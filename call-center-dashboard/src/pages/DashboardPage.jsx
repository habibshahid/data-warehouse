// src/pages/DashboardPage.jsx
import React from 'react';
import { Layout } from 'antd';
import Dashboard from '../components/dashboard/Dashboard';

const DashboardPage = () => {
  return (
    <Layout style={{ minHeight: '100%', background: 'transparent' }}>
      <Dashboard />
    </Layout>
  );
};

export default DashboardPage;
