import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FiArrowRight, FiClock, FiLayers, FiPlayCircle } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import { getStudentOverview } from '../../dashboards/student/student.service';
import { HACKER_PROTOCOL_BOOTCAMP, HACKER_PROTOCOL_PHASES } from '../../../data/bootcamps/hackerProtocolData';
import BootcampAccessGate from './components/BootcampAccessGate';
import BootcampRightPanel from './components/BootcampRightPanel';

const BootcampOverview = () => {
  const navigate = useNavigate();
  const { setRightPanel } = useOutletContext() || {};
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await getStudentOverview();
      if (!mounted) return;
      if (response.success) setOverview(response.data);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!setRightPanel) return undefined;
    setRightPanel(<BootcampRightPanel overview={overview} />);
    return () => setRightPanel(null);
  }, [overview, setRightPanel]);

  const nextModule = useMemo(() => {
    const progressMap = (overview?.modules || []).reduce((acc, module) => {
      acc[Number(module.id)] = Number(module.progress) || 0;
      return acc;
    }, {});

    return (
      HACKER_PROTOCOL_PHASES.find((phase) => (progressMap[Number(phase.moduleId)] || 0) < 100)
      || HACKER_PROTOCOL_PHASES[HACKER_PROTOCOL_PHASES.length - 1]
    );
  }, [overview]);

  return (
    <section className="bootcamp-page">
      <BootcampAccessGate>
        <div className="bootcamp-hero">
          <div>
            <p className="bootcamp-kicker">{HACKER_PROTOCOL_BOOTCAMP.subtitle}</p>
            <h1>{HACKER_PROTOCOL_BOOTCAMP.title} Learning App</h1>
            <p>{HACKER_PROTOCOL_BOOTCAMP.overview}</p>
          </div>
          <div className="bootcamp-hero-actions">
            <Button variant="primary" size="small" onClick={() => navigate('/student-bootcamps/modules')}>
              Go to Modules
              <FiArrowRight size={14} />
            </Button>
            <Button variant="ghost" size="small" onClick={() => navigate('/student-bootcamps/live-class')}>
              Live Class Hub
            </Button>
          </div>
        </div>

        <div className="bootcamp-overview-grid">
          <Card padding="medium" className="bootcamp-overview-card">
            <FiLayers size={18} />
            <div>
              <h3>Structured progression</h3>
              <p>Modules unlock sequentially. Finish each room quiz to continue.</p>
            </div>
          </Card>
          <Card padding="medium" className="bootcamp-overview-card">
            <FiPlayCircle size={18} />
            <div>
              <h3>Live class support</h3>
              <p>Join instructor-led sessions directly from each room.</p>
            </div>
          </Card>
          <Card padding="medium" className="bootcamp-overview-card">
            <FiClock size={18} />
            <div>
              <h3>Next up</h3>
              <p>
                Phase {nextModule?.moduleId}: {nextModule?.title}
              </p>
            </div>
          </Card>
        </div>
      </BootcampAccessGate>
    </section>
  );
};

export default BootcampOverview;
