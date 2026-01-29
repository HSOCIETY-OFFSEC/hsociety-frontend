import { useEffect, useState } from 'react';
import pentestsData from '../data/pentests.json';
import tasksData from '../data/tasks.json';
import usersData from '../data/users.json';

const Dashboard = () => {
  const [pentests, setPentests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load mock data
    setPentests(pentestsData);
    setTasks(tasksData);
    setUsers(usersData);
  }, []);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'in-progress':
        return 'var(--accent-primary)';
      case 'completed':
        return '#00cc6a';
      case 'scheduled':
        return '#6a9aff';
      case 'pending':
        return '#ffa500';
      default:
        return 'var(--text-secondary)';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#ff4444';
      case 'high':
        return '#ff8844';
      case 'medium':
        return '#ffa500';
      case 'low':
        return '#44aa88';
      default:
        return 'var(--text-secondary)';
    }
  };

  const activePentests = pentests.filter(p => p.status === 'in-progress');
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
  const activeUsers = users.filter(u => u.status === 'active');

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of ongoing security operations</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-3 mb-4">
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Active Projects
          </h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
            {activePentests.length}
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Pending Tasks
          </h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff8844' }}>
            {pendingTasks.length}
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Active Team Members
          </h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {activeUsers.length}
          </p>
        </div>
      </div>

      {/* Active Penetration Tests */}
      <section className="mb-4">
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Active Penetration Tests
        </h2>
        <div className="grid grid-2">
          {activePentests.map((pentest) => (
            <div key={pentest.id} className="card">
              <div className="card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3 className="card-title">{pentest.projectName}</h3>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: getStatusBadgeColor(pentest.status) + '20',
                      color: getStatusBadgeColor(pentest.status),
                    }}
                  >
                    {pentest.status}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  {pentest.client}
                </p>
              </div>
              <div className="card-body">
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <strong>Assigned to:</strong> {pentest.assignedTo}
                  </p>
                  <p style={{ fontSize: '0.85rem' }}>
                    <strong>Timeline:</strong> {pentest.startDate} - {pentest.endDate}
                  </p>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Progress</span>
                    <span>{pentest.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pentest.progress}%`,
                        height: '100%',
                        backgroundColor: 'var(--accent-primary)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', marginTop: '1rem' }}>
                  <span style={{ color: '#ff4444' }}>🔴 {pentest.findings.critical}</span>
                  <span style={{ color: '#ff8844' }}>🟠 {pentest.findings.high}</span>
                  <span style={{ color: '#ffa500' }}>🟡 {pentest.findings.medium}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>⚪ {pentest.findings.low}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Tasks */}
      <section>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Pending Tasks
        </h2>
        <div className="grid grid-2">
          {pendingTasks.slice(0, 6).map((task) => (
            <div key={task.id} className="card">
              <div className="card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3 className="card-title" style={{ fontSize: '1.1rem' }}>{task.title}</h3>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: getPriorityBadgeColor(task.priority) + '20',
                      color: getPriorityBadgeColor(task.priority),
                    }}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>{task.description}</p>
                <div style={{ fontSize: '0.85rem' }}>
                  <p style={{ marginBottom: '0.25rem' }}>
                    <strong>Assigned to:</strong> {task.assignedTo}
                  </p>
                  <p style={{ marginBottom: '0.25rem' }}>
                    <strong>Project:</strong> {task.project}
                  </p>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    <strong>Due:</strong> {task.dueDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;