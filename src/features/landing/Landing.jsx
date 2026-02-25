import React, { useEffect, useMemo, useState } from 'react';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import landingContent from '../../data/landing.json';
import { getLandingStats } from './landing.service';
import LiveThreatMiniMap from '../live-map/LiveThreatMiniMap';
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

import { 
  FaGraduationCap, 
  FaUsers, 
  FaShieldAlt, 
  FaRocket 
} from 'react-icons/fa';


import { 
  FiShield,
  FiFileText, 
  FiTarget, 
  FiClipboard, 
  FiSearch, 
  FiLayers, 
  FiCheckCircle,
  FiTerminal, 
  FiLock, 
  FiMessageSquare 
} from 'react-icons/fi';

import '../../styles/features/landing.css';

const Landing = () => {
  useScrollReveal();
  const [statsData, setStatsData] = useState(null);

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

  const trustSignals = landingContent.trust.map((item) => ({
    ...item,
    icon: item.icon ? iconMap[item.icon] : null
  }));

  const cycleSteps = landingContent.cycle;

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      const response = await getLandingStats();
      if (!isMounted) return;

      if (response.success) {
        setStatsData(response.data);
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatStatValue = (value, fallback, options = {}) => {
      if (value === null || value === undefined || Number.isNaN(value)) return fallback;
      if (typeof value === 'number') {
        if (options.percent) return `${value}%`;
        if (options.plus) return `${value.toLocaleString()}+`;
        return value.toLocaleString();
      }
      return String(value);
    };

  const statsContent = useMemo(() => {
    const items = landingContent.stats.items.map((item) => {
      const rawValue = item.key ? statsData?.stats?.[item.key] : undefined;
      return {
        ...item,
        value: formatStatValue(rawValue, item.value, { plus: true })
      };
    });

    return {
      ...landingContent.stats,
      items
    };
  }, [statsData]);

  const heroContent = useMemo(() => {
    const proof = landingContent.hero.proof?.map((item) => {
      const rawValue = item.key ? statsData?.heroProof?.[item.key] : undefined;
      const isPercent = String(item.value || '').includes('%') || item.key === 'remediationSuccess';
      const isPlus = item.key === 'validatedFindings';
      return {
        ...item,
        value: formatStatValue(rawValue, item.value, { percent: isPercent, plus: isPlus })
      };
    });

    return {
      ...landingContent.hero,
      proof
    };
  }, [statsData]);

  return (
    <div className="landing-page">
      <HeroSection content={heroContent} />
      <StatsSection content={statsContent} />
      <LiveThreatMiniMap />
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
