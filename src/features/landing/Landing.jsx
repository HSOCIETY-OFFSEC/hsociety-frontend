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
import { FaGraduationCap, FaUsers, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { FiShield, FiFileText, FiTarget, FiClipboard, FiSearch, FiLayers, FiCheckCircle, FiTerminal, FiLock, FiMessageSquare, FiGlobe, FiZap, FiBarChart2, FiCpu, FiUsers as FiUsersAlt } from 'react-icons/fi';
import '../../styles/features/landing.css';

const Landing = () => {
  useScrollReveal();

  // Services offered
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
      description: 'Simulated attacks to test defenses, uncover gaps, and strengthen incident response.',
      features: ['Social Engineering', 'Physical Security', 'Threat Simulation', 'Custom Scenarios']
    }
  ];

  // Stats
  const stats = [
    { value: '500+', label: 'Vulnerabilities Found' },
    { value: '50+', label: 'Clients Secured' },
    { value: '100%', label: 'Success Rate' },
    { value: '24/7', label: 'Support Available' }
  ];

  // Why HSOCIETY: UVP-focused
  const whyChooseUs = [
    {
      icon: FaGraduationCap,
      title: 'Hands-On Learning',
      description: 'Beginner-friendly training with real-world exercises supervised by experts. Execution over theory.'
    },
    {
      icon: FaUsers,
      title: 'Community & Mentorship',
      description: 'Join an active cybersecurity community where collaboration, guidance, and continuous skill growth are central.'
    },
    {
      icon: FaShieldAlt,
      title: 'Real Engagements',
      description: 'Participate in supervised penetration tests for actual companies to gain professional experience and credibility.'
    },
    {
      icon: FaRocket,
      title: 'Career-Ready Pathway',
      description: 'Move from learner to professional penetration tester with continuous skill refresh, specialization, and paid deployments.'
    }
  ];

  // Engagement / process steps
  const engagementSteps = [
    { icon: FiClipboard, title: 'Scope & Threat Model', description: 'Define assets, attack paths, and critical risks.', meta: '1-2 days' },
    { icon: FiSearch, title: 'Recon & Exploitation', description: 'Map the attack surface and validate vulnerabilities.', meta: '3-10 days' },
    { icon: FiLayers, title: 'Privilege & Impact', description: 'Demonstrate controlled escalation to assess real-world impact.', meta: '2-5 days' },
    { icon: FiCheckCircle, title: 'Report & Retest', description: 'Provide actionable reports and optional remediation verification.', meta: '3-5 days' }
  ];

  // Deliverables
  const deliverables = [
    { icon: FiFileText, title: 'Executive Narrative', description: 'Risk framing, business impact, and board-ready summary.' },
    { icon: FiTerminal, title: 'Proof-of-Exploit Pack', description: 'Repro steps, evidence, and safe PoC artifacts.' },
    { icon: FiLock, title: 'Retest Validation', description: 'Verify fixes with updated risk scoring.' },
    { icon: FiMessageSquare, title: 'Remediation Workshop', description: 'Live walkthroughs and fix guidance with your engineers.' }
  ];

  // Learning modules
  const learningModules = [
    { title: 'Foundation: Hacker Mindset', description: 'Linux, networking, and tooling fundamentals with guided labs.', level: 'Starter', duration: '2 weeks' },
    { title: 'Web App Exploitation', description: 'OWASP Top 10, API testing, and real bug chains in sandboxes.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Cloud & Infrastructure', description: 'IAM attacks, misconfigurations, and lateral movement drills.', level: 'Advanced', duration: '3 weeks' },
    { title: 'Red Team Labs', description: 'End-to-end simulations with reporting and remediation.', level: 'Elite', duration: '4 weeks' }
  ];

  // Trust signals
  const trustSignals = [
    { title: 'African-Centric Threat Modeling', description: 'We map regional attack patterns and compliance realities.' },
    { title: 'Affordable, High-Value Engagements', description: 'Premium expertise without the global-enterprise price tag.' },
    { title: 'Proof-Driven Reporting', description: 'Every finding includes evidence, impact, and fix-ready steps.' }
  ];

  // Pathways
  const pathways = [
    { title: 'Learners', description: 'Structured modules, challenges, and mentorship.', cta: 'Start Learning', path: '/student-dashboard' },
    { title: 'Corporate Teams', description: 'Offensive security services tailored to real-world risk.', cta: 'Request Pentest', path: '/login' }
  ];

  // Cycle steps
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
