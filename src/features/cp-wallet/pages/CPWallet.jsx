import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiBookOpen, FiCreditCard, FiRefreshCcw, FiTarget, FiTrendingUp } from 'react-icons/fi';
import { getCpBalance, getCpTransactions } from '../services/cp.service';
import { getPublicErrorMessage } from '../../../shared/utils/errors/publicError';
import PageLoader from '../../../shared/components/ui/PageLoader';
import cpIcon from '../../../assets/icons/CP/cp-icon.webp';

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
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-xl border border-border bg-bg-secondary p-6 shadow-lg sm:p-8">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:gap-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-text-tertiary">HSOCIETY / CP Wallet</p>
            <h1 className="mt-2 text-2xl font-semibold text-text-primary sm:text-3xl">
              Manage your CP Points balance.
            </h1>
            <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-text-secondary">
              CP Points are your in-platform currency. Track earnings, review purchases, and
              redeem for books in the marketplace.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-md border border-brand bg-brand px-4 py-2 text-sm font-semibold text-ink-onBrand transition hover:bg-brand-hover"
                onClick={() => navigate('/cp-marketplace')}
              >
                Open ZeroDay Market <FiArrowUpRight size={14} />
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-bg-tertiary"
                onClick={() => navigate('/leaderboard')}
              >
                View Leaderboard
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {pills.map((pill) => (
                <span key={pill.label} className="rounded-full border border-border bg-bg-tertiary px-3 py-1 text-xs text-text-secondary">
                  {pill.label}: {pill.value}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-bg-primary p-6">
            <span className="text-xs uppercase tracking-widest text-text-tertiary">Available CP</span>
            <strong className="inline-flex items-center gap-2 text-3xl font-semibold text-brand">
              <img src={cpIcon} alt="CP" className="h-8 w-8 p-1" />
              {balance.toLocaleString()}
            </strong>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
              <span className="flex items-center gap-2"><FiTrendingUp size={14} /> Live signal</span>
              <span className="flex items-center gap-2"><FiCreditCard size={14} /> Spendable points</span>
            </div>
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/20 sm:w-auto sm:self-start"
              onClick={loadData}
            >
              Refresh <FiRefreshCcw size={14} />
            </button>
          </div>
        </div>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-bg-secondary p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              className="flex flex-col items-start gap-2 rounded-md border border-border bg-bg-tertiary p-3 text-sm font-medium text-text-primary transition hover:bg-bg-secondary"
              onClick={() => navigate('/cp-marketplace')}
            >
              <FiBookOpen size={16} />
              Browse Marketplace
            </button>
            <button
              type="button"
              className="flex flex-col items-start gap-2 rounded-md border border-border bg-bg-tertiary p-3 text-sm font-medium text-text-primary transition hover:bg-bg-secondary"
              onClick={() => navigate('/community')}
            >
              <FiTarget size={16} />
              Join Community
            </button>
            <button
              type="button"
              className="flex flex-col items-start gap-2 rounded-md border border-border bg-bg-tertiary p-3 text-sm font-medium text-text-primary transition hover:bg-bg-secondary"
              onClick={() => navigate('/courses')}
            >
              <FiTrendingUp size={16} />
              Start Training
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-bg-secondary p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Recent Activity</h2>
            {error && <span className="text-xs text-status-danger">{error}</span>}
          </div>
          {transactions.length === 0 ? (
            <div className="rounded-md bg-bg-tertiary p-4 text-sm text-text-secondary">
              No CP activity yet. Complete labs or redeem from the marketplace.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {transactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between border-b border-dashed border-border/60 py-3 last:border-b-0">
                  <div>
                    <strong className="block text-sm font-semibold text-text-primary">{tx.note || tx.type}</strong>
                    <span className="text-xs text-text-tertiary">{new Date(tx.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`text-sm font-bold ${tx.points < 0 ? 'text-status-danger' : 'text-status-success'}`}>
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
