import React, { useState } from 'react';
import '../../../styles/landing/faq.css';

const FaqSection = ({ content }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section reveal-on-scroll">
      <div className="section-container">
        <div className="faq-inner">

          {/* ── Left: sticky header ── */}
          <div className="faq-header">
            <p className="faq-eyebrow">{content.eyebrow}</p>
            <h2>{content.title}</h2>
            <p className="faq-subtitle">{content.subtitle}</p>
            {content.contactHref && (
              <a className="faq-contact-hint" href={content.contactHref}>
                Still have questions? Get in touch →
              </a>
            )}
          </div>

          {/* ── Right: accordion ── */}
          <div className="faq-list">
            {content.items.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`faq-item${isOpen ? ' open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon" aria-hidden="true" />
                  </button>
                  <div
                    className="faq-answer"
                    role="region"
                    aria-hidden={!isOpen}
                  >
                    <p>{faq.answer}</p>
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