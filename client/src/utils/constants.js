export const timeIntervalOptions = [
    { value: '15_min', label: '15 Minutes' },
    { value: 'half_hourly', label: '30 Minutes' },
    { value: 'hourly', label: '1 Hour' },
    { value: 'daily', label: 'Daily' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];
  
  // Report type options
  export const reportTypeOptions = [
    { value: 'contact_center', label: 'Contact Center Stats' },
    { value: 'agent', label: 'Agent Summary Stats' }
  ];
  
  // Chart type options
  export const chartTypeOptions = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'area', label: 'Area Chart' },
    { value: 'pie', label: 'Pie Chart' }
  ];
  
  // Group by options
  export const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' }
  ];
  
  // Default metrics for each report type
  export const defaultMetrics = {
    contact_center: ['inbound', 'outbound', 'answeredInbound', 'abandonedInbound'],
    agent: ['loginTime', 'breakTime', 'idleTime', 'talkTimeInbound']
  };