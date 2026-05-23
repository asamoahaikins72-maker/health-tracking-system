from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.routes.auth import get_current_user
from fastapi.security import HTTPBearer, HTTPAuthCredentials

router = APIRouter()
security = HTTPBearer()

@router.get("/profile", response_model=UserResponse)
async def get_profile(credentials: HTTPAuthCredentials = Depends(security), db: Session = Depends(get_db)):
    from app.routes.auth import get_current_user
    current_user = get_current_user(credentials.credentials, db)
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    from app.routes.auth import get_current_user
    current_user = get_current_user(credentials.credentials, db)
    
    if user_update.full_name:
        current_user.full_name = user_update.full_name
    if user_update.age:
        current_user.age = user_update.age
    if user_update.gender:
        current_user.gender = user_update.gender
    if user_update.height:
        current_user.height = user_update.height
    if user_update.target_weight:
        current_user.target_weight = user_update.target_weight
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/profile", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(credentials: HTTPAuthCredentials = Depends(security), db: Session = Depends(get_db)):
    from app.routes.auth import get_current_user
    current_user = get_current_user(credentials.credentials, db)
    db.delete(current_user)
    db.commit()
