import React from 'react';
import { FiCompass, FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/ui/Button';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import '../../styles/sections/careers/index.css';

const Careers = () => {
  const navigate = useNavigate();
  useScrollReveal();
  const heroCopy =
    'We are pausing hiring for now while we focus on internal programs and training. Keep an eye on this page for future opportunities as we scale.';

  return (
    <div className="careers-page">
      <header className="careers-hero reveal-on-scroll">
        <div>
          <p className="careers-kicker">Careers</p>
          <h1>We aren’t hiring right now.</h1>
          <p>{heroCopy}</p>
          <div className="careers-hero-meta">
            <div>
              <span className="meta-value">Still curious?</span>
              <span className="meta-label">Stay in touch</span>
            </div>
            <div>
              <span className="meta-value">Future roles</span>
              <span className="meta-label">will land here</span>
            </div>
            <div>
              <span className="meta-value">Building</span>
              <span className="meta-label">community first</span>
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          size="large"
          onClick={() => navigate('/contact')}
        >
          <FiMessageSquare size={18} />
          Notify Me
        </Button>
      </header>

      <section className="careers-grid reveal-on-scroll">
        <div className="careers-status-card">
          <h3>What’s next?</h3>
          <p>
            We are enhancing bootcamp programming and internal delivery before opening new roles.
            Follow our updates or revisit this page later in 2026 to review new openings.
          </p>
        </div>
        <div className="careers-status-card">
          <h3>Want to stay informed?</h3>
          <p>
            The next batch of roles will include analysts, builders, and mentors. Drop us a note today and
            we will reach out when the hiring window reopens.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Careers;
