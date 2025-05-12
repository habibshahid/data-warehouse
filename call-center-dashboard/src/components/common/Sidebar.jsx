// src/components/common/Sidebar.jsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  BarChartOutlined, 
  SettingOutlined, 
  TeamOutlined,
  PhoneOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: <Link to="/reports">Reports</Link>,
    },
    {
      key: 'call-management',
      icon: <PhoneOutlined />,
      label: 'Call Management',
      children: [
        {
          key: '/queues',
          label: <Link to="/queues">Queues</Link>,
        },
        {
          key: '/agents',
          label: <Link to="/agents">Agents</Link>,
        },
        {
          key: '/ivr',
          label: <Link to="/ivr">IVR</Link>,
        },
      ],
    },
    {
      key: 'scheduling',
      icon: <CalendarOutlined />,
      label: 'Scheduling',
      children: [
        {
          key: '/schedule',
          label: <Link to="/schedule">Agent Schedule</Link>,
        },
        {
          key: '/forecasting',
          label: <Link to="/forecasting">Forecasting</Link>,
        },
      ],
    },
    {
      key: 'admin',
      icon: <TeamOutlined />,
      label: 'Administration',
      children: [
        {
          key: '/users',
          label: <Link to="/users">Users</Link>,
        },
        {
          key: '/roles',
          label: <Link to="/roles">Roles & Permissions</Link>,
        },
      ],
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];
  
  // Find the open submenu key based on current path
  const getOpenKeys = () => {
    for (const item of menuItems) {
      if (item.children) {
        for (const child of item.children) {
          if (child.key === path) {
            return [item.key];
          }
        }
      }
    }
    return [];
  };
  
  return (
    <Sider 
      width={220} 
      style={{ 
        background: '#fff',
        boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
        height: '100%',
      }}
      theme="light"
    >
      <Menu
        mode="inline"
        selectedKeys={[path]}
        defaultOpenKeys={getOpenKeys()}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;