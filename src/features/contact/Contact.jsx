import React from 'react';
import { FiMail, FiMapPin, FiMessageSquare, FiPhone } from 'react-icons/fi';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import Logo from '../../shared/components/common/Logo';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import '../../styles/sections/contact/index.css';

const Contact = () => {
  useScrollReveal();

  return (
    <div className="contact-page">
      <header className="contact-hero reveal-on-scroll">
        <div className="contact-hero-inner">
          <div className="contact-hero-text">
            <p className="contact-kicker">Contact Us</p>
            <h1 className="contact-title">Talk to the HSOCIETY team.</h1>
            <p className="contact-subtitle">
              Whether you need a security partner or have a question about training,
              reach out and we will respond quickly.
            </p>
            <div className="contact-actions">
              <Button
                variant="primary"
                size="large"
                onClick={() => window.location.assign('mailto:ops@hsociety.africa')}
              >
                <FiMessageSquare size={18} />
                Email the Team
              </Button>
              <Button
                variant="secondary"
                size="large"
                onClick={() => window.location.assign('tel:+254700000000')}
              >
                <FiPhone size={18} />
                Call Support
              </Button>
            </div>
          </div>
          <div className="contact-hero-mark">
            <Logo size="large" />
          </div>
        </div>
      </header>

      <section className="contact-grid reveal-on-scroll">
        <Card padding="large" className="contact-card">
          <div className="contact-card-icon">
            <FiMail size={20} />
          </div>
          <h3>Email</h3>
          <p>ops@hsociety.africa</p>
          <span>Average response time: same business day.</span>
        </Card>

        <Card padding="large" className="contact-card">
          <div className="contact-card-icon">
            <FiPhone size={20} />
          </div>
          <h3>Phone</h3>
          <p>+254 700 000 000</p>
          <span>Weekdays, 9am–6pm EAT.</span>
        </Card>

        <Card padding="large" className="contact-card">
          <div className="contact-card-icon">
            <FiMapPin size={20} />
          </div>
          <h3>Presence</h3>
          <p>Remote-first across Africa</p>
          <span>Serving teams across the continent.</span>
        </Card>
      </section>
    </div>
  );
};

export default Contact;
