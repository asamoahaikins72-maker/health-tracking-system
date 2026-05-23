# Health Tracking System

A comprehensive health and fitness tracking application built with **FastAPI** (Python) backend and **React with TypeScript** frontend.

## Features

- ✅ User Authentication (Signup/Login with JWT)
- ✅ User Profile Management
- ✅ Health Metrics Tracking (weight, steps, heart rate, calories, etc.)
- ✅ Dashboard with Statistics
- ✅ Data Visualization & Analytics
- ✅ REST API

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: MySQL (production), SQLite (development)
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: SQLAlchemy

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API / Redux
- **HTTP Client**: Axios

## Project Structure

```
health-tracking-system/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routes/
│   │   ├── database.py
│   │   └── config.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/                # React TypeScript application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- MySQL Server (for production)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Running the Application

**Backend:**
```bash
cd backend
uv run uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm start
```

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive Swagger documentation.

## License

MIT License
