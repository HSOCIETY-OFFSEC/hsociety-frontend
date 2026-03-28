import React from 'react';
import { FiFileText, FiShield, FiActivity, FiCheckCircle } from 'react-icons/fi';

const DeliverablesSection = ({ items = [] }) => {
  if (!items.length) return null;

  const icons = [FiFileText, FiShield, FiActivity, FiCheckCircle];

  return (
    <section className="reveal-on-scroll border-t border-border bg-bg-primary py-16" id="deliverables">
      <div className="section-container">
        <header className="section-header-center">
          <p className="section-eyebrow"><span className="eyebrow-dot" />Deliverables</p>
          <h2 className="section-title">Evidence, reports, remediation.</h2>
          <p className="section-subtitle">Clear outputs for leadership and engineering teams.</p>
        </header>

        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2" role="list">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={item.title} className="flex gap-3 rounded-md border border-border bg-bg-secondary px-5 py-4" role="listitem">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-xs border border-border bg-bg-tertiary text-brand" aria-hidden="true">
                  <Icon size={16} />
                </span>
                <div>
                  <h3 className="mb-1 text-base font-semibold text-text-primary">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DeliverablesSection;
