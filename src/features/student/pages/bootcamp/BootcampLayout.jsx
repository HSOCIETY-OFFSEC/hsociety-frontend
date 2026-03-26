import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../styles/bootcamp/bootcamp-app.css';

const BootcampLayout = () => (
  <div className="bootcamp-app">
    <Outlet />
  </div>
);

export default BootcampLayout;
