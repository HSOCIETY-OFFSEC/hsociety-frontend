import React from 'react';
import { FiArrowLeft, FiImage, FiMessageSquare, FiUsers } from 'react-icons/fi';
import { COMMUNITY_UI } from '../../../../data/static/community/communityUiData';

const CommunityHeader = ({ overviewStats, connected = false, onBack, onMedia }) => {
  const learners = Number(overviewStats?.learners || 0).toLocaleString();
  const posts = Number(overviewStats?.questions || 0).toLocaleString();

  return (
    <header className="sticky top-0 z-10 flex flex-col border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="flex min-w-0 items-center gap-2">
          {onBack && (
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-bg-secondary text-text-secondary transition hover:text-text-primary"
              onClick={onBack}
              aria-label="Back"
            >
              <FiArrowLeft size={14} aria-hidden="true" />
            </button>
          )}
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-widest text-text-tertiary">
              {COMMUNITY_UI.header.brand}
            </p>
            <h1 className="truncate text-base font-extrabold tracking-tight text-text-primary">
              {COMMUNITY_UI.header.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-secondary px-2.5 py-1 text-xs font-semibold text-text-tertiary">
            <FiUsers size={12} aria-hidden="true" />
            {learners}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-secondary px-2.5 py-1 text-xs font-semibold text-text-tertiary">
            <FiMessageSquare size={12} aria-hidden="true" />
            {posts}
          </span>
          {onMedia && (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-secondary px-2.5 py-1 text-xs font-semibold text-text-secondary transition hover:text-text-primary"
              onClick={onMedia}
              aria-label="Open community media"
            >
              <FiImage size={12} aria-hidden="true" />
              Media
            </button>
          )}
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-widest ${
              connected
                ? 'border-status-success/40 bg-status-success/10 text-status-success'
                : 'border-border bg-bg-secondary text-text-tertiary'
            }`}
            aria-label={connected ? 'Connected — live' : 'Connecting'}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected ? 'bg-status-success animate-badge-pulse motion-reduce:animate-none' : 'bg-text-tertiary'
              }`}
              aria-hidden="true"
            />
            {connected ? 'Live' : 'Connecting'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default CommunityHeader;
