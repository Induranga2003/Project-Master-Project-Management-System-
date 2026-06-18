import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingCheck from './components/OnboardingCheck';
import Navbar from './components/Navbar';
import Intro from './pages/Intro';
import Login from './pages/Login';
import Register from './pages/Register';

import Onboarding from './pages/Onboarding';
import TemplateSelection from './pages/TemplateSelection';
import OnboardingTutorial from './components/OnboardingTutorial';
import ResetPassword from './pages/ResetPassword';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Cookies from './pages/Cookies';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Search from './pages/Search';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import TimeLog from './pages/TimeLog';
import Resources from './pages/Resources';
import Templates from './pages/Templates';
import InvitationAcceptance from './pages/InvitationAcceptance';
import MyInvitations from './pages/MyInvitations';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';

// Google OAuth Client ID - Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';

// Warn if Google Client ID is not set
if (!process.env.REACT_APP_GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
  console.warn('⚠️ Google OAuth Client ID not set! Google Sign-In will not work.');
  console.warn('Please create a .env file in the frontend folder with: REACT_APP_GOOGLE_CLIENT_ID=your_client_id');
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <DarkModeProvider>
        <Router>
          <AuthProvider>
            <OnboardingCheck>
              <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/login" element={<><Navbar /><Login /></>} />
            <Route path="/register" element={<><Navbar /><Register /></>} />

            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><TemplateSelection /></ProtectedRoute>} />
            <Route path="/tutorial" element={<ProtectedRoute><OnboardingTutorial /></ProtectedRoute>} />
            <Route path="/reset-password" element={<><Navbar /><ResetPassword /></>} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cookies" element={<Cookies />} />

            <Route path="/invitations/:invitationId/:token" element={<InvitationAcceptance />} />
            <Route path="/my-invitations" element={<ProtectedRoute><MyInvitations /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/time-log" element={<ProtectedRoute><TimeLog /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

              </Routes>
            </OnboardingCheck>
          </AuthProvider>
        </Router>
      </DarkModeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
