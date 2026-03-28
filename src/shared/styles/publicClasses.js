export const publicPage = 'min-h-screen';

export const publicHeroSection =
  'pt-[clamp(4.5rem,8vw,7rem)] pb-14 max-md:pt-[calc(var(--navbar-height,64px)+4.5rem)]';

export const publicHeroGrid =
  'grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]';

export const publicHeroKicker =
  'mb-4 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] text-text-tertiary';

export const publicHeroTitle =
  'mb-4 text-[clamp(2.2rem,5vw,3.4rem)] font-semibold tracking-[-0.04em] text-text-primary';

export const publicHeroDesc =
  'mb-6 max-w-[640px] text-[1.05rem] text-text-secondary';

export const publicHeroActions =
  'flex flex-wrap gap-3 max-sm:flex-col max-sm:items-stretch';

export const publicHeroPanel =
  'relative rounded-lg border border-border bg-[color-mix(in_srgb,var(--bg-secondary)_88%,transparent)] p-7 shadow-sm';

export const publicHeroPanelImage =
  'block max-w-full drop-shadow-[0_18px_24px_color-mix(in_srgb,var(--primary-color)_18%,transparent)]';

export const publicHeroStats = 'mt-5 flex flex-wrap gap-2';

export const publicHeroStat =
  'inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';

export const publicPillRow = 'mt-6 flex flex-wrap gap-2';

export const publicPill =
  'inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';

export const publicSection = 'py-[clamp(3rem,7vw,5.5rem)]';

export const publicCardGrid =
  'grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] max-md:gap-4 max-md:[grid-template-columns:1fr] lg:gap-7 lg:[grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] xl:gap-8 xl:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]';

export const publicCard =
  "relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-lg border border-border bg-bg-secondary p-6 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--primary-color)_35%,var(--border-color))] hover:shadow-md before:block before:content-[''] before:w-[calc(100%+3rem)] before:mx-[-1.5rem] before:mt-[-1.5rem] before:mb-4 before:aspect-[16/9] before:bg-[image:linear-gradient(to_bottom,transparent_48%,var(--bg-secondary)),var(--public-card-media)] before:bg-cover before:bg-center before:rounded-t-[calc(var(--radius-lg)-1px)] before:border-b before:border-border max-md:p-5 max-md:gap-2 max-md:before:w-[calc(100%+2.5rem)] max-md:before:mx-[-1.25rem] max-md:before:mt-[-1.1rem] max-md:before:mb-3 max-md:before:aspect-[2.2/1]";

export const publicCardSkeleton =
  'before:bg-none before:bg-[color-mix(in_srgb,var(--bg-secondary)_92%,var(--border-color))]';

export const publicCardTitle =
  'text-[1.05rem] font-semibold text-text-primary break-words max-md:text-base';

export const publicCardDesc =
  'text-[0.98rem] leading-relaxed text-text-secondary break-words max-md:text-[0.92rem]';

export const publicCardMeta =
  'flex flex-wrap gap-2 text-xs text-text-tertiary';

export const publicChip =
  'inline-flex max-w-full items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--primary-color)_28%,var(--border-color))] bg-[color-mix(in_srgb,var(--primary-color)_12%,var(--bg-secondary))] px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.04em] text-text-secondary';

export const publicList = 'grid gap-3';

export const publicListItem = 'flex items-start gap-3 text-text-secondary';

export const publicCtaSection =
  'border-y border-border bg-[linear-gradient(145deg,color-mix(in_srgb,var(--bg-primary)_82%,transparent),color-mix(in_srgb,var(--primary-color)_16%,var(--bg-secondary)))] py-[clamp(3.5rem,7vw,6rem)]';

export const publicCtaInner =
  'grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] max-md:grid-cols-1';

export const publicCtaCard =
  'grid gap-3 rounded-lg border border-border bg-bg-secondary p-7';

export const publicSurface =
  'relative rounded-lg border border-border bg-bg-secondary p-6';

export const publicBadge =
  'inline-flex items-center gap-2 rounded-full border border-border bg-[color-mix(in_srgb,var(--bg-secondary)_85%,transparent)] px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-text-tertiary';

export const publicBadgePulse =
  'relative after:absolute after:inset-[-6px] after:rounded-full after:border after:border-[color-mix(in_srgb,var(--primary-color)_35%,transparent)] after:opacity-60 after:animate-badge-pulse';

export const publicDivider = 'my-10 h-px bg-border';

export const publicButtonBase =
  'inline-flex items-center justify-center gap-2 rounded-sm border-2 font-semibold transition-all duration-200 ease-out shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand';

export const publicButtonSmall = 'h-9 px-4 text-sm';

export const publicButtonPrimary =
  'border-brand bg-brand text-ink-white hover:border-brand-hover hover:bg-brand-hover';

export const publicButtonGhost =
  'border-border bg-transparent text-text-primary hover:border-brand hover:bg-bg-tertiary';
