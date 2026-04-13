const { sequelize } = require('./config/database');
const { User } = require('./models');

async function migrateRBAC() {
  try {
    console.log('Starting RBAC migration...');
    
    // Update the role column enum to include SUPER_ADMIN
    await sequelize.query(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('SUPER_ADMIN', 'ADMIN', 'teacher', 'student', 'researcher')
    `);
    
    console.log('Updated role column enum to include SUPER_ADMIN and ADMIN');
    
    // Update existing admin user to SUPER_ADMIN
    const adminUser = await User.findOne({ 
      where: { email: 'admin@example.com' } 
    });
    
    if (adminUser) {
      await adminUser.update({ role: 'SUPER_ADMIN' });
      console.log('Updated admin user to SUPER_ADMIN:', adminUser.email);
    } else {
      console.log('Admin user not found');
    }
    
    console.log('RBAC migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateRBAC();
