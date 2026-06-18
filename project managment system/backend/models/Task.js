const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'completed'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['none', 'very-low', 'low', 'medium', 'high', 'very-high', 'critical', null],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    default: 0
  },
  actualHours: {
    type: Number,
    default: 0
  },
  percentComplete: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  dependencies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ],
  subtasks: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      title: String,
      completed: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  timeLogs: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      hours: Number,
      date: Date,
      description: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  attachments: [String],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', TaskSchema);
