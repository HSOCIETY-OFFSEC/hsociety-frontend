import React, { useMemo, useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiMessageSquare, FiShield, FiStar } from 'react-icons/fi';
import { useAuth } from '../../../core/auth/AuthContext';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import { validateForm } from '../../../core/validation/input.validator';
import { submitFeedback } from '../services/feedback.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import feedbackContent from '../../../data/static/feedback.json';
import { logger } from '../../../core/logging/logger';
import {
  publicBadge,
  publicBadgePulse,
  publicCtaCard,
  publicCtaInner,
  publicCtaSection,
  publicHeroDesc,
  publicHeroGrid,
  publicHeroPanel,
  publicHeroSection,
  publicHeroStat,
  publicHeroStats,
  publicHeroTitle,
  publicList,
  publicListItem,
  publicPage,
  publicSection,
} from '../../../shared/styles/publicClasses';

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

  const iconMap = useMemo(() => ({
    FiAlertTriangle,
    FiStar,
    FiShield,
    FiMessageSquare,
    FiClock
  }), []);
  
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

  const inputBase =
    'w-full rounded-md border-2 border-border bg-[var(--input-bg)] px-4 py-3 text-base text-text-primary placeholder:text-text-tertiary transition focus:border-brand focus:bg-[var(--input-bg-focus)] focus:outline-none focus:ring-2 focus:ring-brand/20';
  const inputError = 'border-status-danger';

  const typeCardBase =
    'relative flex cursor-pointer items-start gap-3 rounded-lg border-2 border-border bg-[var(--input-bg)] p-5 transition-all duration-200';
  const typeCardHover = 'hover:-translate-y-0.5 hover:border-brand hover:bg-bg-tertiary hover:shadow-md';
  const typeCardSelected =
    'border-brand bg-[color-mix(in_srgb,var(--primary-color)_12%,var(--bg-secondary))] shadow-[0_0_0_3px_var(--primary-color-alpha)]';

  const feedbackTypes = feedbackContent.types.map((item) => ({
    ...item,
    icon: iconMap[item.icon]
  }));

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
        throw new Error(getPublicErrorMessage({ action: 'submit', response }));
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
      setFormErrors({ submit: feedbackContent.errors.submit });
      logger.error('Feedback submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${publicPage} text-text-primary`}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={`hero-section reveal-on-scroll ${publicHeroSection}`}>
        <div className={`section-container ${publicHeroGrid}`}>
          <div>
            <h1 className={publicHeroTitle}>{feedbackContent.header.title}</h1>
            <p className={publicHeroDesc}>{feedbackContent.header.subtitle}</p>
          </div>
          <div className={publicHeroPanel}>
            <div className="hs-signature" aria-hidden="true" />
            <p className={`${publicBadge} ${publicBadgePulse}`}>Feedback live</p>
            <div className={publicList}>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Direct operator review within 24 hours.</span>
              </div>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Actionable follow-up for critical issues.</span>
              </div>
              <div className={publicListItem}>
                <FiCheckCircle size={14} />
                <span>Transparent tracking with ticket receipts.</span>
              </div>
            </div>
            <div className={publicHeroStats}>
              <span className={publicHeroStat}>
                <strong>24h</strong> response
              </span>
              <span className={publicHeroStat}>
                <strong>Live</strong> routing
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDS ────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicSection}`}>
        <div className="section-container">

          {/* Success Message */}
          {submitSuccess && (
            <Card
              padding="large"
              shadow="medium"
              className="reveal-on-scroll border-2 border-[color:rgb(var(--success-rgb))] bg-[color-mix(in_srgb,rgb(var(--success-rgb))_12%,var(--bg-secondary))]"
            >
              <div className="flex flex-col items-center gap-4 px-4 py-8 text-center max-md:px-2">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-[color:rgb(var(--success-rgb))] text-ink-white animate-scale-in max-md:h-16 max-md:w-16">
                  <FiCheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-semibold text-text-primary max-md:text-xl">{feedbackContent.success.title}</h2>
                <p className="max-w-[500px] text-base leading-relaxed text-text-secondary">
                  {feedbackContent.success.message}
                </p>
                {submittedReceipt?.contact?.allowContact && (
                  <p className="rounded-md border-l-[3px] border-brand bg-[var(--input-bg)] px-5 py-3 text-[0.95rem] text-text-secondary">
                    {feedbackContent.success.contactNote}{' '}
                    <strong className="text-brand">{submittedReceipt?.contact?.email || formData.email}</strong> if we need additional information.
                  </p>
                )}
                {submittedReceipt?.ticketNumber && (
                  <p className="rounded-md border-l-[3px] border-brand bg-[var(--input-bg)] px-5 py-3 text-[0.95rem] text-text-secondary">
                    {feedbackContent.success.ticketLabel} <strong>{submittedReceipt.ticketNumber}</strong>
                  </p>
                )}
                <Button
                  variant="primary"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setSubmittedReceipt(null);
                  }}
                  className="mt-4"
                >
                  {feedbackContent.success.button}
                </Button>
              </div>
            </Card>
          )}

          {/* Feedback Form */}
          {!submitSuccess && (
            <Card padding="large" shadow="medium" className="reveal-on-scroll">
              {/* Error Message */}
              {formErrors.submit && (
                <div className="mb-6 flex items-center gap-3 rounded-md border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger animate-slide-down">
                  <span className="inline-flex text-lg">
                    <FiAlertTriangle size={18} />
                  </span>
                  {formErrors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Feedback Type Selection */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold text-text-primary">{feedbackContent.form.typeLabel}</h3>
                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    {feedbackTypes.map(type => (
                      <label
                        key={type.value}
                        className={[
                          typeCardBase,
                          typeCardHover,
                          formData.type === type.value ? typeCardSelected : '',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={formData.type === type.value}
                          onChange={handleInputChange}
                          className="absolute opacity-0 pointer-events-none"
                        />
                        <div className="flex w-full flex-col gap-2">
                          <div className="inline-flex items-center gap-2 text-base font-semibold text-text-primary">
                            <span className="inline-flex text-brand">
                              <type.icon size={18} />
                            </span>
                            {type.label}
                          </div>
                          <div className="text-sm leading-relaxed text-text-secondary">{type.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold text-text-primary">{feedbackContent.form.contactLabel}</h3>
                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-text-primary" htmlFor="name">
                        {feedbackContent.form.nameLabel}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={feedbackContent.form.namePlaceholder}
                        className={`${inputBase} min-h-[44px] ${formErrors.name ? inputError : ''}`}
                        required
                      />
                      {formErrors.name && (
                        <span className="text-[0.85rem] text-status-danger">{formErrors.name}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-text-primary" htmlFor="email">
                        {feedbackContent.form.emailLabel}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={feedbackContent.form.emailPlaceholder}
                        className={`${inputBase} min-h-[44px] ${formErrors.email ? inputError : ''}`}
                        required
                      />
                      {formErrors.email && (
                        <span className="text-[0.85rem] text-status-danger">{formErrors.email}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback Details */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-semibold text-text-primary">{feedbackContent.form.detailsLabel}</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-primary" htmlFor="subject">
                      {feedbackContent.form.subjectLabel}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder={feedbackContent.form.subjectPlaceholder}
                      className={`${inputBase} min-h-[44px] ${formErrors.subject ? inputError : ''}`}
                      required
                    />
                    {formErrors.subject && (
                      <span className="text-[0.85rem] text-status-danger">{formErrors.subject}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-primary" htmlFor="message">
                      {feedbackContent.form.messageLabel}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={feedbackContent.form.messagePlaceholder}
                      rows={8}
                      className={`${inputBase} min-h-[150px] resize-y leading-relaxed ${formErrors.message ? inputError : ''}`}
                      required
                    />
                    {formErrors.message && (
                      <span className="text-[0.85rem] text-status-danger">{formErrors.message}</span>
                    )}
                    <span className="text-[0.85rem] text-text-secondary">
                      {feedbackContent.form.detailsHintPrefix} • {formData.message.length} / 20
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-primary" htmlFor="priority">
                      {feedbackContent.form.priorityLabel}
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className={`${inputBase} min-h-[44px] cursor-pointer appearance-none pr-10`}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                      }}
                    >
                      {feedbackContent.form.priorityOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferences */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="allowContact"
                        checked={formData.allowContact}
                        onChange={handleInputChange}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-brand"
                      />
                      <span className="text-[0.95rem] leading-relaxed text-text-secondary">
                        {feedbackContent.form.allowContact}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 max-sm:flex-col">
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? feedbackContent.form.submitting : feedbackContent.form.submit}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Info Cards */}
          <div className="grid gap-4 pt-4 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] reveal-on-scroll">
            {feedbackContent.infoCards.map((card) => {
              const InfoIcon = iconMap[card.icon];
              return (
                <Card key={card.title} padding="medium" shadow="small">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex text-2xl text-brand">
                      {InfoIcon && <InfoIcon size={18} />}
                    </span>
                    <div>
                      <h4 className="text-base font-semibold text-text-primary">{card.title}</h4>
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {card.description}{' '}
                        {card.link && (
                          <a className="font-semibold text-brand underline hover:text-brand-hover" href={`mailto:${card.link}`}>
                            {card.link}
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className={`reveal-on-scroll ${publicCtaSection}`}>
        <div className={`section-container ${publicCtaInner}`}>
          <div>
            <p className="section-eyebrow">
              <span className="eyebrow-dot" />
              Need support
            </p>
            <h2 className="section-title">We read every submission.</h2>
            <p className="section-subtitle">Our team reviews feedback and ships fixes fast.</p>
          </div>
          <div className={publicCtaCard}>
            <div className="hs-signature" aria-hidden="true" />
            <h3 className="text-[1.05rem] font-semibold text-text-primary">Prefer email?</h3>
            <p className="text-[0.98rem] leading-relaxed text-text-secondary">
              Reach out via the contact page for direct support.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
