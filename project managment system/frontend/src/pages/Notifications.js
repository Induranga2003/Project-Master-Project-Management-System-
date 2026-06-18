import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../services/api';
import TopHeader from '../components/TopHeader';
import '../styles/Notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending'); // pending (unread), accepted (read), all
  const [selectedView, setSelectedView] = useState('Notifications');
  const [notificationPreferences, setNotificationPreferences] = useState(null);
  const navigate = useNavigate();

  const dashboardViews = ['Dashboard', 'Templates', 'Projects', 'Tasks', 'Teams', 'Analytics', 'Reports', 'Notifications', 'Settings'];

  // Load notification preferences
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const saved = localStorage.getItem('notificationSettings');
        if (saved) {
          setNotificationPreferences(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Failed to load notification preferences:', err);
      }
    };
    loadPreferences();
  }, []);

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
        navigate('/settings');
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
      case 'Notifications':
        // Already on notifications
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await notificationsAPI.getAll();
      console.log('Notifications response:', response);
      console.log('Notifications data:', response.data);
      
      // Backend returns { notifications: [...], unreadCount: X }
      const notificationsData = response.data?.notifications || response.data || [];
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error response status:', err.response?.status);
      console.error('Error message:', err.message);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load notifications';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationsAPI.markAsRead(notification._id);
        setNotifications(notifications.map(n => 
          n._id === notification._id ? { ...n, isRead: true } : n
        ));
      }
      
      // Navigate to the link if available
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      setError('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  const handleClearRead = async () => {
    try {
      await notificationsAPI.clearRead();
      setNotifications(notifications.filter(n => !n.isRead));
    } catch (err) {
      setError('Failed to clear read notifications');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'member_joined':
        return (
          <div className="notification-icon bg-cyan-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        );
      case 'task_completed':
        return (
          <div className="notification-icon bg-green-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'deadline_approaching':
        return (
          <div className="notification-icon bg-orange-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'task_assigned':
        return (
          <div className="notification-icon bg-blue-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
      case 'task_updated':
        return (
          <div className="notification-icon bg-purple-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case 'project_updated':
        return (
          <div className="notification-icon bg-indigo-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="notification-icon bg-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return 'Just now';
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterStatus === 'pending') return !n.isRead; // Unread = Pending
    if (filterStatus === 'accepted') return n.isRead; // Read = Accepted
    return true; // all
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const readCount = notifications.filter(n => n.isRead).length;
  const statusCounts = {
    pending: unreadCount,
    accepted: readCount,
    all: notifications.length
  };

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
          <h2 className="text-3xl font-bold mb-3">Notifications</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Stay updated with your project activities
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
        <TopHeader title="Notifications" showSearch={false} />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">All Notifications</h1>
                  <p className="text-slate-600">{notifications.length} notification{notifications.length !== 1 ? 's' : ''} total</p>
                </div>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Mark all as read
                    </button>
                  )}
                  {notifications.filter(n => n.isRead).length > 0 && (
                    <button
                      onClick={handleClearRead}
                      className="px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all duration-300"
                    >
                      Clear read
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Pending</p>
                      <p className="text-3xl font-bold text-cyan-600">{statusCounts.pending}</p>
                    </div>
                    <div className="bg-cyan-100 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Accepted</p>
                      <p className="text-3xl font-bold text-green-600">{statusCounts.accepted}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Total</p>
                      <p className="text-3xl font-bold text-slate-900">{notifications.length}</p>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Preferences Info Banner */}
              {notificationPreferences && (
                notificationPreferences.emailNotifications ||
                notificationPreferences.taskAssignments ||
                notificationPreferences.projectUpdates ||
                notificationPreferences.deadlineReminders ||
                notificationPreferences.commentReplies ||
                notificationPreferences.weeklyDigest ||
                notificationPreferences.pushNotifications
              ) && (
                <div className="mb-6 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-100 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-cyan-900 mb-1">Notification Preferences Active</h4>
                      <p className="text-sm text-cyan-800 mb-2">
                        Your notification settings are configured. You'll receive notifications based on your preferences.
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {notificationPreferences.emailNotifications && (
                          <span className="px-2 py-1 bg-white text-cyan-700 rounded-full border border-cyan-200">
                            ✓ Email Notifications
                          </span>
                        )}
                        {notificationPreferences.taskAssignments && (
                          <span className="px-2 py-1 bg-white text-cyan-700 rounded-full border border-cyan-200">
                            ✓ Task Assignments
                          </span>
                        )}
                        {notificationPreferences.projectUpdates && (
                          <span className="px-2 py-1 bg-white text-cyan-700 rounded-full border border-cyan-200">
                            ✓ Project Updates
                          </span>
                        )}
                        {notificationPreferences.deadlineReminders && (
                          <span className="px-2 py-1 bg-white text-cyan-700 rounded-full border border-cyan-200">
                            ✓ Deadline Reminders
                          </span>
                        )}
                        {notificationPreferences.commentReplies && (
                          <span className="px-2 py-1 bg-white text-cyan-700 rounded-full border border-cyan-200">
                            ✓ Comment Replies
                          </span>
                        )}
                        {notificationPreferences.weeklyDigest && (
                          <span className="px-2 py-1 bg-white text-cyan-700 rounded-full border border-cyan-200">
                            ✓ Weekly Digest
                          </span>
                        )}
                        {notificationPreferences.pushNotifications && (
                          <span className="px-2 py-1 bg-white text-cyan-700 rounded-full border border-cyan-200">
                            ✓ Push Notifications
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => navigate('/settings')}
                        className="mt-3 text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                      >
                        Manage preferences
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    filterStatus === 'pending'
                      ? 'bg-cyan-500 text-white font-semibold shadow-lg'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>⏳ Pending</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filterStatus === 'pending' ? 'bg-cyan-600' : 'bg-slate-200'
                  }`}>{statusCounts.pending}</span>
                </button>
                <button
                  onClick={() => setFilterStatus('accepted')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    filterStatus === 'accepted'
                      ? 'bg-cyan-500 text-white font-semibold shadow-lg'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>✓ Accepted</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filterStatus === 'accepted' ? 'bg-cyan-600' : 'bg-slate-200'
                  }`}>{statusCounts.accepted}</span>
                </button>
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    filterStatus === 'all'
                      ? 'bg-cyan-500 text-white font-semibold shadow-lg'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>📋 All</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filterStatus === 'all' ? 'bg-cyan-600' : 'bg-slate-200'
                  }`}>{statusCounts.all}</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
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

            {/* Notifications List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 text-lg">Loading notifications...</p>
                </div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">
                  {filterStatus === 'pending' ? '📭' : filterStatus === 'accepted' ? '✅' : '🔔'}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {filterStatus === 'pending'
                    ? 'No pending notifications'
                    : filterStatus === 'accepted'
                    ? 'No accepted notifications'
                    : 'No notifications'}
                </h3>
                <p className="text-slate-600">
                  {filterStatus === 'pending'
                    ? "You'll see new notifications here when actions are taken"
                    : filterStatus === 'accepted'
                    ? "You haven't acknowledged any notifications yet"
                    : "You'll see updates here when something happens"}
                </p>
              </div>
            ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {getNotificationIcon(notification.type)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="notification-title">{notification.title}</h3>
                        <span className="notification-time">{formatTimeAgo(notification.createdAt)}</span>
                      </div>
                      
                      <p className="notification-message">{notification.message}</p>
                      
                      {notification.project?.name && (
                        <div className="notification-meta">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{notification.project.name}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification._id);
                      }}
                      className="notification-delete"
                      title="Delete notification"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
