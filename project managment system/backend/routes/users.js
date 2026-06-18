const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all users
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current user's profile (including onboarding) - Must be before /:id route
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, avatar, department, phone, role, onboardingCompleted, templateSelected, onboardingData } = req.body;

    let user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic profile fields
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (department) user.department = department;
    if (phone) user.phone = phone;

    // Validate and update role if provided (but don't allow users to change their own role)
    if (role !== undefined) {
      const validRoles = ['admin', 'manager', 'team-member', 'client'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: `Invalid role. Must be one of: ${validRoles.join(', ')}. Role '${role}' is not allowed.`
        });
      }
      // Users cannot change their own role - only admins can do this
      // For now, we'll ignore role updates from profile endpoint
      // Role should be managed through admin endpoints
    }

    // Update onboarding status and data
    if (onboardingCompleted !== undefined) {
      user.onboardingCompleted = onboardingCompleted;
    }
    if (templateSelected !== undefined) {
      user.templateSelected = templateSelected;
    }
    if (onboardingData) {
      user.onboardingData = {
        ...user.onboardingData,
        ...onboardingData
      };

      // Update user's department if provided in onboarding
      if (onboardingData.department) {
        user.department = onboardingData.department;
      }

      // Update user's display name if provided
      if (onboardingData.displayName) {
        user.name = onboardingData.displayName;
      }

      // Don't save role from onboardingData to user.role - it's just metadata
      // The role in onboardingData is the user's job role, not system role
    }

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile by ID
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, avatar, role } = req.body;
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only allow updating name and avatar, not role
    // Role should be managed separately by admins
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    // If role is provided, validate it's a valid enum value
    if (role !== undefined) {
      const validRoles = ['admin', 'manager', 'team-member', 'client'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
        });
      }
      // Only allow role update if user is admin or updating their own profile
      const isAdmin = user.role === 'admin';
      const isOwnProfile = req.params.id === req.userId;

      if (!isAdmin && !isOwnProfile) {
        return res.status(403).json({ message: 'Not authorized to update role' });
      }

      user.role = role;
    }

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
