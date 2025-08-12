from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.comment_schema import CommentCreate, CommentResponse, CommentUpdate
from app.dependencies.auth_dependencies import get_current_user, require_admin
from app.database import get_db_connection
from typing import List, Dict, Any

router = APIRouter(prefix="/comments", tags=["Comments"])

@router.post("/", response_model=dict)
async def create_comment(
    comment_data: CommentCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Tạo comment/đánh giá tour (chỉ user đã book tour)"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Kiểm tra user đã book tour này chưa
        cursor.execute("""
            SELECT BookingID FROM booking 
            WHERE UserID = %s AND TourID = %s AND Status = 'Confirmed'
        """, (current_user["UserID"], comment_data.tour_id))
        
        if not cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only comment on tours you have booked"
            )
        
        # Kiểm tra user đã comment tour này chưa
        cursor.execute("""
            SELECT CommentID FROM comment 
            WHERE UserID = %s AND TourID = %s
        """, (current_user["UserID"], comment_data.tour_id))
        
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already commented on this tour"
            )
        
        # Tạo comment
        cursor.execute("""
            INSERT INTO comment (UserID, TourID, Content, Rating)
            VALUES (%s, %s, %s, %s)
        """, (
            current_user["UserID"],
            comment_data.tour_id,
            comment_data.content,
            comment_data.rating
        ))
        
        connection.commit()
        return {"message": "Comment created successfully"}
        
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close()

@router.get("/tour/{tour_id}", response_model=List[CommentResponse])
async def get_comments_by_tour(tour_id: int):
    """Lấy tất cả comment của một tour"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT c.*, u.FullName as user_name
            FROM comment c
            JOIN user u ON c.UserID = u.UserID
            WHERE c.TourID = %s
            ORDER BY c.CreatedAt DESC
        """, (tour_id,))
        
        comments = cursor.fetchall()
        return [
            CommentResponse(
                comment_id=comment["CommentID"],
                user_id=comment["UserID"],
                tour_id=comment["TourID"],
                content=comment["Content"],
                rating=comment["Rating"],
                created_at=comment["CreatedAt"],
                user_name=comment["user_name"]
            ) for comment in comments
        ]
        
    finally:
        cursor.close()
        connection.close()

@router.put("/{comment_id}")
async def update_comment(
    comment_id: int,
    comment_data: CommentUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Cập nhật comment (chỉ owner hoặc admin)"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Kiểm tra comment tồn tại và thuộc về user
        cursor.execute("""
            SELECT * FROM comment WHERE CommentID = %s
        """, (comment_id,))
        
        comment = cursor.fetchone()
        if not comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comment not found"
            )
        
        if comment["UserID"] != current_user["UserID"] and current_user["RoleName"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only edit your own comments"
            )
        
        # Update comment
        update_fields = []
        values = []
        
        if comment_data.content is not None:
            update_fields.append("Content = %s")
            values.append(comment_data.content)
        
        if comment_data.rating is not None:
            update_fields.append("Rating = %s")
            values.append(comment_data.rating)
        
        if update_fields:
            values.append(comment_id)
            cursor.execute(f"""
                UPDATE comment SET {', '.join(update_fields)}
                WHERE CommentID = %s
            """, values)
            
            connection.commit()
        
        return {"message": "Comment updated successfully"}
        
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close()

@router.delete("/{comment_id}")
async def delete_comment(
    comment_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Xóa comment (chỉ owner hoặc admin)"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Kiểm tra comment tồn tại và thuộc về user
        cursor.execute("""
            SELECT * FROM comment WHERE CommentID = %s
        """, (comment_id,))
        
        comment = cursor.fetchone()
        if not comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comment not found"
            )
        
        if comment["UserID"] != current_user["UserID"] and current_user["RoleName"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own comments"
            )
        
        cursor.execute("DELETE FROM comment WHERE CommentID = %s", (comment_id,))
        connection.commit()
        
        return {"message": "Comment deleted successfully"}
        
    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close()

@router.get("/", response_model=List[CommentResponse])
async def get_all_comments(current_user: Dict[str, Any] = Depends(require_admin)):
    """Lấy tất cả comment (chỉ admin)"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT c.*, u.FullName as user_name, t.Title as tour_title
            FROM comment c
            JOIN user u ON c.UserID = u.UserID
            JOIN tour t ON c.TourID = t.TourID
            ORDER BY c.CreatedAt DESC
        """)
        
        comments = cursor.fetchall()
        return [
            CommentResponse(
                comment_id=comment["CommentID"],
                user_id=comment["UserID"],
                tour_id=comment["TourID"],
                content=comment["Content"],
                rating=comment["Rating"],
                created_at=comment["CreatedAt"],
                user_name=comment["user_name"]
            ) for comment in comments
        ]
        
    finally:
        cursor.close()
        connection.close()
