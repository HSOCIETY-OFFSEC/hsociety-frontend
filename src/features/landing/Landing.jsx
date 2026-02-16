import React from 'react';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import {
  HeroSection,
  StatsSection,
  ServicesSection,
  WhySection,
  ProcessSection,
  DeliverablesSection,
  ModulesSection,
  TrustSection,
  PathwaysSection,
  CycleSection,
  CtaSection,
  FooterSection
} from './sections';
import { FiBarChart2, FiCheckCircle, FiClipboard, FiCpu, FiFileText, FiGlobe, FiLayers, FiLock, FiMessageSquare, FiSearch, FiShield, FiTarget, FiTerminal, FiUsers, FiZap } from 'react-icons/fi';
import '../../styles/features/landing.css';

/**
 * Landing Page Component
 * Location: src/features/landing/Landing.jsx
 * 
 * Features:
 * - Hero section with CTA
 * - Services showcase
 * - Why choose us section
 * - Security-focused design
 * - Smooth animations
 */

const Landing = () => {
  useScrollReveal();

  const services = [
    {
      icon: FiShield,
      title: 'Penetration Testing',
      description: 'Comprehensive security assessments to identify vulnerabilities before attackers do.',
      features: ['Web Applications', 'Mobile Apps', 'Network Infrastructure', 'API Security']
    },
    {
      icon: FiFileText,
      title: 'Security Audits',
      description: 'In-depth analysis and reporting of your security posture with actionable remediation steps.',
      features: ['Compliance Checks', 'Risk Assessment', 'Detailed Reports', 'Remediation Support']
    },
    {
      icon: FiTarget,
      title: 'Red Team Operations',
      description: 'Real-world attack simulations to test your defenses and incident response capabilities.',
      features: ['Social Engineering', 'Physical Security', 'Threat Simulation', 'Custom Scenarios']
    }
  ];

  const stats = [
    { value: '500+', label: 'Vulnerabilities Found' },
    { value: '50+', label: 'Clients Secured' },
    { value: '100%', label: 'Success Rate' },
    { value: '24/7', label: 'Support Available' }
  ];

  const whyChooseUs = [
    {
      icon: FiTarget,
      title: 'Real-World Experience',
      description: 'Our team has hands-on experience with actual offensive security operations.'
    },
    {
      icon: FiGlobe,
      title: 'African-Centric Approach',
      description: 'Understanding local contexts, threats, and compliance requirements.'
    },
    {
      icon: FiCpu,
      title: 'Thorough Methodology',
      description: 'We follow OWASP, PTES, and other industry-standard testing frameworks.'
    },
    {
      icon: FiBarChart2,
      title: 'Detailed Reporting',
      description: 'Clear, actionable reports with step-by-step remediation guidance.'
    },
    {
      icon: FiUsers,
      title: 'Community-Driven',
      description: 'Training and deploying the next generation of security professionals.'
    },
    {
      icon: FiZap,
      title: 'Fast Response',
      description: 'Critical security issues are addressed within 24 hours.'
    }
  ];

  const engagementSteps = [
    {
      icon: FiClipboard,
      title: 'Scope & Threat Model',
      description: 'Define assets, access paths, and crown-jewel risks before testing begins.',
      meta: '1-2 days'
    },
    {
      icon: FiSearch,
      title: 'Recon & Exploitation',
      description: 'Enumerate the attack surface and validate exploitable weaknesses.',
      meta: '3-10 days'
    },
    {
      icon: FiLayers,
      title: 'Privilege & Impact',
      description: 'Demonstrate real-world impact through controlled privilege escalation.',
      meta: '2-5 days'
    },
    {
      icon: FiCheckCircle,
      title: 'Report & Retest',
      description: 'Deliver fix-ready guidance with optional verification of remediation.',
      meta: '3-5 days'
    }
  ];

  const deliverables = [
    {
      icon: FiFileText,
      title: 'Executive Narrative',
      description: 'Risk framing, business impact, and a board-ready summary.'
    },
    {
      icon: FiTerminal,
      title: 'Proof-of-Exploit Pack',
      description: 'Repro steps, evidence, and safe PoC artifacts.'
    },
    {
      icon: FiLock,
      title: 'Retest Validation',
      description: 'Verification of fixes with updated risk scoring.'
    },
    {
      icon: FiMessageSquare,
      title: 'Remediation Workshop',
      description: 'Live walkthroughs and fix guidance with your engineers.'
    }
  ];

  const learningModules = [
    {
      title: 'Foundation: Hacker Mindset',
      description: 'Linux, networking, and tooling fundamentals with guided labs.',
      level: 'Starter',
      duration: '2 weeks'
    },
    {
      title: 'Web App Exploitation',
      description: 'OWASP Top 10, API testing, and real bug chains in sandboxes.',
      level: 'Intermediate',
      duration: '4 weeks'
    },
    {
      title: 'Cloud & Infrastructure',
      description: 'IAM attacks, misconfigurations, and lateral movement drills.',
      level: 'Advanced',
      duration: '3 weeks'
    },
    {
      title: 'Red Team Labs',
      description: 'End-to-end simulations with reporting and remediation.',
      level: 'Elite',
      duration: '4 weeks'
    }
  ];

  const trustSignals = [
    {
      title: 'African-Centric Threat Modeling',
      description: 'We map regional attack patterns and compliance realities.'
    },
    {
      title: 'Affordable, High-Value Engagements',
      description: 'Premium expertise without the global-enterprise price tag.'
    },
    {
      title: 'Proof-Driven Reporting',
      description: 'Every finding includes evidence, impact, and fix-ready steps.'
    }
  ];

  const pathways = [
    {
      title: 'Learners',
      description: 'Join structured modules, weekly challenges, and mentorship.',
      cta: 'Start Learning',
      path: '/student-dashboard'
    },
    {
      title: 'Corporate Teams',
      description: 'Get offensive security that matches your real-world risk.',
      cta: 'Request Pentest',
      path: '/login'
    }
  ];

  const cycleSteps = [
    { title: 'Recon', description: 'Map assets, attack surface, and risk hotspots.' },
    { title: 'Exploit', description: 'Validate weaknesses with controlled proof.' },
    { title: 'Report', description: 'Deliver evidence, impact, and fixes.' },
    { title: 'Remediate', description: 'Patch, harden, and retest.' },
    { title: 'Verify', description: 'Confirm closure and updated risk score.' }
  ];

  return (
    <div className="landing-page">
      <HeroSection />
      <StatsSection stats={stats} />
      <ServicesSection services={services} />
      <WhySection items={whyChooseUs} />
      <ProcessSection steps={engagementSteps} />
      <DeliverablesSection deliverables={deliverables} />
      <ModulesSection modules={learningModules} />
      <TrustSection signals={trustSignals} />
      <PathwaysSection pathways={pathways} />
      <CycleSection steps={cycleSteps} />
      <CtaSection />
      <FooterSection />
    </div>
  );
};

export default Landing;
