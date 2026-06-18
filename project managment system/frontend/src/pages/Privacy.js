import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
          <p className="text-slate-600 mb-8">Last updated: January 21, 2026</p>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">1. Information We Collect</h2>
              <p className="leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                update your profile, or communicate with us. This may include your name, email address, 
                and other contact information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">2. How We Use Your Information</h2>
              <p className="leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">3. Information Sharing</h2>
              <p className="leading-relaxed">
                We do not share your personal information with third parties except as described in this 
                privacy policy or with your consent. We may share information with service providers who 
                perform services on our behalf.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">4. Data Security</h2>
              <p className="leading-relaxed">
                We take reasonable measures to protect your information from unauthorized access, use, 
                or disclosure. However, no internet transmission is ever completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">5. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@projectmanager.com" className="text-[#229fc5] hover:text-[#1a7a9a]">
                  privacy@projectmanager.com
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

export default Privacy;
