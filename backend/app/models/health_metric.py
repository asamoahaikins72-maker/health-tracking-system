from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class MetricType(str, enum.Enum):
    WEIGHT = "weight"
    STEPS = "steps"
    HEART_RATE = "heart_rate"
    CALORIES = "calories"
    SLEEP = "sleep"
    BLOOD_PRESSURE = "blood_pressure"
    WATER_INTAKE = "water_intake"

class HealthMetric(Base):
    __tablename__ = "health_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    metric_type = Column(Enum(MetricType), nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False)  # kg, steps, bpm, kcal, hours, mmHg, ml
    notes = Column(String(500), nullable=True)
    recorded_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="health_metrics")

    def __repr__(self):
        return f"<HealthMetric(user_id={self.user_id}, type='{self.metric_type}', value={self.value} {self.unit})>"
