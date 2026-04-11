const Contribution = require('../models/Contribution');
const ResearchTopic = require('../models/ResearchTopic');
const User = require('../models/User');
const { Op } = require('sequelize');

// Submit a new contribution
const submitContribution = async (req, res) => {
  try {
    const { title, description, content, type, category, tags } = req.body;
    const userId = req.user.id;

    const contribution = await Contribution.create({
      title,
      description,
      content,
      type,
      category,
      tags: tags || [],
      userId,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Contribution submitted successfully. Awaiting admin approval.',
      data: contribution
    });
  } catch (error) {
    console.error('Error submitting contribution:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contribution',
      error: error.message
    });
  }
};

// Get all contributions (for admin)
const getAllContributions = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const contributions = await Contribution.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: {
        contributions: contributions.rows,
        total: contributions.count,
        page: parseInt(page),
        totalPages: Math.ceil(contributions.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contributions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contributions',
      error: error.message
    });
  }
};

// Approve a contribution
const approveContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const contribution = await Contribution.findByPk(id);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    if (contribution.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Contribution has already been processed'
      });
    }

    await contribution.update({
      status: 'approved',
      approvedBy: adminId,
      approvedAt: new Date()
    });

    // If it's a topic, create a research topic
    if (contribution.type === 'topic') {
      await ResearchTopic.create({
        title: contribution.title,
        description: contribution.description,
        category: contribution.category,
        tags: contribution.tags,
        contributionId: contribution.id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contribution approved successfully',
      data: contribution
    });
  } catch (error) {
    console.error('Error approving contribution:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving contribution',
      error: error.message
    });
  }
};

// Reject a contribution
const rejectContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const adminId = req.user.id;

    const contribution = await Contribution.findByPk(id);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    if (contribution.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Contribution has already been processed'
      });
    }

    await contribution.update({
      status: 'rejected',
      approvedBy: adminId,
      approvedAt: new Date(),
      rejectionReason: rejectionReason || 'Rejected by admin'
    });

    res.status(200).json({
      success: true,
      message: 'Contribution rejected successfully',
      data: contribution
    });
  } catch (error) {
    console.error('Error rejecting contribution:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting contribution',
      error: error.message
    });
  }
};

// Get published research topics (for Explore Research Topics)
const getResearchTopics = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { isActive: true };
    if (category) whereClause.category = category;
    if (difficulty) whereClause.difficulty = difficulty;

    const topics = await ResearchTopic.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Contribution,
          as: 'contribution',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: {
        topics: topics.rows,
        total: topics.count,
        page: parseInt(page),
        totalPages: Math.ceil(topics.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching research topics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching research topics',
      error: error.message
    });
  }
};

// Get user's contributions
const getUserContributions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId };
    if (status) whereClause.status = status;

    const contributions = await Contribution.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: {
        contributions: contributions.rows,
        total: contributions.count,
        page: parseInt(page),
        totalPages: Math.ceil(contributions.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user contributions',
      error: error.message
    });
  }
};

module.exports = {
  submitContribution,
  getAllContributions,
  approveContribution,
  rejectContribution,
  getResearchTopics,
  getUserContributions
};
