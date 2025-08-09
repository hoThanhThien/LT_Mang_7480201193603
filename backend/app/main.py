from fastapi import FastAPI
from app.controllers import example_controller

app = FastAPI()

app.include_router(example_controller.router)
