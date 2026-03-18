import React from 'react';
import { Outlet } from 'react-router-dom';
import './index.css';

const AdminLayout = () => {
  return (
    <Outlet />
  );
};

export default AdminLayout;
