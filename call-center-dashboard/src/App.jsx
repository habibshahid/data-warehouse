import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { DashboardProvider } from './contexts/DashboardContext';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';

// Import Ant Design CSS directly - no special handling needed
import 'antd/dist/reset.css';
// Import our custom CSS
import './styles.css';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
      }}
    >
      <DashboardProvider>
        <Router>
          <div className="app-container">
            <Header />
            <div className="main-container">
              <Sidebar />
              <div className="content-container">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </DashboardProvider>
    </ConfigProvider>
  );
};

export default App;