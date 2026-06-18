const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const Project = require('../../../models/Project');
const { setupTestDB, teardownTestDB, clearDatabase } = require('../../helpers/setup');

// Set test environment before importing server
process.env.NODE_ENV = 'test';

const app = require('../../../server');
let authToken;
let userId;

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

beforeEach(async () => {
  await clearDatabase();
  
  // Create test user and get auth token
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: await bcrypt.hash('password123', 10)
  });
  userId = user._id;
  authToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret');
});

describe('Projects API', () => {
  describe('POST /api/projects', () => {
    it('should create a project with authentication', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'Test Description',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString()
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData)
        .expect(201);

      expect(response.body.project).toHaveProperty('_id');
      expect(response.body.project.name).toBe(projectData.name);
      // Owner is populated (object) by the route, so check _id property
      expect(response.body.project.owner).toBeDefined();
      expect(response.body.project.owner._id.toString()).toBe(userId.toString());
      expect(response.body.project.status).toBe('planning');
    });

    it('should reject project creation without authentication', async () => {
      const projectData = {
        name: 'Unauthorized Project',
        description: 'Test',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000)
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject project creation with missing required fields', async () => {
      const projectData = {
        description: 'Test Description'
        // Missing name, startDate, endDate
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/projects', () => {
    beforeEach(async () => {
      // Create test projects
      await Project.create([
        {
          name: 'Project 1',
          description: 'Description 1',
          owner: userId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000)
        },
        {
          name: 'Project 2',
          description: 'Description 2',
          owner: userId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000)
        }
      ]);
    });

    it('should get all projects for authenticated user', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body.projects)).toBe(true);
      expect(response.body.projects.length).toBeGreaterThan(0);
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/projects/:id', () => {
    let projectId;

    beforeEach(async () => {
      const project = await Project.create({
        name: 'Test Project',
        description: 'Test Description',
        owner: userId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000)
      });
      projectId = project._id;
    });

    it('should get a specific project by ID', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.project).toHaveProperty('_id');
      expect(response.body.project._id).toBe(projectId.toString());
      expect(response.body.project.name).toBe('Test Project');
    });

    it('should reject request for non-existent project', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/projects/:id', () => {
    let projectId;

    beforeEach(async () => {
      const project = await Project.create({
        name: 'Original Name',
        description: 'Original Description',
        owner: userId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000)
      });
      projectId = project._id;
    });

    it('should update a project with valid data', async () => {
      const updateData = {
        name: 'Updated Name',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.project.name).toBe(updateData.name);
      expect(response.body.project.description).toBe(updateData.description);
    });

    it('should reject update without authentication', async () => {
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .send({ name: 'Updated Name' })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/projects/:id', () => {
    let projectId;

    beforeEach(async () => {
      const project = await Project.create({
        name: 'Project to Delete',
        description: 'Description',
        owner: userId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000)
      });
      projectId = project._id;
    });

    it('should delete a project', async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');

      // Verify project was deleted
      const project = await Project.findById(projectId);
      expect(project).toBeNull();
    });

    it('should reject delete without authentication', async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});

