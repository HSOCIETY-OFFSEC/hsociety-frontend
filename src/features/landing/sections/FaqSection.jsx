import React, { useState } from 'react';
import '../../../styles/landing/faq.css';

const FaqSection = ({ content }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const items = content?.items || [];
  if (!items.length) return null;

  return (
    <section className="faq-section reveal-on-scroll" id="faq">
      <div className="section-container">
        <header className="section-header-center">
          <p className="section-eyebrow"><span className="eyebrow-dot" />{content.eyebrow || 'FAQ'}</p>
          <h2 className="section-title">{content.title}</h2>
          <p className="section-subtitle">{content.subtitle}</p>
        </header>

        <div className="faq-list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="faq-toggle">{isOpen ? '-' : '+'}</span>
                </button>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
