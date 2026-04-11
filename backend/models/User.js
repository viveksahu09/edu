const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'student', 'researcher', 'teacher'),
    defaultValue: 'student',
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      subjects: [],
      languages: ['English'],
    },
  },
  progress: {
    type: DataTypes.JSON,
    defaultValue: {
      savedNotes: 0,
      completedTopics: 0,
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

// Hash password before creating user
User.beforeCreate(async (user) => {
  const bcrypt = require('bcryptjs');
  const saltRounds = 12;
  user.password = await bcrypt.hash(user.password, saltRounds);
});

// Hash password before updating user
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
});

module.exports = User;
