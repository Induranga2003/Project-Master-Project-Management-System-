const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const { createNotification, notifyProjectMembers } = require('./notifications');

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, startDate, endDate, budget, status, progress } = req.body;

    // Validate required fields
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: 'Name, start date, and end date are required' });
    }

    const userId = req.userId || req.user?.user?.id || req.user?.id;
    
    const project = new Project({
      name,
      description: description || '',
      owner: userId,
      startDate,
      endDate,
      budget: budget || { estimated: 0, actual: 0 },
      status: status || 'planning',
      progress: progress || 0,
      members: [
        {
          user: userId,
          role: 'admin'
        }
      ]
    });

    await project.save();
    await project.populate('owner members.user');

    // Notify owner about project creation
    try {
      const io = req.app.get('io');
      await createNotification({
        user: userId,
        project: project._id,
        type: 'project_updated',
        title: 'Project Created',
        message: `Project "${project.name}" has been created successfully`,
        link: `/projects/${project._id}`
      }, io);
    } catch (err) {
      console.error('Failed to create notification:', err);
    }

    res.status(201).json({ project });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.user?.id || req.user?.id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.user': userId }]
    })
      .populate('owner')
      .populate('members.user')
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner').populate('members.user');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.userId || req.user?.user?.id || req.user?.id;
    
    if (project.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, status, startDate, endDate, budget, progress, members } = req.body;

    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    if (budget) project.budget = budget;
    if (progress) project.progress = progress;
    if (members) project.members = members;

    project.updatedAt = Date.now();
    await project.save();
    await project.populate('owner members');

    // Notify project members of the update
    try {
      const io = req.app.get('io');
      await notifyProjectMembers(project._id, userId, {
        type: 'project_updated',
        title: 'Project Updated',
        message: `Project "${project.name}" has been updated`,
        link: `/projects/${project._id}`
      }, io);
    } catch (err) {
      console.error('Failed to create notification:', err);
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.userId || req.user?.user?.id || req.user?.id;
    
    if (project.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const projectName = project.name;
    const projectId = project._id;

    // Notify all members before deletion
    try {
      const io = req.app.get('io');
      await notifyProjectMembers(projectId, userId, {
        type: 'project_updated',
        title: 'Project Deleted',
        message: `Project "${projectName}" has been deleted`,
        link: `/projects`
      }, io);
    } catch (err) {
      console.error('Failed to create notification:', err);
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
