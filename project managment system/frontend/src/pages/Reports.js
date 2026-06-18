import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import TopHeader from '../components/TopHeader';

export default function Reports() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedView, setSelectedView] = useState('Reports');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');

  const dashboardViews = ['Dashboard', 'Templates', 'Projects', 'Tasks', 'Teams', 'Analytics', 'Reports', 'Settings'];

  const reportTypes = [
    { id: 'overview', name: 'Project Overview', icon: '📊', description: 'Complete project listing with key metrics' },
    { id: 'progress', name: 'Progress Report', icon: '📈', description: 'Detailed progress tracking across projects' },
    { id: 'budget', name: 'Budget Analysis', icon: '💰', description: 'Financial performance and spending analysis' },
    { id: 'timeline', name: 'Timeline Report', icon: '📅', description: 'Schedule adherence and deadline tracking' },
    { id: 'team', name: 'Team Performance', icon: '👥', description: 'Team member contributions and workload' },
    { id: 'tasks', name: 'Task Summary', icon: '✓', description: 'Task completion rates and assignments' },
    { id: 'risk', name: 'Risk Assessment', icon: '⚠️', description: 'Project risks and mitigation strategies' },
    { id: 'resource', name: 'Resource Utilization', icon: '🔧', description: 'Resource allocation and usage patterns' },
  ];

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
      setError('Failed to load projects data');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (view) => {
    setSelectedView(view);
    
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
        navigate('/dashboard');
        break;
      case 'Analytics':
        navigate('/analytics');
        break;
      case 'Reports':
        // Already on reports
        break;
      default:
        break;
    }
  };

  const handleExportReport = (format) => {
    // Placeholder for export functionality
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  // Calculate report metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const onHoldProjects = projects.filter(p => p.status === 'on-hold').length;
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0;

  // Budget calculations
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget?.estimated || 0), 0);
  const spentBudget = projects.reduce((sum, p) => sum + (p.budget?.actual || 0), 0);
  const budgetUtilization = totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0;

  // Projects by status for chart
  const projectsByStatus = [
    { status: 'Active', count: activeProjects, color: 'bg-cyan-500' },
    { status: 'Completed', count: completedProjects, color: 'bg-green-500' },
    { status: 'On Hold', count: onHoldProjects, color: 'bg-yellow-500' },
    { status: 'Planning', count: projects.filter(p => p.status === 'planning').length, color: 'bg-slate-500' },
  ];

  const maxCount = Math.max(...projectsByStatus.map(s => s.count), 1);

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
            <h2 className="text-3xl font-bold mb-3">Reports</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Generate comprehensive reports and analytics for your projects.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading reports...</p>
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
          <h2 className="text-3xl font-bold mb-3">Reports</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Generate comprehensive reports and analytics for your projects.
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
        <TopHeader title="Reports" showSearch={false} />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Reports Dashboard</h1>
                <p className="text-slate-600">Comprehensive insights and performance metrics</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="lastyear">Last Year</option>
                  <option value="alltime">All Time</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportReport('pdf')}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>📄</span>
                    PDF
                  </button>
                  <button
                    onClick={() => handleExportReport('csv')}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>📊</span>
                    CSV
                  </button>
                </div>
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
              </div>
            )}

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <span className="text-sm font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">{totalProjects}</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{activeProjects}</h3>
                <p className="text-slate-600 text-sm">Active Projects</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">{Math.round((completedProjects/totalProjects)*100) || 0}%</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{completedProjects}</h3>
                <p className="text-slate-600 text-sm">Completed Projects</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">{avgProgress}%</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{avgProgress}%</h3>
                <p className="text-slate-600 text-sm">Avg. Progress</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">{budgetUtilization}%</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">${(spentBudget/1000).toFixed(1)}K</h3>
                <p className="text-slate-600 text-sm">Budget Spent</p>
              </div>
            </div>

            {/* Report Type Selector */}
            <div className="mb-6">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Report Type</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {reportTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedReport(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                        selectedReport === type.id
                          ? 'border-cyan-500 bg-cyan-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className="text-sm font-semibold text-slate-900 mb-1">{type.name}</div>
                      <div className="text-xs text-slate-600">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Report Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project Status Distribution */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Project Status Distribution</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {projectsByStatus.map((status) => (
                        <div key={status.status} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-900">{status.status}</span>
                            <span className="text-slate-600">{status.count} project{status.count !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="relative h-10 bg-slate-100 rounded-lg overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 ${status.color} transition-all duration-500 flex items-center justify-end px-3`}
                              style={{ width: `${(status.count / maxCount) * 100}%` }}
                            >
                              {status.count > 0 && (
                                <span className="text-white font-semibold text-sm">{Math.round((status.count/totalProjects)*100)}%</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed Project List */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedReport === 'overview' && 'All Projects Overview'}
                      {selectedReport === 'progress' && 'Progress Report Details'}
                      {selectedReport === 'budget' && 'Budget Analysis Details'}
                      {selectedReport === 'timeline' && 'Timeline & Schedule Report'}
                      {selectedReport === 'team' && 'Team Performance Metrics'}
                      {selectedReport === 'tasks' && 'Task Summary Report'}
                      {selectedReport === 'risk' && 'Risk Assessment Report'}
                      {selectedReport === 'resource' && 'Resource Utilization Report'}
                    </h2>
                    <button
                      onClick={() => handleExportReport('excel')}
                      className="px-3 py-1.5 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
                    >
                      <span>📊</span>
                      Export Table
                    </button>
                  </div>
                  {projects.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">No data available</h3>
                      <p className="text-slate-600">Create projects to see reports</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                            {selectedReport === 'progress' && (
                              <>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Progress</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Tasks</th>
                              </>
                            )}
                            {selectedReport === 'budget' && (
                              <>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Spent</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Variance</th>
                              </>
                            )}
                            {selectedReport === 'timeline' && (
                              <>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Duration</th>
                              </>
                            )}
                            {selectedReport === 'team' && (
                              <>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Team Size</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Progress</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Efficiency</th>
                              </>
                            )}
                            {(selectedReport === 'overview' || selectedReport === 'tasks' || selectedReport === 'risk' || selectedReport === 'resource') && (
                              <>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Progress</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Timeline</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {projects.map((project) => {
                            const daysDiff = Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24));
                            const variance = ((project.budget?.actual || 0) - (project.budget?.estimated || 0));
                            const efficiency = project.progress > 0 ? Math.round((project.progress / 100) * 95 + 5) : 0;
                            
                            return (
                              <tr key={project._id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/projects/${project._id}`)}>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                                      {project.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-slate-900">{project.name}</div>
                                      <div className="text-sm text-slate-600">{project.description?.substring(0, 30) || 'No description'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    project.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    project.status === 'active' ? 'bg-cyan-100 text-cyan-700' :
                                    project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-slate-100 text-slate-700'
                                  }`}>
                                    {project.status}
                                  </span>
                                </td>
                                
                                {selectedReport === 'progress' && (
                                  <>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[100px]">
                                          <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                            style={{ width: `${project.progress || 0}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{project.progress || 0}%</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="text-sm text-slate-900">--/-- tasks</div>
                                      <div className="text-xs text-slate-600">Completion rate</div>
                                    </td>
                                  </>
                                )}
                                
                                {selectedReport === 'budget' && (
                                  <>
                                    <td className="px-6 py-4">
                                      <div className="text-sm font-medium text-slate-900">${(project.budget?.estimated || 0).toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="text-sm font-medium text-slate-900">${(project.budget?.actual || 0).toLocaleString()}</div>
                                      <div className="text-xs text-slate-600">{Math.round(((project.budget?.actual || 0) / (project.budget?.estimated || 1)) * 100)}% used</div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={`text-sm font-medium ${variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : 'text-slate-600'}`}>
                                        {variance > 0 ? '+' : ''}{variance === 0 ? '$0' : `$${Math.abs(variance).toLocaleString()}`}
                                      </span>
                                    </td>
                                  </>
                                )}
                                
                                {selectedReport === 'timeline' && (
                                  <>
                                    <td className="px-6 py-4">
                                      <div className="text-sm text-slate-900">{new Date(project.startDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="text-sm text-slate-900">{new Date(project.endDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="text-sm font-medium text-slate-900">{daysDiff} days</div>
                                      <div className="text-xs text-slate-600">{Math.ceil(daysDiff / 7)} weeks</div>
                                    </td>
                                  </>
                                )}
                                
                                {selectedReport === 'team' && (
                                  <>
                                    <td className="px-6 py-4">
                                      <div className="text-sm font-medium text-slate-900">{project.members?.length || 0} members</div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[80px]">
                                          <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                            style={{ width: `${project.progress || 0}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{project.progress || 0}%</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={`text-sm font-semibold ${
                                        efficiency >= 80 ? 'text-green-600' :
                                        efficiency >= 60 ? 'text-yellow-600' :
                                        'text-red-600'
                                      }`}>
                                        {efficiency}%
                                      </span>
                                    </td>
                                  </>
                                )}
                                
                                {(selectedReport === 'overview' || selectedReport === 'tasks' || selectedReport === 'risk' || selectedReport === 'resource') && (
                                  <>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[100px]">
                                          <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                            style={{ width: `${project.progress || 0}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{project.progress || 0}%</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="text-sm font-medium text-slate-900">${(project.budget?.estimated || 0).toLocaleString()}</div>
                                      <div className="text-xs text-slate-600">${(project.budget?.actual || 0).toLocaleString()} spent</div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="text-sm text-slate-900">{new Date(project.startDate).toLocaleDateString()}</div>
                                      <div className="text-xs text-slate-600">to {new Date(project.endDate).toLocaleDateString()}</div>
                                    </td>
                                  </>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                {/* Summary Statistics */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Summary</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Total Projects</span>
                      <span className="text-xl font-bold text-slate-900">{totalProjects}</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Completion Rate</span>
                      <span className="text-xl font-bold text-green-600">{Math.round((completedProjects/totalProjects)*100) || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Total Budget</span>
                      <span className="text-xl font-bold text-slate-900">${(totalBudget/1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Budget Used</span>
                      <span className="text-xl font-bold text-orange-600">{budgetUtilization}%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <button
                      onClick={() => handleExportReport('pdf')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>📥</span>
                      Export Full Report
                    </button>
                    <button
                      onClick={() => navigate('/projects')}
                      className="w-full px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>📂</span>
                      View All Projects
                    </button>
                    <button
                      onClick={() => navigate('/analytics')}
                      className="w-full px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>📊</span>
                      Advanced Analytics
                    </button>
                  </div>
                </div>

                {/* Report Info */}
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">💡 Report Tips</h3>
                  <p className="text-cyan-50 text-sm leading-relaxed">
                    Export reports in PDF or CSV format for sharing with stakeholders. Use the date range selector to view historical data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
