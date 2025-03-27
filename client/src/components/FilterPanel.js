import React from 'react';
import { 
  timeIntervalOptions, 
  reportTypeOptions, 
  chartTypeOptions,
  groupByOptions
} from '../utils/constants';

const FilterPanel = ({ 
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
  channelOptions,
  queueOptions,
  agentOptions,
  metricOptions,
  onApplyFilters
}) => {
  // Toggle metric selection
  const toggleMetric = (metric) => {
    if (metrics.includes(metric)) {
      setMetrics(metrics.filter(m => m !== metric));
    } else {
      setMetrics([...metrics, metric]);
    }
  };
  
  // Handle report type change
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    
    // Reset metrics to default for the selected report type
    if (e.target.value === 'contact_center') {
      setMetrics(['inbound', 'outbound', 'answeredInbound']);
    } else {
      setMetrics(['loginTime', 'breakTime', 'talkTimeInbound']);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters();
  };
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={handleReportTypeChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {reportTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          {/* Time Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Interval</label>
            <select
              value={timeInterval}
              onChange={(e) => setTimeInterval(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {timeIntervalOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {/* Channel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {channelOptions.map(option => (
                <option key={option} value={option}>{option === 'all' ? 'All Channels' : option}</option>
              ))}
            </select>
          </div>
          
          {/* Queue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Queue</label>
            <select
              value={queue}
              onChange={(e) => setQueue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {queueOptions.map(option => (
                <option key={option} value={option}>{option === 'all' ? 'All Queues' : option}</option>
              ))}
            </select>
          </div>
          
          {/* Agent (only for agent reports) */}
          {reportType === 'agent' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
              <select
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {agentOptions.map(option => (
                  <option key={option} value={option}>{option === 'all' ? 'All Agents' : option}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Group By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {groupByOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          {/* Chart Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {chartTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Metrics Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Metrics</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {metricOptions.map(metric => (
              <div key={metric} className="flex items-center">
                <input
                  type="checkbox"
                  id={`metric-${metric}`}
                  checked={metrics.includes(metric)}
                  onChange={() => toggleMetric(metric)}
                  className="mr-2"
                />
                <label htmlFor={`metric-${metric}`} className="text-sm">{metric}</label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterPanel;