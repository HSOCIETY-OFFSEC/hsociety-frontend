import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiUsers } from 'react-icons/fi';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import '../../styles/sections/pricing/index.css';

const tiers = [
  {
    title: 'Starter Security Review',
    price: 'From $2,500',
    details: 'Focused web and API assessment with prioritized report and remediation checklist.',
  },
  {
    title: 'Growth Pentest Sprint',
    price: 'From $6,000',
    details: 'Broader offensive test with exploit validation, debrief session, and retest window.',
  },
  {
    title: 'Continuous Security Partner',
    price: 'Custom',
    details: 'Quarterly pentests, ongoing advisory, and security roadmap support.',
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="pricing-page">
      <header className="pricing-hero reveal-on-scroll">
        <p className="pricing-kicker">Pricing & Engagements</p>
        <h1>Security Engagements That Scale With You</h1>
        <p>
          Choose a model based on your current risk posture and engineering capacity.
          Every plan includes evidence-first reporting and remediation guidance.
        </p>
      </header>

      <section className="pricing-grid reveal-on-scroll">
        {tiers.map((tier) => (
          <Card key={tier.title} padding="large" className="pricing-card">
            <h2>{tier.title}</h2>
            <p className="pricing-value">{tier.price}</p>
            <p>{tier.details}</p>
          </Card>
        ))}
      </section>

      <section className="pricing-actions reveal-on-scroll">
        <Button variant="primary" size="large" onClick={() => navigate('/contact')}>
          Talk to Security Team <FiArrowRight size={16} />
        </Button>
        <Button variant="ghost" size="large" onClick={() => navigate('/register/corporate')}>
          Create Corporate Account <FiUsers size={16} />
        </Button>
      </section>
    </div>
  );
};

export default Pricing;
