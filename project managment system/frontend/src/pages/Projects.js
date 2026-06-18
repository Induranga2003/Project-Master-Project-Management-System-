import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import TopHeader from '../components/TopHeader';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0,
    status: 'planning',
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
        status: formData.status,
        progress: 0,
      };
      const newProject = await projectsAPI.create(projectData);
      setProjects([newProject.data, ...projects]);
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: 0,
        status: 'planning',
      });
      setShowNewProject(false);
      setError('');
    } catch (err) {
      setError('Failed to create project');
      console.error('Error creating project:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectsAPI.delete(projectId);
        setProjects(projects.filter(p => p._id !== projectId));
      } catch (err) {
        setError('Failed to delete project');
        console.error('Error deleting project:', err);
      }
    }
  };

  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-700',
      'active': 'bg-cyan-100 text-cyan-700',
      'on-hold': 'bg-yellow-100 text-yellow-700',
      'planning': 'bg-slate-100 text-slate-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getStatusCount = (status) => {
    return projects.filter(p => p.status === status).length;
  };

  const [selectedView, setSelectedView] = useState('Projects');

  const dashboardViews = ['Dashboard', 'Templates', 'Projects', 'Tasks', 'Teams', 'Analytics', 'Reports', 'Settings'];

  const handleNavigation = (view) => {
    setSelectedView(view);
    
    // Navigate to respective pages
    switch(view) {
      case 'Dashboard':
        navigate('/dashboard');
        break;
      case 'Projects':
        // Already on projects page, just update state
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
        // For Analytics, Reports, etc., just update state
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
            <h2 className="text-3xl font-bold mb-3">Projects</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              View and manage all your projects in one place.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading projects...</p>
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
          <h2 className="text-3xl font-bold mb-3">Projects</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            View and manage all your projects in one place.
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
        <TopHeader title="Projects" showSearch={false} />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">All Projects</h1>
              <p className="text-slate-600">{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found</p>
            </div>
            <button
              onClick={() => setShowNewProject(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              New Project
            </button>
          </div>

          {/* Error Alert */}
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

          {/* Filters and Search */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  filterStatus === 'all' 
                    ? 'bg-cyan-500 text-white font-semibold shadow-lg' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                onClick={() => setFilterStatus('all')}
              >
                All <span className="ml-2 px-2 py-0.5 bg-slate-200 rounded-full text-xs">{projects.length}</span>
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  filterStatus === 'active' 
                    ? 'bg-cyan-500 text-white font-semibold shadow-lg' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                onClick={() => setFilterStatus('active')}
              >
                Active <span className="ml-2 px-2 py-0.5 bg-slate-200 rounded-full text-xs">{getStatusCount('active')}</span>
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  filterStatus === 'planning' 
                    ? 'bg-cyan-500 text-white font-semibold shadow-lg' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                onClick={() => setFilterStatus('planning')}
              >
                Planning <span className="ml-2 px-2 py-0.5 bg-slate-200 rounded-full text-xs">{getStatusCount('planning')}</span>
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  filterStatus === 'completed' 
                    ? 'bg-cyan-500 text-white font-semibold shadow-lg' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                onClick={() => setFilterStatus('completed')}
              >
                Completed <span className="ml-2 px-2 py-0.5 bg-slate-200 rounded-full text-xs">{getStatusCount('completed')}</span>
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  filterStatus === 'on-hold' 
                    ? 'bg-cyan-500 text-white font-semibold shadow-lg' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                onClick={() => setFilterStatus('on-hold')}
              >
                On Hold <span className="ml-2 px-2 py-0.5 bg-slate-200 rounded-full text-xs">{getStatusCount('on-hold')}</span>
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No projects found</h3>
              <p className="text-slate-600 mb-6">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your filters or search query' 
                  : 'Create your first project to get started'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <button
                  onClick={() => setShowNewProject(true)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Create First Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{project.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'completed' ? 'bg-green-100 text-green-700' :
                          project.status === 'active' ? 'bg-cyan-100 text-cyan-700' :
                          project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <button
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project._id);
                        }}
                        title="Delete project"
                      >
                        🗑️
                      </button>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {project.description || 'No description provided'}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>📅</span>
                        <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>🎯</span>
                        <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <span>💰</span>
                          <span>${project.budget?.estimated || 0}</span>
                        </div>
                        {project.members && project.members.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <span>👥</span>
                            <span>{project.members.length} members</span>
                          </div>
                        )}
                      </div>
                      <div className="text-cyan-600 group-hover:translate-x-1 transition-transform">→</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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

                  <div className="grid grid-cols-2 gap-4">
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

                    <div>
                      <label htmlFor="project-status" className="block text-sm font-semibold text-slate-700 mb-2">
                        Status
                      </label>
                      <select
                        id="project-status"
                        name="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="on-hold">On Hold</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
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
