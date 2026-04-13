# Single Admin System Implementation

## Overview
The EduSolGrow platform now enforces a **single admin system** where only one admin account can exist at any time.

## Features Implemented

### 1. Registration Restrictions
- **Only one admin account** can be created
- If someone tries to register as admin when an admin already exists, they get an error:
  ```json
  {
    "success": false,
    "message": "Admin account already exists. Only one admin is allowed."
  }
  ```

### 2. Admin Management Endpoints

#### Check if Admin Exists
- **GET** `/api/admin/check`
- **Public access**
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "adminExists": true,
      "adminCount": 1
    }
  }
  ```

#### Get Admin Info
- **GET** `/api/admin/info`
- **Admin only**
- **Response**: Current admin details

#### Transfer Admin Role
- **POST** `/api/admin/transfer`
- **Admin only**
- **Body**:
  ```json
  {
    "targetUserId": "user-uuid-to-become-admin"
  }
  ```
- **Action**: 
  - Target user becomes admin
  - Current admin becomes student
  - Ensures only one admin exists

### 3. Security Middleware

#### Single Admin Restriction
- Prevents creating multiple admin accounts
- Validates admin role changes

#### Prevent Self Deletion
- Admin cannot delete their own account
- Must transfer admin role first

## API Endpoints Summary

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/admin/check` | GET | Public | Check if admin exists |
| `/api/admin/info` | GET | Admin | Get current admin info |
| `/api/admin/transfer` | POST | Admin | Transfer admin role |
| `/api/auth/register` | POST | Public | Register (with admin restrictions) |

## Usage Examples

### First Admin Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@edusolgrow.com",
    "password": "securepassword",
    "role": "admin"
  }'
```

### Attempt Second Admin Registration
```bash
# This will fail with error message
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another Admin",
    "email": "admin2@edusolgrow.com",
    "password": "password",
    "role": "admin"
  }'
```

### Transfer Admin Role
```bash
curl -X POST http://localhost:5000/api/admin/transfer \
  -H "Authorization: Bearer admin-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "target-user-uuid"
  }'
```

## Benefits

1. **Security**: Only one person has admin privileges
2. **Accountability**: Clear responsibility for admin actions
3. **Control**: Admin can transfer role to trusted user
4. **Safety**: Prevents accidental admin creation

## Error Messages

- `"Admin account already exists. Only one admin is allowed."`
- `"Only current admin can transfer admin role"`
- `"Admin cannot delete their own account. Transfer admin role first."`
- `"Cannot create another admin. Only one admin is allowed."`

The single admin system is now fully implemented and enforced across the platform.
