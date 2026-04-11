# Backend Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file with your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=edusolgrow
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Create MySQL Database
```sql
CREATE DATABASE edusolgrow;
```

### 4. Start Backend Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### Health Check
- `GET /api/health` - Server health check

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Required)
- `email` (VARCHAR, Unique, Required)
- `password` (VARCHAR, Required, Hashed)
- `role` (ENUM: admin, student, researcher, teacher)
- `institution` (VARCHAR, Optional)
- `preferences` (JSON)
- `progress` (JSON)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## Features

### JWT Authentication
- Secure password hashing with bcrypt
- JWT token generation and validation
- Token expiration handling
- Protected routes with middleware

### Error Handling
- Comprehensive error responses
- Input validation
- Database error handling
- CORS configuration

### Security
- Password hashing (bcrypt, salt rounds: 12)
- JWT token validation
- CORS protection
- Input sanitization
