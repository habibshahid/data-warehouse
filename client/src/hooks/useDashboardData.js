import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Custom hook to fetch and manage dashboard data
 */
const useDashboardData = () => {
  // State for filter parameters
  const [reportType, setReportType] = useState('contact_center');
  const [timeInterval, setTimeInterval] = useState('daily');
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [channel, setChannel] = useState('all');
  const [queue, setQueue] = useState('all');
  const [agent, setAgent] = useState('all');
  const [metrics, setMetrics] = useState(['inbound', 'outbound', 'answeredInbound']);
  const [chartType, setChartType] = useState('line');
  const [groupBy, setGroupBy] = useState('day');
  
  // State for data and loading status
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for metadata (available options)
  const [metadata, setMetadata] = useState({
    channels: [],
    queues: [],
    agents: [],
    metrics: []
  });
  
  // Fetch metadata (available channels, queues, etc.)
  const fetchMetadata = async () => {
    try {
      const response = await axios.get(`${API_URL}/metadata`, {
        params: { reportType }
      });
      
      if (response.data.status === 'success') {
        setMetadata(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
      setError('Failed to fetch metadata. Please try again later.');
    }
  };
  
  // Fetch dashboard data based on filters
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/dashboard`, {
        params: {
          reportType,
          timeInterval,
          startDate,
          endDate,
          channel,
          queue,
          agent,
          metrics: metrics.join(','),
          groupBy
        }
      });
      
      if (response.data.status === 'success') {
        setDashboardData(response.data.data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data. Please try again later.');
      setLoading(false);
    }
  };
  
  // Fetch metadata when report type changes
  useEffect(() => {
    fetchMetadata();
  }, [reportType]);
  
  // Return the state and functions
  return {
    // Filter state
    reportType,
    setReportType,
    timeInterval,
    setTimeInterval,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    channel,
    setChannel,
    queue,
    setQueue,
    agent,
    setAgent,
    metrics,
    setMetrics,
    chartType,
    setChartType,
    groupBy,
    setGroupBy,
    
    // Data state
    dashboardData,
    loading,
    error,
    
    // Metadata
    channelOptions: ['all', ...metadata.channels],
    queueOptions: ['all', ...metadata.queues],
    agentOptions: ['all', ...metadata.agents],
    metricOptions: metadata.metrics,
    
    // Functions
    fetchDashboardData,
    fetchMetadata
  };
};

export default useDashboardData;