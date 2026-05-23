from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class HealthMetricCreate(BaseModel):
    metric_type: str  # weight, steps, heart_rate, calories, sleep, blood_pressure, water_intake
    value: float
    unit: str
    notes: Optional[str] = None
    recorded_at: Optional[datetime] = None

class HealthMetricResponse(BaseModel):
    id: int
    user_id: int
    metric_type: str
    value: float
    unit: str
    notes: Optional[str]
    recorded_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
