from fastapi import FastAPI
from app.controllers import booking_controller, user_controller, tour_controller, payment_controller, category_controller, discount_controller, guide_controller, photo_controller, role_controller, tourschedule_controller, tour_guide_controller

app = FastAPI()

app.include_router(booking_controller.router)
app.include_router(user_controller.router)
app.include_router(tour_controller.router)
app.include_router(payment_controller.router)
app.include_router(category_controller.router)
app.include_router(discount_controller.router)
app.include_router(guide_controller.router)
app.include_router(photo_controller.router)
app.include_router(role_controller.router)
app.include_router(tourschedule_controller.router)
app.include_router(tour_guide_controller.router)
