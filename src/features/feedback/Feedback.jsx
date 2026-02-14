import React, { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiMessageSquare, FiShield, FiStar } from 'react-icons/fi';
import { useAuth } from '../../core/auth/AuthContext';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { validateForm } from '../../core/validation/input.validator';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import { submitFeedback } from './feedback.service';
import '../../styles/features/feedback.css';

/**
 * Feedback Component
 * Location: src/features/feedback/Feedback.jsx
 * 
 * Features:
 * - Submit feedback without authentication
 * - Multiple feedback types (bug, feature, general)
 * - File attachment support (placeholder)
 * - Email notification option
 * - Success confirmation
 * 
 * Note: This page is publicly accessible
 * TODO: Backend integration for feedback submission
 */

const Feedback = () => {
  const { user } = useAuth();

  useScrollReveal();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    type: 'general',
    subject: '',
    message: '',
    priority: 'normal',
    allowContact: true
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: FiAlertTriangle, description: 'Report a technical issue' },
    { value: 'feature', label: 'Feature Request', icon: FiStar, description: 'Suggest a new feature' },
    { value: 'security', label: 'Security Concern', icon: FiShield, description: 'Report a security issue' },
    { value: 'general', label: 'General Feedback', icon: FiMessageSquare, description: 'Share your thoughts' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitSuccess(false);
    setSubmittedReceipt(null);

    const validationInput = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    };

    const validationRules = {
      name: { required: true, minLength: 2 },
      email: { required: true, type: 'email' },
      subject: { required: true, minLength: 5 },
      message: { required: true, minLength: 20 }
    };

    const validation = validateForm(validationInput, validationRules);

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        ...validation.sanitizedData
      };
      const response = await submitFeedback(payload);
      if (!response.success) {
        throw new Error(response.error || 'Failed to submit feedback.');
      }

      setSubmittedReceipt({
        ...response.data,
        contact: response.data?.contact || {
          name: payload.name,
          email: payload.email,
          allowContact: payload.allowContact
        }
      });
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        type: 'general',
        subject: '',
        message: '',
        priority: 'normal',
        allowContact: true
      });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setFormErrors({ submit: 'Failed to submit feedback. Please try again.' });
      console.error('Feedback submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-container">
        <div className="feedback-wrapper">
          {/* Header */}
          <div className="feedback-header reveal-on-scroll">
            <h1 className="feedback-title">We Value Your Feedback</h1>
            <p className="feedback-subtitle">
              Help us improve by sharing your thoughts, reporting issues, or suggesting features
            </p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <Card padding="large" shadow="medium" className="success-card reveal-on-scroll">
              <div className="success-content">
                <div className="success-icon-large">
                  <FiCheckCircle size={40} />
                </div>
                <h2>Thank You!</h2>
                <p>
                  Your feedback has been submitted successfully. We appreciate you taking the time
                  to help us improve HSOCIETY.
                </p>
                {submittedReceipt?.contact?.allowContact && (
                  <p className="contact-note">
                    We'll reach out to you at <strong>{submittedReceipt?.contact?.email || formData.email}</strong> if we need
                    additional information.
                  </p>
                )}
                {submittedReceipt?.ticketNumber && (
                  <p className="contact-note">
                    Ticket: <strong>{submittedReceipt.ticketNumber}</strong>
                  </p>
                )}
                <Button
                  variant="primary"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setSubmittedReceipt(null);
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  Submit Another Feedback
                </Button>
              </div>
            </Card>
          )}

          {/* Feedback Form */}
          {!submitSuccess && (
            <Card padding="large" shadow="medium" className="reveal-on-scroll">
              {/* Error Message */}
              {formErrors.submit && (
                <div className="error-message">
                  <span className="error-icon">
                    <FiAlertTriangle size={18} />
                  </span>
                  {formErrors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="feedback-form">
                {/* Feedback Type Selection */}
                <div className="form-section">
                  <h3 className="section-label">What type of feedback?</h3>
                  <div className="type-grid">
                    {feedbackTypes.map(type => (
                      <label
                        key={type.value}
                        className={`type-card ${formData.type === type.value ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={formData.type === type.value}
                          onChange={handleInputChange}
                          className="type-radio"
                        />
                        <div className="type-content">
                          <div className="type-label">
                            <span className="type-icon">
                              <type.icon size={18} />
                            </span>
                            {type.label}
                          </div>
                          <div className="type-description">{type.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="form-section">
                  <h3 className="section-label">Contact Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        className={`form-input ${formErrors.name ? 'error' : ''}`}
                        required
                      />
                      {formErrors.name && (
                        <span className="field-error">{formErrors.name}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={`form-input ${formErrors.email ? 'error' : ''}`}
                        required
                      />
                      {formErrors.email && (
                        <span className="field-error">{formErrors.email}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback Details */}
                <div className="form-section">
                  <h3 className="section-label">Feedback Details</h3>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Brief summary of your feedback"
                      className={`form-input ${formErrors.subject ? 'error' : ''}`}
                      required
                    />
                    {formErrors.subject && (
                      <span className="field-error">{formErrors.subject}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide detailed information about your feedback..."
                      rows={8}
                      className={`form-input ${formErrors.message ? 'error' : ''}`}
                      required
                    />
                    {formErrors.message && (
                      <span className="field-error">{formErrors.message}</span>
                    )}
                    <span className="field-hint">
                      Minimum 20 characters • {formData.message.length} / 20
                    </span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority Level</label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="low">Low - Minor issue or suggestion</option>
                      <option value="normal">Normal - Standard feedback</option>
                      <option value="high">High - Important issue</option>
                      <option value="critical">Critical - Urgent security concern</option>
                    </select>
                  </div>
                </div>

                {/* Preferences */}
                <div className="form-section">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="allowContact"
                        checked={formData.allowContact}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">
                        Allow us to contact you about this feedback
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Info Cards */}
          <div className="info-section reveal-on-scroll">
            <Card padding="medium" shadow="small">
              <div className="info-card">
                <span className="info-icon">
                  <FiShield size={18} />
                </span>
                <div>
                  <h4>Privacy & Security</h4>
                  <p>
                    Your feedback is confidential and will only be used to improve our services.
                    For security concerns, we respond within 24 hours.
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="medium" shadow="small">
              <div className="info-card">
                <span className="info-icon">
                  <FiClock size={18} />
                </span>
                <div>
                  <h4>Response Time</h4>
                  <p>
                    We typically respond to feedback within 2-3 business days. Critical security
                    issues are prioritized and addressed immediately.
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="medium" shadow="small">
              <div className="info-card">
                <span className="info-icon">
                  <FiMessageSquare size={18} />
                </span>
                <div>
                  <h4>Alternative Contact</h4>
                  <p>
                    Prefer email? You can also reach us directly at{' '}
                    <a href="mailto:feedback@hsociety.com">feedback@hsociety.com</a>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
};

export default Feedback;
