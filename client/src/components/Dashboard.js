import React, { useEffect } from 'react';
import FilterPanel from './FilterPanel';
import Visualization from './Visualization';
import DataTable from './DataTable';
import useDashboardData from '../hooks/useDashboardData';

/**
 * Main Dashboard component that integrates all dashboard components
 */
const Dashboard = () => {
  const {
    // Filter state
    reportType, setReportType,
    timeInterval, setTimeInterval,
    startDate, setStartDate,
    endDate, setEndDate,
    channel, setChannel,
    queue, setQueue,
    agent, setAgent,
    metrics, setMetrics,
    chartType, setChartType,
    groupBy, setGroupBy,
    
    // Data state
    dashboardData,
    loading,
    error,
    
    // Metadata
    channelOptions,
    queueOptions,
    agentOptions,
    metricOptions,
    
    // Functions
    fetchDashboardData,
    fetchMetadata
  } = useDashboardData();
  
  // Load initial data on component mount
  useEffect(() => {
    fetchMetadata();
    fetchDashboardData();
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Center Dashboard</h1>
      
      {/* Filters */}
      <FilterPanel
        reportType={reportType}
        setReportType={setReportType}
        timeInterval={timeInterval}
        setTimeInterval={setTimeInterval}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        channel={channel}
        setChannel={setChannel}
        queue={queue}
        setQueue={setQueue}
        agent={agent}
        setAgent={setAgent}
        metrics={metrics}
        setMetrics={setMetrics}
        chartType={chartType}
        setChartType={setChartType}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        channelOptions={channelOptions}
        queueOptions={queueOptions}
        agentOptions={agentOptions}
        metricOptions={metricOptions}
        onApplyFilters={fetchDashboardData}
      />
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Dashboard Content */}
      {!loading && !error && dashboardData.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Visualization</h2>
            <Visualization 
              data={dashboardData} 
              chartType={chartType} 
              metrics={metrics} 
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Data Table</h2>
            <DataTable 
              data={dashboardData} 
              metrics={metrics} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;