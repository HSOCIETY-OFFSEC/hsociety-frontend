import React from 'react';
import { FiAlertCircle, FiClipboard, FiFileText, FiShield, FiUsers } from 'react-icons/fi';
import '../../styles/sections/terms/index.css';

const Terms = () => {
  return (
    <div className="terms-page">
      <header className="terms-hero">
        <p className="terms-kicker">Legal</p>
        <h1>Terms & Conditions</h1>
        <p className="terms-subtitle">
          Please review the terms that govern access to HSOCIETY training, services, and
          community platforms.
        </p>
        <div className="terms-meta">
          <span className="terms-chip">
            <FiFileText size={14} />
            Last updated: March 3, 2026
          </span>
          <span className="terms-chip">
            <FiShield size={14} />
            Applies to all HSOCIETY users
          </span>
        </div>
      </header>

      <section className="terms-section">
        <h2>
          <FiClipboard size={18} />
          Acceptance of Terms
        </h2>
        <p>
          By accessing HSOCIETY services, you agree to these Terms & Conditions and any
          supplemental policies referenced here. If you do not agree, you must not use
          the platform.
        </p>
      </section>

      <section className="terms-section">
        <h2>
          <FiUsers size={18} />
          Accounts & Eligibility
        </h2>
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activities that occur under your account. Corporate
          registrations may require verification before access to pentest workflows.
        </p>
      </section>

      <section className="terms-section">
        <h2>
          <FiShield size={18} />
          Acceptable Use
        </h2>
        <p>
          You may not use HSOCIETY systems to conduct unauthorized scanning, testing, or
          exploitation. Any offensive activity must be explicitly authorized within
          approved scopes and engagements.
        </p>
      </section>

      <section className="terms-section">
        <h2>
          <FiAlertCircle size={18} />
          Disclaimers & Limitations
        </h2>
        <p>
          Services are provided "as is" without warranties of any kind. HSOCIETY is not
          liable for indirect or consequential damages arising from use of the platform,
          to the maximum extent permitted by law.
        </p>
      </section>

      <section className="terms-section terms-section--last">
        <h2>
          <FiFileText size={18} />
          Contact & Updates
        </h2>
        <p>
          Terms may be updated periodically. Continued use of the platform after updates
          constitutes acceptance. For questions, contact ops@hsociety.africa.
        </p>
      </section>
    </div>
  );
};

export default Terms;
