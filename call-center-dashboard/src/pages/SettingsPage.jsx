// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Card, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Select, 
  Tabs,
  Divider,
  message,
  Upload
} from 'antd';
import { 
  SaveOutlined, 
  UploadOutlined, 
  UserOutlined, 
  LockOutlined,
  MailOutlined,
  PieChartOutlined,
  BgColorsOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Password } = Input;

const SettingsPage = () => {
  const [userForm] = Form.useForm();
  const [displayForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Save user profile settings
  const handleSaveUserProfile = async (values) => {
    try {
      setLoading(true);
      // In a real app, this would save to backend API
      console.log('Saving user profile:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('User profile saved successfully');
    } catch (error) {
      console.error('Error saving user profile:', error);
      message.error('Failed to save user profile');
    } finally {
      setLoading(false);
    }
  };
  
  // Save display settings
  const handleSaveDisplaySettings = async (values) => {
    try {
      setLoading(true);
      // In a real app, this would save to backend API
      console.log('Saving display settings:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Display settings saved successfully');
    } catch (error) {
      console.error('Error saving display settings:', error);
      message.error('Failed to save display settings');
    } finally {
      setLoading(false);
    }
  };
  
  // Change password
  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      // In a real app, this would save to backend API
      console.log('Changing password:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Password changed successfully');
      
      // Reset form
      userForm.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
    } catch (error) {
      console.error('Error changing password:', error);
      message.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Content style={{ padding: '0 16px', marginTop: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={3}>Settings</Title>
        <p>Customize your application settings</p>
      </div>
      
      <Tabs defaultActiveKey="user">
        <TabPane 
          tab={
            <span>
              <UserOutlined />
              User Profile
            </span>
          } 
          key="user"
        >
          <Card>
            <Form
              form={userForm}
              layout="vertical"
              onFinish={handleSaveUserProfile}
              initialValues={{
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'admin',
                notifications: {
                  email: true,
                  dashboard: true,
                  reports: true,
                },
              }}
            >
              <Form.Item
                name="avatar"
                label="Profile Picture"
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  showUploadList={false}
                  action="/api/upload"
                  maxCount={1}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
              
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Name" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              
              <Form.Item
                name="role"
                label="Role"
              >
                <Select disabled>
                  <Option value="admin">Administrator</Option>
                  <Option value="manager">Manager</Option>
                  <Option value="agent">Agent</Option>
                  <Option value="viewer">Viewer</Option>
                </Select>
              </Form.Item>
              
              <Divider>Notification Settings</Divider>
              
              <Form.Item
                name={['notifications', 'email']}
                label="Email Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                name={['notifications', 'dashboard']}
                label="Dashboard Alerts"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                name={['notifications', 'reports']}
                label="Report Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  Save Profile
                </Button>
              </Form.Item>
              
              <Divider>Change Password</Divider>
              
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Password 
                  prefix={<LockOutlined />} 
                  placeholder="Current Password" 
                />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter your new password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                ]}
              >
                <Password 
                  prefix={<LockOutlined />} 
                  placeholder="New Password" 
                />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match'));
                    },
                  }),
                ]}
              >
                <Password 
                  prefix={<LockOutlined />} 
                  placeholder="Confirm New Password" 
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  htmlType="button" 
                  onClick={handleChangePassword}
                  loading={loading}
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <PieChartOutlined />
              Display Settings
            </span>
          } 
          key="display"
        >
          <Card>
            <Form
              form={displayForm}
              layout="vertical"
              onFinish={handleSaveDisplaySettings}
              initialValues={{
                theme: 'light',
                primaryColor: '#1890ff',
                tableRowsPerPage: 10,
                chartAnimations: true,
                defaultTimeInterval: 'daily',
                defaultDateRange: 'last7Days',
              }}
            >
              <Form.Item
                name="theme"
                label="Theme"
              >
                <Select>
                  <Option value="light">Light</Option>
                  <Option value="dark">Dark</Option>
                  <Option value="system">System</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="primaryColor"
                label="Primary Color"
              >
                <Input 
                  prefix={<BgColorsOutlined />} 
                  type="color" 
                  style={{ width: 100 }} 
                />
              </Form.Item>
              
              <Form.Item
                name="tableRowsPerPage"
                label="Table Rows Per Page"
              >
                <Select>
                  <Option value={10}>10</Option>
                  <Option value={20}>20</Option>
                  <Option value={50}>50</Option>
                  <Option value={100}>100</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="chartAnimations"
                label="Chart Animations"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              
              <Form.Item
                name="defaultTimeInterval"
                label="Default Time Interval"
              >
                <Select>
                  <Option value="15min">15 Minutes</Option>
                  <Option value="30min">30 Minutes</Option>
                  <Option value="hourly">Hourly</Option>
                  <Option value="daily">Daily</Option>
                  <Option value="monthly">Monthly</Option>
                  <Option value="yearly">Yearly</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="defaultDateRange"
                label="Default Date Range"
              >
                <Select>
                  <Option value="today">Today</Option>
                  <Option value="yesterday">Yesterday</Option>
                  <Option value="thisWeek">This Week</Option>
                  <Option value="lastWeek">Last Week</Option>
                  <Option value="thisMonth">This Month</Option>
                  <Option value="lastMonth">Last Month</Option>
                  <Option value="last7Days">Last 7 Days</Option>
                  <Option value="last30Days">Last 30 Days</Option>
                  <Option value="last90Days">Last 90 Days</Option>
                </Select>
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  Save Display Settings
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </Content>
  );
};

export default SettingsPage;