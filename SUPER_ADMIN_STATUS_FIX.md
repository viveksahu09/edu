# Super Admin Status Issue

## Current Problem
The working backend (`backend-edu`) still has the old single admin system:
- **User Model**: Only supports `'admin', 'teacher', 'student', 'researcher'`
- **No SUPER_ADMIN role**: Not implemented in working backend
- **admin@example.com**: Currently just a regular 'admin' user, not SUPER_ADMIN

## What Needs to Be Fixed

### 1. Update Working Backend User Model
Add SUPER_ADMIN and ADMIN roles to `backend-edu/models/User.js`:
```javascript
role: {
  type: DataTypes.ENUM('SUPER_ADMIN', 'ADMIN', 'teacher', 'student', 'researcher'),
  allowNull: false,
  defaultValue: 'student'
}
```

### 2. Update admin@example.com to SUPER_ADMIN
Create migration script to update existing admin user:
```javascript
// Update admin@example.com to SUPER_ADMIN
const adminUser = await User.findOne({ 
  where: { email: 'admin@example.com' } 
});
if (adminUser) {
  await adminUser.update({ role: 'SUPER_ADMIN' });
}
```

### 3. Update Admin Limit Logic
Update `backend-edu/controllers/userController.js` to support 3-admin limit:
```javascript
// Count both ADMIN and SUPER_ADMIN
const adminCount = await User.count({ where: { role: 'ADMIN' } });
const superAdminCount = await User.count({ where: { role: 'SUPER_ADMIN' } });
const totalAdmins = adminCount + superAdminCount;

const MAX_ADMINS = 3;
if (totalAdmins >= MAX_ADMINS) {
  return res.status(403).json({
    success: false,
    message: `Cannot create another admin. Maximum ${MAX_ADMINS} admins allowed.`
  });
}
```

## Current Status

### ❌ Not Working
- SUPER_ADMIN role not implemented in working backend
- admin@example.com is regular admin, not super admin
- 3-admin limit not enforced
- Frontend expecting SUPER_ADMIN role

### ✅ Working
- Backend server is running
- Basic user creation works
- Single admin protection works

## Next Steps

1. **Stop current backend server**
2. **Update working backend** with RBAC implementation
3. **Run migration** to update admin@example.com to SUPER_ADMIN
4. **Restart backend server**
5. **Test 3-admin limit system**

The super admin functionality needs to be properly implemented in the working backend directory.
