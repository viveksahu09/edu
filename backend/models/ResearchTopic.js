const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ResearchTopic = sequelize.define('ResearchTopic', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'intermediate',
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  estimatedTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prerequisites: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  learningObjectives: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  resources: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  contributionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'contributions',
      key: 'id',
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  enrollments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  tableName: 'research_topics',
  timestamps: true,
});

module.exports = ResearchTopic;
