from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies.auth_dependencies import get_current_user, require_admin
from app.schemas.auth_schema import UserResponse
from app.database import get_db_connection
from typing import List, Dict, Any

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=List[UserResponse])
async def get_users(current_user: Dict[str, Any] = Depends(require_admin)):
    """Lấy danh sách tất cả user (chỉ admin)"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT u.*, r.RoleName 
            FROM user u 
            JOIN role r ON u.RoleID = r.RoleID
            ORDER BY u.UserID
        """)
        
        users = cursor.fetchall()
        return [
            UserResponse(
                user_id=user["UserID"],
                first_name=user["FirstName"],
                last_name=user["LastName"],
                full_name=user["FullName"],
                email=user["Email"],
                phone=user["Phone"],
                role_name=user["RoleName"]
            ) for user in users
        ]
    finally:
        cursor.close()
        connection.close()

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Lấy thông tin user theo ID (chỉ admin hoặc chính user đó)"""
    if current_user["UserID"] != user_id and current_user["RoleName"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden"
        )
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT u.*, r.RoleName 
            FROM user u 
            JOIN role r ON u.RoleID = r.RoleID
            WHERE u.UserID = %s
        """, (user_id,))
        
        user = cursor.fetchone()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse(
            user_id=user["UserID"],
            first_name=user["FirstName"],
            last_name=user["LastName"],
            full_name=user["FullName"],
            email=user["Email"],
            phone=user["Phone"],
            role_name=user["RoleName"]
        )
    finally:
        cursor.close()
        connection.close()

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Xóa user (chỉ admin, không thể xóa chính mình)"""
    if current_user["UserID"] == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Kiểm tra user tồn tại
        cursor.execute("SELECT UserID FROM user WHERE UserID = %s", (user_id,))
        if not cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        cursor.execute("DELETE FROM user WHERE UserID = %s", (user_id,))
        connection.commit()
        
        return {"message": "User deleted successfully"}
        
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close()

@router.put("/{user_id}/role")
async def update_user_role(
    user_id: int,
    role_id: int,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Cập nhật role của user (chỉ admin, không thể thay đổi role của chính mình)"""
    if current_user["UserID"] == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own role"
        )
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Kiểm tra user và role tồn tại
        cursor.execute("SELECT UserID FROM user WHERE UserID = %s", (user_id,))
        if not cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        cursor.execute("SELECT RoleID FROM role WHERE RoleID = %s", (role_id,))
        if not cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found"
            )
        
        cursor.execute("UPDATE user SET RoleID = %s WHERE UserID = %s", (role_id, user_id))
        connection.commit()
        
        return {"message": "User role updated successfully"}
        
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close()

@router.get("/bookings/history")
async def get_user_booking_history(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Lấy lịch sử booking của user hiện tại"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT b.*, t.Title, t.Location, t.StartDate, t.EndDate, t.Price,
                   p.Amount as PaidAmount, p.PaymentStatus, p.PaymentMethod
            FROM booking b
            JOIN tour t ON b.TourID = t.TourID
            LEFT JOIN payment p ON b.BookingID = p.BookingID
            WHERE b.UserID = %s
            ORDER BY b.BookingDate DESC
        """, (current_user["UserID"],))
        
        bookings = cursor.fetchall()
        return bookings
        
    finally:
        cursor.close()
        connection.close()
