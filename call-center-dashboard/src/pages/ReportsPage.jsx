// src/pages/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Tabs, 
  Form, 
  Button, 
  Select, 
  DatePicker, 
  Input,
  Card,
  Table,
  Space,
  Modal,
  message,
  Divider
} from 'antd';
import { 
  DownloadOutlined, 
  PlusOutlined, 
  FileExcelOutlined,
  FilePdfOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useDashboard } from '../hooks/useDashboard';
import { useMetadata } from '../hooks/useMetadata';
import { generateReport, downloadReport, scheduleReport, listScheduledReports } from '../api/reportService';
import { formatDateTime } from '../utils/dateUtils';

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { confirm } = Modal;

const ReportsPage = () => {
  const [generateForm] = Form.useForm();
  const [scheduleForm] = Form.useForm();
  const { availableMetadata } = useMetadata();
  const { timeInterval } = useDashboard();
  
  const [reports, setReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  
  // Load scheduled reports
  useEffect(() => {
    const fetchScheduledReports = async () => {
      try {
        setLoading(true);
        const data = await listScheduledReports();
        setScheduledReports(data);
      } catch (error) {
        console.error('Error loading scheduled reports:', error);
        message.error('Failed to load scheduled reports');
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'scheduled') {
      fetchScheduledReports();
    }
  }, [activeTab]);
  
  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  
  // Handle generate report
  const handleGenerateReport = async (values) => {
    try {
      setLoading(true);
      
      const reportParams = {
        name: values.name,
        description: values.description,
        timeInterval: values.timeInterval,
        startDate: values.dateRange[0].toDate(),
        endDate: values.dateRange[1].toDate(),
        columns: values.columns,
        filters: {
          queues: values.queues || [],
          channels: values.channels || [],
        },
        groupBy: values.groupBy,
        format: values.format,
      };
      
      const report = await generateReport(reportParams);
      message.success('Report generated successfully');
      
      // Add to reports list
      setReports([report, ...reports]);
      
      // Download the report
      await downloadReport(report.id, values.format);
    } catch (error) {
      console.error('Error generating report:', error);
      message.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle scheduling a report
  const handleScheduleReport = async (values) => {
    try {
      setLoading(true);
      
      const reportParams = {
        name: values.name,
        description: values.description,
        timeInterval: values.timeInterval,
        columns: values.columns,
        filters: {
          queues: values.queues || [],
          channels: values.channels || [],
        },
        groupBy: values.groupBy,
        format: values.format,
        schedule: {
          frequency: values.frequency,
          dayOfWeek: values.frequency === 'weekly' ? values.dayOfWeek : undefined,
          dayOfMonth: values.frequency === 'monthly' ? values.dayOfMonth : undefined,
          time: values.time.format('HH:mm'),
        },
        recipients: values.recipients,
      };
      
      const scheduledReport = await scheduleReport(reportParams);
      message.success('Report scheduled successfully');
      
      // Add to scheduled reports list
      setScheduledReports([scheduledReport, ...scheduledReports]);
      
      // Reset form
      scheduleForm.resetFields();
    } catch (error) {
      console.error('Error scheduling report:', error);
      message.error('Failed to schedule report');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a scheduled report
  const handleDeleteScheduledReport = (reportId) => {
    confirm({
      title: 'Are you sure you want to delete this scheduled report?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will permanently delete the scheduled report.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          // Call API to delete scheduled report
          // await deleteScheduledReport(reportId);
          
          // Update state
          setScheduledReports(scheduledReports.filter(report => report.id !== reportId));
          
          message.success('Scheduled report deleted successfully');
        } catch (error) {
          console.error('Error deleting scheduled report:', error);
          message.error('Failed to delete scheduled report');
        }
      },
    });
  };
  
  // Columns for scheduled reports table
  const scheduledReportsColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Frequency',
      dataIndex: ['schedule', 'frequency'],
      key: 'frequency',
      render: (frequency, record) => {
        if (frequency === 'daily') {
          return 'Daily';
        } else if (frequency === 'weekly') {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          return `Weekly on ${days[record.schedule.dayOfWeek]}`;
        } else if (frequency === 'monthly') {
          return `Monthly on day ${record.schedule.dayOfMonth}`;
        }
        return frequency;
      },
    },
    {
      title: 'Time',
      dataIndex: ['schedule', 'time'],
      key: 'time',
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: (format) => format.toUpperCase(),
    },
    {
      title: 'Recipients',
      dataIndex: 'recipients',
      key: 'recipients',
      render: (recipients) => recipients.join(', '),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteScheduledReport(record.id)}
        />
      ),
    },
  ];
  
  return (
    <Content style={{ padding: '0 16px', marginTop: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={3}>Reports</Title>
        <p>Generate and schedule reports for your call center data</p>
      </div>
      
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Generate Report" key="generate">
            <Form
              form={generateForm}
              layout="vertical"
              onFinish={handleGenerateReport}
              initialValues={{
                timeInterval,
                format: 'pdf',
              }}
            >
              <Form.Item
                name="name"
                label="Report Name"
                rules={[{ required: true, message: 'Please enter a report name' }]}
              >
                <Input placeholder="Enter report name" />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="Description"
              >
                <TextArea
                  placeholder="Enter report description"
                  rows={3}
                />
              </Form.Item>
              
              <Divider />
              
              <Form.Item
                name="timeInterval"
                label="Time Interval"
                rules={[{ required: true, message: 'Please select a time interval' }]}
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
                name="dateRange"
                label="Date Range"
                rules={[{ required: true, message: 'Please select a date range' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="columns"
                label="Columns/Metrics"
                rules={[{ required: true, message: 'Please select at least one column' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select columns"
                  style={{ width: '100%' }}
                >
                  {availableMetadata.metrics.map(metric => (
                    <Option key={metric.value} value={metric.value}>
                      {metric.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="queues"
                label="Filter by Queues"
              >
                <Select
                  mode="multiple"
                  placeholder="Select queues"
                  style={{ width: '100%' }}
                  allowClear
                >
                  {availableMetadata.queues.map(queue => (
                    <Option key={queue.value} value={queue.value}>
                      {queue.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="channels"
                label="Filter by Channels"
              >
                <Select
                  mode="multiple"
                  placeholder="Select channels"
                  style={{ width: '100%' }}
                  allowClear
                >
                  {availableMetadata.channels.map(channel => (
                    <Option key={channel.value} value={channel.value}>
                      {channel.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="groupBy"
                label="Group By"
              >
                <Select placeholder="Select grouping" allowClear>
                  <Option value="queue">Queue</Option>
                  <Option value="channel">Channel</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="format"
                label="Report Format"
                rules={[{ required: true, message: 'Please select a format' }]}
              >
                <Select>
                  <Option value="pdf">PDF</Option>
                  <Option value="excel">Excel</Option>
                  <Option value="csv">CSV</Option>
                </Select>
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<DownloadOutlined />}
                  loading={loading}
                >
                  Generate & Download Report
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="Schedule Reports" key="scheduled">
            <Form
              form={scheduleForm}
              layout="vertical"
              onFinish={handleScheduleReport}
              initialValues={{
                timeInterval,
                format: 'pdf',
                frequency: 'daily',
              }}
            >
              <Form.Item
                name="name"
                label="Report Name"
                rules={[{ required: true, message: 'Please enter a report name' }]}
              >
                <Input placeholder="Enter report name" />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="Description"
              >
                <TextArea
                  placeholder="Enter report description"
                  rows={3}
                />
              </Form.Item>
              
              <Divider />
              
              <Form.Item
                name="timeInterval"
                label="Time Interval"
                rules={[{ required: true, message: 'Please select a time interval' }]}
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
                name="columns"
                label="Columns/Metrics"
                rules={[{ required: true, message: 'Please select at least one column' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select columns"
                  style={{ width: '100%' }}
                >
                  {availableMetadata.metrics.map(metric => (
                    <Option key={metric.value} value={metric.value}>
                      {metric.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="queues"
                label="Filter by Queues"
              >
                <Select
                  mode="multiple"
                  placeholder="Select queues"
                  style={{ width: '100%' }}
                  allowClear
                >
                  {availableMetadata.queues.map(queue => (
                    <Option key={queue.value} value={queue.value}>
                      {queue.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="channels"
                label="Filter by Channels"
              >
                <Select
                  mode="multiple"
                  placeholder="Select channels"
                  style={{ width: '100%' }}
                  allowClear
                >
                  {availableMetadata.channels.map(channel => (
                    <Option key={channel.value} value={channel.value}>
                      {channel.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="groupBy"
                label="Group By"
              >
                <Select placeholder="Select grouping" allowClear>
                  <Option value="queue">Queue</Option>
                  <Option value="channel">Channel</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="format"
                label="Report Format"
                rules={[{ required: true, message: 'Please select a format' }]}
              >
                <Select>
                  <Option value="pdf">PDF</Option>
                  <Option value="excel">Excel</Option>
                  <Option value="csv">CSV</Option>
                </Select>
              </Form.Item>
              
              <Divider />
              
              <Form.Item
                name="frequency"
                label="Schedule Frequency"
                rules={[{ required: true, message: 'Please select a frequency' }]}
              >
                <Select>
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.frequency !== currentValues.frequency}
              >
                {({ getFieldValue }) => {
                  const frequency = getFieldValue('frequency');
                  
                  if (frequency === 'weekly') {
                    return (
                      <Form.Item
                        name="dayOfWeek"
                        label="Day of Week"
                        rules={[{ required: true, message: 'Please select a day of week' }]}
                      >
                        <Select>
                          <Option value={0}>Sunday</Option>
                          <Option value={1}>Monday</Option>
                          <Option value={2}>Tuesday</Option>
                          <Option value={3}>Wednesday</Option>
                          <Option value={4}>Thursday</Option>
                          <Option value={5}>Friday</Option>
                          <Option value={6}>Saturday</Option>
                        </Select>
                      </Form.Item>
                    );
                  }
                  
                  if (frequency === 'monthly') {
                    return (
                      <Form.Item
                        name="dayOfMonth"
                        label="Day of Month"
                        rules={[{ required: true, message: 'Please select a day of month' }]}
                      >
                        <Select>
                          {Array.from({ length: 31 }, (_, i) => (
                            <Option key={i + 1} value={i + 1}>
                              {i + 1}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    );
                  }
                  
                  return null;
                }}
              </Form.Item>
              
              <Form.Item
                name="time"
                label="Time"
                rules={[{ required: true, message: 'Please select a time' }]}
              >
                <DatePicker
                  picker="time"
                  format="HH:mm"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              
              <Form.Item
                name="recipients"
                label="Recipients (Email Addresses)"
                rules={[{ required: true, message: 'Please enter at least one email address' }]}
              >
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Enter email addresses"
                  tokenSeparators={[',', ' ']}
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<PlusOutlined />}
                  loading={loading}
                >
                  Schedule Report
                </Button>
              </Form.Item>
            </Form>
            
            <Divider />
            
            <Title level={4}>Scheduled Reports</Title>
            <Table
              columns={scheduledReportsColumns}
              dataSource={scheduledReports}
              rowKey="id"
              loading={loading && activeTab === 'scheduled'}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </Content>
  );
};

export default ReportsPage;