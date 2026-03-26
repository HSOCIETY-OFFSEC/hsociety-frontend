import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiBookOpen, FiCreditCard, FiRefreshCcw, FiTarget, FiTrendingUp } from 'react-icons/fi';
import { getCpBalance, getCpTransactions } from '../services/cp.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import PageLoader from '../../../shared/components/ui/PageLoader';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';
import '../styles/cp-wallet.css';

const CPWallet = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    const [balanceRes, txRes] = await Promise.all([
      getCpBalance(),
      getCpTransactions(12),
    ]);

    if (!balanceRes.success) {
      setError(getPublicErrorMessage({ action: 'load', response: balanceRes }));
    } else {
      setBalance(Number(balanceRes.data?.balance || 0));
    }

    if (txRes.success) {
      setTransactions(Array.isArray(txRes.data?.items) ? txRes.data.items : []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const pills = useMemo(
    () => [
      { label: 'Earn CP', value: 'Complete labs' },
      { label: 'Spend CP', value: 'Marketplace' },
      { label: 'Rank Signal', value: 'Leaderboard' },
    ],
    []
  );

  if (loading) return <PageLoader message="Loading CP wallet..." durationMs={0} />;

  return (
    <div className="cp-wallet-page">
      <header className="cp-wallet-hero">
        <div className="cp-wallet-hero-inner">
          <div>
            <p className="cp-wallet-kicker">HSOCIETY / CP Wallet</p>
            <h1>Manage your CP Points balance.</h1>
            <p className="cp-wallet-subtitle">
              CP Points are your in-platform currency. Track earnings, review purchases, and
              redeem for books in the marketplace.
            </p>
            <div className="cp-wallet-actions">
              <button className="cp-wallet-btn primary" onClick={() => navigate('/cp-marketplace')}>
                Open ZeroDay Market <FiArrowUpRight size={14} />
              </button>
              <button className="cp-wallet-btn ghost" onClick={() => navigate('/leaderboard')}>
                View Leaderboard
              </button>
            </div>
            <div className="cp-wallet-pills">
              {pills.map((pill) => (
                <span key={pill.label} className="cp-wallet-pill">
                  {pill.label}: {pill.value}
                </span>
              ))}
            </div>
          </div>
          <div className="cp-wallet-balance-card">
            <span className="cp-wallet-balance-label">Available CP</span>
            <strong className="cp-wallet-balance">
              <img src={cpIcon} alt="CP" className="cp-wallet-balance-icon" />
              {balance.toLocaleString()}
            </strong>
            <div className="cp-wallet-balance-meta">
              <span><FiTrendingUp size={14} /> Live signal</span>
              <span><FiCreditCard size={14} /> Spendable points</span>
            </div>
            <button className="cp-wallet-btn secondary" onClick={loadData}>
              Refresh <FiRefreshCcw size={14} />
            </button>
          </div>
        </div>
      </header>

      <section className="cp-wallet-grid">
        <div className="cp-wallet-panel">
          <div className="cp-wallet-panel-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="cp-wallet-actions-grid">
            <button type="button" onClick={() => navigate('/cp-marketplace')}>
              <FiBookOpen size={16} />
              Browse Marketplace
            </button>
            <button type="button" onClick={() => navigate('/community')}>
              <FiTarget size={16} />
              Join Community
            </button>
            <button type="button" onClick={() => navigate('/courses')}>
              <FiTrendingUp size={16} />
              Start Training
            </button>
          </div>
        </div>

        <div className="cp-wallet-panel">
          <div className="cp-wallet-panel-header">
            <h2>Recent Activity</h2>
            {error && <span className="cp-wallet-error">{error}</span>}
          </div>
          {transactions.length === 0 ? (
            <div className="cp-wallet-empty">
              <p>No CP activity yet. Complete labs or redeem from the marketplace.</p>
            </div>
          ) : (
            <div className="cp-wallet-list">
              {transactions.map((tx) => (
                <div key={tx._id} className="cp-wallet-row">
                  <div>
                    <strong>{tx.note || tx.type}</strong>
                    <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`cp-wallet-points ${tx.points < 0 ? 'negative' : 'positive'}`}>
                    {tx.points < 0 ? '' : '+'}{tx.points}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CPWallet;
