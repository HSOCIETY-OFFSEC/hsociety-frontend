import React, { useState } from 'react';

const FaqSection = ({ content }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const items = content?.items || [];
  if (!items.length) return null;

  return (
    <section className="reveal-on-scroll border-t border-border bg-bg-primary py-16" id="faq">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)] lg:items-start lg:gap-[clamp(2.5rem,6vw,5rem)]">
          <header className="section-header-center lg:items-start lg:text-left">
            <p className="section-eyebrow lg:text-left"><span className="eyebrow-dot" />{content.eyebrow || 'FAQ'}</p>
            <h2 className="section-title lg:text-left">{content.title}</h2>
            <p className="section-subtitle max-w-[34ch] lg:text-left">{content.subtitle}</p>
          </header>

          <div className="mx-auto w-full max-w-[720px] overflow-hidden rounded-lg border border-border bg-bg-secondary lg:max-w-none">
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.question} className="border-b border-border last:border-b-0">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-text-primary"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span className="font-mono text-brand">{isOpen ? '-' : '+'}</span>
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-200 motion-reduce:transition-none ${
                      isOpen ? 'max-h-[600px]' : 'max-h-0'
                    }`}
                  >
                    <p className="mb-4 px-5 pb-3 text-sm leading-relaxed text-text-secondary">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
