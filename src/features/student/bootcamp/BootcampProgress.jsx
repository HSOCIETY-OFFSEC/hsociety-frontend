import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';
import { getStudentOverview } from '../../dashboards/student/student.service';
import { HACKER_PROTOCOL_PHASES } from '../../../data/bootcamps/hackerProtocolData';
import BootcampAccessGate from './components/BootcampAccessGate';
import BootcampRightPanel from './components/BootcampRightPanel';

const BootcampProgress = () => {
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

  const progressMap = useMemo(() => {
    return (overview?.modules || []).reduce((acc, module) => {
      acc[Number(module.id)] = Number(module.progress) || 0;
      return acc;
    }, {});
  }, [overview]);

  return (
    <section className="bootcamp-page">
      <BootcampAccessGate>
        <header className="bootcamp-page-header">
          <div>
            <h1>Progress</h1>
            <p>Track room completion and module status. Certification is handled through manual interviews.</p>
          </div>
        </header>

        <div className="bootcamp-progress-grid">
          {HACKER_PROTOCOL_PHASES.map((phase) => (
            <Card key={phase.moduleId} padding="medium" className="bootcamp-progress-card">
              <h3>Phase {phase.moduleId}: {phase.codename}</h3>
              <p>{phase.title}</p>
              <strong>{progressMap[Number(phase.moduleId)] || 0}% complete</strong>
            </Card>
          ))}
        </div>

        <Card padding="medium" className="bootcamp-status-card">
          <h3>Final Evaluation</h3>
          <p>
            Final certification is completed via a manual interview with instructors after all modules
            and quizzes are done.
          </p>
        </Card>
      </BootcampAccessGate>
    </section>
  );
};

export default BootcampProgress;
