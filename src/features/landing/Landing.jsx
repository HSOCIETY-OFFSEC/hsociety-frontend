import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import landingContent from '../../data/landing.json';
import {
  getCommunityProfiles,
  getLandingCacheSnapshot,
  getLandingContent,
  getLandingStats,
} from './landing.service';

/**Sections importation  */
/**========================== */
import HeroSection from './sections/HeroSection';
import CoursesSection from './sections/CoursesSection';
import TrustSection from './sections/TrustSection';
import StatsSection from './sections/StatsSection';
import ServicesSection from './sections/ServicesSection';
import ProcessSection from './sections/ProcessSection';
import PartnerCarouselSection from './sections/PartnerCarouselSection';
import CommunityProfilesSection from './sections/CommunityProfilesSection';
import CtaSection from './sections/CtaSection';
import FaqSection from './sections/FaqSection';
import FooterSection from './sections/FooterSection';

/**ICON importation */
/**===================== */
import { 
  FiShield,
  FiFileText, 
  FiTarget, 
  FiClipboard, 
  FiSearch, 
  FiLayers,
  FiCheckCircle,
  FiTerminal, 
  FiMessageSquare
} from 'react-icons/fi';

/**Image importation */
/**=========================== */
import terminalWallpaper from '../../assets/services-images/beginner-offsec-training.webp';
import greenBinaryWallpaper from '../../assets/services-images/community-integration.webp';
import hackerLaptop from '../../assets/services-images/penetration-tests.webp';
import terminalWallpaperSm from '../../assets/services-images/beginner-offsec-training-sm.webp';
import greenBinaryWallpaperSm from '../../assets/services-images/community-integration-sm.webp';
import hackerLaptopSm from '../../assets/services-images/penetration-tests-sm.webp';

/**ROOT CSS importation */
import '../../styles/landing/index.css';

const Landing = ({ scrollToId = null }) => {
  const location = useLocation();
  const [statsData, setStatsData] = useState(null);
  const [communityProfiles, setCommunityProfiles] = useState([]);
  const [landingOverrides, setLandingOverrides] = useState({});
  const [statsError, setStatsError] = useState('');
  const [profilesError, setProfilesError] = useState('');

  const iconMap = {
    FiShield,
    FiFileText,
    FiTarget,
    FiClipboard,
    FiSearch,
    FiLayers,
    FiCheckCircle,
    FiTerminal,
    FiMessageSquare,
  };

  /**Image mapping variable */
  const imageMap = {
    terminal: terminalWallpaper,
    binary: greenBinaryWallpaper,
    hacker: hackerLaptop
  };
  const imageMapSm = {
    terminal: terminalWallpaperSm,
    binary: greenBinaryWallpaperSm,
    hacker: hackerLaptopSm
  };

  /**Services mapping var */
  const services = landingContent.services.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
    image: item.imageKey ? imageMap[item.imageKey] : item.image,
    imageSrcSet:
      item.imageKey && imageMapSm[item.imageKey]
        ? `${imageMapSm[item.imageKey]} 768w, ${imageMap[item.imageKey]} 1440w`
        : undefined,
  }));

  const engagementSteps = landingContent.process.map((item) => ({
    ...item,
    icon: iconMap[item.icon]
  }));

  const trustSignals = landingContent.trust.map((item) => ({
    ...item,
    icon: item.icon ? iconMap[item.icon] : null
  }));

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
      if (value === null || value === undefined || Number.isNaN(value)) return null;
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

  const profileContent = useMemo(() => {
    return communityProfiles;
  }, [communityProfiles]);

  return (
  <div className="landing-page">
    {/* 1. Hook */}
    <HeroSection content={heroContent} />

    {/* 2. Early product entry */}
    <CoursesSection />

    {/* 3. Trust proof near fold */}
    <TrustSection signals={trustSignals} />

    {/* 4. Immediate credibility */}
    <StatsSection content={statsContent} error={statsError} />

    <PartnerCarouselSection />

    {/* 5. Core offer */}
    <ServicesSection services={services} />

    {/* 6. How it works */}
    <ProcessSection steps={engagementSteps} />

    {/* 7. Community proof */}
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

    {/* 7. Objections handling */}
    <FaqSection content={landingContent.faq} />

    {/* 8. Final conversion push */}
    <CtaSection content={landingContent.cta} />

    {/* 9. Closure */}
    <FooterSection />
  </div>
);
};

export default Landing;
