const mongoose = require('mongoose');
const Task = require('../../../models/Task');
const Project = require('../../../models/Project');
const User = require('../../../models/User');
const { setupTestDB, teardownTestDB, clearDatabase } = require('../../helpers/setup');

describe('Task Model', () => {
  let projectId;
  let userId;

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    
    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    userId = user._id;

    // Create test project
    const project = await Project.create({
      name: 'Test Project',
      description: 'Test Description',
      owner: userId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000)
    });
    projectId = project._id;
  });

  describe('Task Creation', () => {
    it('should create a task with valid data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        project: projectId,
        assignee: userId,
        status: 'todo',
        priority: 'high'
      };

      const task = new Task(taskData);
      const savedTask = await task.save();

      expect(savedTask._id).toBeDefined();
      expect(savedTask.title).toBe(taskData.title);
      expect(savedTask.project.toString()).toBe(projectId.toString());
      expect(savedTask.status).toBe('todo');
      expect(savedTask.priority).toBe('high');
    });

    it('should require title field', async () => {
      const task = new Task({
        description: 'Test Description',
        project: projectId
      });

      await expect(task.save()).rejects.toThrow();
    });

    it('should require project field', async () => {
      const task = new Task({
        title: 'Test Task',
        description: 'Test Description'
      });

      await expect(task.save()).rejects.toThrow();
    });

    it('should set default status to todo', async () => {
      const task = new Task({
        title: 'Test Task',
        project: projectId
      });

      const savedTask = await task.save();
      expect(savedTask.status).toBe('todo');
    });

    it('should set default priority to medium', async () => {
      const task = new Task({
        title: 'Test Task',
        project: projectId
      });

      const savedTask = await task.save();
      expect(savedTask.priority).toBe('medium');
    });

    it('should set default percentComplete to 0', async () => {
      const task = new Task({
        title: 'Test Task',
        project: projectId
      });

      const savedTask = await task.save();
      expect(savedTask.percentComplete).toBe(0);
    });
  });

  describe('Task Status Validation', () => {
    it('should accept valid status values', async () => {
      const validStatuses = ['todo', 'in-progress', 'review', 'completed'];
      
      for (const status of validStatuses) {
        const task = new Task({
          title: `Task ${status}`,
          project: projectId,
          status: status
        });

        const savedTask = await task.save();
        expect(savedTask.status).toBe(status);
      }
    });

    it('should reject invalid status values', async () => {
      const task = new Task({
        title: 'Test Task',
        project: projectId,
        status: 'invalid-status'
      });

      await expect(task.save()).rejects.toThrow();
    });
  });

  describe('Task Priority Validation', () => {
    it('should accept valid priority values', async () => {
      const validPriorities = ['none', 'very-low', 'low', 'medium', 'high', 'very-high', 'critical'];
      
      for (const priority of validPriorities) {
        const task = new Task({
          title: `Task ${priority}`,
          project: projectId,
          priority: priority
        });

        const savedTask = await task.save();
        expect(savedTask.priority).toBe(priority);
      }
    });
  });

  describe('Task Subtasks', () => {
    it('should add subtasks to a task', async () => {
      const task = new Task({
        title: 'Test Task',
        project: projectId
      });

      task.subtasks.push({
        title: 'Subtask 1',
        completed: false
      });

      task.subtasks.push({
        title: 'Subtask 2',
        completed: true
      });

      const savedTask = await task.save();
      expect(savedTask.subtasks).toHaveLength(2);
      expect(savedTask.subtasks[0].title).toBe('Subtask 1');
      expect(savedTask.subtasks[1].completed).toBe(true);
    });

    it('should set default completed to false for subtasks', async () => {
      const task = new Task({
        title: 'Test Task',
        project: projectId
      });

      task.subtasks.push({ title: 'Subtask 1' });
      const savedTask = await task.save();

      expect(savedTask.subtasks[0].completed).toBe(false);
    });
  });

  describe('Task Percent Complete Validation', () => {
    it('should enforce min value of 0', async () => {
      const task = new Task({
        title: 'Test Task',
        project: projectId,
        percentComplete: -10
      });

      await expect(task.save()).rejects.toThrow();
    });

    it('should enforce max value of 100', async () => {
      const task = new Task({
        title: 'Test Task',
        project: projectId,
        percentComplete: 150
      });

      await expect(task.save()).rejects.toThrow();
    });

    it('should accept valid percent values', async () => {
      const task = new Task({
        title: 'Test Task',
        project: projectId,
        percentComplete: 75
      });

      const savedTask = await task.save();
      expect(savedTask.percentComplete).toBe(75);
    });
  });

  describe('Task Dependencies', () => {
    it('should add task dependencies', async () => {
      const task1 = await Task.create({
        title: 'Task 1',
        project: projectId
      });

      const task2 = new Task({
        title: 'Task 2',
        project: projectId,
        dependencies: [task1._id]
      });

      const savedTask2 = await task2.save();
      expect(savedTask2.dependencies).toHaveLength(1);
      expect(savedTask2.dependencies[0].toString()).toBe(task1._id.toString());
    });
  });

  describe('Task Time Logs', () => {
    it('should add time logs to a task', async () => {
      const task = new Task({
        title: 'Test Task',
        project: projectId
      });

      task.timeLogs.push({
        user: userId,
        hours: 4.5,
        date: new Date(),
        description: 'Worked on feature'
      });

      const savedTask = await task.save();
      expect(savedTask.timeLogs).toHaveLength(1);
      expect(savedTask.timeLogs[0].hours).toBe(4.5);
      expect(savedTask.timeLogs[0].user.toString()).toBe(userId.toString());
    });
  });
});

