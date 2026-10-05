import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserShield, FaLock, FaUser, FaEye, FaEyeSlash, FaExclamationCircle, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const DEFAULT_USER_ID = 'admin';
const DEFAULT_PASSWORD = 'admin';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // If already logged in, redirect immediately to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setError('Please enter your User ID or Email');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(trimmedIdentifier, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Invalid User ID or Password.');
      }
    } catch (err) {
      setError('Something went wrong during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick auto-fill handler for testing / stored credentials
  const handleAutoFill = () => {
    setIdentifier(DEFAULT_USER_ID);
    setPassword(DEFAULT_PASSWORD);
    setError('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-bg-orb-1" />
      <div className="login-bg-orb-2" />

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-badge">
            <FaUserShield /> URU Admin Portal
          </div>
          <h1 className="login-title">Sign In</h1>
          <p className="login-subtitle">Enter your administrative credentials to continue</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-alert-error">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="login-identifier">User ID / Email</label>
            <div className="login-input-wrap">
              <input
                id="login-identifier"
                type="text"
                className="login-input"
                placeholder="Enter admin ID or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
              <FaUser className="login-input-icon" />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <div className="login-input-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <FaLock className="login-input-icon" />
              <button
                type="button"
                className="login-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Authenticating...'
            ) : (
              <>
                Sign In to Dashboard <FaArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Stored Credentials Box (as requested) */}
        <div className="login-demo-box">
          <div className="login-demo-header">
            <strong>🔑 Stored Admin Credentials:</strong>
            <button
              type="button"
              className="login-demo-autofill"
              onClick={handleAutoFill}
            >
              Fill Credentials
            </button>
          </div>
          <div className="login-demo-content">
            <div className="login-demo-item">
              User ID: <code>{DEFAULT_USER_ID}</code>
            </div>
            <div className="login-demo-item">
              Password: <code>{DEFAULT_PASSWORD}</code>
            </div>
          </div>
        </div>

        <p className="login-footer-text">
          Protected by JWT Token Authentication with Multi-Tab Auto Sync.
        </p>
      </div>
    </div>
  );
};

export default Login;
