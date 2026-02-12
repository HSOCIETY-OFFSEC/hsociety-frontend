import React, { useState } from 'react';
import { FiAlertTriangle, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Logo from '../../shared/components/common/Logo';
import Navbar from '../../shared/components/layout/Navbar';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import { buildRegisterDTO, validateRegisterForm } from './register.contract';
import { registerUser } from './register.service';
import '../../styles/core/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    accountType: 'corporate',
    name: '',
    email: '',
    companyOrSchool: '',
    password: '',
    confirmPassword: '',
    agree: false
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateRegisterForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = buildRegisterDTO(form);
      const response = await registerUser(payload);
      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }
      navigate('/login', { state: { email: payload.credentials.email } });
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-wrapper">
          <div className="auth-logo">
            <Logo size="large" />
          </div>

          <Card className="auth-card">
            <div className="auth-header">
              <h1>Create Account</h1>
              <p className="auth-subtitle">
                Register as a corporate team or student and get started.
              </p>
            </div>

            {error && (
              <div className="auth-error">
                <span className="error-icon">
                  <FiAlertTriangle size={16} />
                </span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Account Type</label>
                <div className="auth-toggle">
                  <button
                    type="button"
                    className={form.accountType === 'corporate' ? 'active' : ''}
                    onClick={() => updateField('accountType', 'corporate')}
                    disabled={loading}
                  >
                    Corporate
                  </button>
                  <button
                    type="button"
                    className={form.accountType === 'student' ? 'active' : ''}
                    onClick={() => updateField('accountType', 'student')}
                    disabled={loading}
                  >
                    Student
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-name">Full Name</label>
                <input
                  id="register-name"
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Jane Doe"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-email">Email Address</label>
                <input
                  id="register-email"
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-org">
                  {form.accountType === 'student' ? 'School / Program' : 'Company'}
                </label>
                <input
                  id="register-org"
                  type="text"
                  className="form-input"
                  value={form.companyOrSchool}
                  onChange={(e) => updateField('companyOrSchool', e.target.value)}
                  placeholder={form.accountType === 'student' ? 'University name' : 'Company name'}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  type="password"
                  className="form-input"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="At least 8 characters"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-confirm-password">Confirm Password</label>
                <input
                  id="register-confirm-password"
                  type="password"
                  className="form-input"
                  value={form.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  disabled={loading}
                />
              </div>

              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => updateField('agree', e.target.checked)}
                  disabled={loading}
                />
                <span>I agree to the Terms and Privacy Policy</span>
              </label>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="auth-link-inline"
                  disabled={loading}
                >
                  Login
                </button>
              </p>
            </div>
          </Card>

          <div className="auth-notice">
            <p>
              <span className="notice-icon">
                <FiLock size={16} />
              </span>
              Your registration data is encrypted in transit.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
