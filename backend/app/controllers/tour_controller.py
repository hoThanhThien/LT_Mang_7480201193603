from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies.auth_dependencies import get_current_user, require_admin, require_guide
from app.database import get_db_connection
from pydantic import BaseModel
from datetime import date
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/tours", tags=["Tours"])

class TourResponse(BaseModel):
    tour_id: int
    title: str
    location: str
    description: str
    capacity: int
    price: float
    start_date: date
    end_date: date
    status: str
    category_id: int
    category_name: str

@router.get("/", response_model=List[TourResponse])
async def get_tours():
    """Lấy danh sách tất cả tour (public)"""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute("""
            SELECT t.*, c.CategoryName as category_name
            FROM tour t
            JOIN category c ON t.CategoryID = c.CategoryID
            ORDER BY t.StartDate
        """)
        
        tours = cursor.fetchall()
        return [
            TourResponse(
                tour_id=tour["TourID"],
                title=tour["Title"],
                location=tour["Location"],
                description=tour["Description"],
                capacity=tour["Capacity"],
                price=float(tour["Price"]),
                start_date=tour["StartDate"],
                end_date=tour["EndDate"],
                status=tour["Status"],
                category_id=tour["CategoryID"],
                category_name=tour["category_name"]
            ) for tour in tours
        ]
    finally:
        cursor.close()
        connection.close()

@router.get("/my-tours")
async def get_my_tours(current_user: Dict[str, Any] = Depends(require_guide)):
    """Lấy danh sách tour mà guide đang dẫn"""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Tìm guide_id từ user_id
        cursor.execute("""
            SELECT GuideID FROM guide WHERE Email = %s
        """, (current_user["Email"],))
        
        guide_result = cursor.fetchone()
        if not guide_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Guide profile not found"
            )
        
        guide_id = guide_result["GuideID"]
        
        # Lấy tour của guide
        cursor.execute("""
            SELECT t.*, c.CategoryName as category_name,
                   COUNT(b.BookingID) as total_bookings,
                   COALESCE(SUM(CASE WHEN b.Status = 'Confirmed' THEN b.NumberOfPeople ELSE 0 END), 0) as confirmed_people
            FROM tour t
            JOIN category c ON t.CategoryID = c.CategoryID
            JOIN tour_guide tg ON t.TourID = tg.TourID
            LEFT JOIN booking b ON t.TourID = b.TourID
            WHERE tg.GuideID = %s
            GROUP BY t.TourID
            ORDER BY t.StartDate
        """, (guide_id,))
        
        tours = cursor.fetchall()
        
        return [
            {
                "tour_id": tour["TourID"],
                "title": tour["Title"],
                "location": tour["Location"],
                "description": tour["Description"],
                "capacity": tour["Capacity"],
                "price": float(tour["Price"]),
                "start_date": tour["StartDate"],
                "end_date": tour["EndDate"],
                "status": tour["Status"],
                "category_name": tour["category_name"],
                "total_bookings": tour["total_bookings"],
                "confirmed_people": tour["confirmed_people"]
            } for tour in tours
        ]
        
    finally:
        cursor.close()
        connection.close()

@router.get("/{tour_id}", response_model=TourResponse)
async def get_tour_by_id(tour_id: int):
    """Lấy thông tin chi tiết tour (public)"""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute("""
            SELECT t.*, c.CategoryName as category_name
            FROM tour t
            JOIN category c ON t.CategoryID = c.CategoryID
            WHERE t.TourID = %s
        """, (tour_id,))
        
        tour = cursor.fetchone()
        if not tour:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tour not found"
            )
        
        return TourResponse(
            tour_id=tour["TourID"],
            title=tour["Title"],
            location=tour["Location"],
            description=tour["Description"],
            capacity=tour["Capacity"],
            price=float(tour["Price"]),
            start_date=tour["StartDate"],
            end_date=tour["EndDate"],
            status=tour["Status"],
            category_id=tour["CategoryID"],
            category_name=tour["category_name"]
        )
    finally:
        cursor.close()
        connection.close()

@router.get("/{tour_id}/bookings")
async def get_tour_bookings(
    tour_id: int,
    current_user: Dict[str, Any] = Depends(require_guide)
):
    """Lấy danh sách booking của tour (chỉ guide dẫn tour này hoặc admin)"""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Kiểm tra quyền truy cập
        if current_user["RoleName"] != "admin":
            # Tìm guide_id
            cursor.execute("""
                SELECT GuideID FROM guide WHERE Email = %s
            """, (current_user["Email"],))
            
            guide_result = cursor.fetchone()
            if not guide_result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Guide profile not found"
                )
            
            # Kiểm tra guide có dẫn tour này không
            cursor.execute("""
                SELECT TourID FROM tour_guide 
                WHERE TourID = %s AND GuideID = %s
            """, (tour_id, guide_result["GuideID"]))
            
            if not cursor.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only view bookings for tours you guide"
                )
        
        # Lấy danh sách booking
        cursor.execute("""
            SELECT b.*, u.FullName as user_name, u.Phone as user_phone, u.Email as user_email
            FROM booking b
            JOIN user u ON b.UserID = u.UserID
            WHERE b.TourID = %s AND b.Status IN ('Confirmed', 'Pending')
            ORDER BY b.BookingDate DESC
        """, (tour_id,))
        
        bookings = cursor.fetchall()
        return bookings
        
    finally:
        cursor.close()
        connection.close()

@router.post("/")
async def create_tour(
    tour_data: dict,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Tạo tour mới (chỉ admin)"""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO tour (Title, Location, Description, Capacity, Price, StartDate, EndDate, Status, CategoryID)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            tour_data["title"],
            tour_data["location"],
            tour_data["description"],
            tour_data["capacity"],
            tour_data["price"],
            tour_data["start_date"],
            tour_data["end_date"],
            tour_data.get("status", "Available"),
            tour_data["category_id"]
        ))
        
        tour_id = cursor.lastrowid
        connection.commit()
        
        return {"message": "Tour created successfully", "tour_id": tour_id}
        
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close()

@router.put("/{tour_id}")
async def update_tour(
    tour_id: int,
    tour_data: dict,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Cập nhật tour (chỉ admin)"""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Kiểm tra tour tồn tại
        cursor.execute("SELECT TourID FROM tour WHERE TourID = %s", (tour_id,))
        if not cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tour not found"
            )
        
        # Update tour
        update_fields = []
        values = []
        
        for field, value in tour_data.items():
            if field in ["title", "location", "description", "capacity", "price", "start_date", "end_date", "status", "category_id"]:
                update_fields.append(f"{field.title().replace('_', '')} = %s")
                values.append(value)
        
        if update_fields:
            values.append(tour_id)
            cursor.execute(f"""
                UPDATE tour SET {', '.join(update_fields)}
                WHERE TourID = %s
            """, values)
            
            connection.commit()
        
        return {"message": "Tour updated successfully"}
        
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close()

@router.delete("/{tour_id}")
async def delete_tour(
    tour_id: int,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Xóa tour (chỉ admin)"""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Kiểm tra có booking nào không
        cursor.execute("""
            SELECT COUNT(*) as booking_count 
            FROM booking 
            WHERE TourID = %s AND Status IN ('Confirmed', 'Pending')
        """, (tour_id,))
        
        result = cursor.fetchone()
        if result["booking_count"] > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete tour with existing bookings"
            )
        
        cursor.execute("DELETE FROM tour WHERE TourID = %s", (tour_id,))
        
        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tour not found"
            )
        
        connection.commit()
        return {"message": "Tour deleted successfully"}
        
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close()
