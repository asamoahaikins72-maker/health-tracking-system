from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.social import SocialPost, SocialLike
from app.models.user import User
from app.schemas.social import SocialPostCreate, SocialPostResponse
from app.routes.auth import get_current_user
from fastapi.security import HTTPBearer, HTTPAuthCredentials

router = APIRouter()
security = HTTPBearer()

@router.post("/posts/", response_model=SocialPostResponse)
async def create_post(
    post: SocialPostCreate,
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(credentials.credentials, db)
    
    db_post = SocialPost(
        user_id=current_user.id,
        content=post.content,
        post_type=post.post_type
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    return SocialPostResponse(
        id=db_post.id,
        user_id=db_post.user_id,
        username=current_user.username,
        content=db_post.content,
        post_type=db_post.post_type,
        likes=db_post.likes,
        created_at=db_post.created_at,
        liked=False
    )

@router.get("/posts/", response_model=list[SocialPostResponse])
async def get_posts(
    limit: int = 20,
    offset: int = 0,
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(credentials.credentials, db)
    
    posts = db.query(SocialPost).order_by(
        SocialPost.created_at.desc()
    ).offset(offset).limit(limit).all()
    
    result = []
    for post in posts:
        user = db.query(User).filter(User.id == post.user_id).first()
        liked = db.query(SocialLike).filter(
            (SocialLike.post_id == post.id) & (SocialLike.user_id == current_user.id)
        ).first() is not None
        
        result.append(SocialPostResponse(
            id=post.id,
            user_id=post.user_id,
            username=user.username if user else "Unknown",
            content=post.content,
            post_type=post.post_type,
            likes=post.likes,
            created_at=post.created_at,
            liked=liked
        ))
    
    return result

@router.post("/posts/{post_id}/like")
async def like_post(
    post_id: int,
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(credentials.credentials, db)
    
    post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    existing_like = db.query(SocialLike).filter(
        (SocialLike.post_id == post_id) & (SocialLike.user_id == current_user.id)
    ).first()
    
    if existing_like:
        db.delete(existing_like)
        post.likes -= 1
    else:
        like = SocialLike(user_id=current_user.id, post_id=post_id)
        db.add(like)
        post.likes += 1
    
    db.commit()
    return {"likes": post.likes, "liked": not existing_like}

@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(credentials.credentials, db)
    
    post = db.query(SocialPost).filter(
        (SocialPost.id == post_id) & (SocialPost.user_id == current_user.id)
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db.delete(post)
    db.commit()
