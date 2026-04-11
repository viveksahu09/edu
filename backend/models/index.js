const { sequelize } = require('../config/database');
const User = require('./User');
const Contribution = require('./Contribution');
const ResearchTopic = require('./ResearchTopic');

// Define associations
User.hasMany(Contribution, { foreignKey: 'userId', as: 'contributions' });
Contribution.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Contribution, { foreignKey: 'approvedBy', as: 'approvedContributions' });
Contribution.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

Contribution.hasOne(ResearchTopic, { foreignKey: 'contributionId', as: 'researchTopic' });
ResearchTopic.belongsTo(Contribution, { foreignKey: 'contributionId', as: 'contribution' });

module.exports = {
  sequelize,
  User,
  Contribution,
  ResearchTopic
};
