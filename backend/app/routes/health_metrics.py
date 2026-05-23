from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.health_metric import HealthMetric
from app.schemas.health_metric import HealthMetricCreate, HealthMetricResponse
from app.routes.auth import get_current_user
from fastapi.security import HTTPBearer, HTTPAuthCredentials

router = APIRouter()
security = HTTPBearer()

@router.post("/", response_model=HealthMetricResponse)
async def create_metric(
    metric: HealthMetricCreate,
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(credentials.credentials, db)
    
    recorded_at = metric.recorded_at if metric.recorded_at else datetime.utcnow()
    db_metric = HealthMetric(
        user_id=current_user.id,
        metric_type=metric.metric_type,
        value=metric.value,
        unit=metric.unit,
        notes=metric.notes,
        recorded_at=recorded_at
    )
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric

@router.get("/", response_model=list[HealthMetricResponse])
async def get_metrics(
    metric_type: str = None,
    limit: int = 100,
    offset: int = 0,
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(credentials.credentials, db)
    
    query = db.query(HealthMetric).filter(HealthMetric.user_id == current_user.id)
    if metric_type:
        query = query.filter(HealthMetric.metric_type == metric_type)
    
    metrics = query.order_by(HealthMetric.recorded_at.desc()).offset(offset).limit(limit).all()
    return metrics

@router.get("/{metric_id}", response_model=HealthMetricResponse)
async def get_metric(
    metric_id: int,
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(credentials.credentials, db)
    metric = db.query(HealthMetric).filter(
        (HealthMetric.id == metric_id) & (HealthMetric.user_id == current_user.id)
    ).first()
    
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    return metric

@router.delete("/{metric_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_metric(
    metric_id: int,
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(credentials.credentials, db)
    metric = db.query(HealthMetric).filter(
        (HealthMetric.id == metric_id) & (HealthMetric.user_id == current_user.id)
    ).first()
    
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    
    db.delete(metric)
    db.commit()
