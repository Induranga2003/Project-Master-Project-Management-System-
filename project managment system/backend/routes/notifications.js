const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const Project = require('../models/Project');

// Get all notifications for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    // Handle different token structures
    const userId = req.user.user?.id || req.user.id || req.userId;

    console.log('=== Fetching notifications ===');
    console.log('Request user object:', JSON.stringify(req.user, null, 2));
    console.log('Extracted userId:', userId);

    if (!userId) {
      console.error('No userId found in request');
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Fetch notifications without populate first to avoid invalid reference errors
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(100).lean(); // Use lean() for better performance

    console.log(`Found ${notifications.length} raw notifications for user ${userId}`);

    // Manually populate valid references
    const populatedNotifications = await Promise.all(
      notifications.map(async notif => {
        try {
          // Populate project if exists
          if (notif.project) {
            const project = await mongoose.model('Project').findById(notif.project).select('name').lean();
            notif.project = project;
          }

          // Populate relatedUser if exists
          if (notif.relatedUser) {
            const user = await mongoose.model('User').findById(notif.relatedUser).select('name email').lean();
            notif.relatedUser = user;
          }

          // Populate relatedTask if exists
          if (notif.relatedTask) {
            const task = await mongoose.model('Task').findById(notif.relatedTask).select('title').lean();
            notif.relatedTask = task;
          }

          return notif;
        } catch (err) {
          console.error('Error populating notification:', notif._id, err.message);
          // Return notification without population if there's an error
          return notif;
        }
      })
    );

    const unreadCount = await Notification.countDocuments({
      user: userId,
      isRead: false
    });

    console.log(`Unread count: ${unreadCount}`);

    res.json({
      notifications: populatedNotifications,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get unread count only
router.get('/unread-count', auth, async (req, res) => {
  try {
    const userId = req.user.user?.id || req.user.id || req.userId;

    const unreadCount = await Notification.countDocuments({
      user: userId,
      isRead: false
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const userId = req.user.user?.id || req.user.id || req.userId;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', auth, async (req, res) => {
  try {
    const userId = req.user.user?.id || req.user.id || req.userId;

    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.user?.id || req.user.id || req.userId;
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear all read notifications
router.delete('/clear/read', auth, async (req, res) => {
  try {
    const userId = req.user.user?.id || req.user.id || req.userId;

    await Notification.deleteMany({
      user: userId,
      isRead: true
    });

    res.json({ message: 'Read notifications cleared' });
  } catch (error) {
    console.error('Clear read notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test endpoint to create a notification
router.post('/test', auth, async (req, res) => {
  try {
    const userId = req.user.user?.id || req.user.id || req.userId;

    const notification = new Notification({
      user: userId,
      type: 'project_updated',
      title: 'Test Notification',
      message: 'This is a test notification created manually',
      isRead: false
    });

    await notification.save();
    res.status(201).json({ message: 'Test notification created', notification });
  } catch (error) {
    console.error('Create test notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to create a notification
const createNotification = async data => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// Helper function to create notifications for all project members
const notifyProjectMembers = async (projectId, excludeUserId, notificationData) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) return;

    const memberIds = project.members
      .filter(member => member.user.toString() !== excludeUserId?.toString())
      .map(member => member.user);

    const notifications = memberIds.map(userId => ({
      user: userId,
      project: projectId,
      ...notificationData
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error('Notify project members error:', error);
  }
};

module.exports = router;
module.exports.createNotification = createNotification;
module.exports.notifyProjectMembers = notifyProjectMembers;
