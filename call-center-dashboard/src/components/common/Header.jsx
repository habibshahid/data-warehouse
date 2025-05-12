// src/components/common/Header.jsx
import React from 'react';
import { Layout, Typography, Space, Button, Dropdown, Menu } from 'antd';
import { 
  DownOutlined, 
  UserOutlined, 
  SettingOutlined, 
  QuestionCircleOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = () => {
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );
  
  const helpMenu = (
    <Menu>
      <Menu.Item key="documentation">Documentation</Menu.Item>
      <Menu.Item key="tutorials">Video Tutorials</Menu.Item>
      <Menu.Item key="support">Contact Support</Menu.Item>
    </Menu>
  );
  
  return (
    <Header style={{ 
      background: '#fff', 
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: 64
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/">
          <Title level={3} style={{ margin: 0 }}>
            Call Center Analytics
          </Title>
        </Link>
      </div>
      
      <Space>
        <Dropdown overlay={helpMenu} placement="bottomRight">
          <Button type="text" icon={<QuestionCircleOutlined />}>
            Help <DownOutlined />
          </Button>
        </Dropdown>
        
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Button type="text" icon={<UserOutlined />}>
            Admin <DownOutlined />
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AppHeader;