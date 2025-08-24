from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import (
    booking_controller, user_controller, tour_controller, payment_controller, 
    category_controller, discount_controller, photo_controller, 
    role_controller,
    auth_controller, comment_controller, websocket_controller
)
from fastapi.staticfiles import StaticFiles



app = FastAPI(title="Tour Booking API", version="1.0.0")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Trong production, chỉ định domain cụ thể
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_controller.router)
app.include_router(booking_controller.router)
app.include_router(user_controller.router)
app.include_router(tour_controller.router)
app.include_router(comment_controller.router)
app.include_router(payment_controller.router)
app.include_router(category_controller.router)
app.include_router(discount_controller.router)
app.include_router(photo_controller.router)
app.include_router(role_controller.router)
app.include_router(websocket_controller.router)

@app.get("/")
async def root():
    return {"message": "Tour Booking API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
