import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../shared/components/common/Logo';
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
            <div className="cta-logo">
              <Logo size="large" />
            </div>
            <h2 className="cta-title">Ready to Secure Your Systems?</h2>
            <p className="cta-description">
              Get started with a free consultation and discover your security vulnerabilities
              before attackers do.
            </p>
            <div className="cta-buttons">
              <Button 
                variant="primary" 
                size="large"
                onClick={() => navigate('/login')}
              >
                Request Pentest
              </Button>
              <Button 
                variant="ghost" 
                size="large"
                onClick={() => navigate('/feedback')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CtaSection;
