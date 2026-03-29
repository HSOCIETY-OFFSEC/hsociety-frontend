import React from 'react';
import { Outlet } from 'react-router-dom';

const BootcampLayout = () => (
  <div className="min-h-[calc(100vh-60px)] w-full bg-bg-primary text-text-primary">
    <Outlet />
  </div>
);

export default BootcampLayout;
