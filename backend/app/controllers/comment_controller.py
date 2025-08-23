# app/controllers/comment_controller.py
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from app.dependencies.auth_dependencies import get_current_user, require_admin
from app.database import get_db_connection
from typing import List, Dict, Any, Optional
from math import ceil
from datetime import datetime

router = APIRouter(prefix="/comments", tags=["Comments"])

# -------------------- Helpers --------------------
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
    """
    sort_expr ví dụ: 'created_at:desc,rating:asc,user_name:asc'
    allowed: map key -> tên cột SQL hợp lệ để chống injection.
    """
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

# -------------------- Create comment --------------------
@router.post("/", response_model=dict)
async def create_comment(
    # Chấp nhận cả camel (TourID) lẫn snake (tour_id)
    payload: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Tạo comment/đánh giá tour (chỉ user đã có booking Confirmed).
    Payload chấp nhận:
    {
      "tour_id": 1,         // hoặc "TourID": 1
      "content": "....",
      "rating": 5
    }
    """
    # Chuẩn hóa keys
    tour_id = payload.get("tour_id", payload.get("TourID"))
    content = payload.get("content", payload.get("Content"))
    rating = payload.get("rating", payload.get("Rating"))

    if tour_id is None:
        raise HTTPException(status_code=422, detail="Field 'tour_id' (or 'TourID') is required")
    if content is None:
        raise HTTPException(status_code=422, detail="Field 'content' is required")
    if rating is None:
        raise HTTPException(status_code=422, detail="Field 'rating' is required")
    try:
        rating = int(rating)
    except Exception:
        raise HTTPException(status_code=422, detail="'rating' must be an integer")
    if not (1 <= rating <= 5):
        raise HTTPException(status_code=422, detail="'rating' must be between 1 and 5")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # 1) Kiểm tra user đã có booking Confirmed cho tour này
        cur.execute("""
            SELECT BookingID FROM booking
            WHERE UserID = %s AND TourID = %s AND Status = 'Confirmed'
        """, (current_user["UserID"], tour_id))
        if not cur.fetchone():
            raise HTTPException(status_code=403, detail="You can only comment on tours you have booked (Confirmed)")

        # 2) Mỗi user comment 1 lần / tour
        cur.execute("""
            SELECT CommentID FROM comment
            WHERE UserID = %s AND TourID = %s
        """, (current_user["UserID"], tour_id))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="You have already commented on this tour")

        # 3) Tạo comment
        cur.execute("""
            INSERT INTO comment (UserID, TourID, Content, Rating)
            VALUES (%s, %s, %s, %s)
        """, (current_user["UserID"], tour_id, content, rating))
        conn.commit()
        return {"message": "Comment created successfully"}

    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# -------------------- Comments by tour (PUBLIC, pagination) --------------------
@router.get("/tour/{tour_id}")
async def get_comments_by_tour(
    tour_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=200),
    sort: Optional[str] = Query(None, description="VD: created_at:desc,rating:asc,user_name:asc")
):
    """
    Public: xem bình luận theo tour.
    Trả về:
    {
      "items": [ {comment_id, user_id, tour_id, content, rating, created_at, user_name}, ... ],
      "page": ..., "page_size": ..., "total": ..., "total_pages": ..., "has_next": ..., "has_prev": ...
    }
    """
    offset = (page - 1) * page_size
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Đếm tổng
            cur.execute("""
                SELECT COUNT(*) AS cnt
                FROM comment c
                WHERE c.TourID = %s
            """, (tour_id,))
            total = int(cur.fetchone()["cnt"])

            allowed = {
                "created_at": "c.CreatedAt",
                "rating": "c.Rating",
                "user_name": "u.FullName"
            }
            order_by_sql = parse_sort(sort, allowed, "ORDER BY c.CreatedAt DESC")

            # Data trang
            cur.execute(f"""
                SELECT
                    c.CommentID AS comment_id,
                    c.UserID    AS user_id,
                    c.TourID    AS tour_id,
                    c.Content   AS content,
                    c.Rating    AS rating,
                    c.CreatedAt AS created_at,
                    u.FullName  AS user_name
                FROM comment c
                JOIN `user` u ON c.UserID = u.UserID
                WHERE c.TourID = %s
                {order_by_sql}
                LIMIT %s OFFSET %s
            """, (tour_id, page_size, offset))
            rows = cur.fetchall()

        for r in rows:
            if isinstance(r["created_at"], datetime):
                r["created_at"] = r["created_at"].isoformat()

        return {"items": rows, **make_meta(total, page, page_size)}
    finally:
        conn.close()

# -------------------- Update comment --------------------
@router.put("/{comment_id}")
async def update_comment(
    comment_id: int,
    payload: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Cập nhật comment (chỉ owner hoặc admin).
    Body: { "content": "...", "rating": 1..5 } (rating optional)
    """
    content = payload.get("content")
    rating = payload.get("rating")

    if content is None and rating is None:
        return {"message": "Nothing to update"}

    if rating is not None:
        try:
            rating = int(rating)
        except Exception:
            raise HTTPException(status_code=422, detail="'rating' must be an integer")
        if not (1 <= rating <= 5):
            raise HTTPException(status_code=422, detail="'rating' must be between 1 and 5")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM comment WHERE CommentID = %s", (comment_id,))
        cmt = cur.fetchone()
        if not cmt:
            raise HTTPException(status_code=404, detail="Comment not found")

        if cmt["UserID"] != current_user["UserID"] and current_user["RoleName"] != "admin":
            raise HTTPException(statusocode=403, detail="You can only edit your own comments")

        sets, params = [], []
        if content is not None:
            sets.append("Content = %s")
            params.append(content)
        if rating is not None:
            sets.append("Rating = %s")
            params.append(rating)

        if sets:
            params.append(comment_id)
            cur.execute(f"UPDATE comment SET {', '.join(sets)} WHERE CommentID = %s", params)
            conn.commit()

        return {"message": "Comment updated successfully"}

    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# -------------------- Delete comment --------------------
@router.delete("/{comment_id}")
async def delete_comment(
    comment_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Xóa comment (chỉ owner hoặc admin)"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM comment WHERE CommentID = %s", (comment_id,))
        cmt = cur.fetchone()
        if not cmt:
            raise HTTPException(status_code=404, detail="Comment not found")

        if cmt["UserID"] != current_user["UserID"] and current_user["RoleName"] != "admin":
            raise HTTPException(status_code=403, detail="You can only delete your own comments")

        cur.execute("DELETE FROM comment WHERE CommentID = %s", (comment_id,))
        conn.commit()
        return {"message": "Comment deleted successfully"}
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# -------------------- List ALL comments (Admin & User, pagination) --------------------
@router.get("")
async def get_all_comments(
    current_user: Dict[str, Any] = Depends(get_current_user),  # cả admin & user đều truy cập
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=200),
    q: Optional[str] = Query(None, description="Tìm theo tên user hoặc tiêu đề tour"),
    sort: Optional[str] = Query(None, description="VD: created_at:desc,rating:asc,user_name:asc,tour_title:asc")
):
    """
    Admin & User: xem TẤT CẢ bình luận theo phân trang.
    Trả về: { items: [...], page, page_size, total, total_pages, has_next, has_prev }
    """
    offset = (page - 1) * page_size
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            where = "WHERE 1=1"
            params: List[Any] = []

            if q:
                where += " AND (u.FullName LIKE %s OR t.Title LIKE %s)"
                params.extend([f"%{q}%", f"%{q}%"])

            # Đếm tổng
            cur.execute(f"""
                SELECT COUNT(*) AS cnt
                FROM comment c
                JOIN `user` u ON c.UserID = u.UserID
                JOIN tour t ON c.TourID = t.TourID
                {where}
            """, tuple(params))
            total = int(cur.fetchone()["cnt"])

            allowed = {
                "created_at": "c.CreatedAt",
                "rating": "c.Rating",
                "user_name": "u.FullName",
                "tour_title": "t.Title"
            }
            order_by_sql = parse_sort(sort, allowed, "ORDER BY c.CreatedAt DESC")

            # Data
            cur.execute(f"""
                SELECT
                    c.CommentID AS comment_id,
                    c.UserID    AS user_id,
                    c.TourID    AS tour_id,
                    c.Content   AS content,
                    c.Rating    AS rating,
                    c.CreatedAt AS created_at,
                    u.FullName  AS user_name,
                    t.Title     AS tour_title
                FROM comment c
                JOIN `user` u ON c.UserID = u.UserID
                JOIN tour t ON c.TourID = t.TourID
                {where}
                {order_by_sql}
                LIMIT %s OFFSET %s
            """, (*params, page_size, offset))
            rows = cur.fetchall()

        for r in rows:
            if isinstance(r["created_at"], datetime):
                r["created_at"] = r["created_at"].isoformat()

        return {"items": rows, **make_meta(total, page, page_size)}
    finally:
        conn.close()
