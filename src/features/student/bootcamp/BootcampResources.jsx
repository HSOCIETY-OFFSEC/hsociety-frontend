import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';
import BootcampAccessGate from './components/BootcampAccessGate';
import BootcampRightPanel from './components/BootcampRightPanel';

const BootcampResources = () => {
  const { setRightPanel } = useOutletContext() || {};

  React.useEffect(() => {
    if (!setRightPanel) return undefined;
    setRightPanel(<BootcampRightPanel overview={null} />);
    return () => setRightPanel(null);
  }, [setRightPanel]);

  return (
    <section className="bootcamp-page">
      <BootcampAccessGate>
        <header className="bootcamp-page-header">
          <div>
            <h1>Resources</h1>
            <p>Guides, tools, and playbooks supporting each room.</p>
          </div>
        </header>

        <div className="bootcamp-resources-grid">
          <Card padding="medium" className="bootcamp-resource-card">
            <h3>Bootcamp Playbooks</h3>
            <p>Step-by-step guidance aligned to each module.</p>
          </Card>
          <Card padding="medium" className="bootcamp-resource-card">
            <h3>Tooling Library</h3>
            <p>Curated tool stacks for reconnaissance, analysis, and reporting.</p>
          </Card>
          <Card padding="medium" className="bootcamp-resource-card">
            <h3>Reading Material</h3>
            <p>Deep dives, checklists, and quick references.</p>
          </Card>
        </div>
      </BootcampAccessGate>
    </section>
  );
};

export default BootcampResources;
