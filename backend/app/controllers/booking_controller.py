# app/controllers/booking_controller.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.dependencies.auth_dependencies import get_current_user, require_admin
from app.database import get_db_connection
from pydantic import BaseModel
from datetime import date
from math import ceil
from typing import List, Dict, Any, Optional
from pymysql import IntegrityError  # để bắt lỗi FK nếu có

router = APIRouter(prefix="/bookings", tags=["Bookings"])

# -------------------- Schemas --------------------
class BookingCreate(BaseModel):
    tour_id: int
    number_of_people: int
    discount_id: Optional[int] = None

class BookingResponse(BaseModel):
    booking_id: int
    user_id: int
    tour_id: int
    booking_date: date
    number_of_people: int
    total_amount: float
    status: str
    discount_id: Optional[int]
    tour_title: str
    tour_location: str

# -------------------- Helpers (pagination/sort) --------------------
def make_meta(total: int, page: int, page_size: int) -> Dict[str, Any]:
    total_pages = max(1, ceil(total / page_size)) if total else 1
    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1,
    }

def parse_sort(sort_expr: Optional[str], allowed: Dict[str, str], default_sql: str) -> str:
    if not sort_expr:
        return default_sql
    parts: List[str] = []
    for raw in sort_expr.split(","):
        raw = raw.strip()
        if not raw:
            continue
        if ":" in raw:
            key, direction = raw.split(":", 1)
        else:
            key, direction = raw, "asc"
        key = key.strip().lower()
        direction = direction.strip().lower()
        if key not in allowed:
            continue
        if direction not in ("asc", "desc"):
            direction = "asc"
        parts.append(f"{allowed[key]} {direction.upper()}")
    return ("ORDER BY " + ", ".join(parts)) if parts else default_sql

# -------------------- Create booking --------------------
@router.post("/", response_model=dict)
async def create_booking(
    booking_data: BookingCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Tạo booking mới (user đặt tour)"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # 1) Tour
        cur.execute("""
            SELECT TourID, Title, Price, Capacity, Status
            FROM tour WHERE TourID = %s
        """, (booking_data.tour_id,))
        tour = cur.fetchone()
        if not tour:
            raise HTTPException(status_code=404, detail="Tour not found")
        if tour["Status"] != "Available":
            raise HTTPException(status_code=400, detail="Tour is not available")

        # 2) Sức chứa
        cur.execute("""
            SELECT COALESCE(SUM(NumberOfPeople), 0) AS booked_people
            FROM booking
            WHERE TourID = %s AND Status IN ('Pending','Confirmed')
        """, (booking_data.tour_id,))
        booked_people = cur.fetchone()["booked_people"]
        if booked_people + booking_data.number_of_people > tour["Capacity"]:
            raise HTTPException(status_code=400, detail="Not enough capacity for this tour")

        # 3) Tính tiền
        total_amount = tour["Price"] * booking_data.number_of_people

        # 4) Validate & áp dụng discount (nếu có) -> dùng biến discount_id_to_use
        discount_id_to_use = None
        if booking_data.discount_id is not None:
            cur.execute("""
                SELECT DiscountID, DiscountAmount, IsPercent, StartDate, EndDate
                FROM discount
                WHERE DiscountID = %s
            """, (booking_data.discount_id,))
            discount = cur.fetchone()
            if not discount:
                # Không tồn tại -> báo 400 (tránh lỗi FK 1452)
                raise HTTPException(status_code=400, detail="Discount not found")

            today = date.today()
            if not (discount["StartDate"] <= today <= discount["EndDate"]):
                raise HTTPException(status_code=400, detail="Discount is not active")

            if discount["IsPercent"]:
                total_amount = total_amount * (1 - discount["DiscountAmount"] / 100)
            else:
                total_amount = max(0, total_amount - discount["DiscountAmount"])

            discount_id_to_use = discount["DiscountID"]

        # 5) Tạo booking (DiscountID = None -> chèn NULL)
        cur.execute("""
            INSERT INTO booking (UserID, TourID, BookingDate, NumberOfPeople, TotalAmount, Status, DiscountID)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            current_user["UserID"],
            booking_data.tour_id,
            date.today(),
            booking_data.number_of_people,
            total_amount,
            "Pending",
            discount_id_to_use
        ))
        booking_id = cur.lastrowid
        conn.commit()

        return {
            "message": "Booking created successfully",
            "booking_id": booking_id,
            "total_amount": float(total_amount)
        }

    except HTTPException:
        conn.rollback()
        raise
    except IntegrityError as e:
        conn.rollback()
        # Phòng khi schema không cho NULL hoặc FK khác
        raise HTTPException(status_code=400, detail=f"Invalid foreign key: {str(e)}")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# -------------------- List bookings (pagination) --------------------
@router.get("")  # trả object phân trang
async def get_bookings(
    current_user: Dict[str, Any] = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=200),
    status_filter: Optional[str] = Query(None, description="Pending/Confirmed/Cancelled"),
    sort: Optional[str] = Query(None, description="VD: booking_date:desc,total_amount:asc,people:desc,tour_title:asc"),
):
    """
    Admin: xem tất cả; User: chỉ xem của mình.
    Trả về: { items: [BookingResponse], page, page_size, total, total_pages, has_next, has_prev }
    """
    offset = (page - 1) * page_size
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            params: List[Any] = []
            where = "WHERE 1=1"

            if current_user["RoleName"] != "admin":
                where += " AND b.UserID = %s"
                params.append(current_user["UserID"])

            if status_filter:
                where += " AND b.Status = %s"
                params.append(status_filter)

            count_sql = f"""
                SELECT COUNT(*) AS cnt
                FROM booking b
                JOIN tour t ON b.TourID = t.TourID
                {"JOIN `user` u ON b.UserID = u.UserID" if current_user["RoleName"] == "admin" else ""}
                {where}
            """
            cur.execute(count_sql, tuple(params))
            total = int(cur.fetchone()["cnt"])

            allowed = {
                "booking_date": "b.BookingDate",
                "status": "b.Status",
                "total_amount": "b.TotalAmount",
                "people": "b.NumberOfPeople",
                "tour_title": "t.Title",
            }
            order_by_sql = parse_sort(sort, allowed, "ORDER BY b.BookingDate DESC")

            data_sql = f"""
                SELECT
                    b.*,
                    t.Title AS tour_title,
                    t.Location AS tour_location
                    {", u.FullName AS user_name" if current_user["RoleName"] == "admin" else ""}
                FROM booking b
                JOIN tour t ON b.TourID = t.TourID
                {"JOIN `user` u ON b.UserID = u.UserID" if current_user["RoleName"] == "admin" else ""}
                {where}
                {order_by_sql}
                LIMIT %s OFFSET %s
            """
            cur.execute(data_sql, (*params, page_size, offset))
            rows = cur.fetchall()

        items = [
            BookingResponse(
                booking_id=r["BookingID"],
                user_id=r["UserID"],
                tour_id=r["TourID"],
                booking_date=r["BookingDate"],
                number_of_people=r["NumberOfPeople"],
                total_amount=float(r["TotalAmount"]),
                status=r["Status"],
                discount_id=r["DiscountID"],
                tour_title=r["tour_title"],
                tour_location=r["tour_location"],
            )
            for r in rows
        ]
        return {"items": items, **make_meta(total, page, page_size)}
    finally:
        conn.close()

# -------------------- Update status --------------------
@router.put("/{booking_id}/status")
async def update_booking_status(
    booking_id: int,
    new_status: str,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Cập nhật trạng thái booking (chỉ admin)"""
    if new_status not in ["Pending", "Confirmed", "Cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("UPDATE booking SET Status = %s WHERE BookingID = %s", (new_status, booking_id))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Booking not found")
        conn.commit()
        return {"message": "Booking status updated successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# -------------------- Cancel booking --------------------
@router.delete("/{booking_id}")
async def cancel_booking(
    booking_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Hủy booking (user chỉ có thể hủy booking của mình nếu chưa confirmed)"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM booking WHERE BookingID = %s", (booking_id,))
        booking = cur.fetchone()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")

        if current_user["RoleName"] != "admin" and booking["UserID"] != current_user["UserID"]:
            raise HTTPException(status_code=403, detail="You can only cancel your own bookings")

        if current_user["RoleName"] != "admin" and booking["Status"] == "Confirmed":
            raise HTTPException(status_code=400, detail="Cannot cancel confirmed booking")

        cur.execute("UPDATE booking SET Status = 'Cancelled' WHERE BookingID = %s", (booking_id,))
        conn.commit()
        return {"message": "Booking cancelled successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
