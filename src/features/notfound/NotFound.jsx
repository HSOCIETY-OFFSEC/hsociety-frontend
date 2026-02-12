import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCompass } from 'react-icons/fi';
import Navbar from '../../shared/components/layout/Navbar';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import '../../styles/features/notfound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="notfound-page">
        <Card className="notfound-card" padding="large">
          <p className="notfound-code">404</p>
          <h1 className="notfound-title">Page Not Found</h1>
          <p className="notfound-text">
            The page you requested does not exist or has moved.
          </p>
          <div className="notfound-actions">
            <Button variant="primary" size="large" onClick={() => navigate('/')}>
              <FiCompass size={18} />
              Go Home
            </Button>
            <Button variant="ghost" size="large" onClick={() => navigate(-1)}>
              <FiArrowLeft size={18} />
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default NotFound;
