from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.utils.pagination import PaginationParams, paginate_mysql, parse_sort

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("")
def list_categories(paging: PaginationParams = Depends()):
    conn = get_db_connection()
    try:
        count_sql = "SELECT COUNT(*) AS cnt FROM category"
        data_sql_base = "SELECT CategoryID AS category_id, CategoryName AS name, Description AS description FROM category"
        allowed = {"name": "CategoryName", "category_id": "CategoryID"}
        order_by_sql = parse_sort(paging.sort, allowed, "ORDER BY CategoryName")

        result = paginate_mysql(conn, count_sql, data_sql_base, (), paging.page, paging.page_size, order_by_sql)
        return result
    finally:
        conn.close()
