from fastapi import APIRouter
from app.models.example_model import ExampleModel
from app.views.example_view import example_view

router = APIRouter()

@router.get("/example")
def get_example():
    example = ExampleModel(id=1, name="Test")
    return example_view(example)
