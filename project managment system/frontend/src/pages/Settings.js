import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, authAPI } from '../services/api';
import { DarkModeContext } from '../context/DarkModeContext';
import { AuthContext } from '../context/AuthContext';
import TopHeader from '../components/TopHeader';

export default function Settings() {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { logout, user: contextUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile & Account
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskAssignments: true,
    projectUpdates: true,
    deadlineReminders: true,
    commentReplies: true,
    weeklyDigest: false,
    pushNotifications: true,
  });

  // Security & Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });


  useEffect(() => {
    if (contextUser) {
      setFormData({
        name: contextUser.name || '',
        email: contextUser.email || '',
      });
      loadSettings();
    }
  }, [contextUser]);

  const loadSettings = async () => {
    try {
      // Get user ID (handle both id and _id)
      const userId = contextUser?.id || contextUser?._id;
      
      // Try to load from backend first
      if (contextUser && userId) {
        const response = await usersAPI.getOne(userId);
        if (response.data?.notificationPreferences) {
          setNotifications(response.data.notificationPreferences);
          // Also save to localStorage for offline access
          localStorage.setItem('notificationSettings', JSON.stringify(response.data.notificationPreferences));
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load notification settings from backend:', err);
    }
    
    // Fallback to localStorage if backend fails
    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      // Get user ID (handle both id and _id)
      const userId = contextUser?.id || contextUser?._id;
      
      if (!contextUser || !userId) {
        throw new Error('User information not available');
      }
      
      await usersAPI.update(userId, formData);
      const updatedUser = { ...contextUser, ...formData };
      updateUser(updatedUser);
      // Also update localStorage for backward compatibility
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Validate all fields are filled
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setError('All password fields are required');
        setLoading(false);
        return;
      }

      // Validate password match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }

      // Validate password length
      if (passwordData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      // Validate current password is not the same as new password
      if (passwordData.currentPassword === passwordData.newPassword) {
        setError('New password must be different from current password');
        setLoading(false);
        return;
      }

      // Call API to change password
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      console.error('Password change error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      // Get user ID (handle both id and _id)
      const userId = contextUser?.id || contextUser?._id;
      
      // Validate user ID exists
      if (!contextUser || !userId) {
        console.error('User context:', contextUser);
        throw new Error('User information not available. Please try logging out and back in.');
      }
      
      // Save to backend
      await usersAPI.update(userId, {
        notificationPreferences: notifications
      });
      
      // Also save to localStorage for offline access
      localStorage.setItem('notificationSettings', JSON.stringify(notifications));
      
      setSuccess('Notification preferences saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to save notification preferences:', err);
      const errorMsg = err.message || 'Failed to save notification preferences. Please try again.';
      setError(errorMsg);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
    navigate('/login');
  };

  const [selectedView, setSelectedView] = useState('Settings');
  const dashboardViews = ['Dashboard', 'Templates', 'Projects', 'Tasks', 'Teams', 'Analytics', 'Reports', 'Settings'];

  const handleNavigation = (view) => {
    setSelectedView(view);
    
    switch(view) {
      case 'Dashboard':
        navigate('/dashboard');
        break;
      case 'Projects':
        navigate('/projects');
        break;
      case 'Tasks':
        navigate('/tasks');
        break;
      case 'Settings':
        // Already on settings page
        break;
      case 'Templates':
        navigate('/templates');
        break;
      case 'Teams':
        navigate('/users');
        break;
      case 'Analytics':
        navigate('/analytics');
        break;
      case 'Reports':
        navigate('/reports');
        break;
      default:
        break;
    }
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-cyan-300 transition-all">
      <div className="flex-1">
        <div className="font-semibold text-slate-900 text-sm mb-1">
          {label}
        </div>
        {description && (
          <div className="text-xs text-slate-600">
            {description}
          </div>
        )}
      </div>
      <button
        onClick={onChange}
        type="button"
        className="relative inline-flex h-7 w-14 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
        style={{
          backgroundColor: checked ? '#06b6d4' : '#cbd5e0'
        }}
      >
        <span
          className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform"
          style={{
            transform: checked ? 'translateX(28px)' : 'translateX(2px)'
          }}
        />
      </button>
    </div>
  );

  // Tab Configuration
  const tabs = [
    { id: 'profile', icon: '👤', label: 'Account & Security' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'preferences', icon: '⚙️', label: 'Preferences' },
  ];

  if (!contextUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8 flex flex-col">
          <div className="mb-8">
            <div className="text-white text-xl font-bold flex items-center gap-3 mb-6">
              <img 
                src="/Logo.png" 
                alt="ProjectMaster Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl">ProjectMaster</span>
            </div>
            <h2 className="text-3xl font-bold mb-3">Settings</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Manage your account preferences and system configuration.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8 flex flex-col">
        <div className="mb-8">
          <div className="text-white text-xl font-bold flex items-center gap-3 mb-6">
            <img 
              src="/Logo.png" 
              alt="ProjectMaster Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl">ProjectMaster</span>
          </div>
          <h2 className="text-3xl font-bold mb-3">Settings</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage your account preferences and system configuration.
          </p>
        </div>

        {/* Dashboard Views */}
        <div className="space-y-2 flex-1">
          {dashboardViews.map((view) => (
            <button
              key={view}
              onClick={() => handleNavigation(view)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                selectedView === view
                  ? 'bg-cyan-500 text-white font-semibold shadow-lg'
                  : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader title="Settings" showSearch={false} />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            {/* <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
                <p className="text-slate-600">Manage your account preferences and system configuration</p>
              </div>
            </div> */}

            {/* Alerts */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div className="flex-1">
                  <strong className="text-red-800 block mb-1">Error</strong>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button className="text-red-500 hover:text-red-700" onClick={() => setError('')}>×</button>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <span className="text-green-500 text-xl">✅</span>
                <div className="flex-1">
                  <strong className="text-green-800 block mb-1">Success</strong>
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
                <button className="text-green-500 hover:text-green-700" onClick={() => setSuccess('')}>×</button>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b-2 border-slate-200 pb-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-t-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-white shadow-lg -mb-2 border-b-2 border-cyan-500'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Account & Security Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Account & Security</h2>
                  
                  {/* Profile Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          disabled
                          className="w-full px-4 py-3 bg-slate-100 text-slate-500 border border-slate-300 rounded-lg cursor-not-allowed"
                        />
                        <small className="text-slate-500 text-xs mt-1 block">Name cannot be changed</small>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 bg-slate-100 text-slate-500 border border-slate-300 rounded-lg cursor-not-allowed"
                        />
                        <small className="text-slate-500 text-xs mt-1 block">Email cannot be changed</small>
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="pt-8 border-t-2 border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Security & Password</h3>
                    <form onSubmit={handlePasswordChange} className="max-w-lg">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            placeholder="Enter current password"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="Enter new password"
                            required
                            disabled={loading}
                            minLength={6}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                          <small className="text-slate-500 text-xs mt-1 block">Minimum 6 characters</small>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Notification Preferences</h2>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      <ToggleSwitch
                        checked={notifications.emailNotifications}
                        onChange={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
                        label="Email Notifications"
                        description="Receive notifications via email"
                      />
                      <ToggleSwitch
                        checked={notifications.taskAssignments}
                        onChange={() => setNotifications({ ...notifications, taskAssignments: !notifications.taskAssignments })}
                        label="Task Assignments"
                        description="Get notified when assigned to tasks"
                      />
                      <ToggleSwitch
                        checked={notifications.projectUpdates}
                        onChange={() => setNotifications({ ...notifications, projectUpdates: !notifications.projectUpdates })}
                        label="Project Updates"
                        description="Notifications about project changes"
                      />
                      <ToggleSwitch
                        checked={notifications.deadlineReminders}
                        onChange={() => setNotifications({ ...notifications, deadlineReminders: !notifications.deadlineReminders })}
                        label="Deadline Reminders"
                        description="Reminders for upcoming deadlines"
                      />
                      <ToggleSwitch
                        checked={notifications.commentReplies}
                        onChange={() => setNotifications({ ...notifications, commentReplies: !notifications.commentReplies })}
                        label="Comment Replies"
                        description="Get notified of comment replies"
                      />

                      <ToggleSwitch
                        checked={notifications.weeklyDigest}
                        onChange={() => setNotifications({ ...notifications, weeklyDigest: !notifications.weeklyDigest })}
                        label="Weekly Digest"
                        description="Receive weekly activity summary"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Push Notifications</h3>
                    <ToggleSwitch
                      checked={notifications.pushNotifications}
                      onChange={() => setNotifications({ ...notifications, pushNotifications: !notifications.pushNotifications })}
                      label="Browser Push Notifications"
                      description="Real-time browser notifications"
                    />
                  </div>
                  <div className="pt-6 border-t border-slate-200">
                    <button 
                      onClick={handleSaveNotifications} 
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {/* System Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">System Preferences</h2>
                  <div className="mb-6">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <div className="text-lg font-semibold text-slate-900 mb-1">Theme</div>
                        <div className="text-sm text-slate-600">
                          {isDarkMode ? 'Dark mode enabled' : 'Light mode enabled'}
                        </div>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        style={{
                          backgroundColor: isDarkMode ? '#06b6d4' : '#cbd5e0'
                        }}
                      >
                        <span
                          className="inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform"
                          style={{
                            transform: isDarkMode ? 'translateX(34px)' : 'translateX(2px)'
                          }}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-200">
                    <button 
                      onClick={handleLogout}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
