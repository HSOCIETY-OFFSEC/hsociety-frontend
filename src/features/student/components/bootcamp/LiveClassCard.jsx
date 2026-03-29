import React from 'react';
import { FiExternalLink, FiVideo } from 'react-icons/fi';

const LiveClassCard = ({ title, instructor, time, link }) => {
  const hasLink = Boolean(link);
  const cardClassName = 'rounded-lg border border-border bg-bg-secondary p-4 shadow-sm';
  const headerClassName = 'flex items-center gap-3';
  const kickerClassName = 'text-xs font-semibold uppercase tracking-widest text-text-tertiary';
  const titleClassName = 'text-sm font-semibold text-text-primary';
  const metaClassName = 'flex flex-col gap-1 text-sm text-text-secondary';
  const mutedClassName = 'text-sm text-text-tertiary';
  const buttonClassName =
    'inline-flex items-center gap-2 rounded-xs border border-brand bg-brand px-3 py-2 text-xs font-semibold text-ink-onBrand transition hover:bg-brand/90';

  return (
    <div className={cardClassName}>
      <div className={headerClassName}>
        <FiVideo size={16} className="text-text-tertiary" />
        <div>
          <p className={kickerClassName}>Live Class</p>
          <h3 className={titleClassName}>{title || 'Live session'}</h3>
        </div>
      </div>
      <div className={metaClassName}>
        <span>Instructor: {instructor || 'Admin'}</span>
        <span>Time: {time || 'To be announced'}</span>
      </div>
      {hasLink ? (
        <button
          type="button"
          className={buttonClassName}
          onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
        >
          <FiExternalLink size={14} />
          Join Live Session
        </button>
      ) : (
        <p className={mutedClassName}>Live session link will be posted by the instructor before class begins.</p>
      )}
    </div>
  );
};

export default LiveClassCard;
