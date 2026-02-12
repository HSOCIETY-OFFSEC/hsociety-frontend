import React, { useState } from 'react';
import { FiAlertTriangle, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import Logo from '../../shared/components/common/Logo';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import '../../styles/core/auth.css';

/**
 * Login Component
 * 
 * Features:
 * - OTP-based login (placeholder for backend integration)
 * - 2FA support (placeholder)
 * - Secure input validation
 * - Auto logout on inactivity (handled by context)
 * - Theme-aware styling
 * 
 * Flow:
 * 1. User enters email
 * 2. Request OTP (backend placeholder)
 * 3. Enter OTP code
 * 4. Optional 2FA verification
 * 5. Successful login → Dashboard
 */

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form state
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: 2FA
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle email submission and OTP request
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Backend integration - Request OTP
      // await otpService.requestOTP(email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('OTP requested for:', email);
      setStep(2);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      console.error('OTP request error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Backend integration - Verify OTP
      // const response = await otpService.verifyOTP(email, otp);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('OTP verified:', otp);
      
      // Check if 2FA is enabled for this user
      const requires2FA = true; // TODO: Get from backend response
      
      if (requires2FA) {
        setStep(3);
      } else {
        await completeLogin();
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA verification
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError('');
    
    if (twoFACode.length !== 6) {
      setError('2FA code must be 6 digits');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Backend integration - Verify 2FA
      // await twoFAService.verify(email, twoFACode);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('2FA verified:', twoFACode);
      await completeLogin();
    } catch (err) {
      setError('Invalid 2FA code. Please try again.');
      console.error('2FA verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Complete login and redirect
  const completeLogin = async () => {
    try {
      // TODO: Backend integration - Get auth token
      const mockUser = {
        id: '1',
        email: email,
        name: 'Test User',
        role: 'client'
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      await login(mockUser, mockToken);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  // Reset form
  const handleReset = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setTwoFACode('');
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Logo */}
        <div className="auth-logo">
          <Logo size="large" />
        </div>

        {/* Login Card */}
        <Card className="auth-card">
          <div className="auth-header">
            <h1>Secure Login</h1>
            <p className="auth-subtitle">
              {step === 1 && 'Enter your email to receive a one-time password'}
              {step === 2 && 'Enter the OTP sent to your email'}
              {step === 3 && 'Enter your 2FA authentication code'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="auth-error">
              <span className="error-icon">
                <FiAlertTriangle size={16} />
              </span>
              {error}
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  disabled={loading}
                  className="form-input"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Request OTP'}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="auth-form">
              <div className="form-group">
                <label htmlFor="otp">One-Time Password</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                  disabled={loading}
                  className="form-input otp-input"
                />
                <span className="form-hint">Check your email for the 6-digit code</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <button
                type="button"
                onClick={handleReset}
                className="auth-link"
                disabled={loading}
              >
                Use a different email
              </button>
            </form>
          )}

          {/* Step 3: 2FA Input */}
          {step === 3 && (
            <form onSubmit={handleVerify2FA} className="auth-form">
              <div className="form-group">
                <label htmlFor="twofa">Two-Factor Authentication</label>
                <input
                  type="text"
                  id="twofa"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                  disabled={loading}
                  className="form-input otp-input"
                />
                <span className="form-hint">Enter code from your authenticator app</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading || twoFACode.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify 2FA'}
              </Button>

              <button
                type="button"
                onClick={handleReset}
                className="auth-link"
                disabled={loading}
              >
                Start over
              </button>
            </form>
          )}

          {/* Register Link */}
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="auth-link-inline"
                disabled={loading}
              >
                Register here
              </button>
            </p>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="auth-notice">
          <p>
            <span className="notice-icon">
              <FiLock size={16} />
            </span>
            Your security is our priority. All communications are encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
