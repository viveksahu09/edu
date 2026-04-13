# User Management API Documentation

## Overview
Complete user management system with CRUD operations, protected by admin authentication and single admin restrictions.

## API Endpoints

### Get All Users
- **GET** `/api/users`
- **Authentication**: Admin required
- **Query Params**: `page`, `limit`, `role`, `search`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "users": [
        {
          "id": "uuid",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "student",
          "institution": "University",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "total": 5,
      "page": 1,
      "totalPages": 1
    }
  }
  ```

### Get User by ID
- **GET** `/api/users/:id`
- **Authentication**: Admin required
- **Response**: Single user object

### Create User
- **POST** `/api/users`
- **Authentication**: Admin required
- **Body**:
  ```json
  {
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "role": "student",
    "institution": "University"
  }
  ```

### Update User
- **PUT** `/api/users/:id`
- **Authentication**: Admin required
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "teacher",
    "institution": "New Institution"
  }
  ```

### Delete User
- **DELETE** `/api/users/:id`
- **Authentication**: Admin required
- **Restrictions**:
  - Cannot delete yourself (admin)
  - Cannot delete the only admin account

### Reset User Password
- **PUT** `/api/users/:id/reset-password`
- **Authentication**: Admin required
- **Body**:
  ```json
  {
    "newPassword": "newpassword123"
  }
  ```

## Security Features

### Single Admin Protection
- Only one admin account can exist
- Cannot create another admin if one exists
- Cannot delete the only admin account
- Admin cannot delete their own account

### Role Management
- Valid roles: `admin`, `student`, `teacher`, `researcher`
- Admin can change user roles (with single admin restriction)
- Email uniqueness validation

### Authentication
- All endpoints require admin authentication
- JWT token validation
- Password hashing with bcrypt

## Error Messages

- `"Admin account already exists. Only one admin is allowed."`
- `"Email already exists"`
- `"Admin cannot delete their own account. Transfer admin role first."`
- `"Cannot delete admin account. Transfer admin role first."`
- `"User not found"`

## Usage Examples

### Load Users for Table
```javascript
// Frontend call to populate user management table
fetch('/api/users?page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
})
.then(response => response.json())
.then(data => {
  // Populate table with data.users
});
```

### Edit User
```javascript
// Update user details
fetch('/api/users/user-uuid', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Updated Name',
    email: 'newemail@example.com',
    role: 'teacher'
  })
});
```

### Delete User
```javascript
// Delete user (with protection checks)
fetch('/api/users/user-uuid', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
```

The user management system is now fully functional with proper security restrictions and single admin protection.
