from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.database import Base, engine
from app.routes import (
    user_routes,
    course_routes,
    quiz_routes,
    doubt_routes,
    ai_routes
)

# create sqlite tables if not present
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Edugenie Backend", version="1.0")

# very permissive CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# serve frontend static files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

# include API routers under clear prefixes
app.include_router(user_routes.router, prefix="/user", tags=["User"])
app.include_router(course_routes.router, prefix="/course", tags=["Course"])
app.include_router(quiz_routes.router, prefix="/quiz", tags=["Quiz"])
app.include_router(doubt_routes.router, prefix="/doubt", tags=["Doubt"])
app.include_router(ai_routes.router, prefix="/generate", tags=["AI"])

@app.get("/healthz")
def health():
    return {"status":"ok"}
