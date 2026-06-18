import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import TopHeader from '../components/TopHeader';

export default function Analytics() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedView, setSelectedView] = useState('Analytics');
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const dashboardViews = ['Dashboard', 'Templates', 'Projects', 'Tasks', 'Teams', 'Analytics', 'Reports', 'Settings'];

  const metricTypes = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'performance', name: 'Performance', icon: '⚡' },
    { id: 'trends', name: 'Trends', icon: '📈' },
    { id: 'productivity', name: 'Productivity', icon: '🎯' },
    { id: 'resources', name: 'Resources', icon: '👥' },
    { id: 'timeline', name: 'Timeline', icon: '⏱️' },
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
      setError('Failed to load analytics data');
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
      case 'Reports':
        navigate('/reports');
        break;
      case 'Analytics':
        // Already on analytics
        break;
      default:
        break;
    }
  };

  // Calculate analytics metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0;

  // Calculate completion rate
  const completionRate = totalProjects > 0 
    ? Math.round((completedProjects / totalProjects) * 100)
    : 0;

  // Calculate on-time delivery rate (mock data for now)
  const onTimeProjects = projects.filter(p => 
    p.status === 'completed' && new Date(p.endDate) >= new Date()
  ).length;
  const onTimeRate = completedProjects > 0 
    ? Math.round((onTimeProjects / completedProjects) * 100)
    : 0;

  // Calculate team efficiency (mock calculation)
  const teamEfficiency = Math.min(95, Math.round(avgProgress * 0.9 + 10));

  // Get project velocity (projects completed per month - mock data)
  const projectVelocity = Math.round(completedProjects / Math.max(totalProjects, 1) * 10);

  // Progress distribution
  const progressRanges = [
    { label: '0-25%', count: projects.filter(p => (p.progress || 0) <= 25).length, color: 'bg-red-500' },
    { label: '26-50%', count: projects.filter(p => (p.progress || 0) > 25 && (p.progress || 0) <= 50).length, color: 'bg-orange-500' },
    { label: '51-75%', count: projects.filter(p => (p.progress || 0) > 50 && (p.progress || 0) <= 75).length, color: 'bg-yellow-500' },
    { label: '76-100%', count: projects.filter(p => (p.progress || 0) > 75).length, color: 'bg-green-500' },
  ];

  const maxProgressCount = Math.max(...progressRanges.map(r => r.count), 1);

  // Monthly trend data (mock data for visualization)
  const monthlyTrends = [
    { month: 'Jan', completed: 2, started: 3, value: 65 },
    { month: 'Feb', completed: 3, started: 4, value: 72 },
    { month: 'Mar', completed: 4, started: 3, value: 78 },
    { month: 'Apr', completed: 3, started: 5, value: 85 },
    { month: 'May', completed: 5, started: 4, value: 82 },
    { month: 'Jun', completed: 4, started: 6, value: 88 },
  ];

  const maxTrendValue = Math.max(...monthlyTrends.map(t => Math.max(t.completed, t.started)), 1);

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
            <h2 className="text-3xl font-bold mb-3">Analytics</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Advanced insights and performance analytics for your projects.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading analytics...</p>
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
          <h2 className="text-3xl font-bold mb-3">Analytics</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Advanced insights and performance analytics for your projects.
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
        <TopHeader title="Analytics" showSearch={false} />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Analytics Dashboard</h1>
                <p className="text-slate-600">Real-time insights and performance metrics</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="year">This Year</option>
                </select>
                <button
                  onClick={() => fetchProjects()}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <span>🔄</span>
                  Refresh
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
              </div>
            )}

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <span className="text-sm font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">KPI</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{completionRate}%</h3>
                <p className="text-slate-600 text-sm">Completion Rate</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+{onTimeRate}%</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{onTimeRate}%</h3>
                <p className="text-slate-600 text-sm">On-Time Delivery</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: `${onTimeRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">{teamEfficiency}%</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{teamEfficiency}%</h3>
                <p className="text-slate-600 text-sm">Team Efficiency</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${teamEfficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">{projectVelocity}/mo</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{projectVelocity}</h3>
                <p className="text-slate-600 text-sm">Project Velocity</p>
                <div className="mt-3 text-xs text-slate-500">Projects completed per month</div>
              </div>
            </div>

            {/* Metric Type Selector */}
            <div className="mb-6">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Analytics View</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {metricTypes.map((metric) => (
                    <button
                      key={metric.id}
                      onClick={() => setSelectedMetric(metric.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        selectedMetric === metric.id
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{metric.icon}</div>
                      <div className="text-sm font-medium text-slate-900">{metric.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Analytics Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progress Distribution Chart */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Progress Distribution</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {progressRanges.map((range) => (
                        <div key={range.label} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-900">{range.label} Progress</span>
                            <span className="text-slate-600">{range.count} project{range.count !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="relative h-10 bg-slate-100 rounded-lg overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 ${range.color} transition-all duration-500 flex items-center justify-end px-3`}
                              style={{ width: `${(range.count / maxProgressCount) * 100}%` }}
                            >
                              {range.count > 0 && (
                                <span className="text-white font-semibold text-sm">{Math.round((range.count/totalProjects)*100)}%</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Monthly Trends */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Monthly Trends</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-6 gap-4">
                      {monthlyTrends.map((trend) => (
                        <div key={trend.month} className="space-y-2">
                          <div className="text-center">
                            <div className="h-32 flex flex-col justify-end gap-2">
                              <div 
                                className="bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t transition-all duration-500"
                                style={{ height: `${(trend.completed / maxTrendValue) * 100}%` }}
                                title={`${trend.completed} completed`}
                              ></div>
                              <div 
                                className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-500"
                                style={{ height: `${(trend.started / maxTrendValue) * 100}%` }}
                                title={`${trend.started} started`}
                              ></div>
                            </div>
                          </div>
                          <div className="text-center text-xs font-medium text-slate-600">{trend.month}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                        <span className="text-slate-600">Completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-slate-600">Started</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Projects */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Top Performing Projects</h2>
                  </div>
                  {projects.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">No data available</h3>
                      <p className="text-slate-600">Create projects to see analytics</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200">
                      {projects
                        .sort((a, b) => (b.progress || 0) - (a.progress || 0))
                        .slice(0, 5)
                        .map((project, index) => (
                          <div
                            key={project._id}
                            className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/projects/${project._id}`)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 truncate">{project.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[200px]">
                                    <div
                                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                      style={{ width: `${project.progress || 0}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium text-slate-700">{project.progress || 0}%</span>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                project.status === 'completed' ? 'bg-green-100 text-green-700' :
                                project.status === 'active' ? 'bg-cyan-100 text-cyan-700' :
                                project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                {/* Performance Score */}
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Overall Performance</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="white"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${avgProgress * 3.52} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{avgProgress}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-cyan-50 text-sm text-center">
                    Average project completion across all active projects
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Quick Stats</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Active Projects</span>
                      <span className="text-2xl font-bold text-cyan-600">{activeProjects}</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Completed</span>
                      <span className="text-2xl font-bold text-green-600">{completedProjects}</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Success Rate</span>
                      <span className="text-2xl font-bold text-purple-600">{completionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Avg Progress</span>
                      <span className="text-2xl font-bold text-orange-600">{avgProgress}%</span>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Key Insights</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600 text-xl">✓</span>
                      <div>
                        <div className="font-semibold text-green-900 text-sm">Strong Performance</div>
                        <div className="text-green-700 text-xs">Team efficiency is above target</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 text-xl">ℹ</span>
                      <div>
                        <div className="font-semibold text-blue-900 text-sm">Consistent Delivery</div>
                        <div className="text-blue-700 text-xs">On-time rate is {onTimeRate}%</div>
                      </div>
                    </div>
                    {activeProjects > 5 && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <span className="text-yellow-600 text-xl">⚠</span>
                        <div>
                          <div className="font-semibold text-yellow-900 text-sm">High Workload</div>
                          <div className="text-yellow-700 text-xs">{activeProjects} projects in progress</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Actions</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <button
                      onClick={() => navigate('/reports')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>📊</span>
                      View Detailed Reports
                    </button>
                    <button
                      onClick={() => navigate('/projects')}
                      className="w-full px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>📂</span>
                      Manage Projects
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
