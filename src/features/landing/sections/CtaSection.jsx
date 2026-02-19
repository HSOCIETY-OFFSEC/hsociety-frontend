import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/features/landing/cta.css';

const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section reveal-on-scroll">
      <div className="cta-container">
        <Card padding="large" className="cta-card">
          <div className="cta-content">
            <div className="cta-panel">
              <h2 className="cta-title">Start Your Offensive Security Journey</h2>
              <p className="cta-description">
                Join the paid training cycle and move from beginner to professional penetration tester.
              </p>
              <Button
                variant="primary"
                size="large"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>

            <div className="cta-divider" aria-hidden="true" />

            <div className="cta-panel">
              <h2 className="cta-title">Secure Your Organization</h2>
              <p className="cta-description">
                Request a supervised penetration test with clear reporting and remediation guidance.
              </p>
              <Button
                variant="ghost"
                size="large"
                onClick={() => navigate('/corporate/pentest')}
              >
                Request Pentest
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CtaSection;
