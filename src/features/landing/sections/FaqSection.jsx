import React, { useState } from 'react';
import '../../../styles/features/landing/faq.css';

const FAQS = [
  {
    question: 'Is this beginner-friendly?',
    answer:
      'Yes. The training starts at the foundations and is designed for people with no prior offensive security experience.'
  },
  {
    question: 'Do students work on real companies?',
    answer:
      'Students participate in supervised, real-world engagements where scope and safety are controlled by senior operators.'
  },
  {
    question: 'Are engagements supervised?',
    answer:
      'Yes. Every engagement is led and reviewed by experienced offensive security professionals.'
  },
  {
    question: 'How are companies protected?',
    answer:
      'All tests are scoped, authorized, monitored, and reported with clear remediation guidance and evidence.'
  },
  {
    question: 'What makes HSOCIETY different?',
    answer:
      'We combine training with real execution. Students become professionals by contributing to supervised pentests.'
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section reveal-on-scroll">
      <div className="section-container">
        <div className="faq-header">
          <p className="faq-eyebrow">FAQ</p>
          <h2>Clear answers for students and companies</h2>
          <p className="faq-subtitle">
            Short, direct responses to the most common questions about how HSOCIETY works.
          </p>
        </div>
        <div className="faq-list">
          {FAQS.map((faq, index) => (
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
