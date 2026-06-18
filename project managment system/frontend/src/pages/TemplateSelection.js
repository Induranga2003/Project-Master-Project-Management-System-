import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

import TopHeader from '../components/TopHeader';

import { tasksAPI } from '../services/api';


const TemplateSelection = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);
  const [showPreview, setShowPreview] = useState(null);

  const templates = [
    {
      id: 'blank',
      name: 'Blank',
      category: 'General',
      description: 'Create your project from scratch with a blank template',
      color: 'gray',
      icon: '+',
      features: ['Custom Structure', 'Flexible Planning', 'Full Control'],
      defaultTasks: [],
      image: '/templates/blank.png',
      isBlank: true
    },
    {
      id: 'it-project-plan',
      name: 'IT Project Plan',
      category: 'IT',
      description: 'Accelerate delivery with your next IT project with pre-defined phases for planning, and dependencies between tasks, so you can get up and running in no time.',
      color: 'blue',
      icon: '💻',
      features: ['Gantt Charts', 'Phase Planning', 'Task Dependencies', 'Resource Allocation'],
      defaultTasks: [
        // Phase 1: Analysis
        { name: '1. Analysis', duration: 20, priority: 'high', phase: 'Analysis' },
        { name: 'On-Site Meetings', duration: 4, priority: 'high', phase: 'Analysis' },
        { name: 'Discussions with Stakeholders', duration: 3, priority: 'high', phase: 'Analysis' },
        { name: 'Stakeholder Requirements', duration: 1, priority: 'high', phase: 'Analysis' },
        { name: 'Customer Requirements', duration: 1, priority: 'high', phase: 'Analysis' },
        { name: 'Document Current Systems', duration: 8, priority: 'medium', phase: 'Analysis' },
        { name: 'Analysis Complete', duration: 2, priority: 'high', phase: 'Analysis' },
        // Phase 2: Design
        { name: '2. Design', duration: 17, priority: 'high', phase: 'Design' },
        { name: 'Design Database', duration: 5, priority: 'high', phase: 'Design' },
        { name: 'Software Design', duration: 6, priority: 'high', phase: 'Design' },
        { name: 'Interface Design', duration: 4, priority: 'medium', phase: 'Design' },
        { name: 'Create Design Documents', duration: 2, priority: 'medium', phase: 'Design' },
        // Phase 3: Development
        { name: '3. Development', duration: 23, priority: 'high', phase: 'Development' },
        { name: 'Deploy Development Environment', duration: 3, priority: 'high', phase: 'Development' },
        { name: 'Backend Development', duration: 10, priority: 'high', phase: 'Development' },
        { name: 'Frontend Development', duration: 8, priority: 'high', phase: 'Development' },
        { name: 'Integration', duration: 2, priority: 'high', phase: 'Development' },
        // Phase 4: Testing
        { name: '4. Testing', duration: 21, priority: 'high', phase: 'Testing' },
        { name: 'Unit Testing', duration: 5, priority: 'high', phase: 'Testing' },
        { name: 'Integration Testing', duration: 6, priority: 'high', phase: 'Testing' },
        { name: 'System Testing', duration: 5, priority: 'medium', phase: 'Testing' },
        { name: 'User Acceptance Testing', duration: 5, priority: 'high', phase: 'Testing' }
      ],
      image: '/templates/it-project.png'
    },
    {
      id: 'new-product-development',
      name: 'New Product Development',
      category: 'Manufacturing',
      description: 'Manage your new product development, from idea generation through product design, using this plan.',
      color: 'green',
      icon: '🚀',
      features: ['Kanban Board', 'Phase Management', 'Stakeholder Feedback', 'Quality Control'],
      defaultTasks: [
        // Ideation Phase
        { name: 'Ideation', duration: 5, priority: 'high', phase: 'Ideation', status: 'completed' },
        { name: 'Market Research', duration: 5, priority: 'high', phase: 'Ideation', status: 'completed' },
        { name: 'Feasibility Analysis', duration: 3, priority: 'high', phase: 'Ideation', status: 'completed' },
        { name: 'Product Requirements', duration: 2, priority: 'high', phase: 'Ideation', status: 'completed' },
        { name: 'Stakeholder Feedback', duration: 2, priority: 'medium', phase: 'Ideation', status: 'completed' },
        // Design Phase
        { name: '3D Rendering', duration: 7, priority: 'high', phase: 'Design', status: 'completed' },
        { name: 'Engineering Drawings', duration: 5, priority: 'high', phase: 'Design', status: 'completed' },
        { name: '3D Printed Prototype', duration: 4, priority: 'high', phase: 'Design', status: 'in-progress' },
        { name: 'Design', duration: 10, priority: 'high', phase: 'Design', status: 'todo' },
        // Prototyping Phase
        { name: 'Durability & Stress Testing', duration: 5, priority: 'high', phase: 'Prototyping', status: 'in-progress' },
        { name: 'CNC Part Creation', duration: 3, priority: 'high', phase: 'Prototyping', status: 'todo' },
        { name: 'Product Assembly', duration: 2, priority: 'high', phase: 'Prototyping', status: 'todo' },
        { name: 'Prototyping', duration: 8, priority: 'high', phase: 'Prototyping', status: 'todo' },
        // Pre-production Phase
        { name: 'New Production Equipment', duration: 7, priority: 'high', phase: 'Pre-production', status: 'todo' },
        { name: 'Supply Chain Sourcing', duration: 5, priority: 'high', phase: 'Pre-production', status: 'todo' },
        { name: 'Pre-production', duration: 14, priority: 'high', phase: 'Pre-production', status: 'todo' }
      ],
      image: '/templates/product-development.png'
    },
    {
      id: 'construction',
      name: 'Construction Schedule',
      category: 'Construction',
      description: 'Manage your next construction project with ease and keep track of all the phases of the build. Just invite your team, add tasks and start digging.',
      color: 'cyan',
      icon: '🏗️',
      features: ['Gantt Charts', 'Resource Planning', 'Budget Tracking', 'Milestone Management'],
      defaultTasks: [
        { name: 'Site Preparation', duration: 7, priority: 'high' },
        { name: 'Foundation Work', duration: 14, priority: 'high' },
        { name: 'Structural Framework', duration: 21, priority: 'high' },
        { name: 'Electrical & Plumbing', duration: 14, priority: 'medium' },
        { name: 'Interior Finishing', duration: 21, priority: 'medium' },
        { name: 'Final Inspection', duration: 3, priority: 'high' }
      ],
      image: '/templates/construction.png'
    },
    {
      id: 'punch-list',
      name: 'Punch List',
      category: 'Construction',
      description: 'A project isn\'t complete until all the work is done. But what do you do when there are straggler tasks that fall outside of the boundaries of the contract? Track and manage them efficiently.',
      color: 'blue',
      icon: '📋',
      features: ['Task Tracking', 'Completion Checklists', 'Status Updates', 'Team Collaboration'],
      defaultTasks: [
        { name: 'Review Contract Items', duration: 2, priority: 'high' },
        { name: 'Document Issues', duration: 3, priority: 'medium' },
        { name: 'Assign Responsibilities', duration: 1, priority: 'high' },
        { name: 'Track Corrections', duration: 7, priority: 'medium' },
        { name: 'Final Walkthrough', duration: 1, priority: 'high' }
      ],
      image: '/templates/punch-list.png'
    },
    {
      id: 'software-dev',
      name: 'Software Development',
      category: 'Software',
      description: 'Plan sprints, track bugs, manage releases and collaborate with your development team. Perfect for agile teams using Scrum or Kanban methodologies.',
      color: 'purple',
      icon: '💻',
      features: ['Sprint Planning', 'Bug Tracking', 'Code Reviews', 'CI/CD Integration'],
      defaultTasks: [
        { name: 'Requirements Gathering', duration: 5, priority: 'high' },
        { name: 'Design & Architecture', duration: 7, priority: 'high' },
        { name: 'Development Sprint 1', duration: 14, priority: 'high' },
        { name: 'Testing & QA', duration: 7, priority: 'medium' },
        { name: 'Deployment', duration: 2, priority: 'high' },
        { name: 'Post-Launch Monitoring', duration: 7, priority: 'medium' }
      ],
      image: '/templates/software.png'
    },
    {
      id: 'marketing-campaign',
      name: 'Marketing Campaign',
      category: 'Marketing',
      description: 'Launch successful marketing campaigns with strategic planning, content calendars, and performance tracking across all channels.',
      color: 'pink',
      icon: '📱',
      features: ['Content Calendar', 'Campaign Analytics', 'Multi-Channel Planning', 'ROI Tracking'],
      defaultTasks: [
        { name: 'Market Research', duration: 7, priority: 'high' },
        { name: 'Campaign Strategy', duration: 5, priority: 'high' },
        { name: 'Content Creation', duration: 14, priority: 'medium' },
        { name: 'Channel Setup', duration: 3, priority: 'medium' },
        { name: 'Campaign Launch', duration: 1, priority: 'high' },
        { name: 'Performance Analysis', duration: 7, priority: 'medium' }
      ],
      image: '/templates/marketing.png'
    },
    {
      id: 'product-launch',
      name: 'Product Launch',
      category: 'Professional Services',
      description: 'Coordinate a successful product launch from conception to market. Manage timelines, resources, and cross-functional teams effectively.',
      color: 'green',
      icon: '🚀',
      features: ['Launch Timeline', 'Stakeholder Management', 'Go-to-Market Strategy', 'Success Metrics'],
      defaultTasks: [
        { name: 'Product Development', duration: 30, priority: 'high' },
        { name: 'Marketing Preparation', duration: 14, priority: 'high' },
        { name: 'Beta Testing', duration: 14, priority: 'medium' },
        { name: 'Launch Materials', duration: 7, priority: 'medium' },
        { name: 'Official Launch', duration: 1, priority: 'high' },
        { name: 'Post-Launch Support', duration: 14, priority: 'medium' }
      ],
      image: '/templates/product-launch.png'
    },
    {
      id: 'event-planning',
      name: 'Event Planning',
      category: 'Professional Services',
      description: 'Organize memorable events with detailed planning tools, vendor management, and timeline coordination for flawless execution.',
      color: 'orange',
      icon: '🎉',
      features: ['Vendor Management', 'Budget Planning', 'Guest Lists', 'Timeline Coordination'],
      defaultTasks: [
        { name: 'Venue Selection', duration: 7, priority: 'high' },
        { name: 'Vendor Booking', duration: 14, priority: 'high' },
        { name: 'Guest Invitations', duration: 7, priority: 'medium' },
        { name: 'Event Setup', duration: 2, priority: 'high' },
        { name: 'Event Day Coordination', duration: 1, priority: 'high' },
        { name: 'Post-Event Follow-up', duration: 3, priority: 'low' }
      ],
      image: '/templates/event.png'
    }
  ];

  const categories = ['All', 'General', 'Construction', 'Software', 'Marketing', 'Professional Services', 'IT', 'Manufacturing'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedView, setSelectedView] = useState('Templates');

  const dashboardViews = ['Dashboard', 'Templates', 'Projects', 'Tasks', 'Teams', 'Analytics', 'Reports', 'Settings'];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

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
        // Already on templates, just update state
        break;
      case 'Teams':
        navigate('/users');
        break;
      case 'Dashboard':
        navigate('/dashboard');
        break;
      default:
        // For Analytics, Reports, etc., just update state
        break;
    }
  };

  const handleCreateProject = async (template) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      // Create project with template
      const projectData = {
        name: template.isBlank ? 'New Project' : `${template.name} Project`,
        description: template.description,
        template: template.id,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        budget: 50000
      };

      console.log('Creating project with data:', projectData);
      const response = await axios.post(
        'http://localhost:5001/api/projects',
        projectData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Project created successfully:', response.data);
      
      const projectId = response.data._id || response.data.id;

      // Create tasks from template if not blank
      if (!template.isBlank && template.defaultTasks && template.defaultTasks.length > 0) {
        console.log('Creating tasks from template...');
        const today = new Date();
        
        for (const taskTemplate of template.defaultTasks) {
          try {
            // Calculate due date based on duration
            const dueDate = new Date(today);
            dueDate.setDate(dueDate.getDate() + taskTemplate.duration);
            
            // Map template priority to task priority
            const priorityMap = {
              'low': 'low',
              'medium': 'medium',
              'high': 'high',
              'critical': 'critical'
            };
            
            const taskData = {
              title: taskTemplate.name,
              description: taskTemplate.phase ? `Phase: ${taskTemplate.phase}` : '',
              project: projectId,
              priority: priorityMap[taskTemplate.priority] || 'medium',
              dueDate: dueDate.toISOString(),
              status: taskTemplate.status === 'completed' ? 'completed' : 
                      taskTemplate.status === 'in-progress' ? 'in-progress' : 'todo'
            };
            
            await tasksAPI.create(taskData);
            console.log(`Task created: ${taskTemplate.name}`);
          } catch (taskError) {
            console.error(`Failed to create task ${taskTemplate.name}:`, taskError);
            // Continue creating other tasks even if one fails
          }
        }
      }

      // Update user context IMMEDIATELY to prevent redirect loop
      updateUser({ templateSelected: true });

      // Mark template selection as complete (async, don't wait)
      console.log('Updating user profile...');
      axios.put(
        'http://localhost:5001/api/users/profile',
        {
          templateSelected: true
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      ).then(() => {
        console.log('User profile updated successfully');
      }).catch((err) => {
        console.error('Profile update failed (non-blocking):', err);
      });

      // Navigate to the newly created project
      navigate(`/projects/${projectId}`, { replace: true });
    } catch (error) {
      console.error('Error creating project:', error);
      console.error('Error details:', error.response?.data);
      
      // Still try to update user and navigate even if there's an error
      try {
        updateUser({ templateSelected: true });
        navigate('/dashboard', { replace: true });
      } catch (navError) {
        console.error('Navigation error:', navError);
        // Force navigation even if update fails
        navigate('/dashboard', { replace: true });
      }
    }
  };

  const skipTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5001/api/users/profile',
        {
          templateSelected: true
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update user context to prevent redirect loop
      updateUser({ templateSelected: true });
      
      // Navigate immediately
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error skipping templates:', error);
      // Still update user context and navigate even on error
      updateUser({ templateSelected: true });
      navigate('/dashboard');
    }
  };

  const startFromScratch = () => {
    // Navigate to tutorial instead of skipping directly to dashboard
    navigate('/tutorial', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <img 
              src="/Logo.png" 
              alt="ProjectMaster Logo" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-semibold">ProjectMaster</span>
          </div>
          <h2 className="text-3xl font-bold mb-3">Pick a template</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Choose a template to get your project started even faster. Browse categories and select the perfect template for your needs.
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

        {/* Bottom Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={startFromScratch}
            className="w-full px-4 py-3 border-2 border-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all duration-300"
          >
            Start from scratch
          </button>
          <button
            onClick={skipTemplates}
            className="w-full text-sm text-slate-400 hover:text-white transition-colors"
          >
            Skip for now →
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader title="Templates" showSearch={false} />
        
        {/* Category Filter Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
          {/* Header Stats */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {selectedCategory === 'All' ? 'All Templates' : `${selectedCategory} Templates`}
              </h3>
              <p className="text-slate-600">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">{templates.length}</div>
                <div className="text-xs text-slate-600">Total Templates</div>
              </div>
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-cyan-600">{categories.length - 1}</div>
                <div className="text-xs text-slate-600">Categories</div>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                {/* Template Preview Image */}
                <div className={`h-48 ${template.isBlank ? 'bg-white border-2 border-slate-200' : 'bg-gradient-to-br from-slate-800 to-slate-900'} relative overflow-hidden`}>
                  {template.isBlank ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-2 border-slate-300 rounded-lg flex items-center justify-center">
                        <div className="text-6xl text-slate-400 font-light">+</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-20 group-hover:scale-125 transition-transform duration-500">
                          {template.icon}
                        </div>
                      </div>
                      {/* Simulated Gantt/Task View */}
                      {template.defaultTasks.length > 0 && (
                        <div className="absolute inset-0 p-4 opacity-40">
                          <div className="space-y-2">
                            {template.defaultTasks.slice(0, 4).map((task, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                <div className="h-1 bg-slate-600 rounded flex-1" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${template.color}-500 text-white shadow-lg`}>
                          {template.category}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Template Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      {!template.isBlank && <span className="text-2xl">{template.icon}</span>}
                      {template.name}
                    </h3>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {template.description}
                  </p>

                  {/* Features */}
                  {!template.isBlank && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-700 mb-2">Includes:</div>
                      <div className="flex flex-wrap gap-2">
                        {template.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                            +{template.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Task Count */}
                  {!template.isBlank && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>{template.defaultTasks.length} pre-configured tasks</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCreateProject(template)}
                      className={`flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105`}
                    >
                      Use Template
                    </button>
                    <button
                      onClick={() => setShowPreview(template)}
                      className="px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300"
                      title="View More"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No templates found</h3>
              <p className="text-slate-600 mb-6">Try selecting a different category</p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                View All Templates
              </button>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!showPreview.isBlank && <span className="text-4xl">{showPreview.icon}</span>}
                {showPreview.isBlank && (
                  <div className="w-16 h-16 border-2 border-slate-300 rounded-lg flex items-center justify-center">
                    <span className="text-3xl text-slate-400 font-light">+</span>
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{showPreview.name}</h3>
                  <p className="text-sm text-slate-600">{showPreview.category}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Description</h4>
                <p className="text-slate-600">{showPreview.description}</p>
              </div>

              {!showPreview.isBlank && (
                <>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Features Included</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {showPreview.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Default Tasks ({showPreview.defaultTasks.length})</h4>
                    <div className="space-y-2">
                      {showPreview.defaultTasks.map((task, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <div className="flex-shrink-0 w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-semibold text-slate-700">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{task.name}</div>
                            <div className="text-xs text-slate-600">{task.duration} days</div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {showPreview.isBlank && (
                <div className="text-center py-8">
                  <div className="w-24 h-24 border-2 border-slate-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl text-slate-400 font-light">+</span>
                  </div>
                  <p className="text-slate-600">Start with a completely blank project and build it your way.</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleCreateProject(showPreview);
                    setShowPreview(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Use This Template
                </button>
                <button
                  onClick={() => setShowPreview(null)}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelection;
