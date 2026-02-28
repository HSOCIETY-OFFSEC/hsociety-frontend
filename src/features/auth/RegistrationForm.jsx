import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import { buildRegisterDTO, validateRegisterForm } from './register.contract';
import { registerUser } from './register.service';
import { login as loginRequest } from '../../core/auth/auth.service';
import { useAuth } from '../../core/auth/AuthContext';
import '../../styles/core/auth.css';

const RegistrationForm = ({
  defaultAccountType = 'corporate',
  allowAccountTypeSwitch = true,
  note = '',
  onSuccessRedirect = '/login'
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    accountType: defaultAccountType,
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

  const resolveDashboardRoute = (role) => {
    if (role === 'student') return '/student-dashboard';
    return '/corporate-dashboard';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      if (!response.success) throw new Error(response.error || 'Registration failed');

      const successRoute =
        onSuccessRedirect && onSuccessRedirect !== '/login'
          ? onSuccessRedirect
          : resolveDashboardRoute(payload.role);

      if (response.isMock) {
        const mockUser = response.data || {
          id: `mock-${Date.now()}`,
          email: payload.credentials.email,
          role: payload.role,
          name: payload.profile?.fullName
        };
        await login(mockUser, 'mock-token');
        navigate(successRoute);
        return;
      }

      if (response.data?.token) {
        const userData = response.data.user || {
          email: payload.credentials.email,
          role: payload.role,
          name: payload.profile?.fullName
        };
        await login(userData, response.data.token, response.data.refreshToken);
        navigate(successRoute);
        return;
      }

      const loginResponse = await loginRequest(
        payload.credentials.email,
        payload.credentials.password
      );

      if (loginResponse.success && !loginResponse.twoFactorRequired) {
        const role = loginResponse.user?.role || payload.role;
        await login(loginResponse.user, loginResponse.token, loginResponse.refreshToken);
        navigate(resolveDashboardRoute(role));
        return;
      }

      navigate('/login', {
        state: {
          email: payload.credentials.email,
          redirect: successRoute
        }
      });
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card" padding="medium">
      <div className="auth-header">
        <h1>Create Account</h1>
        <p className="auth-subtitle">
          {allowAccountTypeSwitch
            ? 'Register as a corporate team or student and get started.'
            : 'Create a corporate team account to request HSOCIETY services and client dashboards.'}
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

      {note && <p className="auth-note">{note}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        {allowAccountTypeSwitch ? (
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
        ) : (
          <div className="form-group">
            <label>Account Type</label>
            <div className="auth-account-label">Corporate account</div>
          </div>
        )}

        <div className="auth-form-row">
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Wunpini Andani"
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
              placeholder={
                form.accountType === 'student' ? 'University name' : 'Company name'
              }
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
            type="email"
            className="form-input"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="you@company.com"
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
            placeholder="Create a secure password"
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
            placeholder="Repeat your password"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => updateField('agree', e.target.checked)}
              disabled={loading}
            />
            <span>
              I have read the <strong>HSOCIETY Terms</strong> and agree to the security policies.
            </span>
          </label>
        </div>

        <Button variant="primary" size="large" type="submit" loading={loading} fullWidth>
          Create Account
        </Button>
      </form>
    </Card>
  );
};

export default RegistrationForm;
