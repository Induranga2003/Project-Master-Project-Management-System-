import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Intro = () => {
  const [email, setEmail] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleStartTrial = (e) => {
    e.preventDefault();
    // Store email in localStorage or handle as needed
    if (email) {
      localStorage.setItem('trialEmail', email);
      window.location.href = '/register';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-5 bg-slate-900 shadow-xl border-b border-slate-700">
        <div className="text-white text-xl font-bold flex items-center gap-3">
          <img 
            src="/Logo.png" 
            alt="ProjectMaster Logo" 
            className="w-10 h-10 object-contain"
          />
          <span className="text-2xl">ProjectMaster</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-white text-sm relative">
          {/* Product Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('product')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a href="#product" className="hover:text-[#229fc5] transition flex items-center gap-1 cursor-pointer">
              Product <span className="text-xs">▼</span>
            </a>
            {activeDropdown === 'product' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[800px] z-50">
                <div className="bg-white rounded-lg shadow-2xl p-8 relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                  <div className="grid grid-cols-3 gap-8 relative z-10">
                  {/* OVERVIEW */}
                  <div>
                    <h4 className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-wide">Overview</h4>
                    <a href="#product-overview" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition group mb-3">
                      <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <div>
                        <div className="text-slate-900 font-semibold text-sm mb-1">Product overview</div>
                        <div className="text-slate-500 text-xs">Learn more about ProjectManager and how it can improve your business</div>
                      </div>
                    </a>
                    <a href="#integrations" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition group mb-3">
                      <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                      <div>
                        <div className="text-slate-900 font-semibold text-sm mb-1">Integrations</div>
                        <div className="text-slate-500 text-xs">Discover app combinations that improve your productivity</div>
                      </div>
                    </a>
                    <a href="#mobile" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition group">
                      <svg className="w-5 h-5 text-pink-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="text-slate-900 font-semibold text-sm mb-1">Mobile apps</div>
                        <div className="text-slate-500 text-xs">Sync work across all your devices and access it on the go</div>
                      </div>
                    </a>
                  </div>

                  {/* FEATURES */}
                  <div>
                    <h4 className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-wide">Features</h4>
                    <div className="space-y-3">
                      <a href="#gantt" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Gantt charts</div>
                          <div className="text-slate-500 text-xs">Set milestones, connect dependencies and track progress</div>
                        </div>
                      </a>
                      <a href="#portfolios" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Project portfolios</div>
                          <div className="text-slate-500 text-xs">Manage portfolios, align objectives and get high-level overviews</div>
                        </div>
                      </a>
                      <a href="#reports" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Reports</div>
                          <div className="text-slate-500 text-xs">Generate in-depth, easy-to-read reports to share progress</div>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* PLAN */}
                  <div>
                    <h4 className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-wide">Plan</h4>
                    <div className="space-y-3">
                      <a href="#team" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-lime-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Team</div>
                          <div className="text-slate-500 text-xs">For small-to-medium teams that need to manage robust projects</div>
                        </div>
                      </a>
                      <a href="#business" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-lime-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Business</div>
                          <div className="text-slate-500 text-xs">For medium-to-large teams that need to optimize portfolios</div>
                        </div>
                      </a>
                      <a href="#enterprise" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-lime-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Enterprise</div>
                          <div className="text-slate-500 text-xs">For organizations that need customized security and priority support</div>
                        </div>
                      </a>
                      <a href="#compare" className="text-slate-900 hover:text-[#229fc5] font-medium text-sm mt-4 inline-flex items-center gap-1 group">
                        Compare plans <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('solutions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a href="#solutions" className="hover:text-[#229fc5] transition flex items-center gap-1 cursor-pointer">
              Solutions <span className="text-xs">▼</span>
            </a>
            {activeDropdown === 'solutions' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[900px] z-50">
                <div className="bg-white rounded-lg shadow-2xl p-8 relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                <div className="grid grid-cols-3 gap-8 relative z-10">
                  {/* BY INDUSTRY */}
                  <div>
                    <h4 className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-wide">By Industry</h4>
                    <div className="space-y-3">
                      <a href="#manufacturing" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-pink-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Manufacturing</div>
                          <div className="text-slate-500 text-xs">Reduce lead time, ensure quality and perfect your process</div>
                        </div>
                      </a>
                      <a href="#construction" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-orange-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Construction</div>
                          <div className="text-slate-500 text-xs">Create schedules, manage crews and deliver under budget</div>
                        </div>
                      </a>
                      <a href="#it" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Information technology</div>
                          <div className="text-slate-500 text-xs">Streamline IT processes and scale up with ease</div>
                        </div>
                      </a>
                      <a href="#professional" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Professional services</div>
                          <div className="text-slate-500 text-xs">Plan projects, track progress and manage resources</div>
                        </div>
                      </a>
                      <a href="#see-all-industry" className="text-slate-900 hover:text-[#229fc5] font-medium text-sm mt-2 inline-flex items-center gap-1 group">
                        See all <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </div>

                  {/* BY USE CASE */}
                  <div>
                    <h4 className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-wide">By Use Case</h4>
                    <div className="space-y-3">
                      <a href="#project-planning" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Project planning</div>
                          <div className="text-slate-500 text-xs">Build comprehensive project plans and organize tasks</div>
                        </div>
                      </a>
                      <a href="#scheduling" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Project scheduling</div>
                          <div className="text-slate-500 text-xs">Schedule and assign work to bring your project in on time</div>
                        </div>
                      </a>
                      <a href="#risk" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Risk management</div>
                          <div className="text-slate-500 text-xs">Manage risks alongside project plans for better execution</div>
                        </div>
                      </a>
                      <a href="#time-tracking" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Time tracking</div>
                          <div className="text-slate-500 text-xs">Track your team's time, whether they're on-site or remote</div>
                        </div>
                      </a>
                      <a href="#see-all-usecase" className="text-slate-900 hover:text-[#229fc5] font-medium text-sm mt-2 inline-flex items-center gap-1 group">
                        See all <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </div>

                  {/* PLAN */}
                  <div>
                    <h4 className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-wide">Plan</h4>
                    <div className="space-y-3">
                      <a href="#team-plan" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-lime-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Team</div>
                          <div className="text-slate-500 text-xs">For small-to-medium teams that need to manage robust projects</div>
                        </div>
                      </a>
                      <a href="#business-plan" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-lime-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Business</div>
                          <div className="text-slate-500 text-xs">For medium-to-large teams that need to optimize portfolios</div>
                        </div>
                      </a>
                      <a href="#enterprise-plan" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-lime-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Enterprise</div>
                          <div className="text-slate-500 text-xs">For organizations that need customized security and priority support</div>
                        </div>
                      </a>
                      <a href="#compare-plans" className="text-slate-900 hover:text-[#229fc5] font-medium text-sm mt-4 inline-flex items-center gap-1 group">
                        Compare plans <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('resources')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a href="#resources" className="hover:text-[#229fc5] transition flex items-center gap-1 cursor-pointer">
              Resources <span className="text-xs">▼</span>
            </a>
            {activeDropdown === 'resources' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[1000px] z-50">
                <div className="bg-white rounded-lg shadow-2xl p-8 relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                <div className="grid grid-cols-4 gap-6 relative z-10">
                  {/* EXPLORE */}
                  <div>
                    <h4 className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-wide">Explore</h4>
                    <div className="space-y-3">
                      <a href="#company" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Company</div>
                          <div className="text-slate-500 text-xs">Get to know our company and our mission</div>
                        </div>
                      </a>
                      <a href="#customer-stories" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Customer stories</div>
                          <div className="text-slate-500 text-xs">See how real companies achieved success</div>
                        </div>
                      </a>
                      <a href="#blog" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Blog</div>
                          <div className="text-slate-500 text-xs">Read the industry-leading blog on work management</div>
                        </div>
                      </a>
                      <a href="#guides" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Guides</div>
                          <div className="text-slate-500 text-xs">Get key insights on major topics in project management</div>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* LEARN */}
                  <div>
                    <h4 className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-wide">Learn</h4>
                    <div className="space-y-3">
                      <a href="#training" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Training academy</div>
                          <div className="text-slate-500 text-xs">Get started faster with free training videos</div>
                        </div>
                      </a>
                      <a href="#knowledge" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Knowledge base</div>
                          <div className="text-slate-500 text-xs">Access documentation on using ProjectManager</div>
                        </div>
                      </a>
                      <a href="#product-videos" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Product videos</div>
                          <div className="text-slate-500 text-xs">Tour our features with exploratory videos</div>
                        </div>
                      </a>
                      <a href="#developer" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Developer resources</div>
                          <div className="text-slate-500 text-xs">Review documentation, code samples and other API resources</div>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* COMPARE */}
                  <div>
                    <h4 className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-wide">Compare</h4>
                    <div className="space-y-3">
                      <a href="#vs-ms-project" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">vs Microsoft Project</div>
                          <div className="text-slate-500 text-xs">Collaborate online without compromising features</div>
                        </div>
                      </a>
                      <a href="#vs-ms-planner" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">vs Microsoft Planner</div>
                          <div className="text-slate-500 text-xs">Import MPP and get stronger Gantt charts</div>
                        </div>
                      </a>
                      <a href="#vs-monday" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">vs Monday.com</div>
                          <div className="text-slate-500 text-xs">Tackle complex projects without add-ons</div>
                        </div>
                      </a>
                      <a href="#vs-smartsheet" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">vs Smartsheet</div>
                          <div className="text-slate-500 text-xs">Manage work with more than a spreadsheet</div>
                        </div>
                      </a>
                      <a href="#see-all-compare" className="text-slate-900 hover:text-[#229fc5] font-medium text-sm mt-2 inline-flex items-center gap-1 group">
                        See all <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </div>

                  {/* TEMPLATES */}
                  <div>
                    <h4 className="text-slate-400 text-xs font-semibold mb-4 uppercase tracking-wide">Templates</h4>
                    <div className="space-y-3">
                      <a href="#construction-schedule" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Construction schedule</div>
                          <div className="text-slate-500 text-xs">Keep track of all the phases of your build</div>
                        </div>
                      </a>
                      <a href="#production-schedule" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Production schedule</div>
                          <div className="text-slate-500 text-xs">Create product roadmaps and ship on time</div>
                        </div>
                      </a>
                      <a href="#it-project" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">IT project plan</div>
                          <div className="text-slate-500 text-xs">Accelerate delivery on your next IT project</div>
                        </div>
                      </a>
                      <a href="#agile-planner" className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition">
                        <svg className="w-5 h-5 text-cyan-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm mb-1">Agile sprint planner</div>
                          <div className="text-slate-500 text-xs">Plan your sprints with out-of-the-box workflows</div>
                        </div>
                      </a>
                      <a href="#see-all-templates" className="text-slate-900 hover:text-[#229fc5] font-medium text-sm mt-2 inline-flex items-center gap-1 group">
                        See all templates <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}
          </div>

          <a href="#enterprise" className="hover:text-[#229fc5] transition">
            Enterprise
          </a>
          
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2 text-white hover:text-[#229fc5] transition duration-300 text-sm"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 bg-[#229fc5] text-white font-semibold rounded-md hover:bg-[#1a7a9a] transition duration-300 text-sm flex items-center gap-2"
          >
            Sign Up <span>→</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Project management software designed for business excellence
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              A feature-rich, online platform for project planning, resource management and AI-powered analysis
            </p>
            <form onSubmit={handleStartTrial} className="flex flex-col sm:flex-row gap-3 pt-4 max-w-lg">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@yourcompany.com"
                className="flex-1 px-5 py-3.5 rounded-md text-slate-900 border-2 border-transparent focus:border-[#229fc5] focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#229fc5] text-white font-semibold rounded-md hover:bg-[#1a7a9a] transition duration-300 whitespace-nowrap"
              >
                Sign Up
              </button>
            </form>
          </div>

          {/* Right Visual - Dashboard Mockup */}
          <div className="relative">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-500">
              {/* Dashboard Header */}
              <div className="bg-slate-100 p-4 border-b border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-slate-300 rounded w-32 mb-2"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-slate-200 rounded w-16"></div>
                      <div className="h-2 bg-slate-200 rounded w-16"></div>
                      <div className="h-2 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 bg-slate-300 rounded"></div>
                    <div className="w-6 h-6 bg-slate-300 rounded"></div>
                    <div className="w-6 h-6 bg-slate-300 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {/* Health Card */}
                  <div className="col-span-1 space-y-2">
                    <div className="text-xs text-slate-600 font-semibold mb-3">Health</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Time</span>
                        <span className="text-cyan-600 font-semibold">14% ahead</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tasks</span>
                        <span className="text-slate-900">12 to complete</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Workload</span>
                        <span className="text-slate-900">0 overdue</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-slate-900">14% complete</span>
                      </div>
                    </div>
                  </div>

                  {/* Tasks Donut Chart */}
                  <div className="col-span-1">
                    <div className="text-xs text-slate-600 font-semibold mb-3">Tasks</div>
                    <div className="flex justify-center items-center">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#ef4444"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray="125 251"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#229fc5"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray="94 251"
                            strokeDashoffset="-125"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#3b82f6"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray="32 251"
                            strokeDashoffset="-219"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                          10
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-slate-600">Not Started (10)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span className="text-slate-600">Complete (6)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-600">In Progress (2)</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="col-span-1">
                    <div className="text-xs text-slate-600 font-semibold mb-3">Progress</div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-slate-700 mb-1">Contracts</div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-cyan-500 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                        <div className="text-xs text-cyan-600 font-semibold mt-1">100%</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-700 mb-1">Design</div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-cyan-400 h-2 rounded-full" style={{width: '80%'}}></div>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">80%</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-700 mb-1">Procurement</div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-pink-500 h-2 rounded-full" style={{width: '10%'}}></div>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">10%</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-700 mb-1">Construction</div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-slate-400 h-2 rounded-full" style={{width: '14%'}}></div>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">14%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Charts */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {/* Time Chart */}
                  <div>
                    <div className="text-xs text-slate-600 font-semibold mb-3">Time</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 w-20">Planned C...</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div className="bg-cyan-500 h-2 rounded-full" style={{width: '14%'}}></div>
                        </div>
                        <span className="text-xs text-cyan-600 font-semibold">14%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 w-20">Actual C...</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div className="bg-cyan-400 h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-xs text-slate-600">25%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 w-20">Ahead</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div className="bg-cyan-300 h-2 rounded-full" style={{width: '33%'}}></div>
                        </div>
                        <span className="text-xs text-slate-600">33%</span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Bar Chart */}
                  <div>
                    <div className="text-xs text-slate-600 font-semibold mb-3">Cost</div>
                    <div className="flex items-end justify-center gap-2 h-20">
                      <div className="w-8 bg-cyan-400 rounded-t" style={{height: '20%'}}></div>
                      <div className="w-8 bg-cyan-400 rounded-t" style={{height: '80%'}}></div>
                      <div className="w-8 bg-blue-500 rounded-t" style={{height: '40%'}}></div>
                    </div>
                    <div className="flex justify-center gap-3 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-slate-600">Actual</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-slate-600">Planned</span>
                      </div>
                    </div>
                  </div>

                  {/* Workload Chart */}
                  <div>
                    <div className="text-xs text-slate-600 font-semibold mb-3">Workload</div>
                    <div className="flex items-end justify-end gap-1 h-20">
                      {[0, 0, 0, 0, 0, 2, 4, 6, 8].map((height, idx) => (
                        <div
                          key={idx}
                          className="w-2 bg-slate-300 rounded-t"
                          style={{height: `${height * 10}%`}}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#229fc5] rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to manage projects
          </h2>
          <p className="text-xl text-slate-400">
            Powerful features for teams of all sizes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg className="w-10 h-10 text-[#229fc5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Real-Time Collaboration',
              desc: 'Work together seamlessly with instant updates, live chat, and synchronized changes across your team'
            },
            {
              icon: (
                <svg className="w-10 h-10 text-[#229fc5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: 'AI-Powered Analytics',
              desc: 'Get intelligent insights with advanced metrics, predictive analysis, and automated reporting'
            },
            {
              icon: (
                <svg className="w-10 h-10 text-[#229fc5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ),
              title: 'Resource Management',
              desc: 'Optimize team allocation, track availability, and manage workload across all projects'
            },
            {
              icon: (
                <svg className="w-10 h-10 text-[#229fc5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              ),
              title: 'Advanced Task Management',
              desc: 'Create, assign, and track tasks with dependencies, priorities, and custom workflows'
            },
            {
              icon: (
                <svg className="w-10 h-10 text-[#229fc5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Budget & Cost Tracking',
              desc: 'Monitor expenses, forecast budgets, and manage financial health of your projects'
            },
            {
              icon: (
                <svg className="w-10 h-10 text-[#229fc5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: 'Quality Assurance',
              desc: 'Maintain high standards with quality checks, reviews, and compliance tracking'
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-[#229fc5] hover:bg-slate-800 transition duration-300 group"
            >
              <div className="mb-5 transform group-hover:scale-110 transition duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-800 bg-opacity-30 border-y border-slate-700 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '15K+', label: 'Active Teams' },
              { number: '100K+', label: 'Projects Delivered' },
              { number: '99.9%', label: 'Uptime SLA' },
              { number: '24/7', label: 'Expert Support' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#229fc5] mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

            
      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black border-t border-slate-800 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#229fc5] rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-16">
          {/* Main Footer Content - Centered */}
          <div className="text-center mb-12">
            {/* Brand Section */}
            

            

            {/* Social Media Links - Centered */}
            {/* <div className="mb-8">
              <h4 className="text-white text-sm font-semibold mb-5 tracking-wide uppercase">Connect With Us</h4>
              <div className="flex gap-4 justify-center">
                <a href="#twitter" className="group relative w-12 h-12 bg-slate-800 hover:bg-gradient-to-br hover:from-lime-400 hover:to-green-500 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all duration-300 shadow-lg hover:shadow-lime-500/30 hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Twitter</span>
                </a>
                <a href="#linkedin" className="group relative w-12 h-12 bg-slate-800 hover:bg-gradient-to-br hover:from-lime-400 hover:to-green-500 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all duration-300 shadow-lg hover:shadow-lime-500/30 hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">LinkedIn</span>
                </a>
                <a href="#github" className="group relative w-12 h-12 bg-slate-800 hover:bg-gradient-to-br hover:from-lime-400 hover:to-green-500 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all duration-300 shadow-lg hover:shadow-lime-500/30 hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path></svg>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">GitHub</span>
                </a>
                <a href="#youtube" className="group relative w-12 h-12 bg-slate-800 hover:bg-gradient-to-br hover:from-lime-400 hover:to-green-500 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all duration-300 shadow-lg hover:shadow-lime-500/30 hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">YouTube</span>
                </a>
                <a href="#discord" className="group relative w-12 h-12 bg-slate-800 hover:bg-gradient-to-br hover:from-lime-400 hover:to-green-500 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all duration-300 shadow-lg hover:shadow-lime-500/30 hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/></svg>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Discord</span>
                </a>
              </div>
            </div> */}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 my-8"></div>

          {/* Bottom Section */}
          <div className="space-y-6">
            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link to="/privacy" className="text-slate-500 hover:text-[#229fc5] transition-colors duration-200 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privacy Policy
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/terms" className="text-slate-500 hover:text-[#229fc5] transition-colors duration-200 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Terms of Service
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/cookies" className="text-slate-500 hover:text-[#229fc5] transition-colors duration-200 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Cookie Settings
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/contact" className="text-slate-500 hover:text-[#229fc5] transition-colors duration-200 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </Link>
            </div>

            {/* Trust Badges
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
                <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <span className="font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium">SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="font-medium">99.9% Uptime</span>
              </div>
            </div> */}

            {/* Copyright */}
            <div className="text-center">
              <p className="text-slate-500 text-sm">
                &copy; 2026 <span className="text-slate-400 font-semibold">ProjectMaster</span>. All rights reserved. Made with <span className="text-red-500">♥</span> for teams worldwide.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Intro;

