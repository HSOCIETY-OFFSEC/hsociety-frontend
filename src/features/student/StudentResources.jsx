import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiExternalLink, FiInfo } from 'react-icons/fi';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import { getFreeResources } from './services/learn.service';
import '../../styles/student/base.css';
import '../../styles/student/components.css';
import '../../styles/student/pages/resources.css';

const StudentResources = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState('We do not have free resources yet.');

  useEffect(() => {
    let mounted = true;
    const loadResources = async () => {
      setLoading(true);
      const response = await getFreeResources();
      if (!mounted) return;
      if (!response.success) {
        setError(response.error || 'Unable to load free resources.');
      } else {
        setResources(Array.isArray(response.data?.items) ? response.data.items : []);
        if (response.data?.message) {
          setMessage(response.data.message);
        }
      }
      setLoading(false);
    };

    loadResources();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="student-page">
      <div className="dashboard-shell">
        <header className="student-hero dashboard-shell-header reveal-on-scroll">
          <div>
            <p className="student-kicker dashboard-shell-kicker">Resources</p>
            <h1 className="dashboard-shell-title">Free learning resources.</h1>
            <p className="dashboard-shell-subtitle">
              These are admin-managed public materials outside paid bootcamp access.
            </p>
          </div>
        </header>

        {error && (
          <Card padding="medium" className="student-card reveal-on-scroll">
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{error}</p>
          </Card>
        )}

        {loading ? (
          <Card padding="medium" className="student-card reveal-on-scroll">
            <p style={{ margin: 0 }}>Loading resources...</p>
          </Card>
        ) : resources.length === 0 ? (
          <Card padding="medium" className="student-card reveal-on-scroll">
            <div className="student-card-header">
              <FiInfo size={20} />
              <h3>No free resources yet</h3>
            </div>
            <p>{message}</p>
          </Card>
        ) : (
          <div className="student-grid">
            {resources.map((resource) => (
              <Card
                key={resource.id}
                padding="medium"
                className="student-card reveal-on-scroll"
              >
                <div className="student-card-header">
                  <FiBookOpen size={20} />
                  <h3>{resource.title}</h3>
                </div>
                <p>{resource.description || 'Free learning resource'}</p>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                  disabled={!resource.url}
                >
                  <FiExternalLink size={14} />
                  Open Resource
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResources;
