import React from 'react';
import { FiBookOpen, FiCheckCircle, FiLayers, FiTool } from 'react-icons/fi';
import BootcampAccessGate from '../../components/bootcamp/BootcampAccessGate';

const BootcampResources = () => {
  return (
    <BootcampAccessGate>
      <div className="bc-page">
        <header className="bc-page-header">
          <div className="bc-page-header-inner">
            <div className="bc-header-left">
              <div className="bc-header-icon-wrap">
                <FiBookOpen size={20} className="bc-header-icon" />
              </div>
              <div>
                <div className="bc-header-breadcrumb">
                  <span className="bc-breadcrumb-org">HSOCIETY</span>
                  <span className="bc-breadcrumb-sep">/</span>
                  <span className="bc-breadcrumb-page">bootcamp-resources</span>
                  <span className="bc-header-visibility">Private</span>
                </div>
                <p className="bc-header-desc">Guides, tools, and playbooks supporting each room.</p>
              </div>
            </div>
          </div>
          <div className="bc-header-meta">
            <span className="bc-meta-pill">
              <FiLayers size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Libraries</span>
              <strong className="bc-meta-value">3</strong>
            </span>
            <span className="bc-meta-pill">
              <FiTool size={13} className="bc-meta-icon" />
              <span className="bc-meta-label">Tooling</span>
              <strong className="bc-meta-value">Curated</strong>
            </span>
          </div>
        </header>

        <div className="bc-layout">
          <main className="bc-main">
            <section className="bc-section">
              <h2 className="bc-section-title">
                <FiBookOpen size={15} className="bc-section-icon" />
                Resource Library
              </h2>
              <p className="bc-section-desc">Downloadable guides and playbooks aligned to each phase.</p>
              <div className="bc-item-list">
                <article className="bc-item-row">
                  <div className="bc-item-main">
                    <span className="bc-item-title">Bootcamp Playbooks</span>
                    <span className="bc-item-subtitle">Step-by-step guidance aligned to each module.</span>
                  </div>
                  <span className="bc-label bc-label-alpha">Core</span>
                </article>
                <article className="bc-item-row">
                  <div className="bc-item-main">
                    <span className="bc-item-title">Tooling Library</span>
                    <span className="bc-item-subtitle">Curated tool stacks for reconnaissance, analysis, and reporting.</span>
                  </div>
                  <span className="bc-label bc-label-delta">Tools</span>
                </article>
                <article className="bc-item-row">
                  <div className="bc-item-main">
                    <span className="bc-item-title">Reading Material</span>
                    <span className="bc-item-subtitle">Deep dives, checklists, and quick references.</span>
                  </div>
                  <span className="bc-label bc-label-beta">Docs</span>
                </article>
              </div>
            </section>
          </main>
        </div>
      </div>
    </BootcampAccessGate>
  );
};

export default BootcampResources;
