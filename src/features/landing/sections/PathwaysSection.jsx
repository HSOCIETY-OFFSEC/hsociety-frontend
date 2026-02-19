import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/features/landing/pathways.css';

const PathwaysSection = ({ content }) => {
  const navigate = useNavigate();
  const { student, company } = content;

  return (
    <section className="pathways-section reveal-on-scroll">
      <div className="section-container">
        <div className="pathways-grid">
          <Card padding="large" className="pathway-card reveal-on-scroll">
            <h3>{student.title}</h3>
            <ul className="pathway-list">
              {student.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate(student.route)}
            >
              {student.cta}
            </Button>
          </Card>

          <Card padding="large" className="pathway-card reveal-on-scroll">
            <h3>{company.title}</h3>
            <ul className="pathway-list">
              {company.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate(company.route)}
            >
              {company.cta}
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PathwaysSection;
