FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

ENV PYTHONUNBUFFERED=1
ENV DATABASE_URL=mysql+pymysql://health_user:health_password@db:3306/health_tracking

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
