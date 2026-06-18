import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const OnboardingCheck = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect if still loading or already on onboarding/template pages
    if (loading || location.pathname === '/onboarding' || location.pathname === '/templates') {
      return;
    }

    // Check if user exists and hasn't completed onboarding
    if (user && !user.onboardingCompleted) {
      // Only redirect to onboarding if user is trying to access protected routes
      const protectedRoutes = ['/dashboard', '/projects', '/tasks', '/settings', '/analytics'];
      const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
      
      if (isProtectedRoute) {
        navigate('/onboarding', { replace: true });
      }
    } else if (user && user.onboardingCompleted) {
      // Only check template selection if user completed onboarding
      // Add a delay to allow React state to update after template selection
      const timer = setTimeout(() => {
        if (user && !user.templateSelected) {
          // Only redirect if we're on a protected route and not coming from templates
          const protectedRoutes = ['/dashboard', '/projects', '/tasks', '/settings', '/analytics'];
          const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
          
          if (isProtectedRoute && location.pathname !== '/dashboard') {
            // Don't redirect if we're already on dashboard (state might be updating)
            navigate('/templates', { replace: true });
          }
        }
      }, 300); // Increased delay to allow state to propagate
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, navigate, location.pathname]);

  return <>{children}</>;
};

export default OnboardingCheck;
