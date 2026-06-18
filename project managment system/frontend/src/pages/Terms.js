import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-5 bg-slate-900 shadow-xl border-b border-slate-700">
        <Link to="/" className="text-white text-xl font-bold flex items-center gap-3">
          <img src="/Logo.png" alt="ProjectMaster Logo" className="h-16 object-contain" />
          <span className="text-2xl">ProjectMaster</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-5 py-2 text-white hover:text-[#229fc5] transition duration-300 text-sm">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2.5 bg-[#229fc5] text-white font-semibold rounded-md hover:bg-[#1a7a9a] transition duration-300 text-sm">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Terms of Service</h1>
          <p className="text-slate-600 mb-8">Last updated: January 21, 2026</p>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using ProjectManagerMaster, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to these terms, please do not use 
                our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">2. Use License</h2>
              <p className="leading-relaxed mb-3">
                Permission is granted to temporarily use ProjectManagerMaster for personal or commercial purposes. 
                This license shall automatically terminate if you violate any of these restrictions.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must not modify or copy the materials</li>
                <li>You must not use the materials for any commercial purpose without authorization</li>
                <li>You must not attempt to reverse engineer any software</li>
                <li>You must not remove any copyright or proprietary notations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">3. User Accounts</h2>
              <p className="leading-relaxed">
                You are responsible for safeguarding the password that you use to access the service and 
                for any activities or actions under your password. You agree not to disclose your password 
                to any third party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">4. Disclaimer</h2>
              <p className="leading-relaxed">
                The materials on ProjectManagerMaster are provided on an 'as is' basis. ProjectManagerMaster makes 
                no warranties, expressed or implied, and hereby disclaims and negates all other warranties 
                including, without limitation, implied warranties or conditions of merchantability, fitness 
                for a particular purpose, or non-infringement of intellectual property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">5. Limitations</h2>
              <p className="leading-relaxed">
                In no event shall ProjectManagerMaster or its suppliers be liable for any damages (including, 
                without limitation, damages for loss of data or profit, or due to business interruption) 
                arising out of the use or inability to use ProjectManagerMaster.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">6. Modifications</h2>
              <p className="leading-relaxed">
                ProjectManagerMaster may revise these terms of service at any time without notice. By using 
                this service you are agreeing to be bound by the then current version of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">7. Contact Information</h2>
              <p className="leading-relaxed">
                Questions about the Terms of Service should be sent to us at{' '}
                <a href="mailto:legal@projectmanager.com" className="text-[#229fc5] hover:text-[#1a7a9a]">
                  legal@projectmanager.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-200">
            <Link to="/" className="text-[#229fc5] hover:text-[#1a7a9a] font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
