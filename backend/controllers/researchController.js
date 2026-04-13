const ResearchTopic = require('../models/ResearchTopic');
const Contribution = require('../models/Contribution');

// Get approved research topics
const getApprovedTopics = async (req, res) => {
  try {
    const approvedTopics = await ResearchTopic.findAll({
      include: [
        {
          model: Contribution,
          as: 'contribution',
          where: {
            status: 'approved'
          },
          attributes: ['title', 'description', 'type', 'subject', 'customSubject', 'difficulty', 'estimatedTime']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedTopics = approvedTopics.map(topic => ({
      id: topic.id,
      title: topic.contribution.title,
      description: topic.contribution.description,
      type: topic.contribution.type,
      subject: topic.contribution.subject,
      customSubject: topic.contribution.customSubject,
      difficulty: topic.contribution.difficulty,
      estimatedTime: topic.contribution.estimatedTime,
      createdAt: topic.createdAt
    }));

    res.json(formattedTopics);
  } catch (error) {
    console.error('Error fetching approved topics:', error);
    res.status(500).json({ message: 'Failed to fetch approved topics', error: error.message });
  }
};

// Get all research topics (including pending for admin)
const getAllTopics = async (req, res) => {
  try {
    const topics = await ResearchTopic.findAll({
      include: [
        {
          model: Contribution,
          as: 'contribution',
          attributes: ['title', 'description', 'type', 'subject', 'customSubject', 'difficulty', 'estimatedTime', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedTopics = topics.map(topic => ({
      id: topic.id,
      title: topic.contribution.title,
      description: topic.contribution.description,
      type: topic.contribution.type,
      subject: topic.contribution.subject,
      customSubject: topic.contribution.customSubject,
      difficulty: topic.contribution.difficulty,
      estimatedTime: topic.contribution.estimatedTime,
      status: topic.contribution.status,
      createdAt: topic.createdAt
    }));

    res.json(formattedTopics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Failed to fetch topics', error: error.message });
  }
};

// Create research topic from approved contribution
const createResearchTopic = async (req, res) => {
  try {
    const { contributionId } = req.body;

    // Check if research topic already exists
    const existingTopic = await ResearchTopic.findOne({
      where: { contributionId }
    });

    if (existingTopic) {
      return res.status(400).json({ message: 'Research topic already exists for this contribution' });
    }

    const researchTopic = await ResearchTopic.create({
      contributionId,
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Research topic created successfully',
      topic: researchTopic
    });
  } catch (error) {
    console.error('Error creating research topic:', error);
    res.status(500).json({ message: 'Failed to create research topic', error: error.message });
  }
};

// Delete research topic
const deleteResearchTopic = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await ResearchTopic.findByPk(id);
    if (!topic) {
      return res.status(404).json({ message: 'Research topic not found' });
    }

    await topic.destroy();
    res.json({ message: 'Research topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting research topic:', error);
    res.status(500).json({ message: 'Failed to delete research topic', error: error.message });
  }
};

module.exports = {
  getApprovedTopics,
  getAllTopics,
  createResearchTopic,
  deleteResearchTopic
};
