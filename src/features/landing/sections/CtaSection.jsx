import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import brandImageBlack from '../../../assets/brand-images/brand-image-black.png';
import brandImageWhite from '../../../assets/brand-images/brand-image-white.png';
import '../../../styles/features/landing/cta.css';

const CtaSection = ({ content }) => {
  const navigate = useNavigate();
  const { left, right } = content;

  return (
    <section className="cta-section reveal-on-scroll">
      <div className="cta-container">
        <Card padding="large" className="cta-card">
          <div className="cta-content">
            <div className="cta-panel">
              <div className="cta-media dark">
                <img src={brandImageBlack} alt="HSOCIETY brand mark" loading="lazy" />
              </div>
              <h2 className="cta-title">{left.title}</h2>
              <p className="cta-description">{left.description}</p>
              <Button
                variant={left.variant}
                size="large"
                onClick={() => navigate(left.route)}
              >
                {left.button}
              </Button>
            </div>

            <div className="cta-divider" aria-hidden="true" />

            <div className="cta-panel">
              <div className="cta-media light">
                <img src={brandImageWhite} alt="HSOCIETY brand mark" loading="lazy" />
              </div>
              <h2 className="cta-title">{right.title}</h2>
              <p className="cta-description">{right.description}</p>
              <Button
                variant={right.variant}
                size="large"
                onClick={() => navigate(right.route)}
              >
                {right.button}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CtaSection;
