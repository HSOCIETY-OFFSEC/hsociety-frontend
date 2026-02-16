import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import '../../../styles/features/landing/pathways.css';

const PathwaysSection = ({ pathways = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="pathways-section reveal-on-scroll">
      <div className="section-container">
        <div className="pathways-grid">
          {pathways.map((pathway) => (
            <Card key={pathway.title} padding="large" className="pathway-card reveal-on-scroll">
              <h3>{pathway.title}</h3>
              <p>{pathway.description}</p>
              <Button
                variant="primary"
                size="small"
                onClick={() => navigate(pathway.path)}
              >
                {pathway.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PathwaysSection;
