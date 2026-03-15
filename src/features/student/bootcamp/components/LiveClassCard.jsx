import React from 'react';
import { FiExternalLink, FiVideo } from 'react-icons/fi';

const LiveClassCard = ({ title, instructor, time, link }) => {
  const hasLink = Boolean(link);

  return (
    <div className="bc-panel bc-live-card">
      <div className="bc-live-header">
        <FiVideo size={16} />
        <div>
          <p className="bc-live-kicker">Live Class</p>
          <h3 className="bc-live-title">{title || 'Live session'}</h3>
        </div>
      </div>
      <div className="bc-live-meta">
        <span>Instructor: {instructor || 'Admin'}</span>
        <span>Time: {time || 'To be announced'}</span>
      </div>
      {hasLink ? (
        <button
          type="button"
          className="bc-btn bc-btn-primary"
          onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
        >
          <FiExternalLink size={14} />
          Join Live Session
        </button>
      ) : (
        <p className="bc-muted">Live session link will be posted by the instructor before class begins.</p>
      )}
    </div>
  );
};

export default LiveClassCard;
