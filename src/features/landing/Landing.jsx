import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import landingContent from '../../data/static/landing.json';
import methodologyContent from '../../data/static/methodology.json';
import { HACKER_PROTOCOL_PHASES } from '../../data/bootcamps/hackerProtocolData';
import { getLeaderboard } from '../leaderboard/leaderboard.service';
import { LEADERBOARD_FALLBACK } from '../../data/leaderboard/leaderboardData';
import {
  getCommunityProfiles,
  getLandingCacheSnapshot,
  getLandingContent,
  getLandingStats,
} from './landing.service';

import HeroSection from './sections/HeroSection';
import StatsSection from './sections/StatsSection';
import ServicesSection from './sections/ServicesSection';
import WhySection from './sections/WhySection';
import CycleSection from './sections/CycleSection';
import ProcessSection from './sections/ProcessSection';
import CoursesSection from './sections/CoursesSection';
import ModulesSection from './sections/ModulesSection';
import PathwaysSection from './sections/PathwaysSection';
import LeaderboardSection from './sections/LeaderboardSection';
import CommunityProfilesSection from './sections/CommunityProfilesSection';
import TrustSection from './sections/TrustSection';
import DeliverablesSection from './sections/DeliverablesSection';
import CtaSection from './sections/CtaSection';
import FaqSection from './sections/FaqSection';
import FooterSection from './sections/FooterSection';

import terminalWallpaper from '../../assets/services-images/beginner-offsec-training.webp';
import greenBinaryWallpaper from '../../assets/services-images/community-integration.webp';
import hackerLaptop from '../../assets/services-images/penetration-tests.webp';
import terminalWallpaperSm from '../../assets/services-images/beginner-offsec-training-sm.webp';
import greenBinaryWallpaperSm from '../../assets/services-images/community-integration-sm.webp';
import hackerLaptopSm from '../../assets/services-images/penetration-tests-sm.webp';

import handsOnImage from '../../assets/why-choose-hsociety-images/hands-on-learning.webp';
import communityImage from '../../assets/why-choose-hsociety-images/community-engagements.webp';
import pentestsImage from '../../assets/why-choose-hsociety-images/supervised-pentests.webp';
import pathwayImage from '../../assets/why-choose-hsociety-images/career-ready-pathway.webp';

import '../../styles/landing/index.css';

const Landing = ({ scrollToId = null }) => {
  const location = useLocation();
  const [statsData, setStatsData] = useState(null);
  const [communityProfiles, setCommunityProfiles] = useState([]);
  const [landingOverrides, setLandingOverrides] = useState({});
  const [statsError, setStatsError] = useState('');
  const [profilesError, setProfilesError] = useState('');
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);

  const imageMap = {
    terminal: terminalWallpaper,
    binary: greenBinaryWallpaper,
    hacker: hackerLaptop,
  };
  const imageMapSm = {
    terminal: terminalWallpaperSm,
    binary: greenBinaryWallpaperSm,
    hacker: hackerLaptopSm,
  };

  const whyImageMap = [handsOnImage, communityImage, pentestsImage, pathwayImage];

  const services = landingContent.services.slice(0, 3).map((item) => ({
    ...item,
    image: item.imageKey ? imageMap[item.imageKey] : item.image,
    imageSrcSet:
      item.imageKey && imageMapSm[item.imageKey]
        ? `${imageMapSm[item.imageKey]} 768w, ${imageMap[item.imageKey]} 1440w`
        : undefined,
  }));

  const whyItems = landingContent.why.map((item, index) => ({
    ...item,
    image: whyImageMap[index],
  }));

  const processSteps = methodologyContent.phases || [];

  useEffect(() => {
    let isMounted = true;
    const timeoutIds = [];
    let idleId = null;
    const cached = getLandingCacheSnapshot();
    if (cached.stats) setStatsData(cached.stats);
    if (cached.profiles) setCommunityProfiles(cached.profiles?.profiles || []);
    if (cached.content) setLandingOverrides(cached.content?.landing || {});

    const loadStats = async () => {
      try {
        const statsResponse = await getLandingStats();
        if (!isMounted) return;
        if (statsResponse.success) {
          setStatsData(statsResponse.data);
        } else {
          setStatsError(statsResponse.error || 'Stats unavailable.');
        }
      } catch {
        if (!isMounted) return;
        setStatsError('Stats unavailable.');
      }
    };

    const loadProfiles = async () => {
      try {
        const profilesResponse = await getCommunityProfiles(6);
        if (!isMounted) return;
        if (profilesResponse.success) {
          setCommunityProfiles(profilesResponse.data?.profiles || []);
        } else {
          setProfilesError(profilesResponse.error || 'Community profiles unavailable.');
        }
      } catch {
        if (!isMounted) return;
        setProfilesError('Community profiles unavailable.');
      }
    };

    const loadLeaderboard = async () => {
      try {
        const response = await getLeaderboard(5);
        if (!isMounted) return;
        if (response.success) {
          const live = response.data?.leaderboard || [];
          setLeaderboardEntries(live.length ? live : LEADERBOARD_FALLBACK.slice(0, 5));
          return;
        }
        setLeaderboardEntries(LEADERBOARD_FALLBACK.slice(0, 5));
      } catch {
        if (!isMounted) return;
        setLeaderboardEntries(LEADERBOARD_FALLBACK.slice(0, 5));
      }
    };

    const loadContent = async () => {
      try {
        const contentResponse = await getLandingContent();
        if (!isMounted) return;
        if (contentResponse.success) {
          setLandingOverrides(contentResponse.data?.landing || {});
        }
      } catch {
        if (!isMounted) return;
      }
    };

    loadStats();
    timeoutIds.push(window.setTimeout(loadLeaderboard, 200));
    timeoutIds.push(window.setTimeout(loadProfiles, 300));
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(loadContent, { timeout: 1500 });
    } else {
      timeoutIds.push(window.setTimeout(loadContent, 900));
    }

    return () => {
      isMounted = false;
      timeoutIds.forEach((id) => window.clearTimeout(id));
      if (idleId && typeof window !== 'undefined' && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
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
    return String(value || fallback || '');
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

  const profileContent = useMemo(() => {
    if (communityProfiles.length) return communityProfiles;
    return [];
  }, [communityProfiles]);

  const moduleEmblems = useMemo(
    () => HACKER_PROTOCOL_PHASES.map((phase) => ({
      codename: phase.codename,
      emblem: phase.emblem,
    })),
    []
  );

  return (
    <div className="landing-page">
      <HeroSection content={heroContent} />
      <StatsSection content={statsContent} error={statsError} />
      <ServicesSection services={services} />
      <WhySection items={whyItems} />
      <CycleSection />
      <ProcessSection steps={processSteps} />
      <CoursesSection />
      <ModulesSection modules={moduleEmblems} />
      <PathwaysSection pathways={landingContent.pathways} />
      <LeaderboardSection entries={leaderboardEntries.length ? leaderboardEntries : LEADERBOARD_FALLBACK.slice(0, 5)} />
      <CommunityProfilesSection
        title={landingContent.communityProfiles?.title || 'Community wins in the open'}
        subtitle={
          landingOverrides.communitySubtitle ||
          landingContent.communityProfiles?.subtitle ||
          'Meet offensive learners already sharing findings, feedback, and collaboration.'
        }
        profiles={profileContent}
        error={profilesError}
      />
      <TrustSection signals={landingContent.trust} />
      <DeliverablesSection items={landingContent.deliverables} />
      <CtaSection content={landingContent.cta} />
      <FaqSection content={landingContent.faq} />
      <FooterSection />
    </div>
  );
};

export default Landing;
