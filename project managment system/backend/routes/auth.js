const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendContactEmail } = require('../services/emailService');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register with validation
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        authProvider: 'local'
      });

      await user.save();

      const payload = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); // Reduced to 7 days for better security

      res.status(201).json({
        token,
        user: {
          _id: user._id,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login with validation
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if user has a password (not Google OAuth only)
      if (!user.password) {
        return res.status(401).json({ message: 'Please sign in with Google' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.json({
        token,
        user: {
          _id: user._id,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Google OAuth Sign-In/Sign-Up
router.post('/google', async (req, res) => {
  try {
    const { tokenId, credential } = req.body;
    const idToken = tokenId || credential;

    if (!idToken) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { googleId: googleId }]
    });

    if (user) {
      // Update user if they signed up with email but now using Google
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture) user.avatar = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name,
        email: email.toLowerCase(),
        googleId,
        authProvider: 'google',
        avatar: picture || null
      });
      await user.save();
    }

    const jwtPayload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: jwtPayload.user
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.user?.id || req.user?.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password - Send reset link via email
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { email } = req.body;

      console.log('Forgot password request for:', email);

      // Find user
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        console.log('User not found for email:', email);
        // Don't reveal if email exists for security
        return res
          .status(200)
          .json({ message: 'If an account exists with this email, you will receive a password reset link' });
      }

      console.log('User found:', user.email);

      // Create reset token
      const resetToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

      console.log('Sending password reset email to:', user.email);
      console.log('Reset link:', resetLink);

      // Send email with reset link
      const emailService = require('../services/emailService');
      const emailResult = await emailService.sendPasswordResetEmail(user.email, resetLink);

      console.log('Email result:', emailResult);

      if (!emailResult.success) {
        console.error('Failed to send reset email:', emailResult.error);
        return res.status(500).json({ message: 'Failed to send reset link. Please try again later.' });
      }

      res.json({ message: 'Password reset link sent to your email' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Reset Password - Update password with token
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { token, newPassword } = req.body;

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user password
      user.password = hashedPassword;
      await user.save();

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Change Password - Authenticated user changes their password
// Change Password - Authenticated user changes their password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Get user ID from token
    const userId = req.user.user?.id || req.user.user?._id;
    console.log('User ID:', userId);
    console.log('req.user structure:', req.user);

    if (!userId) {
      return res.status(400).json({ message: 'Could not verify user identity' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.email);

    // Check if user has a password (not OAuth only)
    if (!user.password) {
      return res
        .status(400)
        .json({ message: 'Your account uses OAuth sign-in. Please use Google to change your credentials.' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    console.log('Current password verified');

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    console.log('Password updated successfully');

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Contact Form - Send email
router.post(
  '/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { name, email, subject, message } = req.body;

      console.log('Contact form submission received:', { name, email, subject });

      // Send contact email
      const result = await sendContactEmail({ name, email, subject, message });

      if (result.success) {
        console.log('Contact email sent successfully:', result.messageId);
        res.json({ message: 'Message sent successfully! We will get back to you soon.' });
      } else {
        console.error('Failed to send contact email:', result.error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ message: 'Server error: ' + error.message });
    }
  }
);

module.exports = router;
