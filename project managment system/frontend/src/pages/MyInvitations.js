import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopHeader from '../components/TopHeader';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export default function MyInvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('Invitations');
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
        navigate('/settings');
        break;
      case 'Templates':
        navigate('/templates');
        break;
      case 'Teams':
        navigate('/users');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/invitations/my-invitations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvitations(response.data);
    } catch (err) {
      setError('Failed to load invitations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId) => {
    try {
      setError('');
      const response = await axios.post(
        `${API_BASE_URL}/invitations/invitations/${invitationId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Invitation accepted! You are now part of the project.');
      setInvitations(
        invitations.map(inv =>
          inv._id === invitationId ? { ...inv, status: 'accepted' } : inv
        )
      );

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept invitation');
    }
  };

  const handleReject = async (invitationId) => {
    if (!window.confirm('Are you sure you want to reject this invitation?')) {
      return;
    }

    try {
      setError('');
      await axios.post(
        `${API_BASE_URL}/invitations/invitations/${invitationId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Invitation rejected');
      setInvitations(
        invitations.map(inv =>
          inv._id === invitationId ? { ...inv, status: 'rejected' } : inv
        )
      );

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject invitation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
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
            <h2 className="text-3xl font-bold mb-3">My Invitations</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Manage your project invitations and join new projects.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading invitations...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredInvitations = invitations.filter(inv => inv.status === filterStatus);
  const statusCounts = {
    pending: invitations.filter(inv => inv.status === 'pending').length,
    accepted: invitations.filter(inv => inv.status === 'accepted').length,
    rejected: invitations.filter(inv => inv.status === 'rejected').length,
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
          <h2 className="text-3xl font-bold mb-3">My Invitations</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage your project invitations and join new projects.
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
        <TopHeader title="My Invitations" showSearch={false} />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Invitations</h1>
              <p className="text-slate-600">{invitations.length} invitation{invitations.length !== 1 ? 's' : ''} total</p>
            </div>

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
                <span className="text-green-500 text-xl">✓</span>
                <div className="flex-1">
                  <strong className="text-green-800 block mb-1">Success</strong>
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
                <button className="text-green-500 hover:text-green-700" onClick={() => setSuccess('')}>×</button>
              </div>
            )}

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
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
                onClick={() => setFilterStatus('rejected')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  filterStatus === 'rejected'
                    ? 'bg-cyan-500 text-white font-semibold shadow-lg'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>✕ Rejected</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  filterStatus === 'rejected' ? 'bg-cyan-600' : 'bg-slate-200'
                }`}>{statusCounts.rejected}</span>
              </button>
            </div>

            {/* Invitations List */}
            {filteredInvitations.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">
                  {filterStatus === 'pending' ? '📭' : filterStatus === 'accepted' ? '📫' : '🚫'}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {filterStatus === 'pending'
                    ? 'No pending invitations'
                    : filterStatus === 'accepted'
                    ? 'No accepted invitations'
                    : 'No rejected invitations'}
                </h3>
                {filterStatus === 'pending' && (
                  <p className="text-slate-600">
                    You'll see project invitations here when team leaders invite you
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInvitations.map((invitation) => (
                  <div
                    key={invitation._id}
                    className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      {/* Project Info */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                          {invitation.project?.name}
                        </h3>
                        {invitation.project?.description && (
                          <p className="text-slate-600 text-sm">
                            {invitation.project.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">From</p>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {invitation.inviter?.name}
                            </p>
                            <p className="text-xs text-slate-600">
                              {invitation.inviter?.email}
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4">
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Role</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            invitation.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {invitation.role}
                          </span>
                        </div>

                        {invitation.status === 'pending' && invitation.expiresAt && (
                          <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Expires</p>
                            <p className="text-slate-900 font-semibold">
                              {new Date(invitation.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {invitation.message && (
                        <div className="mt-4 p-4 bg-cyan-50 border-l-4 border-cyan-500 rounded">
                          <p className="text-xs font-semibold text-cyan-900 mb-1">Message from inviter:</p>
                          <p className="text-sm text-cyan-800">{invitation.message}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                          {invitation.status === 'pending'
                            ? `Sent ${new Date(invitation.createdAt).toLocaleDateString()}`
                            : `${invitation.status === 'accepted' ? 'Accepted' : 'Rejected'} ${new Date(invitation.respondedAt).toLocaleDateString()}`}
                        </p>
                        
                        <div className="flex gap-3">
                          {filterStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleReject(invitation._id)}
                                className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 font-semibold flex items-center gap-2"
                              >
                                <span>✕</span> Decline
                              </button>
                              <button
                                onClick={() => handleAccept(invitation._id)}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                              >
                                <span>✓</span> Accept
                              </button>
                            </>
                          )}

                          {filterStatus === 'accepted' && (
                            <button
                              onClick={() => {
                                navigate(`/projects/${invitation.project._id}`);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                            >
                              <span>Open Project</span> <span>→</span>
                            </button>
                          )}
                        </div>
                      </div>
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
