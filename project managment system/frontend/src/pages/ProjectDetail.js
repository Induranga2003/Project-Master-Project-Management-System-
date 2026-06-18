import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI, usersAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
// eslint-disable-next-line no-unused-vars
import TimeTracker from '../components/TimeTracker';
// eslint-disable-next-line no-unused-vars
import SubtaskManager from '../components/SubtaskManager';
import GanttChart from '../components/GanttChart';
import GoalManager from '../components/GoalManager';
import ScopeManager from '../components/ScopeManager';
import ResourceManager from '../components/ResourceManager';
import InviteMembersModal from '../components/InviteMembersModal';
import Collaboration from '../components/Collaboration';
import OverallProgressChart from '../components/OverallProgressChart';
import ChatPanel from '../components/ChatPanel';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [taskView, setTaskView] = useState('table'); // 'table' or 'kanban'
  const [activeView, setActiveView] = useState('board'); // 'list', 'board', 'gantt', 'sheet', 'dashboard', 'calendar', 'files'
  const [newTaskName, setNewTaskName] = useState('');
  const [showAddTaskInColumn, setShowAddTaskInColumn] = useState(null); // 'todo', 'in-progress', 'completed', null
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showPortfolioDropdown, setShowPortfolioDropdown] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all'); // 'all', 'trash', or folder id
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFileId, setEditingFileId] = useState(null);
  const [editingFileName, setEditingFileName] = useState('');
  const [showFileMenu, setShowFileMenu] = useState(null);
  const [draggedFileId, setDraggedFileId] = useState(null);
  const [sheetSubTab, setSheetSubTab] = useState('all'); // 'all' or 'info'
  const [selectedCell, setSelectedCell] = useState({ row: 1, col: 'taskName' });
  const [sheetData, setSheetData] = useState({}); // Store cell data
  const [selectedGanttTask, setSelectedGanttTask] = useState(null);
  const [ganttZoom, setGanttZoom] = useState(1); // Zoom level for Gantt chart
  const [ganttSplitWidth, setGanttSplitWidth] = useState(384); // Width of left panel in pixels (default 96 * 4 = 384px)
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [editingDueDateTaskId, setEditingDueDateTaskId] = useState(null);
  const [editingStartDateTaskId, setEditingStartDateTaskId] = useState(null);
  const [editingEndDateTaskId, setEditingEndDateTaskId] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [startDateCalendarMonth, setStartDateCalendarMonth] = useState(new Date().getMonth());
  const [startDateCalendarYear, setStartDateCalendarYear] = useState(new Date().getFullYear());
  const [endDateCalendarMonth, setEndDateCalendarMonth] = useState(new Date().getMonth());
  const [endDateCalendarYear, setEndDateCalendarYear] = useState(new Date().getFullYear());
  const [editingProgressTaskId, setEditingProgressTaskId] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningTaskId, setAssigningTaskId] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [taskAssignments, setTaskAssignments] = useState({}); // { userId: { hours: 0, rate: 0, assigned: false } }
  const [showCommentsPanel, setShowCommentsPanel] = useState(false);
  const [selectedTaskForComments, setSelectedTaskForComments] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    fetchProjectAndTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Close portfolio dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPortfolioDropdown && !event.target.closest('.portfolio-section')) {
        setShowPortfolioDropdown(false);
      }
    };

    if (showPortfolioDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showPortfolioDropdown]);

  // Close file menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFileMenu && !event.target.closest('.file-menu-container')) {
        setShowFileMenu(null);
      }
    };

    if (showFileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showFileMenu]);

  // Close calendar dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingDueDateTaskId && !event.target.closest('.calendar-dropdown-container')) {
        setEditingDueDateTaskId(null);
      }
      if (editingStartDateTaskId && !event.target.closest('.calendar-dropdown-container')) {
        setEditingStartDateTaskId(null);
      }
      if (editingEndDateTaskId && !event.target.closest('.calendar-dropdown-container')) {
        setEditingEndDateTaskId(null);
      }
    };

    if (editingDueDateTaskId || editingStartDateTaskId || editingEndDateTaskId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [editingDueDateTaskId, editingStartDateTaskId, editingEndDateTaskId]);

  // Close progress dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingProgressTaskId && !event.target.closest('.progress-dropdown-container')) {
        setEditingProgressTaskId(null);
      }
    };

    if (editingProgressTaskId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [editingProgressTaskId]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      const projectRes = await projectsAPI.getOne(id);
      setProject(projectRes.data);
      const tasksRes = await tasksAPI.getByProject(id);
      setTasks(tasksRes.data);
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const users = [];
      const userIds = new Set(); // Track added user IDs to avoid duplicates
      
      // Add project owner if available
      if (project?.owner) {
        if (typeof project.owner === 'object' && project.owner.name) {
          // Owner is populated
          users.push({
            ...project.owner,
            memberRole: 'admin',
            isOwner: true
          });
          userIds.add(project.owner._id?.toString() || project.owner.id?.toString());
        } else if (project.owner) {
          // Owner is just an ID, fetch it
          try {
            const ownerId = typeof project.owner === 'string' ? project.owner : (project.owner._id || project.owner);
            const ownerRes = await usersAPI.getOne(ownerId);
            if (ownerRes.data) {
              users.push({
                ...ownerRes.data,
                memberRole: 'admin',
                isOwner: true
              });
              userIds.add(ownerRes.data._id?.toString());
            }
          } catch (err) {
            console.error('Failed to fetch owner:', err);
          }
        }
      }
      
      // Add project members (invited members)
      if (project?.members && project.members.length > 0) {
        for (const member of project.members) {
          if (member.user) {
            const userId = typeof member.user === 'object' && member.user._id 
              ? member.user._id.toString() 
              : (typeof member.user === 'string' ? member.user : null);
            
            // Skip if already added (owner might also be in members)
            if (userId && userIds.has(userId)) {
              continue;
            }
            
            // Check if user is populated (has name/email) or just an ID
            if (typeof member.user === 'object' && member.user.name) {
              // User is already populated
              users.push({
                ...member.user,
                memberRole: member.role, // Store the member's role in the project
                joinedAt: member.joinedAt
              });
              if (member.user._id) userIds.add(member.user._id.toString());
            } else {
              // User is just an ID, need to fetch it
              try {
                const memberUserId = typeof member.user === 'string' ? member.user : (member.user._id || member.user);
                const userRes = await usersAPI.getOne(memberUserId);
                if (userRes.data) {
                  users.push({
                    ...userRes.data,
                    memberRole: member.role,
                    joinedAt: member.joinedAt
                  });
                  if (userRes.data._id) userIds.add(userRes.data._id.toString());
                }
              } catch (err) {
                console.error(`Failed to fetch user ${member.user}:`, err);
              }
            }
          }
        }
      }
      
      if (users.length > 0) {
        setAvailableUsers(users);
      } else {
        // No members, fallback to all users
        const usersRes = await usersAPI.getAll();
        setAvailableUsers(usersRes.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setAvailableUsers([]);
    }
  };

  useEffect(() => {
    if (project) {
      fetchAvailableUsers();
    }
  }, [project]);

  useEffect(() => {
    let filtered = [...availableUsers];
    if (userSearchTerm) {
      filtered = filtered.filter(user => 
        (user.name || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(userSearchTerm.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  }, [userSearchTerm, selectedTeamFilter, selectedSkillFilter, availableUsers]);

  const handleAssignUser = async () => {
    if (!assigningTaskId) return;
    try {
      const assignedUser = Object.entries(taskAssignments).find(([_, data]) => data.assigned);
      if (assignedUser) {
        const [userId, assignment] = assignedUser;
        await tasksAPI.update(assigningTaskId, {
          assignee: userId,
          estimatedHours: assignment.hours || 0
        });
        const tasksRes = await tasksAPI.getByProject(id);
        setTasks(tasksRes.data);
      }
      setShowAssignModal(false);
      setAssigningTaskId(null);
      setTaskAssignments({});
    } catch (err) {
      console.error('Failed to assign user:', err);
      setError('Failed to assign user');
    }
  };

  const calculateTotalHours = () => {
    return Object.values(taskAssignments)
      .filter(a => a.assigned)
      .reduce((sum, a) => sum + (parseFloat(a.hours) || 0), 0);
  };

  const calculateTotalCost = () => {
    return Object.values(taskAssignments)
      .filter(a => a.assigned)
      .reduce((sum, a) => sum + ((parseFloat(a.hours) || 0) * (parseFloat(a.rate) || 0)), 0);
  };

  const formatCommentTime = (date) => {
    if (!date) return '';
    const commentDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const commentDay = new Date(commentDate.getFullYear(), commentDate.getMonth(), commentDate.getDate());
    
    if (commentDay.getTime() === today.getTime()) {
      const hours = commentDate.getHours();
      const minutes = commentDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `TODAY ${displayHours}:${displayMinutes} ${ampm}`;
    } else if (commentDay.getTime() === yesterday.getTime()) {
      const hours = commentDate.getHours();
      const minutes = commentDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `YESTERDAY ${displayHours}:${displayMinutes} ${ampm}`;
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const hours = commentDate.getHours();
      const minutes = commentDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${months[commentDate.getMonth()]} ${commentDate.getDate()} ${displayHours}:${displayMinutes} ${ampm}`;
    }
  };

  const handleAddComment = async () => {
    if (!selectedTaskForComments || !newCommentText.trim()) return;
    
    try {
      await tasksAPI.addComment(selectedTaskForComments._id, { text: newCommentText.trim() });
      setNewCommentText('');
      
      // Refresh tasks to get updated comments
      const tasksRes = await tasksAPI.getByProject(id);
      setTasks(tasksRes.data);
      
      // Update selected task
      const updatedTask = tasksRes.data.find(t => t._id === selectedTaskForComments._id);
      if (updatedTask) {
        setSelectedTaskForComments(updatedTask);
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError('Failed to add comment');
    }
  };

  const fetchUserProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await projectsAPI.getAll();
      setUserProjects(response.data || []);
    } catch (err) {
      console.error('Failed to load user projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handlePortfolioToggle = () => {
    if (!showPortfolioDropdown) {
      fetchUserProjects();
    }
    setShowPortfolioDropdown(!showPortfolioDropdown);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = await tasksAPI.create({
        ...formData,
        project: id,
      });
      setTasks([newTask.data, ...tasks]);
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowNewTask(false);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleUpdateProjectName = async (e) => {
    e.preventDefault();
    if (!editingName.trim()) {
      setError('Project name cannot be empty');
      return;
    }
    
    try {
      const updatedProject = await projectsAPI.update(id, { name: editingName.trim() });
      setProject(updatedProject.data);
      setShowEditName(false);
      setError('');
    } catch (err) {
      setError('Failed to update project name');
    }
  };

  const isAdmin = project && (
    currentUser?._id === project.owner._id || 
    currentUser?.id === project.owner._id ||
    project.members?.some(m => (m.user._id === currentUser?._id || m.user === currentUser?.id) && m.role === 'admin')
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading project...</p>
        </div>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Project not found</h3>
          <p className="text-slate-600 mb-6">The project you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const tasksByStatus = {
    'todo': tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    'review': tasks.filter(t => t.status === 'review'),
    'completed': tasks.filter(t => t.status === 'completed'),
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-green-100 text-green-700 border border-green-200',
      'medium': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      'high': 'bg-orange-100 text-orange-700 border border-orange-200',
      'critical': 'bg-red-100 text-red-700 border border-red-200',
    };
    return colors[priority] || colors['medium'];
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'critical') return '🔥';
    if (priority === 'high') return '⬆️';
    return '';
  };

  const getInitials = (name, email) => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return '—';
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `${diffDays} days`;
  };

  const formatDueDateShort = (dueDate) => {
    if (!dueDate) return 'None';
    const date = new Date(dueDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const handleDueDateChange = async (taskId, newDate) => {
    try {
      await tasksAPI.update(taskId, { dueDate: newDate || null });
      setTasks(tasks.map(t => 
        t._id === taskId ? { ...t, dueDate: newDate || null } : t
      ));
      setEditingDueDateTaskId(null);
    } catch (err) {
      console.error('Failed to update due date:', err);
      setError('Failed to update due date');
    }
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    return Math.max(1, diffDays); // Minimum 1 day
  };

  const handleStartDateChange = async (taskId, newDate) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      let updates = { startDate: newDate || null };
      
      // If endDate exists, recalculate duration
      if (newDate && task.endDate) {
        const duration = calculateDuration(newDate, task.endDate);
        updates.estimatedHours = duration * 8; // Convert days to hours (8 hours per day)
      } else if (!newDate) {
        // If start date is cleared, reset duration if end date also doesn't exist
        if (!task.endDate) {
          updates.estimatedHours = 0;
        }
      }

      await tasksAPI.update(taskId, updates);
      setTasks(tasks.map(t => 
        t._id === taskId ? { ...t, ...updates } : t
      ));
      setEditingStartDateTaskId(null);
    } catch (err) {
      console.error('Failed to update start date:', err);
      setError('Failed to update start date');
    }
  };

  const handleEndDateChange = async (taskId, newDate) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      let updates = { endDate: newDate || null };
      
      // If startDate exists, recalculate duration
      if (newDate && task.startDate) {
        const duration = calculateDuration(task.startDate, newDate);
        updates.estimatedHours = duration * 8; // Convert days to hours (8 hours per day)
      } else if (!newDate) {
        // If end date is cleared, reset duration if start date also doesn't exist
        if (!task.startDate) {
          updates.estimatedHours = 0;
        }
      }

      await tasksAPI.update(taskId, updates);
      setTasks(tasks.map(t => 
        t._id === taskId ? { ...t, ...updates } : t
      ));
      setEditingEndDateTaskId(null);
    } catch (err) {
      console.error('Failed to update end date:', err);
      setError('Failed to update end date');
    }
  };

  const getProgressLabel = (percent) => {
    if (percent === 0) return 'Not Started';
    if (percent === 25) return 'Started';
    if (percent === 50) return 'Halfway';
    if (percent === 75) return 'Almost Done';
    if (percent === 100) return 'Done';
    // For other values, find the closest match
    if (percent < 12.5) return 'Not Started';
    if (percent < 37.5) return 'Started';
    if (percent < 62.5) return 'Halfway';
    if (percent < 87.5) return 'Almost Done';
    return 'Done';
  };

  const getProgressPercent = (label) => {
    const mapping = {
      'Not Started': 0,
      'Started': 25,
      'Halfway': 50,
      'Almost Done': 75,
      'Done': 100
    };
    return mapping[label] || 0;
  };

  const handleProgressChange = async (taskId, progressLabel) => {
    try {
      const progressPercent = getProgressPercent(progressLabel);
      await tasksAPI.update(taskId, { percentComplete: progressPercent });
      setTasks(tasks.map(t => 
        t._id === taskId ? { ...t, percentComplete: progressPercent } : t
      ));
      setEditingProgressTaskId(null);
    } catch (err) {
      console.error('Failed to update progress:', err);
      setError('Failed to update progress');
    }
  };

  const renderProgressDropdown = (task) => {
    const progressOptions = ['Not Started', 'Started', 'Halfway', 'Almost Done', 'Done'];
    const currentProgress = task.percentComplete !== undefined ? task.percentComplete : 
      (task.subtasks && task.subtasks.length > 0
        ? Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)
        : (task.status === 'completed' ? 100 : 0));
    const currentLabel = getProgressLabel(currentProgress);

    return (
      <div className="absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 progress-dropdown-container" style={{ top: '100%', left: 0, marginTop: '4px', minWidth: '140px' }}>
        {progressOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleProgressChange(task._id, option)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors ${
              currentLabel === option ? 'bg-slate-50 font-semibold' : ''
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  const renderCalendar = (task, dateType = 'dueDate') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Determine which date to use and which calendar state
    let selectedDate = null;
    let currentMonth, currentYear, setCurrentMonth, setCurrentYear;
    let handleDateChange;
    
    if (dateType === 'startDate') {
      selectedDate = task.startDate ? new Date(task.startDate) : null;
      currentMonth = startDateCalendarMonth;
      currentYear = startDateCalendarYear;
      setCurrentMonth = setStartDateCalendarMonth;
      setCurrentYear = setStartDateCalendarYear;
      handleDateChange = handleStartDateChange;
    } else if (dateType === 'endDate') {
      selectedDate = task.endDate ? new Date(task.endDate) : null;
      currentMonth = endDateCalendarMonth;
      currentYear = endDateCalendarYear;
      setCurrentMonth = setEndDateCalendarMonth;
      setCurrentYear = setEndDateCalendarYear;
      handleDateChange = handleEndDateChange;
    } else {
      selectedDate = task.dueDate ? new Date(task.dueDate) : null;
      currentMonth = calendarMonth;
      currentYear = calendarYear;
      setCurrentMonth = setCalendarMonth;
      setCurrentYear = setCalendarYear;
      handleDateChange = handleDueDateChange;
    }
    
    if (selectedDate) selectedDate.setHours(0, 0, 0, 0);

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; // Monday = 0

    const weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const handlePrevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const handleNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    const handleDateClick = (day) => {
      const clickedDate = new Date(currentYear, currentMonth, day);
      handleDateChange(task._id, clickedDate.toISOString());
    };

    const isToday = (day) => {
      const checkDate = new Date(currentYear, currentMonth, day);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate.getTime() === today.getTime();
    };

    const isSelected = (day) => {
      if (!selectedDate) return false;
      const checkDate = new Date(currentYear, currentMonth, day);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate.getTime() === selectedDate.getTime();
    };

    const days = [];
    // Empty cells for days before the first day of the month
    for (let i = 0; i < adjustedStartingDay; i++) {
      days.push(null);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return (
      <div className="absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-4 calendar-dropdown-container" style={{ top: '100%', left: 0, marginTop: '4px', minWidth: '280px' }}>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            ‹
          </button>
          <div className="font-semibold text-slate-900">
            {months[currentMonth]} {currentYear}
          </div>
          <button
            onClick={handleNextMonth}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            ›
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-8"></div>;
            }
            const isTodayDate = isToday(day);
            const isSelectedDate = isSelected(day);
            
            let buttonClass = 'h-8 w-8 rounded text-sm transition-colors ';
            if (isSelectedDate) {
              buttonClass += 'bg-cyan-500 text-white font-bold';
            } else if (isTodayDate) {
              buttonClass += 'font-bold bg-slate-100 text-slate-900';
            } else {
              buttonClass += 'text-slate-900 hover:bg-slate-100';
            }
            
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={buttonClass}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Clear Date Button */}
        <button
          onClick={() => handleDateChange(task._id, null)}
          className="w-full mt-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
        >
          Clear date
        </button>
      </div>
    );
  };

  const handleQuickAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    
    try {
      const newTask = await tasksAPI.create({
        title: newTaskName.trim(),
        description: '',
        project: id,
        priority: 'medium',
        status: 'todo'
      });
      setTasks([newTask.data, ...tasks]);
      setNewTaskName('');
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleAddTaskInColumn = async (status) => {
    if (!newTaskTitle.trim()) {
      setShowAddTaskInColumn(null);
      setNewTaskTitle('');
      return;
    }
    
    try {
      const newTask = await tasksAPI.create({
        title: newTaskTitle.trim(),
        description: '',
        project: id,
        priority: 'medium',
        status: status
      });
      setTasks([newTask.data, ...tasks]);
      setNewTaskTitle('');
      setShowAddTaskInColumn(null);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
      
      {/* Left Sidebar */}
      <div className="w-64 bg-gradient-to-br from-slate-800 to-slate-900 text-white flex flex-col min-h-screen border-r border-slate-700">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">PM</span>
            </div>
            <span className="text-lg font-semibold">ProjectManager</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
          >
            <span></span>
            <span>Home</span>
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
          >
            <span></span>
            <span>Notifications</span>
          </button>
          <button
            onClick={() => navigate('/time-log')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
          >
            <span></span>
            <span>Time</span>
          </button>
          <button
            onClick={() => navigate('/users')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
          >
            <span></span>
            <span>Team</span>
          </button>
          
          {/* Portfolio Section */}
          <div className="pt-4 portfolio-section">
            <button
              onClick={handlePortfolioToggle}
              className="w-full flex items-center gap-2 px-4 py-2 text-slate-400 text-sm font-medium hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <span></span>
              <span>Portfolio</span>
              <span className={`ml-auto transition-transform ${showPortfolioDropdown ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {showPortfolioDropdown && (
              <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
                {loadingProjects ? (
                  <div className="px-4 py-2 text-center">
                    <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : userProjects.length > 0 ? (
                  userProjects.map((proj) => (
                    <button
                      key={proj._id}
                      onClick={() => {
                        navigate(`/projects/${proj._id}`);
                        setShowPortfolioDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                        proj._id === id
                          ? 'bg-cyan-500 text-white font-semibold shadow-lg'
                          : 'hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${proj._id === id ? 'bg-white' : 'bg-slate-500'}`}></span>
                      <span className="truncate">{proj.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-slate-400 text-xs text-center">No projects found</div>
                )}
                <button
                  onClick={() => {
                    navigate('/projects');
                    setShowPortfolioDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 text-sm mt-1"
                >
                  <span>+</span>
                  <span>New Project</span>
                </button>
              </div>
            )}
            {!showPortfolioDropdown && (
              <div className="mt-2 space-y-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-cyan-500 text-white font-semibold shadow-lg"
                >
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span className="text-sm truncate">{project?.name || 'Project'}</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 text-sm">
            <span>+</span>
            <span>New</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 text-sm">
            <span></span>
            <span>Help</span>
          </button>
          {currentUser && (
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {getInitials(currentUser.name, currentUser.email)}
              </div>
              <span className="text-sm text-slate-300 truncate">
                {currentUser.email || currentUser.name || 'User'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-xl font-semibold text-slate-900 truncate max-w-xs">{project?.name || 'Project'}</h1>
            
            {/* Circular User Button */}
            <button
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white font-semibold transition-colors shadow-sm"
              title="User Menu"
            >
              U
            </button>

            {/* Member Avatars */}
            <div className="flex items-center gap-2">
              {project?.members?.slice(0, 2).map((member, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                    idx === 0 ? 'bg-teal-500' : 'bg-blue-600'
                  }`}
                  title={member.user?.name || member.user?.email || 'Member'}
                >
                  {member.user?.name ? getInitials(member.user.name, member.user.email) : 'U'}
                </div>
              ))}
              {project?.members && project.members.length > 2 && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold bg-slate-500">
                  +{project.members.length - 2}
                </div>
              )}
              {/* Invite Members Button */}
              {isAdmin && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="ml-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                  title="Invite Members"
                >
                  <span>+</span>
                  <span>Invite</span>
                </button>
              )}
            </div>

            {/* View Buttons (LIST, BOARD, GANTT, SHEET, DASHBOARD, CALENDAR, FILES) */}
            <div className="flex items-center gap-1 ml-4 border-l border-slate-300 pl-4">
              <button
                onClick={() => setActiveView('list')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'list'
                    ? 'bg-gray-100 text-slate-900 border border-teal-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="List View"
              >
                <span className="text-base">☰</span>
                <span>LIST</span>
              </button>
              <button
                onClick={() => setActiveView('board')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'board'
                    ? 'bg-gray-100 text-slate-900 border border-teal-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="Board View"
              >
                <span className="text-base">📋</span>
                <span>BOARD</span>
              </button>
              <button
                onClick={() => setActiveView('gantt')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'gantt'
                    ? 'bg-gray-100 text-slate-900 border border-teal-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="Gantt Chart"
              >
                <span className="text-base">📊</span>
                <span>GANTT</span>
              </button>
              <button
                onClick={() => setActiveView('sheet')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'sheet'
                    ? 'bg-gray-100 text-slate-900 border border-teal-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="Sheet View"
              >
                <span className="text-base">📑</span>
                <span>SHEET</span>
              </button>
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'dashboard'
                    ? 'bg-gray-100 text-slate-900 border border-teal-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="Dashboard"
              >
                <span className="text-base">📈</span>
                <span>DASHBOARD</span>
              </button>
              <button
                onClick={() => setActiveView('calendar')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'calendar'
                    ? 'bg-gray-100 text-slate-900 border border-teal-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="Calendar"
              >
                <span className="text-base">📅</span>
                <span>CALENDAR</span>
              </button>
              <button
                onClick={() => setActiveView('files')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeView === 'files'
                    ? 'bg-gray-100 text-slate-900 border border-teal-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="Files"
              >
                <span className="text-base">📁</span>
                <span>FILES</span>
              </button>
            </div>

            {/* Toolbar Icons */}
            <div className="flex items-center gap-2 ml-4">
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Menu">
                ☰
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Analytics">
                📊
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Calendar">
                📅
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Documents">
                📄
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Risks">
                ⚠️
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Add">
                +
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="View">
                👁️
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Search">
                🔍
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Favorites">
                ⭐
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Search">
                🔎
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Settings">
                ⚙️
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
          <div className="p-6">

            {/* Edit Project Name Modal */}
            {showEditName && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Edit Project Name</h2>
                  <form onSubmit={handleUpdateProjectName} className="space-y-4">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Enter new project name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-slate-900"
                      autoFocus
                    />
                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowEditName(false)}
                        className="px-4 py-2 text-slate-700 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div className="flex-1">
                  <strong className="text-red-800 block mb-1">Error</strong>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button className="text-red-500 hover:text-red-700" onClick={() => setError('')}>×</button>
              </div>
            )}

            {/* Task Table View */}
            {activeView !== 'board' && activeView !== 'gantt' && activeView !== 'sheet' && activeView !== 'dashboard' && activeView !== 'calendar' && activeView !== 'files' && activeTab === 'overview' && taskView === 'table' && (
              <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        DONE
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        TASK NAME
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        ASSIGNED TO
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        STATUS
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        PROGRESS
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        PRIORITY
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        DUE
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => {
                      const isCompleted = task.status === 'completed';
                      const progress = task.percentComplete !== undefined ? task.percentComplete :
                        (task.subtasks && task.subtasks.length > 0
                          ? Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)
                          : (isCompleted ? 100 : 0));
                      
                      return (
                        <tr key={task._id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={(e) => {
                                const newStatus = e.target.checked ? 'completed' : 'todo';
                                handleUpdateTaskStatus(task._id, newStatus);
                              }}
                              className="w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 cursor-move">⋮⋮</span>
                              <div>
                                <div className="font-medium text-slate-900">{task.title}</div>
                                {task.description && (
                                  <div className="text-sm text-slate-600 mt-1 line-clamp-1">{task.description}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => {
                                setAssigningTaskId(task._id);
                                // Initialize assignments from existing assignee
                                if (task.assignee) {
                                  setTaskAssignments({
                                    [task.assignee._id || task.assignee]: {
                                      hours: task.estimatedHours || 0,
                                      rate: 0, // Default rate, can be fetched from user profile
                                      assigned: true
                                    }
                                  });
                                } else {
                                  setTaskAssignments({});
                                }
                                setShowAssignModal(true);
                              }}
                              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                              {task.assignee ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                                  task.assignee.name?.charAt(0) === 'N' ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'
                                }`}>
                                  {getInitials(task.assignee.name, task.assignee.email)}
                                </div>
                              ) : (
                                <span className="text-sm text-slate-500">Unassigned</span>
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={task.status}
                              onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                              className="text-sm px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent capitalize"
                            >
                              <option value="todo">To Do</option>
                              <option value="in-progress">Doing</option>
                              <option value="review">Review</option>
                              <option value="completed">Done</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 relative">
                            <button
                              onClick={() => setEditingProgressTaskId(task._id)}
                              className="text-sm text-slate-700 font-medium hover:text-cyan-600 transition-colors"
                            >
                              {progress}%
                            </button>
                            {editingProgressTaskId === task._id && renderProgressDropdown(task)}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={task.priority || 'none'}
                              onChange={async (e) => {
                                try {
                                  const newPriority = e.target.value;
                                  await tasksAPI.update(task._id, { priority: newPriority === 'none' ? null : newPriority });
                                  setTasks(tasks.map(t => 
                                    t._id === task._id ? { ...t, priority: newPriority === 'none' ? null : newPriority } : t
                                  ));
                                } catch (err) {
                                  console.error('Failed to update priority:', err);
                                  setError('Failed to update task priority');
                                }
                              }}
                              className="text-sm px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            >
                              <option value="none">None</option>
                              <option value="very-low">Very Low</option>
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="very-high">Very High</option>
                              <option value="critical">Critical</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 relative">
                            <button
                              onClick={() => {
                                setEditingDueDateTaskId(task._id);
                                if (task.dueDate) {
                                  const date = new Date(task.dueDate);
                                  setCalendarMonth(date.getMonth());
                                  setCalendarYear(date.getFullYear());
                                } else {
                                  const today = new Date();
                                  setCalendarMonth(today.getMonth());
                                  setCalendarYear(today.getFullYear());
                                }
                              }}
                              className="text-sm text-slate-700 hover:text-cyan-600 transition-colors flex items-center gap-1"
                            >
                              {formatDueDateShort(task.dueDate)}
                            </button>
                            {editingDueDateTaskId === task._id && renderCalendar(task)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedTaskForComments(task);
                                  setShowCommentsPanel(true);
                                }}
                                className="text-slate-500 hover:text-cyan-600 transition-colors" 
                                title="Comments"
                              >
                                💬
                              </button>
                              <button className="text-slate-500 hover:text-cyan-600 transition-colors" title="Attachments">
                                📎
                              </button>
                              <button className="text-slate-500 hover:text-cyan-600 transition-colors" title="More">
                                ⋮
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    
                    {/* Inline Add Task Row */}
                    <tr className="border-b border-slate-200">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          disabled
                          className="w-4 h-4 text-cyan-500 border-slate-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3" colSpan="7">
                        <form onSubmit={handleQuickAddTask} className="flex items-center gap-2">
                          <span className="text-slate-400">⋮⋮</span>
                          <input
                            type="text"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            placeholder="Enter a new task name"
                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                          />
                        </form>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Board View (Kanban) */}
            {activeView === 'board' && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {/* To Do Column */}
                  <div
                    className="flex-shrink-0 w-80 bg-slate-50 rounded-lg p-4 border border-slate-200"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      const taskId = e.dataTransfer.getData('taskId');
                      const currentStatus = e.dataTransfer.getData('currentStatus');
                      if (taskId && currentStatus !== 'todo') {
                        handleUpdateTaskStatus(taskId, 'todo');
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          To Do {tasks.filter(t => t.status === 'todo').length > 0 && tasks.filter(t => t.status === 'todo').length}
                        </h3>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">⋯</button>
                    </div>
                    <div className="text-xs text-slate-500 mb-3">8 HRS</div>
                    <div className="space-y-2 mb-4">
                      {tasks.filter(t => t.status === 'todo').map((task) => {
                        const progress = task.subtasks && task.subtasks.length > 0
                          ? Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)
                          : 0;
                        return (
                          <div
                            key={task._id}
                            className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-move"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('taskId', task._id);
                              e.dataTransfer.setData('currentStatus', task.status);
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                checked={false}
                                onChange={(e) => {
                                  const newStatus = e.target.checked ? 'completed' : 'todo';
                                  handleUpdateTaskStatus(task._id, newStatus);
                                }}
                                className="mt-1 w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900">{task.title}</div>
                                {progress > 0 && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs">⬆️</span>
                                    <span className="text-xs text-slate-600">{progress}%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {showAddTaskInColumn !== 'todo' ? (
                      <button
                        onClick={() => setShowAddTaskInColumn('todo')}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <span>Add a Task</span>
                        <span>+</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTaskInColumn('todo');
                            } else if (e.key === 'Escape') {
                              setShowAddTaskInColumn(null);
                              setNewTaskTitle('');
                            }
                          }}
                          placeholder="Enter task title"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddTaskInColumn('todo')}
                            className="px-3 py-1.5 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowAddTaskInColumn(null);
                              setNewTaskTitle('');
                            }}
                            className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Doing Column */}
                  <div
                    className="flex-shrink-0 w-80 bg-slate-50 rounded-lg p-4 border border-slate-200"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      const taskId = e.dataTransfer.getData('taskId');
                      const currentStatus = e.dataTransfer.getData('currentStatus');
                      if (taskId && currentStatus !== 'in-progress') {
                        handleUpdateTaskStatus(taskId, 'in-progress');
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          Doing {tasks.filter(t => t.status === 'in-progress').length > 0 && tasks.filter(t => t.status === 'in-progress').length}
                        </h3>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">⋯</button>
                    </div>
                    <div className="text-xs text-slate-500 mb-3">8 HRS</div>
                    <div className="space-y-2 mb-4">
                      {tasks.filter(t => t.status === 'in-progress').map((task) => {
                        const progress = task.subtasks && task.subtasks.length > 0
                          ? Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)
                          : 0;
                        return (
                          <div
                            key={task._id}
                            className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-move"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('taskId', task._id);
                              e.dataTransfer.setData('currentStatus', task.status);
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                checked={false}
                                onChange={(e) => {
                                  const newStatus = e.target.checked ? 'completed' : 'in-progress';
                                  handleUpdateTaskStatus(task._id, newStatus);
                                }}
                                className="mt-1 w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900">{task.title}</div>
                                {progress > 0 && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs">⬆️</span>
                                    <span className="text-xs text-slate-600">{progress}%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {showAddTaskInColumn !== 'in-progress' ? (
                      <button
                        onClick={() => setShowAddTaskInColumn('in-progress')}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <span>Add a Task</span>
                        <span>+</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTaskInColumn('in-progress');
                            } else if (e.key === 'Escape') {
                              setShowAddTaskInColumn(null);
                              setNewTaskTitle('');
                            }
                          }}
                          placeholder="Enter task title"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddTaskInColumn('in-progress')}
                            className="px-3 py-1.5 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowAddTaskInColumn(null);
                              setNewTaskTitle('');
                            }}
                            className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {tasks.filter(t => t.status === 'in-progress').length === 0 && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <span>Today</span>
                        {project?.members?.[0] && (
                          <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold">
                            {getInitials(project.members[0].user?.name, project.members[0].user?.email)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Done Column */}
                  <div
                    className="flex-shrink-0 w-80 bg-slate-50 rounded-lg p-4 border border-slate-200"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      const taskId = e.dataTransfer.getData('taskId');
                      const currentStatus = e.dataTransfer.getData('currentStatus');
                      if (taskId && currentStatus !== 'completed') {
                        handleUpdateTaskStatus(taskId, 'completed');
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          Done {tasks.filter(t => t.status === 'completed').length > 0 && tasks.filter(t => t.status === 'completed').length}
                        </h3>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">⋯</button>
                    </div>
                    <div className="text-xs text-slate-500 mb-3">8 HRS</div>
                    <div className="space-y-2 mb-4">
                      {tasks.filter(t => t.status === 'completed').map((task) => (
                        <div
                          key={task._id}
                          className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-move"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('taskId', task._id);
                            e.dataTransfer.setData('currentStatus', task.status);
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={true}
                              onChange={(e) => {
                                const newStatus = e.target.checked ? 'completed' : 'todo';
                                handleUpdateTaskStatus(task._id, newStatus);
                              }}
                              className="mt-1 w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900 line-through">{task.title}</div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs">🔥</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {showAddTaskInColumn !== 'completed' ? (
                      <button
                        onClick={() => setShowAddTaskInColumn('completed')}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <span>Add a Task</span>
                        <span>+</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTaskInColumn('completed');
                            } else if (e.key === 'Escape') {
                              setShowAddTaskInColumn(null);
                              setNewTaskTitle('');
                            }
                          }}
                          placeholder="Enter task title"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddTaskInColumn('completed')}
                            className="px-3 py-1.5 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowAddTaskInColumn(null);
                              setNewTaskTitle('');
                            }}
                            className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {tasks.filter(t => t.status === 'completed').length === 0 && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <span>Today</span>
                        {project?.members?.[0] && (
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                            {getInitials(project.members[0].user?.name, project.members[0].user?.email)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* New Column */}
                  <div className="flex-shrink-0 w-80 bg-slate-50 rounded-lg p-4 border border-slate-200 border-dashed">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">New Column</h3>
                      <button className="text-slate-400 hover:text-slate-600">+</button>
                    </div>
                    {showAddTaskInColumn !== 'new-column' ? (
                      <button
                        onClick={() => setShowAddTaskInColumn('new-column')}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <span>Add a Task</span>
                        <span>+</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTaskInColumn('todo');
                            } else if (e.key === 'Escape') {
                              setShowAddTaskInColumn(null);
                              setNewTaskTitle('');
                            }
                          }}
                          placeholder="Enter task title"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddTaskInColumn('todo')}
                            className="px-3 py-1.5 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowAddTaskInColumn(null);
                              setNewTaskTitle('');
                            }}
                            className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Gantt Chart View */}
            {activeView === 'gantt' && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200">
                {/* Secondary Toolbar */}
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 flex items-center gap-2 overflow-x-auto">
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Add User">👤</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Add Task">➕</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="User">👥</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Undo">↶</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Redo">↷</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Indent">⫸</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Outdent">⫷</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Link">🔗</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Auto Schedule">⚡</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Delete">🗑️</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Text Color">A▾</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Numbering">123▾</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Cut">✂️</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Copy">📋</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Paste">📄</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Print">🖨️</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Info">ℹ️</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Filter">🔍</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Lock">🔒</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Settings">⚙️</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setGanttZoom(Math.max(0.5, ganttZoom - 0.1))} className="p-1 hover:bg-slate-200 rounded">−</button>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={ganttZoom}
                      onChange={(e) => setGanttZoom(parseFloat(e.target.value))}
                      className="w-24"
                    />
                    <button onClick={() => setGanttZoom(Math.min(2, ganttZoom + 0.1))} className="p-1 hover:bg-slate-200 rounded">+</button>
                  </div>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Download">⬇️</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Upload">⬆️</button>
                </div>

                {/* Main Gantt Content - Split View */}
                <div 
                  className="flex overflow-hidden relative" 
                  style={{ height: 'calc(100vh - 300px)' }}
                  onMouseMove={(e) => {
                    if (isDraggingSplit) {
                      const newWidth = Math.max(200, Math.min(800, e.clientX - e.currentTarget.getBoundingClientRect().left));
                      setGanttSplitWidth(newWidth);
                    }
                  }}
                  onMouseUp={() => setIsDraggingSplit(false)}
                  onMouseLeave={() => setIsDraggingSplit(false)}
                >
                  {/* Left Pane: Task List Table */}
                  <div 
                    className="flex-shrink-0 border-r border-slate-200 overflow-y-auto bg-white"
                    style={{ width: `${ganttSplitWidth}px` }}
                  >
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-slate-50 z-10">
                        <tr>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 uppercase border-b border-r border-slate-200 w-12">
                            ALL
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                            TASK NAME
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                            DURATION
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                            PLANNED STA...
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                            PLANNED FINIS...
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                            ASSIGNED
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                            PERCENT CO...
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                            PRIORITY
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          // Group tasks by parent/child relationships
                          const parentTasks = tasks.filter(t => !t.parentTask);
                          const childTasks = tasks.filter(t => t.parentTask);
                          const taskGroups = [];
                          
                          parentTasks.forEach((parent, idx) => {
                            taskGroups.push({ ...parent, isParent: true, color: ['#9333ea', '#10b981', '#3b82f6'][idx % 3] });
                            const children = childTasks.filter(c => c.parentTask === parent._id);
                            children.forEach(child => {
                              taskGroups.push({ ...child, isParent: false, parentColor: ['#9333ea', '#10b981', '#3b82f6'][idx % 3] });
                            });
                          });
                          
                          // Add remaining child tasks without parents
                          childTasks.filter(c => !parentTasks.some(p => p._id === c.parentTask)).forEach(child => {
                            taskGroups.push({ ...child, isParent: false, parentColor: '#6b7280' });
                          });
                          
                          // Add tasks without parent/child relationship
                          tasks.filter(t => !t.parentTask && !childTasks.some(c => c.parentTask === t._id)).forEach(task => {
                            if (!taskGroups.some(tg => tg._id === task._id)) {
                              taskGroups.push({ ...task, isParent: true, color: '#6b7280' });
                            }
                          });
                          
                          return taskGroups.length > 0 ? taskGroups : tasks.map(t => ({ ...t, isParent: false, color: '#6b7280' }));
                        })().map((task, idx) => {
                          const isSelected = selectedGanttTask === task._id;
                          // Calculate dates: use startDate/endDate if available, otherwise calculate from dueDate and duration
                          let startDate, endDate, duration;
                          
                          if (task.startDate && task.endDate) {
                            // Both dates exist - use them and calculate duration
                            startDate = new Date(task.startDate);
                            endDate = new Date(task.endDate);
                            duration = calculateDuration(task.startDate, task.endDate);
                          } else if (task.startDate) {
                            // Only start date exists - calculate end from duration
                            startDate = new Date(task.startDate);
                            duration = task.estimatedHours ? Math.ceil(task.estimatedHours / 8) : 1;
                            endDate = new Date(startDate.getTime() + (duration - 1) * 24 * 60 * 60 * 1000);
                          } else if (task.endDate) {
                            // Only end date exists - calculate start from duration
                            endDate = new Date(task.endDate);
                            duration = task.estimatedHours ? Math.ceil(task.estimatedHours / 8) : 1;
                            startDate = new Date(endDate.getTime() - (duration - 1) * 24 * 60 * 60 * 1000);
                          } else {
                            // No dates - calculate from dueDate and duration
                            duration = task.estimatedHours ? Math.ceil(task.estimatedHours / 8) : 1;
                            startDate = task.dueDate ? new Date(new Date(task.dueDate).getTime() - (duration - 1) * 24 * 60 * 60 * 1000) : new Date();
                            endDate = task.dueDate ? new Date(task.dueDate) : new Date(startDate.getTime() + (duration - 1) * 24 * 60 * 60 * 1000);
                          }
                          
                          // Calculate progress: use percentComplete if available, otherwise calculate from subtasks or status
                          let progress = 0;
                          if (task.percentComplete !== undefined) {
                            progress = task.percentComplete;
                          } else if (task.subtasks && task.subtasks.length > 0) {
                            const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                            progress = Math.round((completedSubtasks / task.subtasks.length) * 100);
                          } else {
                            progress = task.status === 'completed' ? 100 : task.status === 'in-progress' ? 50 : task.status === 'review' ? 75 : 0;
                          }
                          
                          const taskColor = task.isParent ? task.color : task.parentColor || '#6b7280';
                          const isMilestone = duration <= 1 && task.isMilestone !== false; // Single day tasks can be milestones
                          
                          return (
                            <tr
                              key={task._id || idx}
                              className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                                isSelected ? 'bg-cyan-50 ring-2 ring-cyan-500' : ''
                              }`}
                              onClick={() => setSelectedGanttTask(task._id)}
                            >
                              <td className="px-2 py-2 border-r border-slate-200">
                                <input
                                  type="checkbox"
                                  checked={task.status === 'completed'}
                                  onChange={(e) => {
                                    const newStatus = e.target.checked ? 'completed' : 'todo';
                                    handleUpdateTaskStatus(task._id, newStatus);
                                  }}
                                  className="w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-1 h-6 rounded"
                                    style={{ backgroundColor: taskColor }}
                                  ></div>
                                  <span className={`${task.isParent ? 'font-bold text-base' : 'text-sm pl-4'} text-slate-900`}>
                                    {task.title}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3 py-2 text-sm text-slate-600">{duration} days</td>
                              <td className="px-3 py-2 text-sm text-slate-600 relative">
                                <button
                                  onClick={() => {
                                    setEditingStartDateTaskId(task._id);
                                    if (task.startDate) {
                                      const date = new Date(task.startDate);
                                      setStartDateCalendarMonth(date.getMonth());
                                      setStartDateCalendarYear(date.getFullYear());
                                    } else {
                                      const today = new Date();
                                      setStartDateCalendarMonth(today.getMonth());
                                      setStartDateCalendarYear(today.getFullYear());
                                    }
                                  }}
                                  className="hover:text-cyan-600 transition-colors"
                                >
                                  {startDate.toISOString().split('T')[0]}
                                </button>
                                {editingStartDateTaskId === task._id && renderCalendar(task, 'startDate')}
                              </td>
                              <td className="px-3 py-2 text-sm text-slate-600 relative">
                                <button
                                  onClick={() => {
                                    setEditingEndDateTaskId(task._id);
                                    if (task.endDate) {
                                      const date = new Date(task.endDate);
                                      setEndDateCalendarMonth(date.getMonth());
                                      setEndDateCalendarYear(date.getFullYear());
                                    } else {
                                      const today = new Date();
                                      setEndDateCalendarMonth(today.getMonth());
                                      setEndDateCalendarYear(today.getFullYear());
                                    }
                                  }}
                                  className="hover:text-cyan-600 transition-colors"
                                >
                                  {endDate.toISOString().split('T')[0]}
                                </button>
                                {editingEndDateTaskId === task._id && renderCalendar(task, 'endDate')}
                              </td>
                              <td className="px-3 py-2 text-sm text-slate-600">
                                {task.assignee?.name || task.assignee?.email || ''}
                                {task.assignee && ' (100%)'}
                              </td>
                              <td className="px-3 py-2 text-sm text-slate-600 font-semibold relative">
                                <button
                                  onClick={() => setEditingProgressTaskId(task._id)}
                                  className="hover:text-cyan-600 transition-colors"
                                >
                                  {progress}%
                                </button>
                                {editingProgressTaskId === task._id && renderProgressDropdown(task)}
                              </td>
                              <td className="px-3 py-2 text-sm text-slate-600">
                                <select
                                  value={task.priority || 'none'}
                                  onChange={async (e) => {
                                    try {
                                      const newPriority = e.target.value;
                                      await tasksAPI.update(task._id, { priority: newPriority });
                                      setTasks(tasks.map(t => 
                                        t._id === task._id ? { ...t, priority: newPriority } : t
                                      ));
                                    } catch (err) {
                                      console.error('Failed to update priority:', err);
                                      setError('Failed to update task priority');
                                    }
                                  }}
                                  className="text-sm px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full"
                                >
                                  <option value="none">None</option>
                                  <option value="very-low">Very Low</option>
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                  <option value="very-high">Very High</option>
                                  <option value="critical">Critical</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                        {/* Empty rows for adding new tasks */}
                        {Array.from({ length: Math.max(0, 20 - tasks.length) }, (_, i) => (
                          <tr key={`empty-${i}`} className="border-b border-slate-200">
                            <td className="px-2 py-2 border-r border-slate-200"></td>
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2"></td>
                            <td className="px-3 py-2"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Draggable Divider */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-slate-300 hover:bg-cyan-500 cursor-col-resize z-20 transition-colors flex items-center justify-center"
                    style={{ left: `${ganttSplitWidth}px` }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsDraggingSplit(true);
                    }}
                    title="Drag to resize"
                  >
                    <div className="w-0.5 h-12 bg-slate-400 rounded"></div>
                  </div>

                  {/* Right Pane: Gantt Chart Timeline */}
                  <div 
                    className="overflow-x-auto overflow-y-auto bg-white relative"
                    style={{ 
                      width: `calc(100% - ${ganttSplitWidth}px - 4px)`, 
                      marginLeft: `${ganttSplitWidth + 4}px`,
                      height: '100%'
                    }}
                  >
                    {(() => {
                      // Calculate date range from all tasks
                      const allDates = tasks
                        .map(t => {
                          let start, end, duration;
                          if (t.startDate && t.endDate) {
                            // Both dates exist - calculate duration from them
                            start = new Date(t.startDate);
                            end = new Date(t.endDate);
                            duration = calculateDuration(t.startDate, t.endDate);
                          } else {
                            // Calculate duration from estimatedHours or use default
                            duration = t.estimatedHours ? Math.ceil(t.estimatedHours / 8) : (t.duration || 1);
                            start = t.startDate ? new Date(t.startDate) : 
                                   (t.dueDate ? new Date(new Date(t.dueDate).getTime() - (duration - 1) * 24 * 60 * 60 * 1000) : new Date());
                            end = t.endDate ? new Date(t.endDate) : 
                                 (t.dueDate ? new Date(t.dueDate) : new Date(start.getTime() + (duration - 1) * 24 * 60 * 60 * 1000));
                          }
                          return [start, end];
                        })
                        .flat();
                      
                      const minDate = allDates.length > 0 
                        ? new Date(Math.min(...allDates.map(d => d.getTime())))
                        : new Date();
                      const maxDate = allDates.length > 0
                        ? new Date(Math.max(...allDates.map(d => d.getTime())))
                        : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
                      
                      // Generate weeks
                      const weeks = [];
                      const currentDate = new Date(minDate);
                      currentDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start from Sunday
                      
                      while (currentDate <= maxDate) {
                        weeks.push(new Date(currentDate));
                        currentDate.setDate(currentDate.getDate() + 7);
                      }
                      
                      const today = new Date();
                      const dayWidth = 20 * ganttZoom;
                      const weekWidth = dayWidth * 7;
                      
                      // Generate daily grid for better precision
                      const days = [];
                      const dayStart = new Date(minDate);
                      dayStart.setDate(dayStart.getDate() - dayStart.getDay()); // Start from Sunday
                      const dayEnd = new Date(maxDate);
                      dayEnd.setDate(dayEnd.getDate() + (7 - dayEnd.getDay())); // End on Saturday
                      
                      const currentDay = new Date(dayStart);
                      while (currentDay <= dayEnd) {
                        days.push(new Date(currentDay));
                        currentDay.setDate(currentDay.getDate() + 1);
                      }
                      
                      return (
                        <div className="relative" style={{ minWidth: `${days.length * dayWidth}px` }}>
                          {/* Timeline Header with Days */}
                          <div className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10" style={{ minWidth: `${days.length * dayWidth}px` }}>
                            {/* Week Headers */}
                            <div className="flex border-b border-slate-300" style={{ width: `${weeks.length * weekWidth}px` }}>
                              {weeks.map((week, idx) => (
                                <div
                                  key={`week-${idx}`}
                                  className="border-r border-slate-200 px-2 py-2 text-xs font-semibold text-slate-600 bg-slate-100"
                                  style={{ width: `${weekWidth}px`, minWidth: `${weekWidth}px` }}
                                >
                                  {week.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                </div>
                              ))}
                            </div>
                            {/* Day Headers */}
                            <div className="flex" style={{ width: `${days.length * dayWidth}px` }}>
                              {days.map((day, idx) => {
                                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                return (
                                  <div
                                    key={`day-${idx}`}
                                    className={`border-r border-slate-200 text-center text-[10px] py-1 ${
                                      isWeekend ? 'bg-slate-100' : 'bg-white'
                                    }`}
                                    style={{ width: `${dayWidth}px`, minWidth: `${dayWidth}px` }}
                                  >
                                    {day.getDate()}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Timeline Grid and Task Bars */}
                          <div className="relative bg-white" style={{ minWidth: `${days.length * dayWidth}px`, width: `${days.length * dayWidth}px`, height: `${tasks.length * 40 + 100}px` }}>
                            {/* Daily Grid Lines (dotted) */}
                            {days.map((day, idx) => {
                              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                              return (
                                <div
                                  key={`day-grid-${idx}`}
                                  className={`absolute border-r ${
                                    isWeekend ? 'border-slate-200 bg-slate-50' : 'border-slate-100'
                                  }`}
                                  style={{
                                    left: `${idx * dayWidth}px`,
                                    top: 0,
                                    bottom: 0,
                                    width: '1px',
                                    borderStyle: 'dotted'
                                  }}
                                ></div>
                              );
                            })}
                            
                            {/* Weekly Grid Lines (solid) */}
                            {weeks.map((week, idx) => (
                              <div
                                key={`week-grid-${idx}`}
                                className="absolute border-r-2 border-slate-300"
                                style={{
                                  left: `${idx * weekWidth}px`,
                                  top: 0,
                                  bottom: 0,
                                  width: '2px'
                                }}
                              ></div>
                            ))}
                            
                            {/* Current Date Marker */}
                            {(() => {
                              const daysSinceStart = Math.floor((today - dayStart) / (1000 * 60 * 60 * 24));
                              const markerLeft = daysSinceStart * dayWidth;
                              if (markerLeft >= 0 && markerLeft <= days.length * dayWidth) {
                                return (
                                  <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-green-400 z-30 shadow-sm"
                                    style={{ left: `${markerLeft}px` }}
                                  >
                                    <div className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                            
                            {/* Dependency Lines */}
                            {(() => {
                              const taskMap = new Map();
                              const taskGroups = (() => {
                                const parentTasks = tasks.filter(t => !t.parentTask);
                                const childTasks = tasks.filter(t => t.parentTask);
                                const groups = [];
                                
                                parentTasks.forEach((parent, idx) => {
                                  groups.push({ ...parent, isParent: true, color: ['#9333ea', '#10b981', '#3b82f6'][idx % 3], row: idx * 2 });
                                  const children = childTasks.filter(c => c.parentTask === parent._id);
                                  children.forEach((child, cIdx) => {
                                    groups.push({ ...child, isParent: false, parentColor: ['#9333ea', '#10b981', '#3b82f6'][idx % 3], row: idx * 2 + 1 + cIdx });
                                  });
                                });
                                
                                return groups.length > 0 ? groups : tasks.map((t, idx) => ({ ...t, isParent: false, color: '#6b7280', row: idx }));
                              })();
                              
                              taskGroups.forEach((t) => {
                                let startDate, endDate, duration;
                                if (t.startDate && t.endDate) {
                                  startDate = new Date(t.startDate);
                                  endDate = new Date(t.endDate);
                                  duration = calculateDuration(t.startDate, t.endDate);
                                } else {
                                  duration = t.estimatedHours ? Math.ceil(t.estimatedHours / 8) : (t.duration || 1);
                                  startDate = t.startDate ? new Date(t.startDate) : 
                                             (t.dueDate ? new Date(new Date(t.dueDate).getTime() - (duration - 1) * 24 * 60 * 60 * 1000) : new Date());
                                  endDate = t.endDate ? new Date(t.endDate) : 
                                           (t.dueDate ? new Date(t.dueDate) : new Date(startDate.getTime() + (duration - 1) * 24 * 60 * 60 * 1000));
                                }
                                
                                const daysSinceStart = Math.floor((startDate - dayStart) / (1000 * 60 * 60 * 24));
                                const barLeft = daysSinceStart * dayWidth;
                                const barWidth = duration * dayWidth;
                                
                                taskMap.set(t._id, {
                                  ...t,
                                  barLeft,
                                  barWidth,
                                  barRight: barLeft + barWidth,
                                  barCenter: barLeft + barWidth / 2,
                                  row: t.row || 0,
                                  endDate,
                                  startDate
                                });
                              });
                              
                              // Draw dependency lines from task.dependencies array
                              const dependencies = [];
                              tasks.forEach((task) => {
                                if (task.dependencies && task.dependencies.length > 0) {
                                  const current = taskMap.get(task._id);
                                  task.dependencies.forEach(depId => {
                                    const depTask = taskMap.get(depId);
                                    if (current && depTask) {
                                      dependencies.push({
                                        fromX: depTask.barRight,
                                        fromY: depTask.row * 40 + 32,
                                        toX: current.barLeft,
                                        toY: current.row * 40 + 32,
                                        fromTask: depTask,
                                        toTask: current
                                      });
                                    }
                                  });
                                }
                              });
                              
                              return dependencies.map((dep, idx) => (
                                <svg
                                  key={`dep-${idx}`}
                                  className="absolute pointer-events-none z-10"
                                  style={{ top: 0, left: 0, minWidth: `${days.length * dayWidth}px`, width: `${days.length * dayWidth}px`, height: `${tasks.length * 40 + 100}px` }}
                                >
                                  {/* Arrow line */}
                                  <defs>
                                    <marker id={`arrowhead-${idx}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                                      <polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
                                    </marker>
                                  </defs>
                                  <line
                                    x1={dep.fromX}
                                    y1={dep.fromY}
                                    x2={dep.toX}
                                    y2={dep.toY}
                                    stroke="#6b7280"
                                    strokeWidth="2"
                                    strokeDasharray="4,2"
                                    markerEnd={`url(#arrowhead-${idx})`}
                                  />
                                </svg>
                              ));
                            })()}
                            
                            {/* Task Bars */}
                            {(() => {
                              const parentTasks = tasks.filter(t => !t.parentTask);
                              const childTasks = tasks.filter(t => t.parentTask);
                              const taskGroups = [];
                              
                              parentTasks.forEach((parent, idx) => {
                                taskGroups.push({ ...parent, isParent: true, color: ['#9333ea', '#10b981', '#3b82f6'][idx % 3], row: idx * 2 });
                                const children = childTasks.filter(c => c.parentTask === parent._id);
                                children.forEach((child, cIdx) => {
                                  taskGroups.push({ ...child, isParent: false, parentColor: ['#9333ea', '#10b981', '#3b82f6'][idx % 3], row: idx * 2 + 1 + cIdx });
                                });
                              });
                              
                              return taskGroups.length > 0 ? taskGroups : tasks.map((t, idx) => ({ ...t, isParent: false, color: '#6b7280', row: idx }));
                            })().map((task, idx) => {
                              let startDate, endDate, duration;
                              if (task.startDate && task.endDate) {
                                startDate = new Date(task.startDate);
                                endDate = new Date(task.endDate);
                                duration = calculateDuration(task.startDate, task.endDate);
                              } else {
                                duration = task.estimatedHours ? Math.ceil(task.estimatedHours / 8) : (task.duration || 1);
                                startDate = task.startDate ? new Date(task.startDate) : 
                                           (task.dueDate ? new Date(new Date(task.dueDate).getTime() - (duration - 1) * 24 * 60 * 60 * 1000) : new Date());
                                endDate = task.endDate ? new Date(task.endDate) : 
                                         (task.dueDate ? new Date(task.dueDate) : new Date(startDate.getTime() + (duration - 1) * 24 * 60 * 60 * 1000));
                              }
                              
                              const daysSinceStart = Math.floor((startDate - dayStart) / (1000 * 60 * 60 * 24));
                              const barLeft = daysSinceStart * dayWidth;
                              const barWidth = duration * dayWidth;
                              
                              // Calculate progress
                              let progress = 0;
                              if (task.subtasks && task.subtasks.length > 0) {
                                const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                                progress = Math.round((completedSubtasks / task.subtasks.length) * 100);
                              } else {
                                progress = task.status === 'completed' ? 100 : task.status === 'in-progress' ? 50 : task.status === 'review' ? 75 : 0;
                              }
                              if (task.percentComplete !== undefined) {
                                progress = task.percentComplete;
                              }
                              
                              const progressWidth = (barWidth * progress) / 100;
                              const taskColor = task.isParent ? task.color : task.parentColor || '#6b7280';
                              const rowTop = (task.row || idx) * 40 + 20;
                              const isMilestone = duration <= 1 && task.isMilestone !== false;
                              
                              return (
                                <div
                                  key={task._id || idx}
                                  className="absolute group"
                                  style={{
                                    left: `${barLeft}px`,
                                    top: `${rowTop}px`,
                                    width: `${barWidth}px`,
                                    height: '24px'
                                  }}
                                >
                                  {isMilestone ? (
                                    // Milestone marker (diamond shape)
                                    <div
                                      className="absolute"
                                      style={{
                                        left: `${barWidth / 2 - 8}px`,
                                        top: '0px',
                                        width: '16px',
                                        height: '16px',
                                        transform: 'rotate(45deg)',
                                        backgroundColor: taskColor,
                                        border: '2px solid white',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                      }}
                                      title={`${task.title} - Milestone`}
                                    >
                                      <div
                                        className="absolute inset-0 flex items-center justify-center"
                                        style={{ transform: 'rotate(-45deg)' }}
                                      >
                                        <span className="text-[8px] font-bold text-white">M</span>
                                      </div>
                                    </div>
                                  ) : (
                                    // Regular task bar
                                    <div
                                      className="relative rounded h-full flex items-center px-2 text-xs text-white font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                      style={{ 
                                        backgroundColor: taskColor, 
                                        opacity: progress === 100 ? 1 : 0.85,
                                        border: `1px solid ${taskColor}`
                                      }}
                                      title={`${task.title} - ${progress}% complete`}
                                    >
                                      {/* Progress indicator */}
                                      {progress > 0 && (
                                        <div
                                          className="absolute left-0 top-0 bottom-0 rounded-l"
                                          style={{
                                            width: `${progressWidth}px`,
                                            backgroundColor: taskColor,
                                            opacity: 1,
                                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                          }}
                                        ></div>
                                      )}
                                      {/* Task name and progress */}
                                      <div className="relative z-10 flex items-center justify-between w-full">
                                        {barWidth > 100 && (
                                          <span className="truncate font-semibold">{task.title}</span>
                                        )}
                                        {barWidth > 150 && progress > 0 && (
                                          <span className="ml-2 text-[10px] font-bold">{progress}%</span>
                                        )}
                                      </div>
                                      {/* Assignee indicator on hover */}
                                      {task.assignee && (
                                        <div className="absolute -right-8 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <div className="bg-slate-700 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                                            {task.assignee.name || task.assignee.email || 'Unassigned'}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Sheet View */}
            {activeView === 'sheet' && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200">
                {/* Secondary Toolbar */}
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 flex items-center gap-2 overflow-x-auto">
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Add User">👤</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Group">👥</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Refresh">🔄</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Undo">↶</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Redo">↷</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Align Left">⬅</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Align Center">⬌</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Align Right">➡</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Merge Cells">⇄</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Link">🔗</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Cloud">☁️</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Delete">🗑️</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Text Format">A▾</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Numbering">123▾</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Diamond">💎</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Cut">✂️</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Copy">📋</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Paste">📄</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Attach">📎</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Document">📄</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Comment">💬</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Grid">⊞</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Upload">⬆️</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Download">⬇️</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Print">🖨️</button>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Info">ℹ️</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Filter">🔍</button>
                  <button className="p-2 hover:bg-slate-200 rounded transition-colors" title="Lock">🔒</button>
                </div>

                {/* Sheet Content */}
                <div className="flex">
                  {/* Left Sidebar - Sub-tabs and Row Numbers */}
                  <div className="flex-shrink-0 border-r border-slate-200 bg-slate-50">
                    {/* Sub-tabs */}
                    <div className="flex border-b border-slate-200">
                      <button
                        onClick={() => setSheetSubTab('all')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          sheetSubTab === 'all'
                            ? 'bg-white text-slate-900 border-b-2 border-cyan-500'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ALL
                      </button>
                      <button
                        onClick={() => setSheetSubTab('info')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          sheetSubTab === 'info'
                            ? 'bg-white text-slate-900 border-b-2 border-cyan-500'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        INFO
                      </button>
                    </div>
                    {/* Row Numbers */}
                    <div className="w-16">
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((rowNum) => (
                        <div
                          key={rowNum}
                          className={`h-8 flex items-center justify-center text-xs border-b border-r border-slate-200 ${
                            selectedCell.row === rowNum ? 'bg-cyan-50 font-semibold' : 'bg-white'
                          }`}
                        >
                          {rowNum}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Spreadsheet Grid */}
                  <div className="flex-1 overflow-auto">
                    <table className="border-collapse">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase bg-slate-50 border-b border-r border-slate-200 min-w-[200px]">
                            TASK NAME
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase bg-slate-50 border-b border-r border-slate-200 min-w-[120px]">
                            DURATION
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase bg-slate-50 border-b border-r border-slate-200 min-w-[150px]">
                            PLANNED START DATE
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase bg-slate-50 border-b border-r border-slate-200 min-w-[150px]">
                            PLANNED FINISH DATE
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase bg-slate-50 border-b border-r border-slate-200 min-w-[120px]">
                            ASSIGNED
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase bg-slate-50 border-b border-r border-slate-200 min-w-[140px]">
                            PERCENT COMPLETE
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase bg-slate-50 border-b border-r border-slate-200 min-w-[100px]">
                            PRIORITY
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase bg-slate-50 border-b border-r border-slate-200 min-w-[120px]">
                            ACTUAL HOURS
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase bg-slate-50 border-b border-r border-slate-200 min-w-[120px]">
                            PLANNED HOURS
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase bg-slate-50 border-b border-r border-slate-200 min-w-[120px]">
                            PLANNED COST
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 30 }, (_, rowIndex) => {
                          const rowNum = rowIndex + 1;
                          const task = tasks[rowIndex] || null;
                          const isSelected = selectedCell.row === rowNum;
                          
                          return (
                            <tr key={rowNum}>
                              {/* TASK NAME */}
                              <td className={`px-4 py-2 border-b border-r border-slate-200 ${
                                isSelected && selectedCell.col === 'taskName' ? 'bg-cyan-50 ring-2 ring-cyan-500' : 'bg-white'
                              }`}>
                                {isSelected && selectedCell.col === 'taskName' ? (
                                  <input
                                    type="text"
                                    placeholder="Start entering"
                                    className="w-full bg-transparent border-none outline-none text-slate-900"
                                    autoFocus
                                    onBlur={(e) => {
                                      if (e.target.value.trim()) {
                                        setSheetData({
                                          ...sheetData,
                                          [`${rowNum}-taskName`]: e.target.value
                                        });
                                      }
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="cursor-pointer min-h-[24px]"
                                    onClick={() => setSelectedCell({ row: rowNum, col: 'taskName' })}
                                  >
                                    {task?.title || sheetData[`${rowNum}-taskName`] || ''}
                                  </div>
                                )}
                              </td>
                              {/* DURATION */}
                              <td className={`px-4 py-2 border-b border-r border-slate-200 ${
                                isSelected && selectedCell.col === 'duration' ? 'bg-cyan-50 ring-2 ring-cyan-500' : 'bg-white'
                              }`}>
                                <div
                                  className="cursor-pointer min-h-[24px]"
                                  onClick={() => setSelectedCell({ row: rowNum, col: 'duration' })}
                                >
                                  {task?.estimatedHours ? `${task.estimatedHours}h` : sheetData[`${rowNum}-duration`] || ''}
                                </div>
                              </td>
                              {/* PLANNED START DATE */}
                              <td className={`px-4 py-2 border-b border-r border-slate-200 relative ${
                                isSelected && selectedCell.col === 'startDate' ? 'bg-cyan-50 ring-2 ring-cyan-500' : 'bg-white'
                              }`}>
                                <button
                                  onClick={() => {
                                    if (task) {
                                      setEditingStartDateTaskId(task._id);
                                      if (task.startDate) {
                                        const date = new Date(task.startDate);
                                        setStartDateCalendarMonth(date.getMonth());
                                        setStartDateCalendarYear(date.getFullYear());
                                      } else {
                                        const today = new Date();
                                        setStartDateCalendarMonth(today.getMonth());
                                        setStartDateCalendarYear(today.getFullYear());
                                      }
                                    } else {
                                      setSelectedCell({ row: rowNum, col: 'startDate' });
                                    }
                                  }}
                                  className="cursor-pointer min-h-[24px] w-full text-left hover:text-cyan-600 transition-colors"
                                >
                                  {task?.startDate ? new Date(task.startDate).toISOString().split('T')[0] : 
                                   task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : 
                                   sheetData[`${rowNum}-startDate`] || ''}
                                </button>
                                {task && editingStartDateTaskId === task._id && renderCalendar(task, 'startDate')}
                              </td>
                              {/* PLANNED FINISH DATE */}
                              <td className={`px-4 py-2 border-b border-r border-slate-200 relative ${
                                isSelected && selectedCell.col === 'finishDate' ? 'bg-cyan-50 ring-2 ring-cyan-500' : 'bg-white'
                              }`}>
                                <button
                                  onClick={() => {
                                    if (task) {
                                      setEditingEndDateTaskId(task._id);
                                      if (task.endDate) {
                                        const date = new Date(task.endDate);
                                        setEndDateCalendarMonth(date.getMonth());
                                        setEndDateCalendarYear(date.getFullYear());
                                      } else {
                                        const today = new Date();
                                        setEndDateCalendarMonth(today.getMonth());
                                        setEndDateCalendarYear(today.getFullYear());
                                      }
                                    } else {
                                      setSelectedCell({ row: rowNum, col: 'finishDate' });
                                    }
                                  }}
                                  className="cursor-pointer min-h-[24px] w-full text-left hover:text-cyan-600 transition-colors"
                                >
                                  {task?.endDate ? new Date(task.endDate).toISOString().split('T')[0] : 
                                   task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : 
                                   sheetData[`${rowNum}-finishDate`] || ''}
                                </button>
                                {task && editingEndDateTaskId === task._id && renderCalendar(task, 'endDate')}
                              </td>
                              {/* ASSIGNED */}
                              <td className={`px-4 py-2 border-b border-r border-slate-200 ${
                                isSelected && selectedCell.col === 'assigned' ? 'bg-cyan-50 ring-2 ring-cyan-500' : 'bg-white'
                              }`}>
                                <div
                                  className="cursor-pointer min-h-[24px]"
                                  onClick={() => setSelectedCell({ row: rowNum, col: 'assigned' })}
                                >
                                  {task?.assignee?.name || task?.assignee?.email || sheetData[`${rowNum}-assigned`] || ''}
                                </div>
                              </td>
                              {/* PERCENT COMPLETE */}
                              <td className={`px-4 py-2 border-b border-r border-slate-200 ${
                                isSelected && selectedCell.col === 'percentComplete' ? 'bg-cyan-50 ring-2 ring-cyan-500' : 'bg-white'
                              }`}>
                                <div
                                  className="cursor-pointer min-h-[24px]"
                                  onClick={() => setSelectedCell({ row: rowNum, col: 'percentComplete' })}
                                >
                                  {task?.status === 'completed' ? '100%' : task?.status === 'in-progress' ? '50%' : sheetData[`${rowNum}-percentComplete`] || '0%'}
                                </div>
                              </td>
                              {/* PRIORITY */}
                              <td className={`px-4 py-2 border-b border-r border-slate-200 ${
                                isSelected && selectedCell.col === 'priority' ? 'bg-cyan-50 ring-2 ring-cyan-500' : 'bg-white'
                              }`}>
                                <div
                                  className="cursor-pointer min-h-[24px]"
                                  onClick={() => setSelectedCell({ row: rowNum, col: 'priority' })}
                                >
                                  {task?.priority || sheetData[`${rowNum}-priority`] || ''}
                                </div>
                              </td>
                              {/* ACTUAL HOURS */}
                              <td className={`px-4 py-2 border-b border-r border-slate-200 ${
                                isSelected && selectedCell.col === 'actualHours' ? 'bg-cyan-50 ring-2 ring-cyan-500' : 'bg-white'
                              }`}>
                                <div
                                  className="cursor-pointer min-h-[24px]"
                                  onClick={() => setSelectedCell({ row: rowNum, col: 'actualHours' })}
                                >
                                  {task?.actualHours || sheetData[`${rowNum}-actualHours`] || ''}
                                </div>
                              </td>
                              {/* PLANNED HOURS */}
                              <td className={`px-4 py-2 border-b border-r border-slate-200 ${
                                isSelected && selectedCell.col === 'plannedHours' ? 'bg-cyan-50 ring-2 ring-cyan-500' : 'bg-white'
                              }`}>
                                <div
                                  className="cursor-pointer min-h-[24px]"
                                  onClick={() => setSelectedCell({ row: rowNum, col: 'plannedHours' })}
                                >
                                  {task?.estimatedHours || sheetData[`${rowNum}-plannedHours`] || ''}
                                </div>
                              </td>
                              {/* PLANNED COST */}
                              <td className={`px-4 py-2 border-b border-r border-slate-200 ${
                                isSelected && selectedCell.col === 'plannedCost' ? 'bg-cyan-50 ring-2 ring-cyan-500' : 'bg-white'
                              }`}>
                                <div
                                  className="cursor-pointer min-h-[24px]"
                                  onClick={() => setSelectedCell({ row: rowNum, col: 'plannedCost' })}
                                >
                                  {sheetData[`${rowNum}-plannedCost`] || ''}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard View */}
            {activeView === 'dashboard' && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                {/* Calculate Dashboard Metrics */}
                {(() => {
                  const totalTasks = tasks.length;
                  const completedTasks = tasks.filter(t => t.status === 'completed').length;
                  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
                  const todoTasks = tasks.filter(t => t.status === 'todo').length;
                  const reviewTasks = tasks.filter(t => t.status === 'review').length;
                  
                  const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
                  const totalActualHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
                  
                  const taskProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
                  
                  // Time metrics
                  const today = new Date();
                  const projectStart = project?.startDate ? new Date(project.startDate) : new Date();
                  const projectEnd = project?.endDate ? new Date(project.endDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                  const totalDuration = projectEnd - projectStart;
                  const elapsedDuration = today - projectStart;
                  const timeProgress = totalDuration === 0 ? 0 : Math.max(0, Math.min(100, Math.round((elapsedDuration / totalDuration) * 100)));
                  const timeBehind = Math.max(0, 100 - taskProgress); // Behind = 100% planned - actual completion
                  const isOnTime = taskProgress >= 100;
                  
                  // Cost metrics
                  const estimatedBudget = project?.budget?.estimated || 0;
                  const actualBudget = project?.budget?.actual || 0;
                  const plannedCost = estimatedBudget * 0.8; // Assume planned is 80% of budget
                  const budgetUsage = estimatedBudget === 0 ? 0 : Math.round((actualBudget / estimatedBudget) * 100);
                  const isUnderBudget = actualBudget <= estimatedBudget;
                  const budgetRemaining = Math.max(0, 100 - budgetUsage);
                  
                  // Overdue tasks
                  const overdueTasks = tasks.filter(t => {
                    if (!t.dueDate || t.status === 'completed') return false;
                    return new Date(t.dueDate) < today;
                  }).length;
                  
                  // Workload by member
                  const workloadByMember = {};
                  tasks.forEach(task => {
                    if (task.assignee) {
                      const assigneeId = task.assignee._id || task.assignee;
                      const assigneeName = task.assignee.name || task.assignee.email || 'Unknown';
                      if (!workloadByMember[assigneeId]) {
                        workloadByMember[assigneeId] = {
                          name: assigneeName,
                          completed: 0,
                          remaining: 0,
                          overdue: 0
                        };
                      }
                      if (task.status === 'completed') {
                        workloadByMember[assigneeId].completed++;
                      } else if (task.dueDate && new Date(task.dueDate) < today) {
                        workloadByMember[assigneeId].overdue++;
                      } else {
                        workloadByMember[assigneeId].remaining++;
                      }
                    }
                  });
                  const workloadData = Object.values(workloadByMember);
                  
                  // Progress by phase (using task descriptions or phases if available)
                  // If no phase data, distribute tasks across phases for demo
                  const getPhaseProgress = () => {
                    const phaseTasks = {
                      'Contracts': tasks.filter(t => t.description?.toLowerCase().includes('contract') || t.title?.toLowerCase().includes('contract')),
                      'Design': tasks.filter(t => t.description?.toLowerCase().includes('design') || t.title?.toLowerCase().includes('design')),
                      'Procurement': tasks.filter(t => t.description?.toLowerCase().includes('procurement') || t.title?.toLowerCase().includes('procurement')),
                      'Construction': tasks.filter(t => t.description?.toLowerCase().includes('construction') || t.title?.toLowerCase().includes('construction')),
                    };
                    
                    // If we have phase-specific tasks, use them
                    const hasPhaseData = Object.values(phaseTasks).some(phase => phase.length > 0);
                    
                    if (hasPhaseData) {
                      return {
                        'Contracts': phaseTasks['Contracts'].length > 0 ? Math.round((phaseTasks['Contracts'].filter(t => t.status === 'completed').length / phaseTasks['Contracts'].length) * 100) : 0,
                        'Design': phaseTasks['Design'].length > 0 ? Math.round((phaseTasks['Design'].filter(t => t.status === 'completed').length / phaseTasks['Design'].length) * 100) : 0,
                        'Procurement': phaseTasks['Procurement'].length > 0 ? Math.round((phaseTasks['Procurement'].filter(t => t.status === 'completed').length / phaseTasks['Procurement'].length) * 100) : 0,
                        'Construction': phaseTasks['Construction'].length > 0 ? Math.round((phaseTasks['Construction'].filter(t => t.status === 'completed').length / phaseTasks['Construction'].length) * 100) : 0,
                        'Post Construct...': 0,
                        'Project Closin...': 0,
                        'Make reports': 0,
                      };
                    } else {
                      // Default progress distribution for demo
                      return {
                        'Contracts': 87,
                        'Design': 67,
                        'Procurement': 19,
                        'Construction': 85,
                        'Post Construct...': 0,
                        'Project Closin...': 0,
                        'Make reports': 0,
                      };
                    }
                  };
                  
                  const phaseProgress = getPhaseProgress();

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Health Panel */}
                      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Maximize">
                            ⛶
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Settings">
                            ⚙️
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Help">
                            ❓
                          </button>
                        </div>
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Health</h3>
                            <button className="text-slate-400 hover:text-slate-600">❓</button>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Time:</span>
                              <span className={`font-semibold ${timeBehind > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                {timeBehind > 0 ? `${timeBehind}% behind schedule` : 'On schedule'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Tasks:</span>
                              <span className="font-semibold text-slate-900">{todoTasks + inProgressTasks} tasks to be completed</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Workload:</span>
                              <span className="font-semibold text-orange-600">{overdueTasks} tasks overdue</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Progress:</span>
                              <span className="font-semibold text-slate-900">{taskProgress}% complete</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Cost:</span>
                              <span className={`font-semibold ${isUnderBudget ? 'text-green-600' : 'text-red-600'}`}>
                                {budgetRemaining}% {isUnderBudget ? 'under budget' : 'over budget'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tasks Panel - Donut Chart */}
                      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Maximize">
                            ⛶
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Settings">
                            ⚙️
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Help">
                            ❓
                          </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Tasks</h3>
                        <div className="flex items-center justify-center">
                          <div className="relative w-48 h-48">
                            <svg viewBox="0 0 120 120" className="transform -rotate-90">
                              {/* Donut chart segments */}
                              {(() => {
                                const centerX = 60;
                                const centerY = 60;
                                const radius = 45;
                                let currentAngle = 0;
                                
                                const segments = [
                                  { count: todoTasks, color: '#ec4899', label: 'Not Started' },
                                  { count: completedTasks, color: '#10b981', label: 'Complete' },
                                  { count: inProgressTasks, color: '#14b8a6', label: 'In Progress' }
                                ].filter(s => s.count > 0);
                                
                                const total = segments.reduce((sum, s) => sum + s.count, 0) || 1;
                                
                                return segments.map((segment, idx) => {
                                  const percentage = (segment.count / total) * 100;
                                  const angle = (percentage / 100) * 360;
                                  const startAngle = currentAngle;
                                  const endAngle = currentAngle + angle;
                                  currentAngle += angle;
                                  
                                  const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                                  const endAngleRad = (endAngle - 90) * (Math.PI / 180);
                                  
                                  const x1 = centerX + radius * Math.cos(startAngleRad);
                                  const y1 = centerY + radius * Math.sin(startAngleRad);
                                  const x2 = centerX + radius * Math.cos(endAngleRad);
                                  const y2 = centerY + radius * Math.sin(endAngleRad);
                                  
                                  const largeArcFlag = angle > 180 ? 1 : 0;
                                  
                                  const pathData = [
                                    `M ${centerX} ${centerY}`,
                                    `L ${x1} ${y1}`,
                                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                    'Z'
                                  ].join(' ');
                                  
                                  return (
                                    <path
                                      key={idx}
                                      d={pathData}
                                      fill={segment.color}
                                      className="transition-all"
                                    />
                                  );
                                });
                              })()}
                              {/* Inner circle for donut effect */}
                              <circle cx="60" cy="60" r="30" fill="white" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900">{totalTasks}</div>
                                <div className="text-xs text-slate-500">Total</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                              <span className="text-slate-600">Not Started ({todoTasks})</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <span className="text-slate-600">Complete ({completedTasks})</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                              <span className="text-slate-600">In Progress ({inProgressTasks})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Panel - Horizontal Bar Chart */}
                      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Maximize">
                            ⛶
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Settings">
                            ⚙️
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Help">
                            ❓
                          </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Progress</h3>
                        <div className="space-y-3">
                          {Object.entries(phaseProgress).map(([phase, progress]) => (
                            <div key={phase}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-slate-600">{phase}</span>
                                <span className="text-sm font-semibold text-slate-900">{progress}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-4">
                                <div
                                  className={`h-4 rounded-full transition-all ${
                                    progress >= 80 ? 'bg-green-500' :
                                    progress >= 50 ? 'bg-teal-500' :
                                    'bg-pink-500'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          ))}
                          {Object.keys(phaseProgress).length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                              <p className="text-sm">No phase data available</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Time Panel - Horizontal Bar Chart */}
                      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Maximize">
                            ⛶
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Settings">
                            ⚙️
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Help">
                            ❓
                          </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Time</h3>
                        <div className="mb-4 flex gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-500"></div>
                            <span>Ahead</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-pink-500"></div>
                            <span>Behind</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500"></div>
                            <span>On Time</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-slate-600">Planned Completion</span>
                              <span className="text-sm font-semibold text-slate-900">100%</span>
                            </div>
                            <div className="relative w-full bg-slate-200 rounded-full h-6">
                              <div className="absolute left-0 top-0 w-full h-6 bg-blue-500 rounded-full"></div>
                              <div className="absolute right-0 top-0 flex items-center justify-center h-6 px-2 text-white text-xs font-semibold">
                                100
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-slate-600">Actual Completion</span>
                              <span className="text-sm font-semibold text-slate-900">{taskProgress}%</span>
                            </div>
                            <div className="relative w-full bg-slate-200 rounded-full h-6">
                              <div className="absolute left-0 top-0 h-6 bg-blue-500 rounded-full" style={{ width: `${taskProgress}%` }}></div>
                              <div className="absolute left-0 top-0 flex items-center justify-center h-6 px-2 text-white text-xs font-semibold" style={{ width: `${taskProgress}%` }}>
                                {taskProgress}
                              </div>
                            </div>
                          </div>
                          {timeBehind > 0 && (
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-slate-600">Behind</span>
                                <span className="text-sm font-semibold text-orange-600">{timeBehind}%</span>
                              </div>
                              <div className="relative w-full bg-slate-200 rounded-full h-6">
                                <div className="absolute right-0 top-0 h-6 bg-pink-500 rounded-full" style={{ width: `${timeBehind}%` }}></div>
                                <div className="absolute right-0 top-0 flex items-center justify-center h-6 px-2 text-white text-xs font-semibold" style={{ width: `${timeBehind}%` }}>
                                  {timeBehind}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cost Panel - Vertical Bar Chart */}
                      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Maximize">
                            ⛶
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Settings">
                            ⚙️
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Help">
                            ❓
                          </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Cost</h3>
                        <div className="mb-4 flex gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-slate-500"></div>
                            <span>Actual</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-300"></div>
                            <span>Planned</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-600"></div>
                            <span>Budget</span>
                          </div>
                        </div>
                        <div className="flex items-end justify-center gap-4 h-48">
                          <div className="flex flex-col items-center">
                            <div className="w-12 bg-slate-500 rounded-t mb-2" style={{ height: `${Math.min(100, (actualBudget / Math.max(estimatedBudget, 1)) * 100)}%` }}></div>
                            <span className="text-xs text-slate-600">Actual</span>
                            <span className="text-xs font-semibold text-slate-900">${(actualBudget / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-12 bg-blue-300 rounded-t mb-2" style={{ height: `${Math.min(100, (plannedCost / Math.max(estimatedBudget, 1)) * 100)}%` }}></div>
                            <span className="text-xs text-slate-600">Planned</span>
                            <span className="text-xs font-semibold text-slate-900">${(plannedCost / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-12 bg-blue-600 rounded-t mb-2" style={{ height: `${Math.min(100, (estimatedBudget / Math.max(estimatedBudget, 1)) * 100)}%` }}></div>
                            <span className="text-xs text-slate-600">Budget</span>
                            <span className="text-xs font-semibold text-slate-900">${(estimatedBudget / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                        <div className="mt-2 text-center text-xs text-slate-500">Cost in thousands (K)</div>
                      </div>

                      {/* Workload Panel - Horizontal Stacked Bar Chart */}
                      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Maximize">
                            ⛶
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Settings">
                            ⚙️
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Help">
                            ❓
                          </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Workload</h3>
                        <div className="mb-4 flex gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500"></div>
                            <span>Completed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-teal-500"></div>
                            <span>Remaining</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-orange-500"></div>
                            <span>Overdue</span>
                          </div>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {workloadData.length > 0 ? (
                            workloadData.map((member, idx) => {
                              const total = member.completed + member.remaining + member.overdue;
                              const maxTasks = Math.max(...workloadData.map(m => m.completed + m.remaining + m.overdue), 1);
                              const barWidth = (total / maxTasks) * 100;
                              
                              return (
                                <div key={idx} className="space-y-1">
                                  <div className="text-sm text-slate-600 font-medium">{member.name}</div>
                                  <div className="relative w-full h-6 bg-slate-200 rounded overflow-hidden">
                                    {/* Completed (Green) */}
                                    {member.completed > 0 && (
                                      <div
                                        className="absolute left-0 top-0 h-6 bg-green-500"
                                        style={{ width: `${(member.completed / total) * barWidth}%` }}
                                      />
                                    )}
                                    {/* Remaining (Teal) */}
                                    {member.remaining > 0 && (
                                      <div
                                        className="absolute left-0 top-0 h-6 bg-teal-500"
                                        style={{ 
                                          left: `${(member.completed / total) * barWidth}%`,
                                          width: `${(member.remaining / total) * barWidth}%` 
                                        }}
                                      />
                                    )}
                                    {/* Overdue (Orange) */}
                                    {member.overdue > 0 && (
                                      <div
                                        className="absolute left-0 top-0 h-6 bg-orange-500"
                                        style={{ 
                                          left: `${((member.completed + member.remaining) / total) * barWidth}%`,
                                          width: `${(member.overdue / total) * barWidth}%` 
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            // Show project members if no task assignments
                            project?.members?.slice(0, 9).map((member, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="text-sm text-slate-600 font-medium">
                                  {member.user?.name || member.user?.email || 'Member'}
                                </div>
                                <div className="relative w-full h-6 bg-slate-200 rounded">
                                  <div className="absolute left-0 top-0 h-6 bg-orange-500 rounded" style={{ width: '60%' }}></div>
                                </div>
                              </div>
                            )) || (
                              <div className="text-center py-8 text-slate-500">
                                <p className="text-sm">No workload data available</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Calendar View */}
            {activeView === 'calendar' && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                {/* Calendar Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        const newDate = new Date(calendarDate);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setCalendarDate(newDate);
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                      title="Previous Month"
                    >
                      ←
                    </button>
                    <select
                      value={calendarDate.getMonth()}
                      onChange={(e) => {
                        const newDate = new Date(calendarDate);
                        newDate.setMonth(parseInt(e.target.value));
                        setCalendarDate(newDate);
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, idx) => (
                        <option key={idx} value={idx}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={calendarDate.getFullYear()}
                      onChange={(e) => {
                        const newDate = new Date(calendarDate);
                        newDate.setFullYear(parseInt(e.target.value));
                        setCalendarDate(newDate);
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const newDate = new Date(calendarDate);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setCalendarDate(newDate);
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                      title="Next Month"
                    >
                      →
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Sync">
                      📡
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" title="Settings">
                      ⚙️
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    {/* Day Headers */}
                    <thead>
                      <tr>
                        {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => (
                          <th
                            key={day}
                            className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200 bg-slate-50"
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const year = calendarDate.getFullYear();
                        const month = calendarDate.getMonth();
                        const firstDay = new Date(year, month, 1);
                        const lastDay = new Date(year, month + 1, 0);
                        const startDate = new Date(firstDay);
                        // Get Monday of the week containing the first day
                        const dayOfWeek = firstDay.getDay();
                        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                        startDate.setDate(firstDay.getDate() + mondayOffset);
                        
                        const weeks = [];
                        let currentDate = new Date(startDate);
                        
                        // Generate 6 weeks of calendar
                        for (let week = 0; week < 6; week++) {
                          const weekDays = [];
                          for (let day = 0; day < 7; day++) {
                            weekDays.push(new Date(currentDate));
                            currentDate.setDate(currentDate.getDate() + 1);
                          }
                          weeks.push(weekDays);
                        }
                        
                        // Group tasks by date
                        const tasksByDate = {};
                        tasks.forEach(task => {
                          if (task.dueDate) {
                            const taskDate = new Date(task.dueDate);
                            const dateKey = `${taskDate.getFullYear()}-${taskDate.getMonth()}-${taskDate.getDate()}`;
                            if (!tasksByDate[dateKey]) {
                              tasksByDate[dateKey] = [];
                            }
                            tasksByDate[dateKey].push(task);
                          }
                        });
                        
                        // Calculate task spans (start and end dates)
                        const taskSpans = tasks.map(task => {
                          let startDate, endDate, duration;
                          
                          if (task.startDate && task.endDate) {
                            // Both dates exist - use them and calculate duration
                            startDate = new Date(task.startDate);
                            endDate = new Date(task.endDate);
                            duration = calculateDuration(task.startDate, task.endDate);
                          } else if (task.startDate) {
                            // Only start date exists
                            startDate = new Date(task.startDate);
                            duration = task.estimatedHours ? Math.ceil(task.estimatedHours / 8) : 1;
                            endDate = new Date(startDate);
                            endDate.setDate(endDate.getDate() + duration - 1);
                          } else if (task.endDate) {
                            // Only end date exists
                            endDate = new Date(task.endDate);
                            duration = task.estimatedHours ? Math.ceil(task.estimatedHours / 8) : 1;
                            startDate = new Date(endDate);
                            startDate.setDate(startDate.getDate() - (duration - 1));
                          } else if (task.dueDate) {
                            // Use dueDate as fallback
                            startDate = new Date(task.dueDate);
                            duration = task.estimatedHours ? Math.ceil(task.estimatedHours / 8) : 1;
                            endDate = new Date(startDate);
                            endDate.setDate(endDate.getDate() + duration - 1);
                          } else {
                            return null; // No dates available
                          }
                          
                          startDate.setHours(0, 0, 0, 0);
                          endDate.setHours(23, 59, 59, 999);
                          return {
                            task,
                            startDate,
                            endDate,
                            duration
                          };
                        }).filter(span => span !== null);
                        
                        // Get status color
                        const getTaskColor = (status) => {
                          const colors = {
                            'todo': '#93c5fd', // light blue
                            'in-progress': '#14b8a6', // teal
                            'review': '#f472b6', // pink
                            'completed': '#9ca3af', // gray
                          };
                          return colors[status] || '#93c5fd';
                        };
                        
                        return weeks.map((week, weekIdx) => {
                          // Calculate row height based on max tasks in this week
                          const weekTasks = [];
                          week.forEach(date => {
                            const dayTasks = taskSpans.filter(span => {
                              const dateStart = new Date(date);
                              dateStart.setHours(0, 0, 0, 0);
                              const dateEnd = new Date(date);
                              dateEnd.setHours(23, 59, 59, 999);
                              return span.startDate <= dateEnd && span.endDate >= dateStart;
                            });
                            weekTasks.push(...dayTasks);
                          });
                          const uniqueTasks = [...new Set(weekTasks.map(t => t.task._id))];
                          const rowHeight = Math.max(120, uniqueTasks.length * 30 + 40);
                          
                          return (
                            <tr key={weekIdx} className="border-b border-slate-100">
                              {week.map((date, dayIdx) => {
                                const isCurrentMonth = date.getMonth() === month;
                                const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                                const isToday = date.toDateString() === new Date().toDateString();
                                
                                // Find tasks that span this date
                                const dateStart = new Date(date);
                                dateStart.setHours(0, 0, 0, 0);
                                const dateEnd = new Date(date);
                                dateEnd.setHours(23, 59, 59, 999);
                                
                                const dayTasks = taskSpans.filter(span => {
                                  return span.startDate <= dateEnd && span.endDate >= dateStart;
                                }).map(span => {
                                  const isStart = span.startDate <= dateStart && span.endDate >= dateStart;
                                  const isEnd = span.endDate >= dateEnd && span.startDate <= dateEnd;
                                  const isMiddle = !isStart && !isEnd;
                                  return { ...span, isStart, isEnd, isMiddle };
                                });
                                
                                // Sort tasks by start date for consistent stacking
                                dayTasks.sort((a, b) => a.startDate - b.startDate);
                                
                                return (
                                  <td
                                    key={dayIdx}
                                    className={`px-2 py-3 align-top border-r border-slate-100 relative ${
                                      isCurrentMonth ? 'bg-white' : 'bg-slate-50'
                                    } ${isToday ? 'ring-2 ring-cyan-500' : ''}`}
                                    style={{ minWidth: '120px', height: `${rowHeight}px` }}
                                  >
                                    <div className={`text-sm font-semibold mb-2 ${
                                      isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                                    } ${isToday ? 'text-cyan-600' : ''}`}>
                                      {date.getDate()}
                                    </div>
                                    <div className="space-y-1 absolute top-12 left-2 right-2">
                                      {dayTasks.map((span, taskIdx) => {
                                        const taskColor = getTaskColor(span.task.status);
                                        const isStart = span.isStart;
                                        const isEnd = span.isEnd;
                                        
                                        return (
                                          <div
                                            key={`${span.task._id}-${dateKey}-${taskIdx}`}
                                            className={`text-xs px-2 py-1 text-white font-medium truncate ${
                                              isStart ? 'rounded-l' : ''
                                            } ${isEnd ? 'rounded-r' : ''} ${!isStart && !isEnd ? 'rounded-none' : ''}`}
                                            style={{
                                              backgroundColor: taskColor,
                                              width: '100%',
                                              marginTop: `${taskIdx * 24}px`
                                            }}
                                            title={`${span.task.title} (${span.duration} day${span.duration !== 1 ? 's' : ''})`}
                                          >
                                            {isStart && span.task.title}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Files View */}
            {activeView === 'files' && (
              <div className="flex gap-6 h-full">
                {/* Left Sidebar - File Navigation */}
                <div className="w-64 bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedFolder('all')}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (draggedFileId) {
                          e.dataTransfer.dropEffect = 'move';
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (draggedFileId) {
                          setFiles(files.map(f => 
                            f.id === draggedFileId ? { ...f, folderId: null } : f
                          ));
                          setDraggedFileId(null);
                        }
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedFolder === 'all'
                          ? 'bg-white text-slate-900 font-semibold shadow-sm'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      } ${draggedFileId ? 'border-2 border-dashed border-cyan-500' : ''}`}
                    >
                      All Files
                    </button>
                    <button
                      onClick={() => setSelectedFolder('trash')}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (draggedFileId) {
                          e.dataTransfer.dropEffect = 'move';
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (draggedFileId) {
                          setFiles(files.map(f => 
                            f.id === draggedFileId ? { ...f, deleted: true, folderId: null } : f
                          ));
                          setDraggedFileId(null);
                        }
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedFolder === 'trash'
                          ? 'bg-white text-slate-900 font-semibold shadow-sm'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      } ${draggedFileId ? 'border-2 border-dashed border-red-500' : ''}`}
                    >
                      🗑️ Trash Can
                    </button>
                    <div className="pt-2 border-t border-slate-200">
                      {folders.map((folder) => (
                        <button
                          key={folder.id}
                          onClick={() => setSelectedFolder(folder.id)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (draggedFileId) {
                              e.dataTransfer.dropEffect = 'move';
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (draggedFileId) {
                              setFiles(files.map(f => 
                                f.id === draggedFileId ? { ...f, folderId: folder.id } : f
                              ));
                              setDraggedFileId(null);
                            }
                          }}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors mb-1 ${
                            selectedFolder === folder.id
                              ? 'bg-white text-slate-900 font-semibold shadow-sm'
                              : 'text-slate-600 hover:bg-white hover:text-slate-900'
                          } ${draggedFileId ? 'border-2 border-dashed border-cyan-500' : ''}`}
                        >
                          📁 {folder.name}
                        </button>
                      ))}
                      {showNewFolderInput ? (
                        <div className="px-4 py-2">
                          <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newFolderName.trim()) {
                                const newFolder = {
                                  id: `folder-${Date.now()}`,
                                  name: newFolderName.trim()
                                };
                                setFolders([...folders, newFolder]);
                                setNewFolderName('');
                                setShowNewFolderInput(false);
                              } else if (e.key === 'Escape') {
                                setShowNewFolderInput(false);
                                setNewFolderName('');
                              }
                            }}
                            placeholder="Folder name"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowNewFolderInput(true)}
                          className="w-full text-left px-4 py-2 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors flex items-center gap-2"
                        >
                          <span>+</span> New Folder
                        </button>
                      )}
                    </div>
                    <div className="pt-2 text-center text-slate-400 text-xs">⋯</div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  {/* Toolbar */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.onchange = (e) => {
                          const selectedFiles = Array.from(e.target.files);
                          const newFiles = selectedFiles.map((file, idx) => ({
                            id: `file-${Date.now()}-${idx}`,
                            name: file.name,
                            type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
                            size: file.size < 1024 ? `${file.size} B` : file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(2)} KB` : `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                            date: new Date().toLocaleDateString(),
                            addedBy: currentUser?.name || currentUser?.email || 'You',
                            taskLink: '-',
                            folderId: selectedFolder === 'all' ? null : selectedFolder,
                            deleted: false
                          }));
                          setFiles([...files, ...newFiles]);
                        };
                        input.click();
                      }}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                    >
                      Add File
                    </button>
                    <div className="relative">
                      <input
                        type="text"
                        value={fileSearchTerm}
                        onChange={(e) => setFileSearchTerm(e.target.value)}
                        placeholder="Search files"
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 w-64"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
                    </div>
                  </div>

                  {/* File List Headers */}
                  <div className="grid grid-cols-7 gap-4 px-4 py-3 bg-slate-50 rounded-lg mb-4 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                    <div>NAME</div>
                    <div>TASK LINK</div>
                    <div>TYPE</div>
                    <div>DATE</div>
                    <div>ADDED BY</div>
                    <div>SIZE</div>
                    <div>ACTIONS</div>
                  </div>

                  {/* File List or Empty State */}
                  {files.filter(file => {
                    if (fileSearchTerm) {
                      return file.name.toLowerCase().includes(fileSearchTerm.toLowerCase());
                    }
                    if (selectedFolder === 'trash') {
                      return file.deleted;
                    }
                    if (selectedFolder === 'all') {
                      return !file.deleted;
                    }
                    return file.folderId === selectedFolder && !file.deleted;
                  }).length === 0 ? (
                    <div
                      className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const droppedFiles = Array.from(e.dataTransfer.files);
                        const newFiles = droppedFiles.map((file, idx) => ({
                          id: `file-${Date.now()}-${idx}`,
                          name: file.name,
                          type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
                          size: file.size < 1024 ? `${file.size} B` : file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(2)} KB` : `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                          date: new Date().toLocaleDateString(),
                          addedBy: currentUser?.name || currentUser?.email || 'You',
                          taskLink: '-',
                          folderId: selectedFolder === 'all' ? null : selectedFolder
                        }));
                        setFiles([...files, ...newFiles]);
                      }}
                    >
                      <div className="text-6xl mb-4">📄+</div>
                      <p className="text-slate-600 mb-6 text-lg">Drag and drop or click below to add files</p>
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.multiple = true;
                          input.onchange = (e) => {
                            const selectedFiles = Array.from(e.target.files);
                            const newFiles = selectedFiles.map((file, idx) => ({
                              id: `file-${Date.now()}-${idx}`,
                              name: file.name,
                              type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
                              size: file.size < 1024 ? `${file.size} B` : file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(2)} KB` : `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                              date: new Date().toLocaleDateString(),
                              addedBy: currentUser?.name || currentUser?.email || 'You',
                              taskLink: '-',
                              folderId: selectedFolder === 'all' ? null : selectedFolder
                            }));
                            setFiles([...files, ...newFiles]);
                          };
                          input.click();
                        }}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                      >
                        Add File
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {files
                        .filter(file => {
                          if (fileSearchTerm) {
                            return file.name.toLowerCase().includes(fileSearchTerm.toLowerCase());
                          }
                          if (selectedFolder === 'trash') {
                            return file.deleted;
                          }
                          if (selectedFolder === 'all') {
                            return !file.deleted;
                          }
                          return file.folderId === selectedFolder && !file.deleted;
                        })
                        .map((file) => (
                          <div
                            key={file.id}
                            draggable
                            onDragStart={(e) => {
                              setDraggedFileId(file.id);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragEnd={() => {
                              setDraggedFileId(null);
                            }}
                            className={`grid grid-cols-7 gap-4 px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors items-center text-sm relative cursor-move ${
                              draggedFileId === file.id ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📄</span>
                              {editingFileId === file.id ? (
                                <input
                                  type="text"
                                  value={editingFileName}
                                  onChange={(e) => setEditingFileName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && editingFileName.trim()) {
                                      setFiles(files.map(f => 
                                        f.id === file.id ? { ...f, name: editingFileName.trim() } : f
                                      ));
                                      setEditingFileId(null);
                                      setEditingFileName('');
                                    } else if (e.key === 'Escape') {
                                      setEditingFileId(null);
                                      setEditingFileName('');
                                    }
                                  }}
                                  onBlur={() => {
                                    if (editingFileName.trim()) {
                                      setFiles(files.map(f => 
                                        f.id === file.id ? { ...f, name: editingFileName.trim() } : f
                                      ));
                                    }
                                    setEditingFileId(null);
                                    setEditingFileName('');
                                  }}
                                  className="px-2 py-1 border border-slate-300 rounded text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  autoFocus
                                />
                              ) : (
                                <span 
                                  className="text-slate-900 font-medium cursor-pointer hover:text-cyan-600"
                                  onDoubleClick={() => {
                                    setEditingFileId(file.id);
                                    setEditingFileName(file.name);
                                  }}
                                  title="Double-click to edit"
                                >
                                  {file.name}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-600">{file.taskLink}</div>
                            <div className="text-slate-600">{file.type}</div>
                            <div className="text-slate-600">{file.date}</div>
                            <div className="text-slate-600">{file.addedBy}</div>
                            <div className="text-slate-600">{file.size}</div>
                            <div className="relative file-menu-container">
                              <button
                                onClick={() => setShowFileMenu(showFileMenu === file.id ? null : file.id)}
                                className="p-1 hover:bg-slate-200 rounded transition-colors"
                                title="Actions"
                              >
                                ⋯
                              </button>
                              {showFileMenu === file.id && (
                                <div className="absolute right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-48">
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        setEditingFileId(file.id);
                                        setEditingFileName(file.name);
                                        setShowFileMenu(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                    >
                                      ✏️ Rename
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Share functionality - could open a modal or copy link
                                        const shareUrl = `${window.location.origin}/projects/${id}/files/${file.id}`;
                                        if (navigator.share) {
                                          navigator.share({
                                            title: file.name,
                                            text: `Check out this file: ${file.name}`,
                                            url: shareUrl
                                          }).catch(() => {
                                            navigator.clipboard.writeText(shareUrl);
                                            alert('Share link copied to clipboard!');
                                          });
                                        } else {
                                          navigator.clipboard.writeText(shareUrl);
                                          alert('Share link copied to clipboard!');
                                        }
                                        setShowFileMenu(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                    >
                                      🔗 Share
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Download functionality - create a download link
                                        // Since we're storing files in state, we'll simulate download
                                        const blob = new Blob([''], { type: 'application/octet-stream' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = file.name;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                        setShowFileMenu(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                    >
                                      ⬇️ Download
                                    </button>
                                    <div className="border-t border-slate-200 my-1"></div>
                                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Move</div>
                                    <button
                                      onClick={() => {
                                        setFiles(files.map(f => 
                                          f.id === file.id ? { ...f, folderId: null } : f
                                        ));
                                        setShowFileMenu(null);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                    >
                                      📁 All Files
                                    </button>
                                    {folders.map(folder => (
                                      <button
                                        key={folder.id}
                                        onClick={() => {
                                          setFiles(files.map(f => 
                                            f.id === file.id ? { ...f, folderId: folder.id } : f
                                          ));
                                          setShowFileMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                      >
                                        📁 {folder.name}
                                      </button>
                                    ))}
                                    <div className="border-t border-slate-200 my-1"></div>
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
                                          if (selectedFolder === 'trash') {
                                            // Permanent delete
                                            setFiles(files.filter(f => f.id !== file.id));
                                          } else {
                                            // Move to trash
                                            setFiles(files.map(f => 
                                              f.id === file.id ? { ...f, deleted: true, folderId: null } : f
                                            ));
                                          }
                                          setShowFileMenu(null);
                                        }
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      {selectedFolder === 'trash' ? '🗑️ Delete Permanently' : '🗑️ Move to Trash'}
                                    </button>
                                    {selectedFolder === 'trash' && (
                                      <button
                                        onClick={() => {
                                          setFiles(files.map(f => 
                                            f.id === file.id ? { ...f, deleted: false } : f
                                          ));
                                          setShowFileMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                      >
                                        ↶ Restore
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other Tabs - Keep existing functionality */}
            {activeTab !== 'overview' && (
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
                {activeTab === 'goals' && <GoalManager projectId={id} />}
                {activeTab === 'scope' && <ScopeManager projectId={id} />}
                {activeTab === 'timeline' && (
                  <GanttChart 
                    tasks={tasks} 
                    startDate={project?.startDate || new Date()} 
                    endDate={project?.endDate || new Date(Date.now() + 30*24*60*60*1000)} 
                  />
                )}
                {activeTab === 'progress' && <OverallProgressChart projectId={id} />}
                {activeTab === 'resources' && <ResourceManager projectId={id} />}
                {activeTab === 'collaboration' && <Collaboration projectId={id} />}
              </div>
            )}

            {/* Tab Navigation - Hidden for now, can be shown if needed */}
            {false && (
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === 'overview'
                      ? 'bg-cyan-500 text-white font-semibold shadow-lg'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === 'goals'
                      ? 'bg-cyan-500 text-white font-semibold shadow-lg'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Goals
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === 'timeline'
                      ? 'bg-cyan-500 text-white font-semibold shadow-lg'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Timeline
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Invite Members Modal */}
        <InviteMembersModal
          projectId={id}
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onMemberAdded={() => {
            fetchProjectAndTasks();
            setShowInviteModal(false);
          }}
        />

        {/* Assign People Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Assign People</h2>
                  <p className="text-sm text-slate-500 mt-1">REPORT</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">YESTERDAY - {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}</span>
                  <button className="p-2 hover:bg-slate-100 rounded transition-colors">⛶</button>
                  <button 
                    onClick={() => {
                      setShowAssignModal(false);
                      setAssigningTaskId(null);
                      setTaskAssignments({});
                    }}
                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="p-4 border-b border-slate-200 flex items-center gap-4">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedTeamFilter}
                  onChange={(e) => setSelectedTeamFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Teams</option>
                </select>
                <select
                  value={selectedSkillFilter}
                  onChange={(e) => setSelectedSkillFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Skills</option>
                </select>
              </div>

              {/* Users List */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ASSIGN</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">AVAILABILITY</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">HOURS</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">RATE</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">COST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const assignment = taskAssignments[user._id] || { hours: 0, rate: 0, assigned: false };
                      const availability = 24; // Placeholder
                      const cost = (parseFloat(assignment.hours) || 0) * (parseFloat(assignment.rate) || 0);
                      
                      return (
                        <tr key={user._id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={assignment.assigned || false}
                                onChange={(e) => {
                                  setTaskAssignments({
                                    ...taskAssignments,
                                    [user._id]: {
                                      ...assignment,
                                      assigned: e.target.checked,
                                      rate: assignment.rate || 0
                                    }
                                  });
                                }}
                                className="w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
                              />
                              <span className="text-sm text-slate-900">
                                {user.name || user.email}
                                {user.name && user.email && ` (${user.email})`}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              availability >= 20 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {availability} hours
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              value={assignment.hours || ''}
                              onChange={(e) => {
                                setTaskAssignments({
                                  ...taskAssignments,
                                  [user._id]: {
                                    ...assignment,
                                    hours: e.target.value,
                                    assigned: assignment.assigned || e.target.value > 0
                                  }
                                });
                              }}
                              disabled={!assignment.assigned}
                              className="w-20 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-600">
                              {assignment.rate > 0 ? `$${parseFloat(assignment.rate).toFixed(2)} /hr` : '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-600">
                              {cost > 0 ? `$${cost.toFixed(2)}` : '—'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {calculateTotalHours()} HOURS PLANNED OVER 3 DAYS
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xs text-slate-500">TOTAL</div>
                    <div className="text-lg font-semibold text-slate-900">{calculateTotalHours()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500">COST</div>
                    <div className="text-lg font-semibold text-slate-900">${calculateTotalCost().toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowAssignModal(false);
                        setAssigningTaskId(null);
                        setTaskAssignments({});
                      }}
                      className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      ✕ Cancel
                    </button>
                    <button className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                      👤 Add Person
                    </button>
                    <button
                      onClick={handleAssignUser}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-semibold"
                    >
                      ✓ Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* team chat */}
        <div className="fixed bottom-6 right-6 z-40">
          <button 
            onClick={() => setShowChat(!showChat)}
            className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 relative"
            title={showChat ? "Close chat" : "Open team chat"}
          >
            <span className="text-xl">💬</span>
            {!showChat && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
                +
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Assign People Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Assign People</h2>
                <p className="text-sm text-slate-500 mt-1">REPORT</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">YESTERDAY - {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}</span>
                <button className="p-2 hover:bg-slate-100 rounded transition-colors">⛶</button>
                <button 
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssigningTaskId(null);
                    setTaskAssignments({});
                  }}
                  className="p-2 hover:bg-slate-100 rounded transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-4">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedTeamFilter}
                onChange={(e) => setSelectedTeamFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Teams</option>
                {/* Teams would be populated from project data */}
              </select>
              <select
                value={selectedSkillFilter}
                onChange={(e) => setSelectedSkillFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Skills</option>
                {/* Skills would be populated from user data */}
              </select>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ASSIGN</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">AVAILABILITY</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">HOURS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">RATE</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">COST</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const assignment = taskAssignments[user._id] || { hours: 0, rate: 0, assigned: false };
                    const availability = 24; // Placeholder - would calculate from user's existing assignments
                    const cost = (parseFloat(assignment.hours) || 0) * (parseFloat(assignment.rate) || 0);
                    
                    return (
                      <tr key={user._id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={assignment.assigned || false}
                              onChange={(e) => {
                                setTaskAssignments({
                                  ...taskAssignments,
                                  [user._id]: {
                                    ...assignment,
                                    assigned: e.target.checked,
                                    rate: assignment.rate || 0
                                  }
                                });
                              }}
                              className="w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500"
                            />
                            <span className="text-sm text-slate-900">
                              {user.name || user.email}
                              {user.name && user.email && ` (${user.email})`}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            availability >= 20 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {availability} hours
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            value={assignment.hours || ''}
                            onChange={(e) => {
                              setTaskAssignments({
                                ...taskAssignments,
                                [user._id]: {
                                  ...assignment,
                                  hours: e.target.value,
                                  assigned: assignment.assigned || e.target.value > 0
                                }
                              });
                            }}
                            disabled={!assignment.assigned}
                            className="w-20 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-600">
                            {assignment.rate > 0 ? `$${parseFloat(assignment.rate).toFixed(2)} /hr` : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-600">
                            {cost > 0 ? `$${cost.toFixed(2)}` : '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {calculateTotalHours()} HOURS PLANNED OVER 3 DAYS
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xs text-slate-500">TOTAL</div>
                  <div className="text-lg font-semibold text-slate-900">{calculateTotalHours()}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500">COST</div>
                  <div className="text-lg font-semibold text-slate-900">${calculateTotalCost().toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setAssigningTaskId(null);
                      setTaskAssignments({});
                    }}
                    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    ✕ Cancel
                  </button>
                  <button className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                    👤 Add Person
                  </button>
                  <button
                    onClick={handleAssignUser}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-semibold"
                  >
                    ✓ Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Panel - Right Sidebar */}
      {showCommentsPanel && selectedTaskForComments && (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l border-slate-200 shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-2">
            <button
              onClick={() => {
                setShowCommentsPanel(false);
                setSelectedTaskForComments(null);
              }}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              title="Collapse"
            >
              &gt;&gt;
            </button>
            <h2 className="text-lg font-bold text-slate-900">COMMENTS</h2>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedTaskForComments.comments && selectedTaskForComments.comments.length > 0 ? (
              <div className="space-y-4">
                {selectedTaskForComments.comments.map((comment, idx) => {
                  const commentUser = comment.user || {};
                  const userInitials = getInitials(commentUser.name, commentUser.email);
                  const userEmail = commentUser.email || '';
                  const truncatedEmail = userEmail.length > 20 ? userEmail.substring(0, 20) + '...' : userEmail;
                  
                  return (
                    <div key={idx} className="flex gap-3">
                      {/* User Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
                        userInitials.charAt(0) === 'N' ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-gradient-to-br from-teal-500 to-cyan-500'
                      }`}>
                        {userInitials}
                      </div>
                      
                      {/* Comment Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-900">{truncatedEmail}</span>
                          <span className="text-xs text-slate-500">{formatCommentTime(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{comment.text}</p>
                        
                        {/* Reactions */}
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition-colors">
                            <span>😇</span>
                            <span>1</span>
                          </button>
                          <button className="text-xs text-slate-600 hover:text-slate-900 transition-colors">
                            😊
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No comments yet</p>
                <p className="text-xs mt-1">Be the first to comment</p>
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-slate-200">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              placeholder="Add a comment"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-slate-50"
            />
          </div>
        </div>
      )}

      {/* Chat Panel - Right Sidebar */}
      {showChat && (
        <ChatPanel 
          projectId={id} 
          project={project}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}
