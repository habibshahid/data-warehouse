// src/components/sections/TableSection.jsx
import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { formatNumber, formatPercentage, formatDuration } from '../../utils/formatters';

const TableSection = ({ section, loading }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50'],
  });
  const [tableColumns, setTableColumns] = useState([]);
  
  // Generate columns for the table based on the section data and columns
  useEffect(() => {
    if (!section.data || section.data.length === 0) {
      setTableColumns([]);
      return;
    }
    
    // Sample data row to determine column types
    const sampleRow = section.data[0];
    
    // Get all available columns from the data
    const availableColumns = Object.keys(sampleRow);
    
    // Simple column display - just show what's available
    let columnsToDisplay = [];
    
    if (section.columns && section.columns.length > 0) {
      // Start with the period column if available
      if (availableColumns.includes('period')) {
        columnsToDisplay.push('period');
      }
      
      // Then add user-selected columns, avoiding duplicates
      section.columns.forEach(col => {
        if (!columnsToDisplay.includes(col) && availableColumns.includes(col)) {
          columnsToDisplay.push(col);
        }
      });
    } else {
      // No specific columns selected, include all available except the key and _isSingleDataPoint
      columnsToDisplay = availableColumns.filter(col => 
        col !== 'key' && col !== '_isSingleDataPoint'
      );
    }
    
    // Create the column definitions
    const columns = columnsToDisplay.map(key => {
      // Skip the 'key' column which is added for React list rendering
      if (key === 'key' || key === '_isSingleDataPoint') return null;
      
      // Determine column data type
      const value = sampleRow[key];
      const isNumber = typeof value === 'number';
      const isPercentage = key.toLowerCase().includes('percentage') || key.toLowerCase().includes('percent');
      const isTime = key.toLowerCase().includes('time') && key !== 'timeInterval' && key !== 'period';
      const isDuration = key.toLowerCase().includes('duration');
      
      return {
        title: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        dataIndex: key,
        key,
        sorter: (a, b) => {
          if (isNumber) {
            return a[key] - b[key];
          }
          if (typeof a[key] === 'string' && typeof b[key] === 'string') {
            return a[key].localeCompare(b[key]);
          }
          return 0;
        },
        render: (text) => {
          // Special handling for period and timeInterval - return without any formatting
          if (key === 'period' || key === 'timeInterval' || key === 'pKey') {
            return text;
          }
          
          // Format other values based on their type
          if (isPercentage) {
            return formatPercentage(text);
          }
          if (isDuration) {
            return formatDuration(text);
          }
          if (isTime && isNumber) {
            return formatDuration(text, 'hh:mm:ss');
          }
          if (isNumber) {
            return formatNumber(text);
          }
          return text;
        },
        // Add search functionality
        ...getColumnSearchProps(key),
      };
    }).filter(Boolean); // Remove null values
    
    setTableColumns(columns);
  }, [section.data, section.columns]);
  
  // Add search functionality to columns
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      const cell = record[dataIndex];
      if (cell === null || cell === undefined) {
        return false;
      }
      return cell.toString().toLowerCase().includes(value.toLowerCase());
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  
  // Handle search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  // Handle reset
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  
  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };
  
  // If no data, show empty state
  if (!section.data || section.data.length === 0) {
    return <Empty description="No data available" />;
  }

  // Make sure we're passing the data directly without any transformation
  const tableData = section.data.map((item, index) => ({
    ...item,
    key: index
  }));

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Table
        columns={tableColumns}
        dataSource={tableData}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: 350 }} // Enable both horizontal and vertical scrolling
        size="small"
        bordered
        style={{ minHeight: 200, maxHeight: '100%' }}
      />
    </div>
  );
};

export default TableSection;