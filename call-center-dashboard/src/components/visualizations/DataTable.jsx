import React, { useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { formatNumber, formatPercentage, formatDuration } from '../../utils/formatters';
import Highlighter from 'react-highlight-words';

const DataTable = ({ data, columns, loading, pagination = true }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });
  
  // Generate columns if not provided
  const getTableColumns = () => {
    if (columns) {
      return columns.map(col => ({
        ...col,
        ...getColumnSearchProps(col.dataIndex),
      }));
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Sample data row to determine column types
    const sampleRow = data[0];
    
    return Object.keys(sampleRow).map(key => {
      // Determine column data type
      const value = sampleRow[key];
      const isNumber = typeof value === 'number';
      const isPercentage = key.toLowerCase().includes('percentage') || key.toLowerCase().includes('percent');
      const isTime = key.toLowerCase().includes('time');
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
          // Format the value based on its type
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
    });
  };
  
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
    setPaginationConfig(pagination);
  };
  
  return (
    <Table
      columns={getTableColumns()}
      dataSource={data?.map((item, index) => ({ ...item, key: index })) || []}
      loading={loading}
      pagination={pagination ? paginationConfig : false}
      onChange={handleTableChange}
      scroll={{ x: 'max-content' }}
      size="small"
      bordered
    />
  );
};

export default DataTable;