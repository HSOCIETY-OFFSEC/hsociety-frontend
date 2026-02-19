import React from 'react';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import landingContent from '../../data/landing.json';
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
  FaqSection,
  FooterSection
} from './sections';
import { FaGraduationCap, FaUsers, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { FiShield, FiFileText, FiTarget, FiClipboard, FiSearch, FiLayers, FiCheckCircle, FiTerminal, FiLock, FiMessageSquare } from 'react-icons/fi';
import '../../styles/features/landing.css';

const Landing = () => {
  useScrollReveal();

  const iconMap = {
    FiShield,
    FiFileText,
    FiTarget,
    FiClipboard,
    FiSearch,
    FiLayers,
    FiCheckCircle,
    FiTerminal,
    FiLock,
    FiMessageSquare,
    FaGraduationCap,
    FaUsers,
    FaShieldAlt,
    FaRocket
  };

  const services = landingContent.services.map((item) => ({
    ...item,
    icon: iconMap[item.icon]
  }));

  const whyChooseUs = landingContent.why.map((item) => ({
    ...item,
    icon: iconMap[item.icon]
  }));

  const engagementSteps = landingContent.process.map((item) => ({
    ...item,
    icon: iconMap[item.icon]
  }));

  const deliverables = landingContent.deliverables.map((item) => ({
    ...item,
    icon: iconMap[item.icon]
  }));

  const learningModules = landingContent.modules;

  const trustSignals = landingContent.trust;

  const cycleSteps = landingContent.cycle;

  return (
    <div className="landing-page">
      <HeroSection content={landingContent.hero} />
      <StatsSection content={landingContent.stats} />
      <ServicesSection services={services} />
      <WhySection items={whyChooseUs} />
      <ProcessSection steps={engagementSteps} />
      <DeliverablesSection deliverables={deliverables} />
      <ModulesSection modules={learningModules} />
      <TrustSection signals={trustSignals} />
      <PathwaysSection content={landingContent.pathways} />
      <CycleSection steps={cycleSteps} />
      <CtaSection content={landingContent.cta} />
      <FaqSection content={landingContent.faq} />
      <FooterSection />
    </div>
  );
};

export default Landing;
