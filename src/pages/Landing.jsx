import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Landing = () => {
  const features = [
    {
      title: 'Penetration Testing',
      description: 'Comprehensive security assessments to identify vulnerabilities before attackers do.',
      icon: '🎯',
    },
    {
      title: 'Red Team Operations',
      description: 'Advanced adversary simulation to test your defense capabilities.',
      icon: '🔴',
    },
    {
      title: 'Security Audits',
      description: 'In-depth analysis of your security posture and compliance requirements.',
      icon: '🔍',
    },
  ];

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="text-center mb-4">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Logo className="logo" style={{ height: '80px' }} />
        </div>
        <h1 className="page-title">Welcome to Hsociety</h1>
        <p className="page-subtitle" style={{ fontSize: '1.3rem', marginBottom: '2rem' }}>
          Elite Offensive Security Solutions
        </p>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 2rem' }}>
          We specialize in advanced penetration testing, red team operations, and security assessments 
          to help organizations strengthen their security posture.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/signup">
            <button className="btn btn-primary">Get Started</button>
          </Link>
          <Link to="/login">
            <button className="btn btn-secondary">Login</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-4">
        <h2 className="text-center mb-3" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
          Our Services
        </h2>
        <div className="grid grid-3">
          {features.map((feature, index) => (
            <div key={index} className="card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {feature.icon}
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-body">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;