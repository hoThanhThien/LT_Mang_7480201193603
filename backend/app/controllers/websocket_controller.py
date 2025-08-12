from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from typing import List, Dict
import json
import asyncio
from app.dependencies.auth_dependencies import get_current_user
from app.database import get_db_connection

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, tour_id: int):
        await websocket.accept()
        if tour_id not in self.active_connections:
            self.active_connections[tour_id] = []
        self.active_connections[tour_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, tour_id: int):
        if tour_id in self.active_connections:
            self.active_connections[tour_id].remove(websocket)
            if not self.active_connections[tour_id]:
                del self.active_connections[tour_id]
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast_to_tour(self, message: str, tour_id: int):
        if tour_id in self.active_connections:
            for connection in self.active_connections[tour_id]:
                try:
                    await connection.send_text(message)
                except:
                    # Connection might be closed
                    pass

manager = ConnectionManager()

@router.websocket("/ws/tour/{tour_id}")
async def websocket_endpoint(websocket: WebSocket, tour_id: int):
    await manager.connect(websocket, tour_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Verify user authentication từ token trong message
            try:
                # Trong production, bạn nên verify JWT token ở đây
                user_id = message_data.get("user_id")
                message_content = message_data.get("message")
                message_type = message_data.get("type", "chat")  # chat, rating, etc.
                
                if message_type == "comment":
                    # Lưu comment vào database
                    connection = get_db_connection()
                    cursor = connection.cursor(dictionary=True)
                    
                    try:
                        # Lấy thông tin user
                        cursor.execute("""
                            SELECT FullName FROM user WHERE UserID = %s
                        """, (user_id,))
                        user = cursor.fetchone()
                        
                        if user:
                            # Broadcast message với thông tin user
                            broadcast_message = {
                                "type": "comment",
                                "user_id": user_id,
                                "user_name": user["FullName"],
                                "tour_id": tour_id,
                                "message": message_content,
                                "timestamp": str(asyncio.get_event_loop().time())
                            }
                            
                            await manager.broadcast_to_tour(
                                json.dumps(broadcast_message), 
                                tour_id
                            )
                    finally:
                        cursor.close()
                        connection.close()
                
            except Exception as e:
                await manager.send_personal_message(
                    json.dumps({"error": str(e)}), 
                    websocket
                )
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, tour_id)

@router.get("/tours/{tour_id}/live-stats")
async def get_tour_live_stats(tour_id: int):
    """Lấy thống kê real-time của tour"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Số người đang online (connected via WebSocket)
        online_count = len(manager.active_connections.get(tour_id, []))
        
        # Thống kê booking
        cursor.execute("""
            SELECT 
                COUNT(*) as total_bookings,
                SUM(CASE WHEN Status = 'Confirmed' THEN NumberOfPeople ELSE 0 END) as confirmed_people,
                SUM(CASE WHEN Status = 'Pending' THEN NumberOfPeople ELSE 0 END) as pending_people
            FROM booking 
            WHERE TourID = %s
        """, (tour_id,))
        
        booking_stats = cursor.fetchone()
        
        # Rating trung bình
        cursor.execute("""
            SELECT AVG(Rating) as avg_rating, COUNT(*) as total_comments
            FROM comment 
            WHERE TourID = %s
        """, (tour_id,))
        
        rating_stats = cursor.fetchone()
        
        return {
            "tour_id": tour_id,
            "online_users": online_count,
            "total_bookings": booking_stats["total_bookings"],
            "confirmed_people": booking_stats["confirmed_people"],
            "pending_people": booking_stats["pending_people"],
            "avg_rating": float(rating_stats["avg_rating"]) if rating_stats["avg_rating"] else 0,
            "total_comments": rating_stats["total_comments"]
        }
        
    finally:
        cursor.close()
        connection.close()
