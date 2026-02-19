import React, { useState } from 'react';
import '../../../styles/features/landing/faq.css';

const FaqSection = ({ content }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section reveal-on-scroll">
      <div className="section-container">
        <div className="faq-header">
          <p className="faq-eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p className="faq-subtitle">{content.subtitle}</p>
        </div>
        <div className="faq-list">
          {content.items.map((faq, index) => (
            <div key={faq.question} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '-' : '+'}</span>
              </button>
              <div className="faq-answer" aria-hidden={openIndex !== index}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
