import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCompass } from 'react-icons/fi';
import Navbar from '../../../shared/components/layout/Navbar';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import notFoundContent from '../../../data/static/notfound.json';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-72px)] w-full bg-[radial-gradient(800px_350px_at_20%_-10%,rgba(var(--brand-rgb),0.14),transparent_60%),linear-gradient(var(--bg-primary),var(--bg-primary))] px-4 py-8">
        <Card className="mx-auto w-full max-w-[700px] border border-border bg-card/95 text-center" padding="large">
          <p className="text-5xl font-extrabold leading-none text-brand sm:text-6xl lg:text-7xl">
            {notFoundContent.code}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-text-primary sm:text-3xl">
            {notFoundContent.title}
          </h1>
          <p className="mt-3 text-sm text-text-secondary">{notFoundContent.message}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {notFoundContent.actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant}
                size="large"
                onClick={() => (action.route === 'back' ? navigate(-1) : navigate(action.route))}
                className="min-h-[44px]"
              >
                {action.icon === 'FiCompass' && <FiCompass size={18} />}
                {action.icon === 'FiArrowLeft' && <FiArrowLeft size={18} />}
                {action.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default NotFound;
