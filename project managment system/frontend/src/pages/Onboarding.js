import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: '',
    role: '',
    workspaceType: '',
    teamSize: '',
    department: '',
    goals: [],
    experience: '',
    notifications: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [announcements, setAnnouncements] = useState([
    {
      date: 'Jan 13, 2026',
      title: 'New Gantt Print Autoscaling & Risk Automation',
      content: 'Today we introduce a new automatic print layout for the gantt, allowing you to download or print larger plans quicker. Plus, teams using automations can now generate risks with any number of trigger options.',
      link: '#'
    },
    {
      date: 'Jan 10, 2026',
      title: 'Welcome to our brand new Resource Center',
      content: 'This is the central hub for learning about ProjectManagerMaster. Find tutorials, guides, and best practices to get the most out of your workspace.',
      link: '#'
    }
  ]);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showResourceCenter, setShowResourceCenter] = useState(false);

  const totalSteps = 5;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5001/api/users/profile',
        {
          onboardingCompleted: true,
          onboardingData: formData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Redirect to template selection
      navigate('/templates');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still navigate even if there's an error
      navigate('/templates');
    }
  };

  const skipOnboarding = () => {
    navigate('/templates');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8 flex flex-col">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="/Logo.png" 
              alt="ProjectMaster Logo" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-semibold">ProjectMaster</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
          <p className="text-slate-300 text-sm">Let's get you set up in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-6 flex-1">
          {[
            { num: 1, title: 'Introduction', icon: '👋' },
            { num: 2, title: 'Workspace Type', icon: '🏢' },
            { num: 3, title: 'Team Details', icon: '👥' },
            { num: 4, title: 'Your Goals', icon: '🎯' },
            { num: 5, title: 'Preferences', icon: '⚙️' }
          ].map((step) => (
            <div
              key={step.num}
              className={`flex items-center gap-4 transition-all duration-300 ${
                currentStep === step.num
                  ? 'scale-105'
                  : currentStep > step.num
                  ? 'opacity-70'
                  : 'opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep === step.num
                    ? 'bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/50'
                    : currentStep > step.num
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {currentStep > step.num ? '✓' : step.num}
              </div>
              <div className="flex-1">
                <div className="font-medium">{step.title}</div>
                {currentStep === step.num && (
                  <div className="text-xs text-cyan-300 mt-1">In progress...</div>
                )}
              </div>
              <div className="text-2xl">{step.icon}</div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Progress</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Right Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
          {/* Announcements Button */}
          <button
            onClick={() => setShowAnnouncements(!showAnnouncements)}
            className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 w-5 h-5 bg-cyan-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              2
            </span>
          </button>

          {/* Help Button */}
          <button
            onClick={() => setShowResourceCenter(!showResourceCenter)}
            className="p-3 bg-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-cyan-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button
            onClick={skipOnboarding}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium"
          >
            Skip for now
          </button>
        </div>

        {/* Announcements Sidebar */}
        {showAnnouncements && (
          <div className="absolute top-20 right-6 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-20 max-h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-cyan-500 to-blue-500">
              <div className="flex items-center gap-2 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <h3 className="font-semibold">Announcements</h3>
              </div>
              <button
                onClick={() => setShowAnnouncements(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              {announcements.map((announcement, idx) => (
                <div key={idx} className="mb-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="text-xs text-slate-500 mb-2">{announcement.date}</div>
                  <h4 className="font-semibold text-slate-900 mb-2">{announcement.title}</h4>
                  <p className="text-sm text-slate-600 mb-3">{announcement.content}</p>
                  <a href={announcement.link} className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                    Learn more →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resource Center Sidebar */}
        {showResourceCenter && (
          <div className="absolute top-20 right-6 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-20">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Resource Center</h3>
              <button
                onClick={() => setShowResourceCenter(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              {[
                { title: 'Announcements', count: 2, color: 'cyan' },
                { title: 'Knowledge Base', count: null, color: 'slate' },
                { title: 'Training Videos', count: null, color: 'slate' },
                { title: 'Plans & Pricing', count: 1, color: 'cyan' },
                { title: 'Help', count: 1, color: 'cyan' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-slate-700 group-hover:text-slate-900">{item.title}</span>
                  <div className="flex items-center gap-2">
                    {item.count && (
                      <span className={`w-6 h-6 bg-${item.color}-500 text-white text-xs rounded-full flex items-center justify-center font-bold`}>
                        {item.count}
                      </span>
                    )}
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-2xl w-full">
            {/* Step 1: Introduction */}
            {currentStep === 1 && (
              <div className="text-center space-y-6 animate-fadeIn">
                <div className="text-6xl mb-4">👋</div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  Hi {formData.displayName || 'there'}, let's customize your workspace
                </h1>
                <p className="text-xl text-slate-600 mb-8">
                  What brings you here today?
                </p>
                <div className="space-y-4 max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="What should we call you?"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className="w-full px-6 py-4 border-2 border-slate-300 rounded-lg focus:border-cyan-500 focus:outline-none text-lg transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Workspace Type */}
            {currentStep === 2 && (
              <div className="text-center space-y-8 animate-fadeIn">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  What brings you here today?
                </h1>
                <div className="space-y-4 max-w-md mx-auto">
                  {[
                    { value: 'business', label: 'Business', icon: '💼', desc: 'Manage projects and teams' },
                    { value: 'school', label: 'School', icon: '📚', desc: 'Academic projects and assignments' },
                    { value: 'personal', label: 'Personal', icon: '👤', desc: 'Personal tasks and goals' },
                    { value: 'nonprofit', label: 'Nonprofit', icon: '🤝', desc: 'Community and nonprofit work' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('workspaceType', type.value)}
                      className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-300 ${
                        formData.workspaceType === type.value
                          ? 'border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-3xl">{type.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-slate-900">{type.label}</div>
                        <div className="text-sm text-slate-500">{type.desc}</div>
                      </div>
                      {formData.workspaceType === type.value && (
                        <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Team Details */}
            {currentStep === 3 && (
              <div className="text-center space-y-8 animate-fadeIn">
                <div className="text-5xl mb-4">👥</div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  Tell us about your team
                </h1>
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      What's your role?
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select your role</option>
                      <option value="project-manager">Project Manager</option>
                      <option value="team-lead">Team Lead</option>
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="executive">Executive</option>
                      <option value="consultant">Consultant</option>
                      <option value="student">Student</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="text-left">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Team size
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: '1-5', label: '1-5 people' },
                        { value: '6-20', label: '6-20 people' },
                        { value: '21-50', label: '21-50 people' },
                        { value: '50+', label: '50+ people' }
                      ].map((size) => (
                        <button
                          key={size.value}
                          onClick={() => handleInputChange('teamSize', size.value)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                            formData.teamSize === size.value
                              ? 'border-cyan-500 bg-cyan-50 font-semibold'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-left">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Department (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Engineering, Marketing, Sales"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Goals */}
            {currentStep === 4 && (
              <div className="text-center space-y-8 animate-fadeIn">
                <div className="text-5xl mb-4">🎯</div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  What are your main goals?
                </h1>
                <p className="text-slate-600 mb-6">Select all that apply</p>
                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    { value: 'collaboration', label: 'Team Collaboration', icon: '🤝' },
                    { value: 'tracking', label: 'Project Tracking', icon: '📊' },
                    { value: 'planning', label: 'Resource Planning', icon: '📅' },
                    { value: 'budgeting', label: 'Budget Management', icon: '💰' },
                    { value: 'reporting', label: 'Reporting & Analytics', icon: '📈' },
                    { value: 'automation', label: 'Workflow Automation', icon: '⚡' }
                  ].map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => handleGoalToggle(goal.value)}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                        formData.goals.includes(goal.value)
                          ? 'border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{goal.icon}</div>
                      <div className="font-semibold text-slate-900">{goal.label}</div>
                      {formData.goals.includes(goal.value) && (
                        <div className="mt-2">
                          <svg className="w-6 h-6 text-cyan-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Preferences */}
            {currentStep === 5 && (
              <div className="text-center space-y-8 animate-fadeIn">
                <div className="text-5xl mb-4">⚙️</div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  Final touches
                </h1>
                <div className="space-y-6 max-w-md mx-auto text-left">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your experience level
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'beginner', label: 'Beginner - New to project management' },
                        { value: 'intermediate', label: 'Intermediate - Some experience' },
                        { value: 'advanced', label: 'Advanced - Very experienced' }
                      ].map((exp) => (
                        <button
                          key={exp.value}
                          onClick={() => handleInputChange('experience', exp.value)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                            formData.experience === exp.value
                              ? 'border-cyan-500 bg-cyan-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {exp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="notifications"
                        checked={formData.notifications}
                        onChange={(e) => handleInputChange('notifications', e.target.checked)}
                        className="mt-1 w-5 h-5 text-cyan-500 rounded focus:ring-cyan-500"
                      />
                      <label htmlFor="notifications" className="flex-1 text-sm">
                        <div className="font-semibold text-slate-900 mb-1">Enable notifications</div>
                        <div className="text-slate-600">Get updates about project changes, mentions, and deadlines</div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-5 border border-cyan-200">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-slate-700">
                        You can always change these settings later in your profile preferences.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentStep === 1
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                ← Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <span>Complete Setup</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
