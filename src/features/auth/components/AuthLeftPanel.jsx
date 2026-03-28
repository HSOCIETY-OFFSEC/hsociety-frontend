import React from 'react';
const IMAGE_URL = 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1400&q=80';

const AuthLeftPanel = () => (
  <aside className="group relative hidden min-h-screen overflow-hidden lg:block" aria-hidden="true">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75 saturate-75 transition-transform duration-[8000ms] ease-linear group-hover:scale-[1.02]"
      style={{ backgroundImage: `url(${IMAGE_URL})` }}
    />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.55),rgba(0,0,0,0.28)),linear-gradient(to_top,rgba(0,0,0,0.7),rgba(31,191,143,0.08),transparent)]" />
    <div className="relative z-10 flex h-full flex-col justify-end gap-5 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--bg-secondary)_85%,transparent),transparent_70%)] p-8 text-white">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand">HSOCIETY ACCESS</p>
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-white">
        Build your security edge before the next breach.
      </h2>
      <p className="text-sm leading-relaxed text-white/70">
        Choose the path that matches your mission. We tailor onboarding for students
        who want hands-on training and teams that need real-world defense.
      </p>
      <div className="flex items-start gap-6 max-sm:flex-col max-sm:gap-2">
        <div className="flex flex-col gap-1">
          <strong className="text-sm font-semibold text-white">Real-world labs</strong>
          <span className="text-xs text-white/60">Operator-led training with live tooling.</span>
        </div>
        <div className="h-auto w-px self-stretch bg-white/20 max-sm:hidden" />
        <div className="flex flex-col gap-1">
          <strong className="text-sm font-semibold text-white">Team defense</strong>
          <span className="text-xs text-white/60">Corporate workflows built for rapid hardening.</span>
        </div>
      </div>
    </div>
  </aside>
);

export default AuthLeftPanel;
