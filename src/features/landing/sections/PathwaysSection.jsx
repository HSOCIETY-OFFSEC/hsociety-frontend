import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/landing/pathways.css';

// Replace these with your actual image imports
import studentImg from '../../../assets/brand-images/brand-image-black.png';
import companyImg from '../../../assets/brand-images/brand-image-white.png';

const PathwaysSection = ({ content }) => {
  const navigate = useNavigate();
  const { student, company } = content;

  return (
    <section className="pathways-section reveal-on-scroll">
      <div className="section-container">
        <div className="pathways-grid">

          <Card padding="none" className="pathway-card reveal-on-scroll">
            <div className="pathway-card__image-wrapper">
              <img
                src={studentImg}
                alt={student.title}
                className="pathway-card__image"
              />
              <div className="pathway-card__image-overlay" />
            </div>
            <div className="pathway-card__body">
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
            </div>
          </Card>

          <Card padding="none" className="pathway-card reveal-on-scroll">
            <div className="pathway-card__image-wrapper">
              <img
                src={companyImg}
                alt={company.title}
                className="pathway-card__image"
              />
              <div className="pathway-card__image-overlay" />
            </div>
            <div className="pathway-card__body">
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
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
};

export default PathwaysSection;