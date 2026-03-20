import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/admin-dashboard.css';

const AdminLayout = () => {
  return (
    <Outlet />
  );
};

export default AdminLayout;
