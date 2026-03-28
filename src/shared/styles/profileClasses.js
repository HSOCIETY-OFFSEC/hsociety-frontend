export const profileRoot =
  'mx-auto w-full max-w-[1280px] px-6 pb-20 pt-8 max-md:px-4 max-md:pt-6';

export const profileRootStyle = {
  '--pp-border': 'color-mix(in srgb, var(--border-color) 90%, transparent)',
  '--pp-card': 'var(--bg-secondary)',
  '--pp-muted': 'var(--text-tertiary)',
  '--pp-cell-0': 'color-mix(in srgb, var(--bg-tertiary) 80%, var(--border-color) 20%)',
  '--pp-cell-1': 'color-mix(in srgb, var(--primary-color) 22%, var(--bg-tertiary))',
  '--pp-cell-2': 'color-mix(in srgb, var(--primary-color) 45%, var(--bg-tertiary))',
  '--pp-cell-3': 'color-mix(in srgb, var(--primary-color) 68%, var(--bg-tertiary))',
  '--pp-cell-4': 'var(--primary-color)',
  '--pp-cell-size': '11px',
  '--pp-cell-gap': '3px',
  '--pp-radius': '3px',
};

export const profileLayout = 'grid gap-10 max-md:gap-6';

export const profileSidebar =
  'relative flex flex-col gap-5 rounded-lg border border-[color:var(--pp-border)] bg-[var(--pp-card)] p-8 max-md:p-6';

export const profileAvatarWrap = 'w-full';

export const profileAvatar =
  'mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-full border-2 border-[color:var(--pp-border)] bg-bg-tertiary shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary-color)_10%,transparent)]';

export const profileIdentity = 'flex flex-col gap-1';

export const profileName =
  'text-[clamp(1.35rem,2.5vw,1.7rem)] font-semibold tracking-[-0.02em] text-text-primary';

export const profileHandle = 'text-[1.05rem] text-[color:var(--pp-muted)]';

export const profileBio = 'text-sm leading-relaxed text-text-secondary';

export const profileCtaRow = 'flex flex-wrap gap-2';

export const profileButtonBase =
  'inline-flex items-center gap-1.5 rounded-md border border-[color:var(--pp-border)] px-3.5 py-2 text-[0.84rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60';

export const profileButtonOutline =
  'bg-[color-mix(in_srgb,var(--bg-secondary)_85%,var(--bg-primary))] text-text-primary hover:border-[color-mix(in_srgb,var(--primary-color)_40%,var(--pp-border))] hover:bg-[color-mix(in_srgb,var(--bg-tertiary)_80%,transparent)]';

export const profileButtonGhost =
  'bg-transparent text-text-secondary hover:border-[color:var(--pp-border)] hover:bg-[color-mix(in_srgb,var(--bg-tertiary)_60%,transparent)] hover:text-text-primary';

export const profileMetaList = 'flex flex-col gap-2 text-sm text-text-secondary';

export const profileMetaItem = 'flex items-center gap-2';

export const profileBadgeSection = 'grid gap-2.5';

export const profileBadgeTitle =
  'text-[0.72rem] uppercase tracking-[0.08em] text-[color:var(--pp-muted)]';

export const profileStatsCard =
  'relative flex flex-col gap-3 rounded-md border border-[color:var(--pp-border)] bg-[var(--pp-card)] p-4';

export const profileStatRow = 'flex items-center gap-2.5';

export const profileStatIcon =
  'flex h-8 w-8 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--primary-color)_12%,transparent)]';

export const profileStatInfo = 'flex flex-col gap-0.5';

export const profileStatLabel =
  'text-[0.7rem] uppercase tracking-[0.1em] text-[color:var(--pp-muted)]';

export const profileStatValue = 'text-sm font-semibold text-text-primary';

export const profileStatFi = 'w-8 text-center text-[color:var(--pp-muted)]';

export const profileMain = 'flex min-w-0 flex-col gap-5';

export const profilePanel =
  'relative rounded-lg border border-[color:var(--pp-border)] bg-[var(--pp-card)] p-6';

export const profileSectionTitle =
  'mb-4 text-sm font-semibold text-text-primary';
