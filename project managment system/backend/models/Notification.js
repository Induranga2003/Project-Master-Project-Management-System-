const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: false
    },
    type: {
      type: String,
      enum: [
        'member_joined',
        'task_completed',
        'deadline_approaching',
        'task_assigned',
        'task_updated',
        'project_updated'
      ],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    link: {
      type: String // URL to navigate to when clicked
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
