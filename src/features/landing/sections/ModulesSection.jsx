import React from 'react';
import { FiTerminal, FiChevronRight, FiClock, FiZap } from 'react-icons/fi';
import Logo from '../../../shared/components/common/Logo';
import Card from '../../../shared/components/ui/Card';
import ImageWithLoader from '../../../shared/components/ui/ImageWithLoader';
import '../../../styles/landing/modules.css';

const ModulesSection = ({ modules = [] }) => (
  <section className="modules-section reveal-on-scroll">
    <div className="section-container">
      <div className="section-header-center">
        <div className="section-eyebrow">
          <Logo size="small" />
          <span>Learning Modules</span>
        </div>
        <h2 className="section-title-large">Hands-On Hacker Curriculum</h2>
        <p className="section-subtitle-large">
          Structured modules designed to build real offensive security skills with African context.
        </p>
      </div>

      <div className="modules-grid">
        {modules.map((module, i) => (
          <div
            key={module.title}
            className="module-card reveal-on-scroll"
            style={{ '--card-index': i }}
          >
            {/* ── Portal window: emblem lives here ── */}
            <div className="module-portal">
              {/* Corner brackets — pure CSS via pseudo, plus explicit spans for all 4 */}
              <span className="mc-bracket mc-bracket--tl" aria-hidden="true" />
              <span className="mc-bracket mc-bracket--tr" aria-hidden="true" />
              <span className="mc-bracket mc-bracket--bl" aria-hidden="true" />
              <span className="mc-bracket mc-bracket--br" aria-hidden="true" />

              {/* Ambient radial glow */}
              <div className="module-portal-glow" aria-hidden="true" />

              {/* Scanline grid overlay */}
              <div className="module-portal-grid" aria-hidden="true" />

              {/* The emblem itself */}
              {module.image && (
                <div className="module-emblem">
                  <ImageWithLoader
                    src={module.image}
                    alt={module.title}
                    loading="lazy"
                    decoding="async"
                    loaderMessage=""
                  />
                </div>
              )}

              {/* Level badge — floats top-left inside portal */}
              <span className="module-level-badge">{module.level}</span>
            </div>

            {/* ── Info panel ── */}
            <div className="module-info">
              <div className="module-info-top">
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
              </div>

              <div className="module-info-footer">
                <span className="module-duration-chip">
                  <FiClock size={11} />
                  {module.duration}
                </span>
                <span className="module-enter-cta">
                  <FiTerminal size={12} />
                  Enter
                  <FiChevronRight size={13} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ModulesSection;