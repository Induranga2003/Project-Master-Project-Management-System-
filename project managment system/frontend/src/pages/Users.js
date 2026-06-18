import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { projectsAPI, usersAPI } from '../services/api';
import TopHeader from '../components/TopHeader';

export default function Users() {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all projects for current user
      const projectsResponse = await projectsAPI.getAll();
      const projects = projectsResponse.data || [];

      // Collect all unique team members from all projects with their associated projects
      const membersMap = new Map();

      for (const project of projects) {
        // Add project owner
        if (project.owner) {
          const ownerId = project.owner._id || project.owner;
          if (!membersMap.has(ownerId)) {
            membersMap.set(ownerId, {
              _id: ownerId,
              name: project.owner.name || 'Unknown',
              email: project.owner.email || 'No email',
              avatar: project.owner.avatar || '',
              role: 'project-manager',
              createdAt: project.owner.createdAt || new Date(),
              projects: [],
            });
          }
          membersMap.get(ownerId).projects.push({
            _id: project._id,
            name: project.name,
            progress: project.progress || 0,
            status: project.status || 'planning',
            endDate: project.endDate,
          });
        }

        // Add project members
        if (project.members && Array.isArray(project.members)) {
          for (const member of project.members) {
            const userId = member.user._id || member.user;
            if (!membersMap.has(userId)) {
              membersMap.set(userId, {
                _id: userId,
                name: member.user.name || 'Unknown',
                email: member.user.email || 'No email',
                avatar: member.user.avatar || '',
                role: member.role === 'admin' ? 'project-manager' : 'team-member',
                createdAt: member.joinedAt || member.createdAt || new Date(),
                projects: [],
              });
            }
            membersMap.get(userId).projects.push({
              _id: project._id,
              name: project.name,
              progress: project.progress || 0,
              status: project.status || 'planning',
              endDate: project.endDate,
            });
          }
        }
      }

      // Remove duplicate projects for each member
      membersMap.forEach(member => {
        const uniqueProjects = new Map();
        member.projects.forEach(proj => {
          if (!uniqueProjects.has(proj._id)) {
            uniqueProjects.set(proj._id, proj);
          }
        });
        member.projects = Array.from(uniqueProjects.values());
      });

      // Convert map to array and exclude current user
      const teamMembers = Array.from(membersMap.values()).filter(m => {
        const memberId = m._id;
        const userId = currentUser?._id || currentUser?.id;
        return memberId !== userId;
      });
      
      setTeamMembers(teamMembers);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load team members');
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTeamMembers();
    setRefreshing(false);
    setSuccess('Team members refreshed successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleViewDetails = async (member) => {
    try {
      // Try to fetch full user details
      try {
        const userDetails = await usersAPI.getOne(member._id);
        setSelectedMember({ ...member, ...userDetails.data });
      } catch {
        // If API fails, use the member data we have
        setSelectedMember(member);
      }
      setShowMemberDetails(true);
    } catch (err) {
      setError('Failed to load member details');
    }
  };

  const handleViewProjects = (member) => {
    if (member.projects && member.projects.length > 0) {
      // Navigate to the first project or show a list
      navigate(`/projects/${member.projects[0]._id}`);
    } else {
      setError('This member is not assigned to any projects');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleNavigateToProject = (projectId) => {
    navigate(`/projects/${projectId}`);
    setShowMemberDetails(false);
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'status-completed',
      'project-manager': 'status-active',
      'team-member': 'status-planning',
      'viewer': 'status-on-hold',
    };
    return colors[role] || colors['team-member'];
  };

  const getRoleBadge = (role) => {
    const badges = {
      'admin': '👑 Admin',
      'project-manager': '📊 Project Manager',
      'team-member': '👤 Team Member',
      'viewer': '👁️ Viewer',
    };
    return badges[role] || role;
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'status-completed',
      'active': 'status-active',
      'on-hold': 'status-on-hold',
      'planning': 'status-planning',
    };
    return colors[status] || 'status-planning';
  };

  const projectManagers = teamMembers.filter(m => m.role === 'project-manager').length;
  const regularMembers = teamMembers.filter(m => m.role === 'team-member').length;

  const [selectedView, setSelectedView] = useState('Teams');
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
        // Already on teams/users page
        break;
      default:
        break;
    }
  };

  if (loading) {
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
            <h2 className="text-3xl font-bold mb-3">Team Members</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Manage your team members and their roles across projects.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading team members...</p>
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
          <h2 className="text-3xl font-bold mb-3">Team Members</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage your team members and their roles across projects.
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
        <TopHeader title="Team Members" showSearch={false} />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">All Team Members</h1>
                <p className="text-slate-600">{teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} found</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button 
                  onClick={() => navigate('/projects')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <span className="text-xl">+</span>
                  Add Members
                </button>
              </div>
            </div>

            {/* Success Message */}
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

            {/* Metrics Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm mb-1">Total Members</p>
                <p className="text-3xl font-bold text-slate-900">{teamMembers.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm mb-1">Project Managers</p>
                <p className="text-3xl font-bold text-blue-600">{projectManagers}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm mb-1">Team Members</p>
                <p className="text-3xl font-bold text-green-600">{regularMembers}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm mb-1">Filtered</p>
                <p className="text-3xl font-bold text-cyan-600">{filteredMembers.length}</p>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    filterRole === 'all' 
                      ? 'bg-cyan-500 text-white font-semibold shadow-lg' 
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setFilterRole('all')}
                >
                  All Roles <span className="ml-2 px-2 py-0.5 bg-slate-200 rounded-full text-xs">{teamMembers.length}</span>
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    filterRole === 'project-manager' 
                      ? 'bg-cyan-500 text-white font-semibold shadow-lg' 
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setFilterRole('project-manager')}
                >
                  Project Managers <span className="ml-2 px-2 py-0.5 bg-slate-200 rounded-full text-xs">{projectManagers}</span>
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    filterRole === 'team-member' 
                      ? 'bg-cyan-500 text-white font-semibold shadow-lg' 
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setFilterRole('team-member')}
                >
                  Team Members <span className="ml-2 px-2 py-0.5 bg-slate-200 rounded-full text-xs">{regularMembers}</span>
                </button>
              </div>
            </div>

            {/* Team Members List */}
            {filteredMembers.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">💭</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No team members found</h3>
                <p className="text-slate-600 mb-6">
                  {searchTerm || filterRole !== 'all' 
                    ? 'No team members match your search criteria' 
                    : 'Start by adding members to your projects'}
                </p>
                <button 
                  onClick={() => navigate('/projects')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Go to Projects
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMembers.map(member => (
                  <div
                    key={member._id}
                    className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-2xl font-bold">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h4>
                        <p className="text-sm text-slate-600 mb-3">{member.email}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            member.role === 'project-manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {getRoleBadge(member.role)}
                          </span>
                          {member.createdAt && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Joined {new Date(member.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {member.projects && member.projects.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm text-slate-600 mb-2">
                              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                              {member.projects.length} Project{member.projects.length !== 1 ? 's' : ''}
                            </p>
                            <div className="space-y-1">
                              {member.projects.slice(0, 2).map((proj) => (
                                <div 
                                  key={proj._id} 
                                  className="text-sm text-cyan-600 hover:text-cyan-700 cursor-pointer flex items-center gap-2"
                                  onClick={() => navigate(`/projects/${proj._id}`)}
                                >
                                  <span>• {proj.name}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    proj.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    proj.status === 'active' ? 'bg-cyan-100 text-cyan-700' :
                                    proj.status === 'on-hold' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-slate-100 text-slate-700'
                                  }`}>
                                    {proj.status}
                                  </span>
                                </div>
                              ))}
                              {member.projects.length > 2 && (
                                <span className="text-xs text-slate-500">+{member.projects.length - 2} more</span>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(member)}
                            className="flex-1 px-3 py-2 text-sm border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 font-semibold"
                          >
                            View Details
                          </button>
                          {member.projects && member.projects.length > 0 && (
                            <button
                              onClick={() => handleViewProjects(member)}
                              className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                            >
                              View Projects
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Member Details Modal */}
            {showMemberDetails && selectedMember && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6" onClick={() => setShowMemberDetails(false)}>
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Member Details</h2>
                    <button
                      onClick={() => setShowMemberDetails(false)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      {selectedMember.avatar ? (
                        <img 
                          src={selectedMember.avatar} 
                          alt={selectedMember.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-3xl font-bold">
                          {selectedMember.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{selectedMember.name}</h3>
                        <p className="text-slate-600 mt-1">{selectedMember.email}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedMember.role === 'project-manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {getRoleBadge(selectedMember.role)}
                        </span>
                      </div>
                    </div>

                    {selectedMember.projects && selectedMember.projects.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-3">
                          Projects ({selectedMember.projects.length})
                        </h4>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {selectedMember.projects.map((proj) => (
                            <div 
                              key={proj._id}
                              onClick={() => handleNavigateToProject(proj._id)}
                              className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-cyan-500 transition-all cursor-pointer"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-slate-900">{proj.name}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  proj.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  proj.status === 'active' ? 'bg-cyan-100 text-cyan-700' :
                                  proj.status === 'on-hold' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {proj.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${proj.progress || 0}%` }}></div>
                                </div>
                                <span className="text-xs text-slate-600 font-medium">{proj.progress || 0}%</span>
                              </div>
                              {proj.endDate && (
                                <p className="text-xs text-slate-500 mt-2">
                                  Due: {new Date(proj.endDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMember.createdAt && (
                      <div className="pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600">
                          Joined: {new Date(selectedMember.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-slate-200 p-6 flex gap-3">
                    <button 
                      onClick={() => setShowMemberDetails(false)}
                      className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 font-semibold"
                    >
                      Close
                    </button>
                    {selectedMember.projects && selectedMember.projects.length > 0 && (
                      <button 
                        onClick={() => handleNavigateToProject(selectedMember.projects[0]._id)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        View First Project
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
