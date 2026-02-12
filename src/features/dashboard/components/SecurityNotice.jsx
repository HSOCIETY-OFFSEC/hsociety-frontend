import React from 'react';
import { FiLock } from 'react-icons/fi';
import Card from '../../../shared/components/ui/Card';

const SecurityNotice = () => (
  <Card padding="large" shadow="small" className="security-notice reveal-on-scroll dramatic-card">
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <FiLock size={28} />
      <div>
        <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Security Notice
        </h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          All your data is encrypted and stored securely. We never share your information
          with third parties. For any security concerns, please contact our team immediately.
        </p>
      </div>
    </div>
  </Card>
);

export default SecurityNotice;
