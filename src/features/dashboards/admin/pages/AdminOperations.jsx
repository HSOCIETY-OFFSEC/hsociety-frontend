import React from 'react';
import { FiActivity, FiClipboard, FiShield, FiUsers, FiWifi } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Card from '../../../../shared/components/ui/Card';
import Button from '../../../../shared/components/ui/Button';

const AdminOperations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,3vw,1.5rem)] pt-[clamp(1.25rem,3vw,2rem)] pb-16 text-text-primary">
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          <Card
            className="rounded-lg border border-border bg-bg-secondary shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
            padding="medium"
            shadow="none"
          >
            <div className="mb-4 flex flex-col gap-1.5">
              <h2 className="text-base font-semibold text-text-primary">Community</h2>
              <p className="text-sm text-text-secondary">Channels, tags, and stats.</p>
            </div>
            <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/community')}>
              <FiActivity size={14} />
              Open Community Manager
            </Button>
          </Card>

          <Card
            className="rounded-lg border border-border bg-bg-secondary shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
            padding="medium"
            shadow="none"
          >
            <div className="mb-4 flex flex-col gap-1.5">
              <h2 className="text-base font-semibold text-text-primary">Users</h2>
              <p className="text-sm text-text-secondary">Roles, bootcamp status, and access.</p>
            </div>
            <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/users')}>
              <FiUsers size={14} />
              Open User Manager
            </Button>
          </Card>

          <Card
            className="rounded-lg border border-border bg-bg-secondary shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
            padding="medium"
            shadow="none"
          >
            <div className="mb-4 flex flex-col gap-1.5">
              <h2 className="text-base font-semibold text-text-primary">Pentests</h2>
              <p className="text-sm text-text-secondary">Assignments and engagement status.</p>
            </div>
            <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/pentests')}>
              <FiShield size={14} />
              Open Pentest Manager
            </Button>
          </Card>

          <Card
            className="rounded-lg border border-border bg-bg-secondary shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
            padding="medium"
            shadow="none"
          >
            <div className="mb-4 flex flex-col gap-1.5">
              <h2 className="text-base font-semibold text-text-primary">Content</h2>
              <p className="text-sm text-text-secondary">Landing page + blog entries.</p>
            </div>
            <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/content')}>
              <FiClipboard size={14} />
              Open Content Manager
            </Button>
          </Card>

          <Card
            className="rounded-lg border border-border bg-bg-secondary shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
            padding="medium"
            shadow="none"
          >
            <div className="mb-4 flex flex-col gap-1.5">
              <h2 className="text-base font-semibold text-text-primary">Security</h2>
              <p className="text-sm text-text-secondary">View IP activity and SOC telemetry.</p>
            </div>
            <Button variant="primary" size="small" onClick={() => navigate('/mr-robot/security')}>
              <FiWifi size={14} />
              Open Mini SOC
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOperations;
