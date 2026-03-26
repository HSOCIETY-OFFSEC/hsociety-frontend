import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import landingContent from '../../../data/static/landing.json';
import methodologyContent from '../../../data/static/methodology.json';
import { HACKER_PROTOCOL_PHASES } from '../../../data/static/bootcamps/hackerProtocolData';
import { getLeaderboard } from '../../leaderboard/services/leaderboard.service';
import {
  getCommunityProfiles,
  getLandingCacheSnapshot,
  getLandingContent,
  getLandingStats,
} from '../services/landing.service';

import PromoPopup from '../components/PromoPopup';
import HeroSection from '../components/sections/HeroSection';
import StatsSection from '../components/sections/StatsSection';
import ServicesSection from '../components/sections/ServicesSection';
import MarketplaceSection from '../components/sections/MarketplaceSection';
import WhySection from '../components/sections/WhySection';
import CycleSection from '../components/sections/CycleSection';
import ProcessSection from '../components/sections/ProcessSection';
import CoursesSection from '../components/sections/CoursesSection';
import ModulesSection from '../components/sections/ModulesSection';
import PathwaysSection from '../components/sections/PathwaysSection';
import LeaderboardSection from '../components/sections/LeaderboardSection';
import CommunityProfilesSection from '../components/sections/CommunityProfilesSection';
import TrustSection from '../components/sections/TrustSection';
import DeliverablesSection from '../components/sections/DeliverablesSection';
import CtaSection from '../components/sections/CtaSection';
import FaqSection from '../components/sections/FaqSection';
import FooterSection from '../components/sections/FooterSection';

import terminalWallpaper from '../../../assets/images/services-images/beginner-offsec-training.webp';
import greenBinaryWallpaper from '../../../assets/images/services-images/community-integration.webp';
import hackerLaptop from '../../../assets/images/services-images/penetration-tests.webp';
import terminalWallpaperSm from '../../../assets/images/services-images/beginner-offsec-training-sm.webp';
import greenBinaryWallpaperSm from '../../../assets/images/services-images/community-integration-sm.webp';
import hackerLaptopSm from '../../../assets/images/services-images/penetration-tests-sm.webp';

import handsOnImage from '../../../assets/images/why-choose-hsociety-images/hands-on-learning.webp';
import communityImage from '../../../assets/images/why-choose-hsociety-images/community-engagements.webp';
import pentestsImage from '../../../assets/images/why-choose-hsociety-images/supervised-pentests.webp';
import pathwayImage from '../../../assets/images/why-choose-hsociety-images/career-ready-pathway.webp';

import '../styles/landing.css';

const Landing = ({ scrollToId = null }) => {
  const location = useLocation();
  const [statsData, setStatsData] = useState(null);
  const [communityProfiles, setCommunityProfiles] = useState([]);
  const [landingOverrides, setLandingOverrides] = useState({});
  const [statsError, setStatsError] = useState('');
  const [profilesError, setProfilesError] = useState('');
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

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
          setLeaderboardEntries(live);
        }
      } catch {
        // leave entries empty — section will hide itself
      } finally {
        if (isMounted) setLeaderboardLoading(false);
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
        value: formatStatValue(rawValue, item.value, { plus: item.plus ?? true })
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
      <MarketplaceSection />
      <WhySection items={whyItems} />
      <CycleSection />
      <ProcessSection steps={processSteps} />
      <CoursesSection />
      <ModulesSection modules={moduleEmblems} />
      <PathwaysSection pathways={landingContent.pathways} />
      <LeaderboardSection entries={leaderboardEntries} loading={leaderboardLoading} />
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
      <PromoPopup />
    </div>
  );
};

export default Landing;
