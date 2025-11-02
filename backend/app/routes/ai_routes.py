from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_service import generate_ai_response

router = APIRouter()

class AIRequest(BaseModel):
    topic: str
    difficulty: str = "auto"
    formats: list[str] = ["text"]

@router.post("/")
def generate(req: AIRequest):
    # returns a JSON with 'text' key to match frontend expectation
    text = generate_ai_response(req.topic, req.difficulty)
    return {"text": text}
