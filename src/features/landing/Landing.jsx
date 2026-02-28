import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useScrollReveal from '../../shared/hooks/useScrollReveal';
import landingContent from '../../data/landing.json';
import { getCommunityProfiles, getLandingContent, getLandingStats } from './landing.service';
import {
  HeroSection,
  StatsSection,
  ServicesSection,
  WhySection,
  ProcessSection,
  DeliverablesSection,
  ModulesSection,
  TrustSection,
  CommunityProfilesSection,
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

import terminalWallpaper from '../../assets/brand-images/terminalwallpaper.png';
import greenBinaryWallpaper from '../../assets/backgrounds/greenbinarywallaper.png';
import hackerLaptop from '../../assets/backgrounds/hacker_laptop_with_stckers.png';
import handsOnLearningImage from '../../assets/why-choos-hsociety-images/hands-on-learning.png';
import communityEngagementsImage from '../../assets/why-choos-hsociety-images/community-engagments.png';
import supervisedPentestsImage from '../../assets/why-choos-hsociety-images/supervised-pentests.png';
import careerReadyPathwayImage from '../../assets/why-choos-hsociety-images/career-ready-pathway.png';

import '../../styles/landing/index.css';

const Landing = ({ scrollToId = null }) => {
  useScrollReveal();
  const location = useLocation();
  const [statsData, setStatsData] = useState(null);
  const [communityProfiles, setCommunityProfiles] = useState([]);
  const [landingOverrides, setLandingOverrides] = useState({});

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

  const imageMap = {
    terminal: terminalWallpaper,
    binary: greenBinaryWallpaper,
    hacker: hackerLaptop
  };

  const whyImageMap = {
    'Hands-On Learning': handsOnLearningImage,
    'Community & Collaboration': communityEngagementsImage,
    'Real Engagements': supervisedPentestsImage,
    'Career-Ready Pathway': careerReadyPathwayImage
  };

  const services = landingContent.services.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
    image: item.imageKey ? imageMap[item.imageKey] : item.image
  }));

  const whyChooseUs = landingContent.why.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
    image: whyImageMap[item.title] || item.image
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
      const [statsResponse, profilesResponse, contentResponse] = await Promise.all([
        getLandingStats(),
        getCommunityProfiles(6),
        getLandingContent()
      ]);
      if (!isMounted) return;

      if (statsResponse.success) {
        setStatsData(statsResponse.data);
      }
      if (profilesResponse.success) {
        setCommunityProfiles(profilesResponse.data?.profiles || []);
      }
      if (contentResponse.success) {
        setLandingOverrides(contentResponse.data?.landing || {});
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const targetId = scrollToId || (location.hash ? location.hash.slice(1) : null);
    if (!targetId) return undefined;

    let cancelled = false;
    const scrollToTarget = () => {
      if (cancelled) return;
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const rafId = window.requestAnimationFrame(scrollToTarget);
    const timeoutId = window.setTimeout(scrollToTarget, 300);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [location.hash, scrollToId]);

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
      title: landingOverrides.heroTitle || '',
      description: landingOverrides.heroDescription || landingContent.hero.description,
      ctas: landingContent.hero.ctas.map((cta, index) => ({
        ...cta,
        label:
          index === 0
            ? landingOverrides.ctaPrimary || cta.label
            : landingOverrides.ctaSecondary || cta.label,
      })),
      proof
    };
  }, [statsData, landingOverrides]);

  const profileFallbacks = landingContent.communityProfiles?.profiles || [];
  const profileContent = useMemo(() => {
    if (communityProfiles.length) return communityProfiles;
    return profileFallbacks;
  }, [communityProfiles, profileFallbacks]);

  return (
  <div className="landing-page">
    {/* 1. Hook */}
    <HeroSection content={heroContent} />

    {/* 2. Immediate credibility */}
    <StatsSection content={statsContent} />
    <TrustSection signals={trustSignals} />

    {/* 3. Problem & differentiation */}
    <WhySection items={whyChooseUs} />

    {/* 4. What you actually offer */}
    <ServicesSection services={services} />

    {/* 5. How it works (reduce friction) */}
    <ProcessSection steps={engagementSteps} />

    {/* 6. Community proof */}
      <CommunityProfilesSection
        title={landingContent.communityProfiles?.title || 'Community wins in the open'}
        subtitle={
        landingOverrides.communitySubtitle ||
        landingContent.communityProfiles?.subtitle ||
        'Meet offensive learners already sharing findings, feedback, and collaboration.'
        }
        profiles={profileContent}
      />

    {/* 6. What they get at the end */}
    <DeliverablesSection deliverables={deliverables} />

    {/* 7. Learning depth / system strength */}
    <ModulesSection modules={learningModules} />
    <PathwaysSection content={landingContent.pathways} />
    <CycleSection steps={cycleSteps} />

    {/* 8. Objections handling */}
    <FaqSection content={landingContent.faq} />

    {/* 9. Final conversion push */}
    <CtaSection content={landingContent.cta} />

    {/* 10. Closure */}
    <FooterSection />
  </div>
);
};

export default Landing;
