import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';
import { AuthContext } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import TopHeader from '../components/TopHeader';

export default function Tasks() {
  const { isDarkMode } = useContext(DarkModeContext);
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    subtasks: [],
    comments: [],
  });

  useEffect(() => {
    loadTasks();
    if (user?.role === 'admin') {
      loadAdminStats();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await tasksAPI.getAll();
      setTasks(res.data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminStats = async () => {
    if (user?.role !== 'admin') return;
    try {
      const res = await tasksAPI.adminGetStats();
      setAdminStats(res.data.stats);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      if (editingTask) {
        // Use admin endpoint if user is admin, otherwise use regular endpoint
        if (user?.role === 'admin') {
          await tasksAPI.adminUpdate(editingTask._id, newTask);
        } else {
          await tasksAPI.update(editingTask._id, newTask);
        }
      } else {
        await tasksAPI.create(newTask);
      }
      loadTasks();
      if (user?.role === 'admin') {
        loadAdminStats();
      }
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        assignee: '',
        subtasks: [],
        comments: [],
      });
      setEditingTask(null);
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        if (user?.role === 'admin') {
          await tasksAPI.adminDelete(taskId);
        } else {
          await tasksAPI.delete(taskId);
        }
        loadTasks();
        if (user?.role === 'admin') {
          loadAdminStats();
        }
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask(task);
    setShowModal(true);
  };

  const handleAddSubtask = () => {
    setNewTask({
      ...newTask,
      subtasks: [...(newTask.subtasks || []), { title: '', completed: false }],
    });
  };

  const handleUpdateSubtask = (index, updatedSubtask) => {
    const updatedSubtasks = [...(newTask.subtasks || [])];
    updatedSubtasks[index] = updatedSubtask;
    setNewTask({ ...newTask, subtasks: updatedSubtasks });
  };

  const handleRemoveSubtask = (index) => {
    setNewTask({
      ...newTask,
      subtasks: (newTask.subtasks || []).filter((_, i) => i !== index),
    });
  };

  const handleAddComment = (taskId, comment) => {
    const task = tasks.find(t => t._id === taskId);
    if (task) {
      handleEditTask({
        ...task,
        comments: [...(task.comments || []), { text: comment, timestamp: new Date() }],
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'my-tasks') return task.assignee === 'current-user';
    if (filter === 'overdue') return task.status === 'overdue';
    if (filter === 'in-progress') return task.status === 'in-progress';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const completionPercentage = Math.round(
    (tasks.filter(t => t.status === 'completed').length / Math.max(tasks.length, 1)) * 100
  );

  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('Tasks');
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
        // Already on tasks page
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
            <h2 className="text-3xl font-bold mb-3">Tasks</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Organize and track your project tasks efficiently.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading tasks...</p>
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
          <h2 className="text-3xl font-bold mb-3">Tasks</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Organize and track your project tasks efficiently.
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
        <TopHeader title="Tasks" showSearch={true} />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  All Tasks {user?.role === 'admin' && <span className="text-sm bg-red-500 text-white px-2 py-1 rounded ml-2">Admin</span>}
                </h1>
                <p className="text-slate-600">{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found</p>
              </div>
              <div className="flex gap-3">
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setShowAdminPanel(!showAdminPanel)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setNewTask({
                      title: '',
                      description: '',
                      status: 'pending',
                      priority: 'medium',
                      dueDate: '',
                      assignee: '',
                      subtasks: [],
                      comments: [],
                    });
                    setShowModal(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <span className="text-xl">+</span>
                  New Task
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900">{tasks.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm mb-1">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{tasks.filter(t => t.status === 'in-progress').length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm mb-1">Completion</p>
                <p className="text-3xl font-bold text-cyan-600">{completionPercentage}%</p>
              </div>
            </div>

            {/* Admin Panel */}
            {user?.role === 'admin' && showAdminPanel && adminStats && (
              <div className="bg-white rounded-xl shadow-lg border-2 border-red-200 p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-slate-900">
                  <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Admin Control Panel
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-slate-600 font-semibold mb-2">Tasks by Status</p>
                    <div className="mt-2 space-y-1 text-sm">
                      {adminStats.byStatus?.map((item) => (
                        <p key={item._id} className="text-slate-700">
                          {item._id}: <span className="font-bold">{item.count}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-slate-600 font-semibold mb-2">Tasks by Priority</p>
                    <div className="mt-2 space-y-1 text-sm">
                      {adminStats.byPriority?.map((item) => (
                        <p key={item._id} className="text-slate-700">
                          {item._id}: <span className="font-bold">{item.count}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                  {adminStats.overdueTasks > 0 && (
                    <div className="col-span-2 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                      <p className="text-red-600 font-bold">
                        ⚠️ {adminStats.overdueTasks} Overdue Tasks
                      </p>
                      {adminStats.overdueTasksList?.slice(0, 3).map((task) => (
                        <p key={task._id} className="text-sm mt-1 text-slate-600">
                          • {task.title} (Assigned to: {task.assignee?.name || 'Unassigned'})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="mb-6">
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'all', label: 'All Tasks' },
                  { id: 'my-tasks', label: 'My Tasks' },
                  { id: 'in-progress', label: 'In Progress' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'overdue', label: 'Overdue' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      filter === f.id
                        ? 'bg-cyan-500 text-white font-semibold shadow-lg'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                    {f.id === 'all' && <span className="ml-2 px-2 py-0.5 bg-slate-200 rounded-full text-xs">{tasks.length}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks List */}
            {filteredTasks.length > 0 ? (
              <div className="space-y-4">
                {filteredTasks.map(task => (
                  <div
                    key={task._id}
                    className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className="p-6 cursor-pointer group"
                      onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                              {getPriorityIcon(task.priority)} {task.priority}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="space-y-2">
                            {task.dueDate && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span>Subtasks: {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTask(task);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                            title="Edit task"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTask(task);
                                setNewTask({
                                  ...task,
                                  dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                                });
                                setShowModal(true);
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                              title="Admin edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task._id);
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                            title="Delete task"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded View */}
                    {expandedTaskId === task._id && (
                      <div className="border-t border-slate-200 bg-slate-50 p-6">
                        {/* Subtasks */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-bold mb-3 text-slate-900">
                              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Subtasks
                            </h4>
                            <div className="space-y-2">
                              {task.subtasks.map((subtask, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-slate-700">
                                  <input
                                    type="checkbox"
                                    checked={subtask.completed || false}
                                    readOnly
                                    className="w-5 h-5 rounded border-slate-300"
                                  />
                                  <span className={subtask.completed ? 'line-through text-slate-400' : ''}>
                                    {subtask.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Comments */}
                        {task.comments && task.comments.length > 0 && (
                          <div>
                            <h4 className="font-bold mb-3 text-slate-900">
                              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Comments ({task.comments.length})
                            </h4>
                            <div className="space-y-3">
                              {task.comments.map((comment, idx) => (
                                <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200">
                                  <p className="text-slate-700">{comment.text}</p>
                                  <p className="text-xs mt-1 text-slate-500">
                                    {new Date(comment.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No tasks found</h3>
                <p className="text-slate-600 mb-6">
                  {filter !== 'all' ? 'Try adjusting your filters' : 'Create your first task to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">

              <form onSubmit={handleAddTask} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Task Title *</label>
                  <input
                    type="text"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    placeholder="What is this task about?"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {user?.role === 'admin' && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <label className="block text-sm font-semibold text-red-700 mb-2">Estimated Hours</label>
                      <input
                        type="number"
                        value={newTask.estimatedHours || 0}
                        onChange={(e) => setNewTask({ ...newTask, estimatedHours: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-red-700 mb-2">Actual Hours</label>
                      <input
                        type="number"
                        value={newTask.actualHours || 0}
                        onChange={(e) => setNewTask({ ...newTask, actualHours: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all"
                  >
                    + Add Subtask
                  </button>
                </div>

                {newTask.subtasks && newTask.subtasks.map((subtask, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Subtask ${idx + 1}`}
                      value={subtask.title}
                      onChange={(e) => handleUpdateSubtask(idx, { ...subtask, title: e.target.value })}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(idx)}
                      className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
