import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClipboard, FiTarget } from 'react-icons/fi';
import '../styles/components.css';
import '../styles/quiz-material.css';

const StudentQuizMaterial = () => {
  const navigate = useNavigate();

  return (
    <div className="sq-page">
      <header className="sq-page-header">
        <div className="sq-page-header-inner">
          <div className="sq-header-left">
            <div className="sq-header-icon-wrap">
              <FiClipboard size={20} className="sq-header-icon" />
            </div>
            <div>
              <div className="sq-header-breadcrumb">
                <span className="sq-breadcrumb-org">HSOCIETY</span>
                <span className="sq-breadcrumb-sep">/</span>
                <span className="sq-breadcrumb-page">student-quiz-material</span>
                <span className="sq-header-visibility">Private</span>
              </div>
              <p className="sq-header-desc">
                Short quizzes keep you aligned with each module and highlight topics to review.
              </p>
            </div>
          </div>
          <div className="sq-header-actions">
            <button
              type="button"
              className="sq-btn sq-btn-primary"
              onClick={() => navigate('/student-bootcamps/overview')}
            >
              <FiTarget size={16} />
              Go to Learning Path
            </button>
          </div>
        </div>
        <div className="sq-header-meta">
          <span className="sq-meta-pill">
            <FiTarget size={13} className="sq-meta-icon" />
            <span className="sq-meta-label">Access</span>
            <strong className="sq-meta-value">OPEN</strong>
          </span>
          <span className="sq-meta-pill">
            <FiCheckCircle size={13} className="sq-meta-icon" />
            <span className="sq-meta-label">Checks</span>
            <strong className="sq-meta-value">2</strong>
          </span>
        </div>
      </header>

      <div className="sq-layout">
        <main className="sq-main">
          <section className="sq-section">
            <h2 className="sq-section-title">
              <FiClipboard size={15} className="sq-section-icon" />
              Quiz Checkpoints
            </h2>
            <p className="sq-section-desc">Validate understanding before moving into live sessions.</p>
            <div className="sq-item-list">
              <article className="sq-item-row">
                <div className="sq-item-main">
                  <span className="sq-item-title">Module Check-ins</span>
                  <span className="sq-item-subtitle">Quick quizzes mapped to the bootcamp modules.</span>
                </div>
                <div className="sq-item-meta">
                  <button
                    type="button"
                    className="sq-btn sq-btn-secondary"
                    onClick={() => navigate('/student-bootcamps/overview')}
                  >
                    Start check-in
                  </button>
                </div>
              </article>
              <article className="sq-item-row">
                <div className="sq-item-main">
                  <span className="sq-item-title">Skill Validation</span>
                  <span className="sq-item-subtitle">Confidence checks after each workshop.</span>
                </div>
                <div className="sq-item-meta">
                  <button
                    type="button"
                    className="sq-btn sq-btn-secondary"
                    onClick={() => navigate('/student-bootcamps/overview')}
                  >
                    Open validation
                  </button>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>

    </div>
  );
};

export default StudentQuizMaterial;
