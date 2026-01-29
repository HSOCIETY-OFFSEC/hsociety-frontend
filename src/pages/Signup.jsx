import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiMail, 
  HiLockClosed, 
  HiUser, 
  HiUserAdd, 
  HiEye, 
  HiEyeOff,
  HiCheckCircle 
} from 'react-icons/hi';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock signup - in real app, this would call an API
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Signup attempt:', formData);
    // Redirect to dashboard after "signup"
    navigate('/dashboard');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 33, label: 'Weak', color: '#ff4444' };
    if (password.length < 10) return { strength: 66, label: 'Medium', color: '#ffa500' };
    return { strength: 100, label: 'Strong', color: '#00ff88' };
  };

  const strength = passwordStrength();

  return (
    <div className="page auth-page">
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-header">
            <div className="auth-icon">
              <HiUserAdd size={40} />
            </div>
            <h1 className="auth-title">Join Hsociety</h1>
            <p className="auth-subtitle">Create your account and start securing your future</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <HiUser size={18} />
                Full Name
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <HiMail size={18} />
                Email Address
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <HiLockClosed size={18} />
                Password
              </label>
              <div className="input-wrapper password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
              
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: `${strength.strength}%`,
                        backgroundColor: strength.color 
                      }}
                    ></div>
                  </div>
                  <span className="strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <HiCheckCircle size={18} />
                Confirm Password
              </label>
              <div className="input-wrapper password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
              
              {formData.confirmPassword && (
                <div className="password-match">
                  {formData.password === formData.confirmPassword ? (
                    <span className="match-success">
                      <HiCheckCircle size={16} />
                      Passwords match
                    </span>
                  ) : (
                    <span className="match-error">
                      Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="form-terms">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>
                  I agree to the{' '}
                  <Link to="#" className="auth-link">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="#" className="auth-link">Privacy Policy</Link>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              <HiUserAdd size={20} />
              Create Account
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Login here
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;