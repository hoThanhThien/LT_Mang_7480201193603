from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.auth import verify_token
from app.database import get_db_connection
from typing import Dict, Any
from pymysql.cursors import DictCursor
import pymysql

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Lấy thông tin user hiện tại từ token"""
    token = credentials.credentials
    user_id = verify_token(token)
    
    # Lấy thông tin user từ database
    connection = get_db_connection()
    cursor = connection.cursor(cursor=pymysql.cursors.DictCursor)  # ✅ Đúng
    
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
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return user
    finally:
        cursor.close()
        connection.close()

def require_role(required_role: str):
    """Decorator để yêu cầu quyền cụ thể"""
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        if current_user.get("RoleName") != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden. Required role: {required_role}"
            )
        return current_user
    return role_checker

def require_admin(current_user: Dict[str, Any] = Depends(get_current_user)):
    role = current_user.get("RoleName", "").lower()
    print("🔐 current_user:", current_user)
    if role != "admin":
        print("⛔ Từ chối vì RoleName =", role)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


def require_guide(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Yêu cầu quyền hướng dẫn viên"""
    if current_user.get("RoleName") not in ["admin", "guide"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Guide access required"
        )
    return current_user

def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Lấy user hiện tại, không bắt buộc đăng nhập"""
    try:
        return get_current_user(credentials)
    except HTTPException:
        return None
