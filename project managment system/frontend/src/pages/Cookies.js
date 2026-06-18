import React from 'react';
import { Link } from 'react-router-dom';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-5 bg-slate-900 shadow-xl border-b border-slate-700">
        <Link to="/" className="text-white text-xl font-bold flex items-center gap-3">
          <img 
            src="/Logo.png" 
            alt="ProjectMaster Logo" 
            className="w-10 h-10 object-contain"
          />
          <span className="text-2xl">ProjectMaster</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2.5 bg-[#229fc5] text-white font-semibold rounded-md hover:bg-[#1a7a9a] transition duration-300 text-sm"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#229fc5] to-[#1a7a9a] rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Cookie Policy</h1>
            <p className="text-slate-600">Last updated: January 22, 2026</p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What Are Cookies?</h2>
              <p className="mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p>
                ProjectMaster uses cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Cookies</h2>
              <p className="mb-4">We use cookies for the following purposes:</p>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-[#229fc5]">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Essential Cookies</h3>
                  <p>
                    These cookies are necessary for the website to function properly. They enable basic functions like 
                    page navigation, access to secure areas, and authentication. The website cannot function properly 
                    without these cookies.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Performance Cookies</h3>
                  <p>
                    These cookies help us understand how visitors interact with our website by collecting and reporting 
                    information anonymously. This helps us improve the way our website works.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Functional Cookies</h3>
                  <p>
                    These cookies enable the website to provide enhanced functionality and personalization. They may be 
                    set by us or by third-party providers whose services we have added to our pages.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-pink-500">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Targeting/Advertising Cookies</h3>
                  <p>
                    These cookies may be set through our site by our advertising partners. They may be used to build a 
                    profile of your interests and show you relevant advertisements on other sites.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Types of Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 border border-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Cookie Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Purpose</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">token</td>
                      <td className="px-6 py-4 text-sm text-slate-700">Authentication and session management</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">7 days</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">user_preferences</td>
                      <td className="px-6 py-4 text-sm text-slate-700">Store user settings and preferences</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">1 year</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">analytics_id</td>
                      <td className="px-6 py-4 text-sm text-slate-700">Track site usage and performance</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">2 years</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">cookie_consent</td>
                      <td className="px-6 py-4 text-sm text-slate-700">Remember your cookie preferences</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Cookies</h2>
              <p className="mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics, 
                deliver advertisements, and provide social media features. These include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Analytics:</strong> To analyze website traffic and usage patterns</li>
                <li><strong>Google OAuth:</strong> To enable sign-in with Google functionality</li>
                <li><strong>Social Media Platforms:</strong> To enable sharing and social features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Managing Cookies</h2>
              <p className="mb-4">
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights 
                by setting your preferences in the Cookie Consent Manager that appears when you first visit our website.
              </p>
              <p className="mb-4">
                Most web browsers automatically accept cookies, but you can usually modify your browser settings to 
                decline cookies if you prefer. Here's how to manage cookies in popular browsers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
              </ul>
              <p className="mt-4 text-sm text-slate-600">
                Please note that if you choose to disable cookies, some features of our website may not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or 
                our business operations. We encourage you to review this page periodically for the latest information.
              </p>
            </section>

            <section className="bg-gradient-to-r from-[#229fc5] to-[#1a7a9a] text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Questions About Cookies?</h2>
              <p className="mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email: privacy@projectmaster.com
                </p>
                <p>
                  Or visit our <Link to="/contact" className="underline hover:text-cyan-200">Contact Page</Link>
                </p>
              </div>
            </section>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black border-t border-slate-800 overflow-hidden mt-auto">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#229fc5] rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-16">
          <div className="border-t border-slate-800 my-8"></div>

          <div className="space-y-6">
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
}
