import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCompass } from 'react-icons/fi';
import Navbar from '../../shared/components/layout/Navbar';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import notFoundContent from '../../data/notfound.json';
import '../../styles/features/notfound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="notfound-page">
        <Card className="notfound-card" padding="large">
          <p className="notfound-code">{notFoundContent.code}</p>
          <h1 className="notfound-title">{notFoundContent.title}</h1>
          <p className="notfound-text">{notFoundContent.message}</p>
          <div className="notfound-actions">
            {notFoundContent.actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant}
                size="large"
                onClick={() => (action.route === 'back' ? navigate(-1) : navigate(action.route))}
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
