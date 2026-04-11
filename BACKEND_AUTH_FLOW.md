# Backend Authentication Flow Implementation

## Step-by-Step Registration Flow

### 1. Frontend Submission
**User submits:**
- `name` (string, required)
- `email` (string, required, valid email format)
- `password` (string, required, min 8 characters)
- `role` (enum: "student" | "educator" | "researcher")
- `institution` (string, optional)

### 2. Backend Validation
```javascript
// Input validation
const validationRules = {
  name: { required: true, minLength: 2, maxLength: 100 },
  email: { required: true, format: 'email' },
  password: { required: true, minLength: 8, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/ },
  role: { required: true, enum: ['student', 'educator', 'researcher'] },
  institution: { optional: true, maxLength: 200 }
};
```

### 3. Check if User Already Exists
```sql
SELECT id FROM users WHERE email = ?;
```

### 4. Hash Password Using bcrypt
```javascript
const bcrypt = require('bcrypt');
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

### 5. Store User in MySQL
```sql
INSERT INTO users (
  name, email, password_hash, role, institution, 
  preferences, progress, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'educator', 'researcher', 'admin') NOT NULL DEFAULT 'student',
  institution VARCHAR(200),
  preferences JSON DEFAULT '{"subjects": [], "languages": ["English"]}',
  progress JSON DEFAULT '{"savedNotes": 0, "completedTopics": 0}',
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);
```

## API Endpoints

### POST /api/auth/register
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "student",
  "institution": "University Name"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "institution": "University Name",
      "preferences": {
        "subjects": [],
        "languages": ["English"]
      },
      "progress": {
        "savedNotes": 0,
        "completedTopics": 0
      },
      "email_verified": false,
      "created_at": "2026-04-11T02:10:00.000Z"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  },
  "message": "User registered successfully"
}
```

**Error Responses:**
```json
// Validation Error (400)
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}

// User Already Exists (409)
{
  "success": false,
  "error": "User with this email already exists"
}

// Server Error (500)
{
  "success": false,
  "error": "Internal server error"
}
```

### POST /api/auth/login
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "institution": "University Name"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

## Backend Implementation (Node.js + Express)

### Dependencies
```json
{
  "express": "^4.18.0",
  "mysql2": "^3.6.0",
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.0",
  "joi": "^17.9.0",
  "cors": "^2.8.5",
  "helmet": "^7.0.0"
}
```

### Validation Schema
```javascript
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  role: Joi.string().valid('student', 'educator', 'researcher').required(),
  institution: Joi.string().max(200).optional()
});
```

### Registration Controller
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.reduce((acc, detail) => {
          acc[detail.path[0]] = detail.message;
          return acc;
        }, {})
      });
    }

    const { name, email, password, role, institution } = value;

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Store user
    const result = await db.query(
      `INSERT INTO users (
        name, email, password_hash, role, institution, 
        preferences, progress, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name,
        email,
        passwordHash,
        role,
        institution || null,
        JSON.stringify({ subjects: [], languages: ["English"] }),
        JSON.stringify({ savedNotes: 0, completedTopics: 0 })
      ]
    );

    // Generate JWT tokens
    const user = {
      id: result.insertId,
      name,
      email,
      role,
      institution: institution || null
    };

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          ...user,
          preferences: { subjects: [], languages: ["English"] },
          progress: { savedNotes: 0, completedTopics: 0 },
          email_verified: false,
          created_at: new Date().toISOString()
        },
        token,
        refreshToken
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
```

## Frontend Integration Updates

### Updated Validation Rules
```typescript
// Frontend validation should match backend
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  },
  role: {
    required: true,
    options: ['student', 'educator', 'researcher']
  },
  institution: {
    maxLength: 200,
    optional: true
  }
};
```

### Error Handling
```typescript
// Handle specific error types
const handleRegistrationError = (error: string) => {
  if (error.includes('already exists')) {
    return 'An account with this email already exists. Please try logging in.';
  }
  if (error.includes('Validation failed')) {
    return 'Please check your input and try again.';
  }
  return 'Registration failed. Please try again later.';
};
```

## Security Considerations

1. **Password Security**: bcrypt with 12 salt rounds
2. **JWT Tokens**: Short access token (1h) + long refresh token (7d)
3. **Input Validation**: Joi schema validation on backend
4. **Rate Limiting**: Implement rate limiting on auth endpoints
5. **HTTPS**: Use HTTPS in production
6. **Environment Variables**: Store secrets in environment variables

## Next Steps

1. Implement the Node.js backend with the above structure
2. Update frontend validation to match backend rules
3. Add proper error handling for duplicate users
4. Implement email verification
5. Add password reset functionality
6. Set up rate limiting and security middleware
