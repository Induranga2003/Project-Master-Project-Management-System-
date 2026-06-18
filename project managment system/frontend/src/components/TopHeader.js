import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { notificationsAPI } from '../services/api';

export default function TopHeader({ title, dateRange = 'Last 30 days', showSearch = false }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState(dateRange);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      const notifData = response.data?.notifications || [];
      // Get only the latest 5 for the dropdown
      setNotifications(notifData.slice(0, 5));
      setUnreadCount(response.data?.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
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

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationsAPI.markAsRead(notification._id);
        fetchNotifications(); // Refresh to update unread count
      }
      setShowNotifications(false);
      if (notification.link) {
        navigate(notification.link);
      } else {
        navigate('/notifications');
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Could navigate to search results page or trigger global search
      console.log('Searching for:', searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
  };

  const dateRangeOptions = [
    'Last 7 days',
    'Last 30 days',
    'Last 90 days',
    'Last year',
    'All time',
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-700 shadow-2xl">
      <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
      
      <div className="flex items-center gap-4">
        {/* Date Range Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDateRange(!showDateRange)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-cyan-500 hover:bg-slate-700 transition-all flex items-center gap-2 text-xs font-medium text-slate-300 group"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden lg:inline">{selectedDateRange}</span>
          </button>

          {/* Date Range Dropdown */}
          {showDateRange && (
            <div className="absolute right-0 mt-2 w-44 bg-slate-800 rounded-lg shadow-2xl border-2 border-slate-700 z-50 backdrop-blur-sm">
              {dateRangeOptions.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedDateRange(range);
                    setShowDateRange(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-all first:rounded-t-lg last:rounded-b-lg ${
                    selectedDateRange === range
                      ? 'bg-cyan-500/20 text-cyan-400 font-semibold border-l-4 border-l-cyan-500'
                      : 'text-slate-200 hover:bg-slate-700/50 hover:text-cyan-400 border-l-4 border-l-transparent'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        {showSearch && (
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search projects, tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-slate-800 border-2 border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-white placeholder-slate-400"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-slate-800 rounded-lg transition-all hover:shadow-lg group"
          >
            <svg className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 shadow-lg ring-2 ring-slate-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-2xl border-2 border-slate-700 z-50 backdrop-blur-sm">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-bold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 border-b border-slate-700 hover:bg-slate-700/50 transition-all cursor-pointer ${
                        !notif.isRead ? 'bg-cyan-500/10 border-l-4 border-l-cyan-500' : 'border-l-4 border-l-transparent'
                      }`}
                    >
                      <p className="text-sm text-white font-medium">{notif.title}</p>
                      <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(notif.createdAt)}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 text-sm">No notifications</div>
                )}
              </div>
              <div className="p-3 border-t border-slate-700 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/notifications');
                  }}
                  className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  View All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg transition-all hover:shadow-lg"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/50"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
              {/* <p className="text-xs text-slate-400">{user?.role || 'Team Member'}</p> */}
            </div>
            <span className="text-slate-400">▼</span>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-2xl border-2 border-slate-700 z-50 backdrop-blur-sm">
              <div className="p-4 border-b border-slate-700">
                <p className="font-semibold text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400">{user?.email || 'email@example.com'}</p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 hover:text-cyan-400 transition-all flex items-center gap-3 group"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <button
                  onClick={() => {
                    navigate('/my-invitations');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 hover:text-cyan-400 transition-all flex items-center gap-3 group"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  My Invitations
                </button>
                <button
                  onClick={() => {
                    navigate('/users');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 hover:text-cyan-400 transition-all flex items-center gap-3 group"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Team
                </button>
              </div>
              <div className="border-t border-slate-700 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all font-semibold flex items-center gap-3 group"
                >
                  <svg className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={() => setShowLogoutModal(false)}>
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-lg shadow-2xl border-2 border-slate-700 p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-cyan-500/30">
                <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Logout Confirmation</h3>
              <p className="text-slate-300 text-sm mb-8">Are you sure you want to logout from your account?</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-8 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all font-semibold shadow-lg hover:shadow-xl hover:shadow-cyan-500/30"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



