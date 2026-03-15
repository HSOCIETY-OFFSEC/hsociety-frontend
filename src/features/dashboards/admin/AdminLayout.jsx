import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../../styles/dashboards/admin/index.css';

const AdminLayout = () => {
  return (
    <Outlet />
  );
};

export default AdminLayout;
