from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies.auth_dependencies import get_current_user, require_admin
from app.database import get_db_connection
from pydantic import BaseModel
from datetime import date
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/bookings", tags=["Bookings"])

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

@router.post("/", response_model=dict)
async def create_booking(
    booking_data: BookingCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Tạo booking mới (user đặt tour)"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Kiểm tra tour tồn tại và còn chỗ
        cursor.execute("""
            SELECT TourID, Title, Price, Capacity, Status
            FROM tour WHERE TourID = %s
        """, (booking_data.tour_id,))
        
        tour = cursor.fetchone()
        if not tour:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tour not found"
            )
        
        if tour["Status"] != "Available":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tour is not available"
            )
        
        # Kiểm tra số lượng người đã đặt
        cursor.execute("""
            SELECT COALESCE(SUM(NumberOfPeople), 0) as booked_people
            FROM booking WHERE TourID = %s AND Status IN ('Pending', 'Confirmed')
        """, (booking_data.tour_id,))
        
        result = cursor.fetchone()
        booked_people = result["booked_people"]
        
        if booked_people + booking_data.number_of_people > tour["Capacity"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not enough capacity for this tour"
            )
        
        # Tính tổng tiền
        total_amount = tour["Price"] * booking_data.number_of_people
        
        # Áp dụng discount nếu có
        if booking_data.discount_id:
            cursor.execute("""
                SELECT DiscountAmount, IsPercent, StartDate, EndDate
                FROM discount WHERE DiscountID = %s
            """, (booking_data.discount_id,))
            
            discount = cursor.fetchone()
            if discount:
                current_date = date.today()
                if discount["StartDate"] <= current_date <= discount["EndDate"]:
                    if discount["IsPercent"]:
                        total_amount = total_amount * (1 - discount["DiscountAmount"] / 100)
                    else:
                        total_amount = max(0, total_amount - discount["DiscountAmount"])
        
        # Tạo booking
        cursor.execute("""
            INSERT INTO booking (UserID, TourID, BookingDate, NumberOfPeople, TotalAmount, Status, DiscountID)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            current_user["UserID"],
            booking_data.tour_id,
            date.today(),
            booking_data.number_of_people,
            total_amount,
            "Pending",
            booking_data.discount_id
        ))
        
        booking_id = cursor.lastrowid
        connection.commit()
        
        return {
            "message": "Booking created successfully", 
            "booking_id": booking_id,
            "total_amount": total_amount
        }
        
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close()

@router.get("/", response_model=List[BookingResponse])
async def get_bookings(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Lấy danh sách booking (admin: tất cả, user: chỉ của mình)"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        if current_user["RoleName"] == "admin":
            # Admin xem tất cả booking
            cursor.execute("""
                SELECT b.*, t.Title as tour_title, t.Location as tour_location,
                       u.FullName as user_name
                FROM booking b
                JOIN tour t ON b.TourID = t.TourID
                JOIN user u ON b.UserID = u.UserID
                ORDER BY b.BookingDate DESC
            """)
        else:
            # User chỉ xem booking của mình
            cursor.execute("""
                SELECT b.*, t.Title as tour_title, t.Location as tour_location
                FROM booking b
                JOIN tour t ON b.TourID = t.TourID
                WHERE b.UserID = %s
                ORDER BY b.BookingDate DESC
            """, (current_user["UserID"],))
        
        bookings = cursor.fetchall()
        return [
            BookingResponse(
                booking_id=booking["BookingID"],
                user_id=booking["UserID"],
                tour_id=booking["TourID"],
                booking_date=booking["BookingDate"],
                number_of_people=booking["NumberOfPeople"],
                total_amount=float(booking["TotalAmount"]),
                status=booking["Status"],
                discount_id=booking["DiscountID"],
                tour_title=booking["tour_title"],
                tour_location=booking["tour_location"]
            ) for booking in bookings
        ]
        
    finally:
        cursor.close()
        connection.close()

@router.put("/{booking_id}/status")
async def update_booking_status(
    booking_id: int,
    new_status: str,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Cập nhật trạng thái booking (chỉ admin)"""
    if new_status not in ["Pending", "Confirmed", "Cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status"
        )
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            UPDATE booking SET Status = %s WHERE BookingID = %s
        """, (new_status, booking_id))
        
        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        connection.commit()
        return {"message": "Booking status updated successfully"}
        
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close()

@router.delete("/{booking_id}")
async def cancel_booking(
    booking_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Hủy booking (user chỉ có thể hủy booking của mình nếu chưa confirmed)"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Lấy thông tin booking
        cursor.execute("""
            SELECT * FROM booking WHERE BookingID = %s
        """, (booking_id,))
        
        booking = cursor.fetchone()
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Kiểm tra quyền
        if current_user["RoleName"] != "admin" and booking["UserID"] != current_user["UserID"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only cancel your own bookings"
            )
        
        # User chỉ có thể hủy nếu chưa confirmed (trừ admin)
        if current_user["RoleName"] != "admin" and booking["Status"] == "Confirmed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot cancel confirmed booking"
            )
        
        cursor.execute("""
            UPDATE booking SET Status = 'Cancelled' WHERE BookingID = %s
        """, (booking_id,))
        
        connection.commit()
        return {"message": "Booking cancelled successfully"}
        
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close()
