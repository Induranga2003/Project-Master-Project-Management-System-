import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setLoading(true);

    try {
      const response = await authAPI.register({ name, email, password });
      login(response.data.user, response.data.token);
      // New users go to onboarding first
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.googleAuth(credentialResponse.credential);
      login(response.data.user, response.data.token);
      
      // Check if user is new or existing
      const user = response.data.user;
      if (!user.onboardingCompleted) {
        navigate('/onboarding');
      } else if (!user.templateSelected) {
        navigate('/templates');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google sign up error:', err);
      setError(err.response?.data?.message || 'Google sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign up failed. Make sure your Google Client ID is configured and the origin is authorized in Google Cloud Console.');
  };

  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    
    if (strength <= 2) return { level: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength <= 3) return { level: 'Fair', color: 'bg-yellow-500', width: '66%' };
    return { level: 'Strong', color: 'bg-cyan-500', width: '100%' };
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

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
          <span className="text-slate-400 text-sm">Already have an account?</span>
          <Link
            to="/login"
            className="px-6 py-2.5 bg-[#229fc5] text-white font-semibold rounded-md hover:bg-[#1a7a9a] transition duration-300 text-sm"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <img 
                  src="/Logo.png" 
                  alt="ProjectMaster Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
              <p className="text-slate-600">Start managing your projects today</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Google Sign-Up Button */}
            <div className="mb-6 w-full">
              <div className="w-full [&>div]:w-full [&>div>div]:w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                />
              </div>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={50}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#229fc5] transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#229fc5] transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#229fc5] transition-colors pr-12"
                    placeholder="•••••••• (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">Password Strength:</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.level === 'Weak' ? 'text-red-600' : 
                        passwordStrength.level === 'Fair' ? 'text-yellow-600' : 'text-cyan-600'
                      }`}>
                        {passwordStrength.level}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`} 
                        style={{ width: passwordStrength.width }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#229fc5] transition-colors pr-12"
                    placeholder="•••••••• (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-400"
                  />
                </div>
                <label htmlFor="terms" className="ml-3 text-sm text-slate-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#229fc5] hover:text-[#1a7a9a] font-semibold">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-[#229fc5] hover:text-[#1a7a9a] font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="w-full bg-gradient-to-r from-[#229fc5] to-[#1a7a9a] text-white font-semibold py-3 px-4 rounded-lg hover:from-[#1a7a9a] hover:to-[#229fc5] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-slate-600 mt-6 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#229fc5] font-semibold hover:text-[#1a7a9a]">
                Sign in here
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black border-t border-slate-800 overflow-hidden mt-auto">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#229fc5] rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-16">
          {/* Main Footer Content - Centered */}
          <div className="text-center mb-12">
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
}
