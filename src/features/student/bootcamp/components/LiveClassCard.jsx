import React from 'react';
import { FiExternalLink, FiVideo } from 'react-icons/fi';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';

const LiveClassCard = ({ title, instructor, time, link }) => {
  const hasLink = Boolean(link);

  return (
    <Card padding="medium" className="bootcamp-live-card">
      <div className="bootcamp-live-header">
        <FiVideo size={18} />
        <div>
          <p className="bootcamp-live-kicker">Live Class</p>
          <h3>{title || 'Live session'}</h3>
        </div>
      </div>
      <div className="bootcamp-live-meta">
        <span>Instructor: {instructor || 'Admin'}</span>
        <span>Time: {time || 'To be announced'}</span>
      </div>
      {hasLink ? (
        <Button
          variant="primary"
          size="small"
          onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
        >
          <FiExternalLink size={14} />
          Join Live Session
        </Button>
      ) : (
        <p className="bootcamp-live-empty">
          Live session link will be posted by the instructor before class begins.
        </p>
      )}
    </Card>
  );
};

export default LiveClassCard;
