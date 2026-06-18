import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const OnboardingTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const tutorialSteps = [
    {
      id: 'welcome',
      title: "Let's explore what PM can do for you!",
      subtitle: "Learn key features and get started in just a few minutes.",
      features: [],
      image: '/tutorial/welcome.png',
      buttonText: "Let's go",
      icon: '🚀'
    },
    {
      id: 'gantt',
      title: 'Gantt View',
      subtitle: 'Powerful Planning & Scheduling',
      features: [
        'Import your plans (MPP, XLS or CSV)',
        'Drag task bars to adjust dates',
        'Add links & dependencies',
        'Baselines & critical paths',
        'Real-time availability for assignments',
        'Custom columns for more data'
      ],
      image: '/tutorial/gantt.png',
      buttonText: 'Next',
      icon: '📊'
    },
    {
      id: 'dashboard',
      title: 'Project Dashboard',
      subtitle: 'Real-time tracking',
      features: [
        'Track progress, costs and resources',
        'Automatic set up and live updates',
        'Print and share the dashboard',
        'Expand and collapse specific tiles',
        'Helps users deliver on time and on budget'
      ],
      image: '/tutorial/dashboard.png',
      buttonText: 'Next',
      icon: '📈'
    },
    {
      id: 'list',
      title: 'List View',
      subtitle: 'Streamlined Task Updates',
      features: [
        'Manage tasks, including summary tasks',
        'Filter and sort work',
        'Track task progress',
        'Add comments, files, hours and costs',
        'Make recurring tasks'
      ],
      image: '/tutorial/list.png',
      buttonText: 'Next',
      icon: '📋'
    },
    {
      id: 'portfolio',
      title: 'Powerful portfolio management',
      subtitle: "Now let's explore our project portfolio management features, where you can",
      features: [
        'Schedule resources',
        'Run reports',
        'Customize dashboards',
        'Build roadmaps',
        'And more!'
      ],
      image: '/tutorial/portfolio.png',
      buttonText: "Let's go!",
      icon: '📁'
    },
    {
      id: 'board',
      title: 'Board View',
      subtitle: 'Kanban Workflow & Automation',
      features: [
        'Create custom columns for your processes',
        'Build workflows with automations',
        'Define approvals for quality control',
        'Drag and drop tasks and track progress',
        'Filter for tasks based on tags, priority and more'
      ],
      image: '/tutorial/board.png',
      buttonText: 'Next',
      icon: '📲'
    },
    {
      id: 'projects',
      title: 'All projects in one location',
      subtitle: '',
      features: [
        'Organize your projects into folders',
        'Filter by status, priority and more',
        'Review high-level project data'
      ],
      image: '/tutorial/projects.png',
      buttonText: 'Get Started!',
      icon: '🏢'
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const handleSkip = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5001/api/users/profile',
        { templateSelected: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateUser({ templateSelected: true });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error skipping tutorial:', error);
      updateUser({ templateSelected: true });
      navigate('/dashboard', { replace: true });
    }
  };

  const completeTutorial = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5001/api/users/profile',
        { templateSelected: true, onboardingCompleted: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateUser({ templateSelected: true, onboardingCompleted: true });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error completing tutorial:', error);
      updateUser({ templateSelected: true, onboardingCompleted: true });
      navigate('/dashboard', { replace: true });
    }
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Tutorial Modal */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col h-full max-h-[90vh]">
          
          {/* Header with step indicator */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium opacity-90">
                GETTING STARTED
              </div>
              <div className="text-sm opacity-90">
                {currentStep + 1} of {tutorialSteps.length}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-4">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="text-center mb-8">
              {currentStepData.icon && (
                <div className="text-6xl mb-4 animate-bounce">
                  {currentStepData.icon}
                </div>
              )}
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                {currentStepData.title}
              </h1>
              {currentStepData.subtitle && (
                <p className="text-lg text-slate-600">
                  {currentStepData.subtitle}
                </p>
              )}
            </div>

            {/* Features list */}
            {currentStepData.features.length > 0 && (
              <div className="mb-8">
                <ul className="space-y-3 text-left max-w-2xl mx-auto">
                  {currentStepData.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700 text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Feature Image/Video Placeholder */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl h-80 flex items-center justify-center relative overflow-hidden shadow-lg transition-all duration-500">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 animate-pulse"></div>
                
                {currentStep === 0 && (
                  <div className="relative z-10 text-center text-white">
                    <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <span className="text-3xl">🚀</span>
                    </div>
                    <p className="text-lg font-semibold mb-2">Welcome to ProjectManagerMaster</p>
                    <p className="text-sm opacity-75">Your complete project management solution</p>
                  </div>
                )}
                
                {/* Gantt Chart Visualization */}
                {currentStep === 1 && (
                  <div className="absolute inset-0 p-8 opacity-40">
                    <div className="space-y-3">
                      {[1,2,3,4,5,6].map((i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                          <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                          <div className="text-xs text-white w-20">Task {i}</div>
                          <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded flex-1" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dashboard Visualization */}
                {currentStep === 2 && (
                  <div className="absolute inset-0 p-8 opacity-40 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 w-full animate-pulse">
                      <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded h-16 flex items-center justify-center">
                        <span className="text-white font-bold">75%</span>
                      </div>
                      <div className="bg-slate-600 rounded h-16 flex items-center justify-center">
                        <span className="text-white text-sm">Budget</span>
                      </div>
                      <div className="bg-slate-600 rounded h-20 flex items-center justify-center">
                        <span className="text-white text-sm">Timeline</span>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded h-20 flex items-center justify-center">
                        <span className="text-white font-bold">On Track</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* List View Visualization */}
                {currentStep === 3 && (
                  <div className="absolute inset-0 p-6 opacity-40">
                    <div className="space-y-2">
                      {['Planning Phase', 'Development', 'Testing', 'Deployment', 'Review'].map((task, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-slate-700 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                          <div className={`w-3 h-3 rounded-full ${i < 3 ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                          <span className="text-white text-sm flex-1">{task}</span>
                          <div className="w-16 h-2 bg-slate-600 rounded">
                            <div className={`h-2 bg-teal-400 rounded`} style={{ width: `${(i + 1) * 20}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portfolio View */}
                {currentStep === 4 && (
                  <div className="absolute inset-0 p-6 opacity-40 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {['Project Alpha', 'Beta Launch', 'Maintenance', 'Research'].map((project, i) => (
                        <div key={i} className="bg-slate-700 rounded p-3 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
                          <div className="h-2 bg-slate-600 rounded mb-2"></div>
                          <div className="h-2 bg-teal-400 rounded w-3/4 mb-1"></div>
                          <div className="h-1 bg-slate-600 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Kanban Board Visualization */}
                {currentStep === 5 && (
                  <div className="absolute inset-0 p-6 opacity-40">
                    <div className="grid grid-cols-3 gap-4 h-full">
                      {['To Do', 'In Progress', 'Done'].map((column, colIndex) => (
                        <div key={colIndex} className="bg-slate-700 rounded p-3">
                          <div className="text-white text-xs mb-2 font-semibold">{column}</div>
                          <div className="space-y-2">
                            {[1,2,3].slice(0, 3 - colIndex).map((item, itemIndex) => (
                              <div key={itemIndex} className={`h-8 rounded animate-pulse ${
                                colIndex === 0 ? 'bg-slate-600' : 
                                colIndex === 1 ? 'bg-yellow-600' : 'bg-green-600'
                              }`} style={{ animationDelay: `${(colIndex * 3 + itemIndex) * 0.1}s` }}></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Overview */}
                {currentStep === 6 && (
                  <div className="absolute inset-0 p-6 opacity-40">
                    <div className="space-y-3">
                      {['Marketing Campaign', 'Product Development', 'Infrastructure', 'Support'].map((project, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-slate-700 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                          <div className={`w-4 h-4 rounded-full ${['bg-green-400', 'bg-yellow-400', 'bg-blue-400', 'bg-purple-400'][i]}`}></div>
                          <div className="flex-1">
                            <div className="h-3 bg-slate-600 rounded mb-1"></div>
                            <div className="h-2 bg-slate-500 rounded w-2/3"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-2 bg-teal-400 rounded w-12 mb-1"></div>
                            <div className="h-2 bg-slate-600 rounded w-8"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Default placeholder with play button */}
                {currentStep === 0 || (
                  <div className="absolute bottom-4 right-4 z-20">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors cursor-pointer">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                {currentStepData.buttonText}
                {currentStep < tutorialSteps.length - 1 && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleSkip}
                className="px-4 py-3 text-slate-500 hover:text-slate-700 transition-colors text-sm"
              >
                Skip tutorial →
              </button>
            </div>
          </div>

          {/* Step indicators */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex justify-center gap-2">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-teal-500 scale-125'
                      : index < currentStep
                      ? 'bg-teal-300'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;