import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/features/landing/pathways.css';

const PathwaysSection = () => {
  const navigate = useNavigate();

  return (
    <section className="pathways-section reveal-on-scroll">
      <div className="section-container">
        <div className="pathways-grid">
          <Card padding="large" className="pathway-card reveal-on-scroll">
            <h3>For Aspiring Cybersecurity Professionals</h3>
            <ul className="pathway-list">
              <li>Paid beginner-friendly offensive security training</li>
              <li>Community integration</li>
              <li>Supervised real-world engagements</li>
              <li>Professional pentesting pathway</li>
            </ul>
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate('/register')}
            >
              Join as a Student
            </Button>
          </Card>

          <Card padding="large" className="pathway-card reveal-on-scroll">
            <h3>For Companies & Organizations</h3>
            <ul className="pathway-list">
              <li>Supervised security audits</li>
              <li>Professional penetration testing</li>
              <li>Full reporting & remediation</li>
              <li>Long-term security partnership</li>
            </ul>
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate('/corporate/pentest')}
            >
              Request Security Assessment
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PathwaysSection;
