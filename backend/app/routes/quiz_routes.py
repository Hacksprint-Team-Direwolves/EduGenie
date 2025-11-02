from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_quiz_placeholder():
    # frontend uses localStorage for quizzes. This endpoint is a placeholder.
    return {"message": "Quiz endpoints are intentionally minimal for the demo. Use frontend localStorage or extend backend as needed."}
