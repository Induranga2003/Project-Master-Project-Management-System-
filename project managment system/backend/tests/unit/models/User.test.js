const mongoose = require('mongoose');
const User = require('../../../models/User');
const { setupTestDB, teardownTestDB, clearDatabase } = require('../../helpers/setup');

describe('User Model', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email.toLowerCase());
      expect(savedUser.password).toBeDefined();
      expect(savedUser.authProvider).toBe('local');
      expect(savedUser.role).toBe('team-member');
    });

    it('should require name field', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should require email field', async () => {
      const user = new User({
        name: 'Test User',
        password: 'password123'
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should require password for local auth', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        authProvider: 'local'
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should not require password for Google auth', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        googleId: 'google123',
        authProvider: 'google'
      });

      const savedUser = await user.save();
      expect(savedUser._id).toBeDefined();
      expect(savedUser.password).toBeUndefined();
    });

    it('should convert email to lowercase', async () => {
      const user = new User({
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      });

      const savedUser = await user.save();
      expect(savedUser.email).toBe('test@example.com');
    });

    it('should enforce unique email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await new User(userData).save();
      const duplicateUser = new User(userData);

      await expect(duplicateUser.save()).rejects.toThrow();
    });
  });

  describe('Role-based Permissions', () => {
    it('should set admin permissions for admin role', async () => {
      const user = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });

      const savedUser = await user.save();
      expect(savedUser.permissions.canCreateProjects).toBe(true);
      expect(savedUser.permissions.canDeleteProjects).toBe(true);
      expect(savedUser.permissions.canAssignTasks).toBe(true);
      expect(savedUser.permissions.canEditBudget).toBe(true);
      expect(savedUser.permissions.canViewAnalytics).toBe(true);
    });

    it('should set manager permissions for manager role', async () => {
      const user = new User({
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'password123',
        role: 'manager'
      });

      const savedUser = await user.save();
      expect(savedUser.permissions.canCreateProjects).toBe(true);
      expect(savedUser.permissions.canDeleteProjects).toBe(false);
      expect(savedUser.permissions.canAssignTasks).toBe(true);
      expect(savedUser.permissions.canEditBudget).toBe(true);
      expect(savedUser.permissions.canViewAnalytics).toBe(true);
    });

    it('should set restricted permissions for team-member role', async () => {
      const user = new User({
        name: 'Team Member',
        email: 'member@example.com',
        password: 'password123',
        role: 'team-member'
      });

      const savedUser = await user.save();
      expect(savedUser.permissions.canCreateProjects).toBe(false);
      expect(savedUser.permissions.canDeleteProjects).toBe(false);
      expect(savedUser.permissions.canAssignTasks).toBe(false);
      expect(savedUser.permissions.canEditBudget).toBe(false);
      expect(savedUser.permissions.canViewAnalytics).toBe(false);
    });
  });

  describe('User Defaults', () => {
    it('should set default role to team-member', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await user.save();
      expect(savedUser.role).toBe('team-member');
    });

    it('should set default authProvider to local', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await user.save();
      expect(savedUser.authProvider).toBe('local');
    });

    it('should set default onboardingCompleted to false', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await user.save();
      expect(savedUser.onboardingCompleted).toBe(false);
    });

    it('should set default totalHoursLogged to 0', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await user.save();
      expect(savedUser.totalHoursLogged).toBe(0);
    });
  });

  describe('User Validation', () => {
    it('should accept any string as email (format validation at API level)', async () => {
      // Note: Email format validation is handled at the API route level using express-validator
      // The model accepts any string, allowing flexibility for different validation strategies
      const user = new User({
        name: 'Test User',
        email: 'any-string-email',
        password: 'password123'
      });

      const savedUser = await user.save();
      expect(savedUser.email).toBe('any-string-email');
    });

    it('should trim email whitespace', async () => {
      const user = new User({
        name: 'Test User',
        email: '  test@example.com  ',
        password: 'password123'
      });

      const savedUser = await user.save();
      expect(savedUser.email).toBe('test@example.com');
    });
  });
});

