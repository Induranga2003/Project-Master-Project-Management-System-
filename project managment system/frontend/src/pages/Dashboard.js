import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import TopHeader from '../components/TopHeader';

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: {
          estimated: formData.budget ? parseFloat(formData.budget) : 0,
          actual: 0,
        },
        status: 'planning',
        progress: 0,
      };
      const newProject = await projectsAPI.create(projectData);
      setProjects([newProject.data, ...projects]);
      setFormData({ name: '', description: '', startDate: '', endDate: '', budget: '' });
      setShowNewProject(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      console.error('Error creating project:', err);
    }
  };

  // Calculate dashboard metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const onHoldProjects = projects.filter(p => p.status === 'on-hold').length;
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0;

  // Get upcoming deadlines (next 7 days)
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingDeadlines = projects
    .filter(p => new Date(p.endDate) <= nextWeek && new Date(p.endDate) >= now && p.status !== 'completed')
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
    .slice(0, 3);

  // Get team members
  const allMembers = new Map();
  projects.forEach(project => {
    if (project.members && Array.isArray(project.members)) {
      project.members.forEach(member => {
        const id = member.user?._id || member._id;
        const name = member.user?.name || member.name || 'Member';
        if (id && !allMembers.has(id)) {
          allMembers.set(id, { id, name, projectCount: 1 });
        } else if (id) {
          allMembers.get(id).projectCount++;
        }
      });
    }
  });
  const teamMembers = Array.from(allMembers.values()).slice(0, 5);

  const [selectedView, setSelectedView] = useState('Dashboard');

  const dashboardViews = ['Dashboard', 'Templates', 'Projects', 'Tasks', 'Teams', 'Analytics', 'Reports', 'Settings'];

  const handleNavigation = (view) => {
    setSelectedView(view);
    
    // Navigate to respective pages
    switch(view) {
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
      case 'Dashboard':
        // Already on dashboard, just update state
        break;
      case 'Reports':
        navigate('/reports');
        break;
      case 'Analytics':
        navigate('/analytics');
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-700',
      'active': 'bg-cyan-100 text-cyan-700',
      'on-hold': 'bg-yellow-100 text-yellow-700',
      'planning': 'bg-slate-100 text-slate-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getDaysUntil = (date) => {
    const diff = new Date(date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
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
            <h2 className="text-3xl font-bold mb-3">Dashboard</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Manage your projects, track progress, and collaborate with your team.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading your workspace...</p>
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
          <h2 className="text-3xl font-bold mb-3">Dashboard</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage your projects, track progress, and collaborate with your team.
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
        <TopHeader title="Dashboard" showSearch={false} />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h1>
              <p className="text-slate-600">Here's what's happening with your projects today</p>
            </div>
            <button
              onClick={() => setShowNewProject(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              New Project
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div className="flex-1">
                <strong className="text-red-800 block mb-1">Error</strong>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{totalProjects}</h3>
              <p className="text-slate-600 text-sm">Total Projects</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+5%</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{activeProjects}</h3>
              <p className="text-slate-600 text-sm">Active Projects</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">+{completedProjects}</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{completedProjects}</h3>
              <p className="text-slate-600 text-sm">Completed</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">{avgProgress}%</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{avgProgress}%</h3>
              <p className="text-slate-600 text-sm">Avg Progress</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Projects */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Recent Projects</h2>
                  <button
                    onClick={() => navigate('/projects')}
                    className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1 transition-colors"
                  >
                    View all
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No projects yet</h3>
                    <p className="text-slate-600 mb-6">Create your first project to get started</p>
                    <button
                      onClick={() => setShowNewProject(true)}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Create Project
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {projects.slice(0, 4).map((project) => (
                      <div
                        key={project._id}
                        className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/projects/${project._id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                            {project.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-slate-900 mb-1 truncate">{project.name}</h4>
                            <p className="text-slate-600 text-sm truncate">{project.description || 'No description'}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                              <div className="flex items-center gap-2 flex-1">
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                                    style={{ width: `${project.progress || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-slate-600">{project.progress || 0}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Statistics */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900">Quick Statistics</h2>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{activeProjects}</div>
                      <div className="text-sm text-slate-600">In Progress</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">✓</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{completedProjects}</div>
                      <div className="text-sm text-slate-600">Completed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⏸</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{onHoldProjects}</div>
                      <div className="text-sm text-slate-600">On Hold</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{teamMembers.length}</div>
                      <div className="text-sm text-slate-600">Team Members</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900">Upcoming Deadlines</h2>
                </div>
                {upcomingDeadlines.length === 0 ? (
                  <div className="p-8 text-center">
                    <span className="text-4xl mb-2 block">🎉</span>
                    <p className="text-slate-600 text-sm">No upcoming deadlines</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {upcomingDeadlines.map((project) => (
                      <div
                        key={project._id}
                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/projects/${project._id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex flex-col items-center justify-center text-white">
                            <span className="text-lg font-bold">{new Date(project.endDate).getDate()}</span>
                            <span className="text-xs uppercase">{new Date(project.endDate).toLocaleDateString('en', { month: 'short' })}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 mb-1 truncate">{project.name}</h4>
                            <p className="text-sm text-slate-600 flex items-center gap-1">
                              <span>⏰</span>
                              {getDaysUntil(project.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Team Members */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900">Team Members</h2>
                </div>
                {teamMembers.length === 0 ? (
                  <div className="p-8 text-center">
                    <span className="text-4xl mb-2 block">👥</span>
                    <p className="text-slate-600 text-sm">No team members yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 truncate">{member.name}</h4>
                            <p className="text-sm text-slate-600">{member.projectCount} project{member.projectCount !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Create Project Modal */}
          {showNewProject && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
              onClick={() => setShowNewProject(false)}
            >
              <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
                  <button
                    onClick={() => setShowNewProject(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleCreateProject} className="p-6 space-y-6">
                  <div>
                    <label htmlFor="project-name" className="block text-sm font-semibold text-slate-700 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      id="project-name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter project name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="project-description" className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="project-description"
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What is this project about?"
                      rows="3"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="project-start-date" className="block text-sm font-semibold text-slate-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        id="project-start-date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="project-end-date" className="block text-sm font-semibold text-slate-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        id="project-end-date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="project-budget" className="block text-sm font-semibold text-slate-700 mb-2">
                      Budget (USD)
                    </label>
                    <input
                      type="number"
                      id="project-budget"
                      name="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewProject(false)}
                      className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
