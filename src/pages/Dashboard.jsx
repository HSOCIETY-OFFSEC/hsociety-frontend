import { useEffect, useState } from 'react';
import pentestsData from '../data/pentests.json';
import tasksData from '../data/tasks.json';
import usersData from '../data/users.json';
import { 
  HiShieldCheck, 
  HiClock, 
  HiUsers,
  HiChartBar,
  HiTrendingUp,
  HiExclamation,
  HiCheckCircle,
  HiCalendar,
  HiUser,
  HiFire,
  HiLightningBolt
} from 'react-icons/hi';
import { FaBug, FaExclamationTriangle } from 'react-icons/fa';

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

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <HiFire size={16} />;
      case 'high':
        return <FaExclamationTriangle size={14} />;
      case 'medium':
        return <HiExclamation size={16} />;
      default:
        return <HiCheckCircle size={16} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-progress':
        return <HiLightningBolt size={16} />;
      case 'completed':
        return <HiCheckCircle size={16} />;
      case 'scheduled':
        return <HiCalendar size={16} />;
      default:
        return <HiClock size={16} />;
    }
  };

  const activePentests = pentests.filter(p => p.status === 'in-progress');
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
  const activeUsers = users.filter(u => u.status === 'active');

  const totalFindings = pentests.reduce((acc, p) => 
    acc + p.findings.critical + p.findings.high + p.findings.medium + p.findings.low, 0
  );

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <HiChartBar size={40} style={{ marginRight: '0.5rem' }} />
            Dashboard
          </h1>
          <p className="page-subtitle">Overview of ongoing security operations</p>
        </div>
        <div className="dashboard-date">
          <HiCalendar size={20} />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-4 mb-4">
        <div className="stat-card">
          <div className="stat-icon">
            <HiShieldCheck size={32} />
          </div>
          <div className="stat-value">{activePentests.length}</div>
          <div className="stat-label">Active Projects</div>
          <div className="stat-trend">
            <HiTrendingUp size={16} />
            <span>+2 this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <HiClock size={32} />
          </div>
          <div className="stat-value">{pendingTasks.length}</div>
          <div className="stat-label">Pending Tasks</div>
          <div className="stat-trend">
            <HiTrendingUp size={16} />
            <span>+5 today</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <HiUsers size={32} />
          </div>
          <div className="stat-value">{activeUsers.length}</div>
          <div className="stat-label">Active Team</div>
          <div className="stat-trend">
            <HiCheckCircle size={16} />
            <span>All online</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaBug size={28} />
          </div>
          <div className="stat-value">{totalFindings}</div>
          <div className="stat-label">Total Findings</div>
          <div className="stat-trend">
            <HiTrendingUp size={16} />
            <span>+12 this month</span>
          </div>
        </div>
      </div>

      {/* Active Penetration Tests */}
      <section className="dashboard-section mb-4">
        <div className="section-header-row">
          <h2 className="section-title">
            <HiShieldCheck size={28} />
            Active Penetration Tests
          </h2>
          <span className="section-count">{activePentests.length} Projects</span>
        </div>
        
        <div className="grid grid-2">
          {activePentests.map((pentest) => (
            <div key={pentest.id} className="pentest-card card">
              <div className="card-header">
                <div className="card-title-row">
                  <h3 className="card-title">{pentest.projectName}</h3>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getStatusBadgeColor(pentest.status) + '20',
                      color: getStatusBadgeColor(pentest.status),
                    }}
                  >
                    {getStatusIcon(pentest.status)}
                    {pentest.status}
                  </span>
                </div>
                <p className="card-client">
                  {pentest.client}
                </p>
              </div>
              
              <div className="card-body">
                <div className="pentest-info">
                  <div className="info-item">
                    <HiUser size={16} />
                    <span>{pentest.assignedTo}</span>
                  </div>
                  <div className="info-item">
                    <HiCalendar size={16} />
                    <span>{pentest.startDate} - {pentest.endDate}</span>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Progress</span>
                    <span className="progress-percent">{pentest.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${pentest.progress}%` }}
                    />
                  </div>
                </div>

                <div className="findings-grid">
                  <div className="finding-item critical">
                    <FaBug size={18} />
                    <div>
                      <div className="finding-count">{pentest.findings.critical}</div>
                      <div className="finding-label">Critical</div>
                    </div>
                  </div>
                  <div className="finding-item high">
                    <FaExclamationTriangle size={18} />
                    <div>
                      <div className="finding-count">{pentest.findings.high}</div>
                      <div className="finding-label">High</div>
                    </div>
                  </div>
                  <div className="finding-item medium">
                    <HiExclamation size={20} />
                    <div>
                      <div className="finding-count">{pentest.findings.medium}</div>
                      <div className="finding-label">Medium</div>
                    </div>
                  </div>
                  <div className="finding-item low">
                    <HiCheckCircle size={20} />
                    <div>
                      <div className="finding-count">{pentest.findings.low}</div>
                      <div className="finding-label">Low</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Tasks */}
      <section className="dashboard-section">
        <div className="section-header-row">
          <h2 className="section-title">
            <HiClock size={28} />
            Pending Tasks
          </h2>
          <span className="section-count">{pendingTasks.length} Tasks</span>
        </div>
        
        <div className="grid grid-2">
          {pendingTasks.slice(0, 6).map((task) => (
            <div key={task.id} className="task-card card">
              <div className="card-header">
                <div className="card-title-row">
                  <h3 className="card-title task-title">{task.title}</h3>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getPriorityBadgeColor(task.priority) + '20',
                      color: getPriorityBadgeColor(task.priority),
                    }}
                  >
                    {getPriorityIcon(task.priority)}
                    {task.priority}
                  </span>
                </div>
              </div>
              
              <div className="card-body">
                <p className="task-description">{task.description}</p>
                
                <div className="task-meta">
                  <div className="meta-item">
                    <HiUser size={16} />
                    <span>{task.assignedTo}</span>
                  </div>
                  <div className="meta-item">
                    <HiCalendar size={16} />
                    <span>{task.dueDate}</span>
                  </div>
                </div>

                <div className="task-project">
                  <HiShieldCheck size={16} />
                  <span>{task.project}</span>
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