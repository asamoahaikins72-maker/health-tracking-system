from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, users, health_metrics

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Health Tracking System API",
    description="API for tracking health metrics and user fitness data",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(health_metrics.router, prefix="/api/metrics", tags=["Health Metrics"])

@app.get("/")
async def root():
    return {"message": "Welcome to Health Tracking System API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
