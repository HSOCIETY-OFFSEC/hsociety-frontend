import React from 'react';
import { FiBarChart2, FiCheckCircle, FiShield } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import '../../styles/sections/case-studies/index.css';

const CaseStudies = () => {
  useScrollReveal();

  const studies = [
    {
      title: 'Fintech API Exposure',
      outcome: 'Reduced exploitability by 74% in 30 days.',
      focus: 'Auth bypass, token replay, CI/CD secrets.',
      icon: FiShield
    },
    {
      title: 'Telecom Phishing Response',
      outcome: 'Cut incident time by 46% and improved detection.',
      focus: 'Awareness playbooks, SOC triage workflow.',
      icon: FiCheckCircle
    },
    {
      title: 'Critical Infrastructure Review',
      outcome: 'Validated segmentation and access controls.',
      focus: 'Network pivoting, lateral movement controls.',
      icon: FiBarChart2
    }
  ];

  return (
    <div className="case-studies-page">
        <header className="case-studies-hero reveal-on-scroll">
          <h1>Case Studies</h1>
          <p>Outcome-driven security work with measurable results.</p>
          <div className="case-studies-meta">
            <div>
              <span className="meta-value">74%</span>
              <span className="meta-label">risk reduction avg</span>
            </div>
            <div>
              <span className="meta-value">30 days</span>
              <span className="meta-label">median fix cycle</span>
            </div>
            <div>
              <span className="meta-value">100%</span>
              <span className="meta-label">report completeness</span>
            </div>
          </div>
        </header>

        <section className="case-studies-grid reveal-on-scroll">
          {studies.map((study) => (
            <Card key={study.title} padding="large" className="case-studies-card">
              <div className="case-studies-icon">
                <study.icon size={24} />
              </div>
              <h3>{study.title}</h3>
              <p>{study.focus}</p>
              <div className="case-studies-outcome">{study.outcome}</div>
              <Button variant="ghost" size="small">Read More</Button>
            </Card>
          ))}
        </section>
    </div>
  );
};

export default CaseStudies;
