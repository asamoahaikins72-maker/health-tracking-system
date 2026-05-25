# Health Tracking System - Complete Setup Guide

## 📋 Project Overview

A comprehensive health and fitness tracking application with web, mobile, and advanced analytics capabilities.

**Tech Stack:**
- **Backend:** FastAPI (Python)
- **Frontend:** React with TypeScript
- **Mobile:** React Native with Expo
- **Database:** MySQL (production), SQLite (development)
- **Containerization:** Docker & Docker Compose
- **Testing:** pytest, Jest, Vitest
- **CI/CD:** GitHub Actions

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone and setup
git clone https://github.com/asamoahaikins72-maker/health-tracking-system.git
cd health-tracking-system

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Mobile Setup
```bash
cd mobile
npm install
expo start
```

---

## 📁 Project Structure

```
health-tracking-system/
├── backend/                          # FastAPI application
│   ├── app/
│   │   ├── main.py                  # Main app entry
│   │   ├── config.py                # Configuration
│   │   ├── database.py              # Database setup
│   │   ├── models/                  # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── health_metric.py
│   │   │   ├── goal.py
│   │   │   ├── achievement.py
│   │   │   └── social.py
│   │   ├── schemas/                 # Pydantic schemas
│   │   └── routes/                  # API routes
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── health_metrics.py
│   │       ├── goals.py
│   │       ├── achievements.py
│   │       └── social.py
│   ├── tests/                       # Unit tests
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                        # React TypeScript application
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── MetricsTracker.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Goals.tsx
│   │   │   └── Social.tsx
│   │   ├── components/              # Reusable components
│   │   │   ├── PrivateRoute.tsx
│   │   │   └── Notifications.tsx
│   │   ├── context/                 # Context API
│   │   │   └── AuthContext.tsx
│   │   └── App.tsx
│   ├── tests/                       # Unit tests
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── mobile/                          # React Native (Expo) app
│   ├── app/                         # Expo Router app
│   ├── components/                  # Reusable components
│   ├── services/                    # API service
│   │   └── api.ts
│   ├── store/                       # Zustand store
│   │   └── authStore.ts
│   ├── Dockerfile
│   ├── app.json
│   └── package.json
│
├── .github/
│   └── workflows/                   # GitHub Actions CI/CD
│       ├── backend-tests.yml
│       ├── frontend-tests.yml
│       └── docker-build.yml
│
├── docker-compose.yml               # Docker Compose configuration
└── README.md
```

---

## ✨ Features Implemented

### ✅ **1. Data Visualization - Charts for Health Trends**
- Line charts showing metric progression
- Statistics cards (latest, average, min, max)
- Time range filters (7, 30, 90, 365 days)
- Multiple metric support
- `/api/metrics/` endpoint

### ✅ **2. Goal Setting - Track Fitness Goals and Progress**
- Create health and fitness goals
- Track progress with visual progress bars
- Update goal status
- View active goals
- `/api/goals/` endpoints

### ✅ **3. Social Features - Share Achievements**
- Community feed
- Like/unlike functionality
- Share achievements and milestones
- Different post types (achievement, milestone, challenge)
- `/api/social/posts/` endpoints

### ✅ **4. Mobile App - React Native with Expo**
- Cross-platform iOS/Android
- Full feature parity with web
- Offline capability
- Native performance
- Push notifications ready

### ✅ **5. Unit Tests - Complete Coverage**

**Backend Tests:**
```bash
cd backend
pytest tests/ --cov=app
```

**Frontend Tests:**
```bash
cd frontend
npm run test
```

### ✅ **6. Docker Setup - Containerization**
```bash
docker-compose up -d
```

Includes MySQL database, backend, and frontend containers.

### ✅ **7. CI/CD Pipeline - GitHub Actions**

**Automated Workflows:**
- Backend tests on push/PR
- Frontend build and type check
- Docker image build and push
- Code coverage reporting

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Health Metrics
- `POST /api/metrics/` - Create metric
- `GET /api/metrics/` - Get user metrics
- `GET /api/metrics/{id}` - Get specific metric
- `DELETE /api/metrics/{id}` - Delete metric

### Goals
- `POST /api/goals/` - Create goal
- `GET /api/goals/` - Get user goals
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

### Achievements
- `POST /api/achievements/` - Create achievement
- `GET /api/achievements/` - Get user achievements
- `DELETE /api/achievements/{id}` - Delete achievement

### Social
- `POST /api/social/posts/` - Create post
- `GET /api/social/posts/` - Get community feed
- `POST /api/social/posts/{id}/like` - Like post
- `DELETE /api/social/posts/{id}` - Delete post

---

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
pytest tests/                          # Run all tests
pytest tests/ --cov=app               # With coverage
pytest tests/test_auth.py             # Specific test file
pytest -v                             # Verbose output
```

### Frontend Tests
```bash
cd frontend
npm run test                           # Run tests
npm run test:coverage                 # With coverage
npm run test:ui                       # UI mode
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Build images
docker-compose build

# Run specific service
docker-compose up -d backend

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

---

## 📱 Mobile Development

### Run on Expo Go (Fastest)
```bash
cd mobile
npm install
expo start
# Scan QR code with Expo Go app
```

### Build for Stores
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# Both
eas build
```

---

## 🔐 Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql+pymysql://user:password@localhost/health_tracking
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_APP_NAME=Health Tracker
```

---

## 📊 Database Schema

### Users Table
```
- id (PK)
- email (unique)
- username (unique)
- full_name
- hashed_password
- age
- gender
- height
- target_weight
- is_active
- created_at, updated_at
```

### Health Metrics Table
```
- id (PK)
- user_id (FK)
- metric_type (weight, steps, heart_rate, etc.)
- value
- unit
- notes
- recorded_at
- created_at
```

### Goals Table
```
- id (PK)
- user_id (FK)
- metric_type
- target_value
- current_value
- unit
- deadline
- status (active, completed, failed)
- created_at, updated_at
```

### Achievements Table
```
- id (PK)
- user_id (FK)
- title
- description
- icon
- achieved_at
```

### Social Posts Table
```
- id (PK)
- user_id (FK)
- content
- post_type (achievement, milestone, challenge)
- likes
- created_at, updated_at
```

---

## 🚀 Deployment

### Deploy Backend to Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend to Vercel
```bash
npm run build
vercel deploy
```

### Deploy Mobile to App Store/Play Store
```bash
eas submit --platform ios
eas submit --platform android
```

---

## 🔄 CI/CD Workflows

### On Every Push to Main
1. ✅ Backend tests run
2. ✅ Frontend linter and type check
3. ✅ Build Docker images
4. ✅ Push to Docker Hub

### On Pull Request
1. ✅ All tests must pass
2. ✅ Code coverage required
3. ✅ No linter errors

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [React Native/Expo](https://expo.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add my feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Submit Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🆘 Support

For issues and questions:
- Check existing issues on GitHub
- Create a new issue with detailed description
- Contact the development team

---

**Last Updated:** May 2026
**Status:** ✅ Complete
**Version:** 1.0.0
