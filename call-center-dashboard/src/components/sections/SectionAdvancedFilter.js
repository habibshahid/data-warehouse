// src/components/sections/SectionAdvancedFilter.jsx
import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Divider, 
  Card, 
  Row, 
  Col,
  Checkbox,
  DatePicker,
  Tabs,
  Typography,
  Tag,
  message
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
  CodeOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useMetadata } from '../../hooks/useMetadata';
import createQueryBuilder from '../../utils/queryBuilder';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

// Available operators for different data types
const OPERATORS = {
  string: [
    { label: 'equals', value: '=' },
    { label: 'not equals', value: '!=' },
    { label: 'contains', value: 'LIKE' },
    { label: 'not contains', value: 'NOT LIKE' },
    { label: 'starts with', value: 'LIKE%' },
    { label: 'ends with', value: '%LIKE' },
    { label: 'is null', value: 'IS NULL' },
    { label: 'is not null', value: 'IS NOT NULL' }
  ],
  number: [
    { label: 'equals', value: '=' },
    { label: 'not equals', value: '!=' },
    { label: 'greater than', value: '>' },
    { label: 'less than', value: '<' },
    { label: 'greater than or equals', value: '>=' },
    { label: 'less than or equals', value: '<=' },
    { label: 'between', value: 'BETWEEN' },
    { label: 'not between', value: 'NOT BETWEEN' },
    { label: 'is null', value: 'IS NULL' },
    { label: 'is not null', value: 'IS NOT NULL' }
  ],
  date: [
    { label: 'equals', value: '=' },
    { label: 'not equals', value: '!=' },
    { label: 'after', value: '>' },
    { label: 'before', value: '<' },
    { label: 'after or on', value: '>=' },
    { label: 'before or on', value: '<=' },
    { label: 'between', value: 'BETWEEN' },
    { label: 'not between', value: 'NOT BETWEEN' },
    { label: 'is null', value: 'IS NULL' },
    { label: 'is not null', value: 'IS NOT NULL' }
  ],
  boolean: [
    { label: 'is true', value: '=true' },
    { label: 'is false', value: '=false' },
    { label: 'is null', value: 'IS NULL' },
    { label: 'is not null', value: 'IS NOT NULL' }
  ]
};

// Determine the data type of a field based on name and sample data
const determineFieldType = (fieldName, sampleData) => {
  // If we have sample data and this field exists in it
  if (sampleData && sampleData[fieldName] !== undefined) {
    const value = sampleData[fieldName];
    
    if (value instanceof Date) return 'date';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    
    // Special handling for date strings
    if (typeof value === 'string') {
      // Check for date-like field names
      if (fieldName.toLowerCase().includes('date') || 
          fieldName.toLowerCase().includes('time') ||
          fieldName === 'period' ||
          fieldName === 'timeInterval') {
        return 'date';
      }
      
      // Check for number-like field names
      if (fieldName.toLowerCase().includes('count') ||
          fieldName.toLowerCase().includes('total') ||
          fieldName.toLowerCase().includes('amount') ||
          fieldName.toLowerCase().includes('avg') ||
          fieldName.toLowerCase().includes('min') ||
          fieldName.toLowerCase().includes('max')) {
        return 'number';
      }
      
      // Check for boolean-like field names
      if (fieldName.toLowerCase().includes('is') ||
          fieldName.toLowerCase().includes('has')) {
        return 'boolean';
      }
    }
    
    return 'string';
  }
  
  // If no sample data, make best guess based on field name
  if (fieldName.toLowerCase().includes('date') || 
      fieldName.toLowerCase().includes('time') ||
      fieldName === 'period' ||
      fieldName === 'timeInterval') {
    return 'date';
  }
  
  if (fieldName.toLowerCase().includes('count') ||
      fieldName.toLowerCase().includes('total') ||
      fieldName.toLowerCase().includes('amount') ||
      fieldName.toLowerCase().includes('avg') ||
      fieldName.toLowerCase().includes('min') ||
      fieldName.toLowerCase().includes('max')) {
    return 'number';
  }
  
  if (fieldName.toLowerCase().includes('is') ||
      fieldName.toLowerCase().includes('has')) {
    return 'boolean';
  }
  
  return 'string';
};

const SectionAdvancedFilter = ({ 
  section, 
  visible, 
  onClose, 
  onApply, 
  availableFields = [] 
}) => {
  const [form] = Form.useForm();
  const { availableMetadata } = useMetadata();
  const [conditions, setConditions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeTab, setActiveTab] = useState('visual');
  const [sqlQuery, setSqlQuery] = useState('');
  const [savedFilters, setSavedFilters] = useState([]);
  
  // Load any existing filters when opened
  useEffect(() => {
    if (visible && section) {
      // Initialize from section advanced filters if they exist
      if (section.advancedFilters) {
        setConditions(section.advancedFilters.conditions || []);
        setGroups(section.advancedFilters.groups || []);
        
        // Build SQL query from existing conditions
        updateSqlQuery(section.advancedFilters.conditions || [], section.advancedFilters.groups || []);
      } else {
        // Reset to empty state
        setConditions([]);
        setGroups([]);
        setSqlQuery('');
      }
      
      // Load saved filters from localStorage
      const saved = localStorage.getItem('savedAdvancedFilters');
      if (saved) {
        try {
          setSavedFilters(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading saved filters:', e);
          setSavedFilters([]);
        }
      }
    }
  }, [visible, section]);
  
  // Update SQL query whenever conditions or groups change
  useEffect(() => {
    updateSqlQuery(conditions, groups);
  }, [conditions, groups]);
  
  // Builder function to convert UI conditions to SQL query
  const updateSqlQuery = (currentConditions, currentGroups) => {
    if (!currentConditions || currentConditions.length === 0) {
      setSqlQuery('');
      return;
    }
    
    try {
      // Create a new query builder
      const queryBuilder = createQueryBuilder();
      
      // Add regular conditions
      currentConditions.forEach((condition, index) => {
        const { field, operator, value, logicalOperator = 'AND', isNot = false } = condition;
        
        if (!field || !operator) return;
        
        // Skip first logical operator
        const actualLogicalOperator = index === 0 ? undefined : logicalOperator;
        
        // Handle various operator types
        switch (operator) {
          case 'IS NULL':
            isNot 
              ? queryBuilder.whereNotNull(field, actualLogicalOperator)
              : queryBuilder.whereNull(field, actualLogicalOperator);
            break;
            
          case 'IS NOT NULL':
            isNot 
              ? queryBuilder.whereNull(field, actualLogicalOperator)
              : queryBuilder.whereNotNull(field, actualLogicalOperator);
            break;
            
          case 'BETWEEN':
            if (Array.isArray(value) && value.length === 2) {
              isNot
                ? queryBuilder.whereNotBetween(field, value[0], value[1], actualLogicalOperator)
                : queryBuilder.whereBetween(field, value[0], value[1], actualLogicalOperator);
            }
            break;
            
          case 'NOT BETWEEN':
            if (Array.isArray(value) && value.length === 2) {
              isNot
                ? queryBuilder.whereBetween(field, value[0], value[1], actualLogicalOperator)
                : queryBuilder.whereNotBetween(field, value[0], value[1], actualLogicalOperator);
            }
            break;
            
          case 'LIKE':
            const likeValue = isNot ? value : `%${value}%`;
            queryBuilder.where(field, 'LIKE', likeValue, actualLogicalOperator);
            break;
            
          case 'NOT LIKE':
            const notLikeValue = isNot ? `%${value}%` : value;
            queryBuilder.where(field, 'NOT LIKE', notLikeValue, actualLogicalOperator);
            break;
            
          case 'LIKE%':
            const startsWithValue = `${value}%`;
            isNot
              ? queryBuilder.where(field, 'NOT LIKE', startsWithValue, actualLogicalOperator)
              : queryBuilder.where(field, 'LIKE', startsWithValue, actualLogicalOperator);
            break;
            
          case '%LIKE':
            const endsWithValue = `%${value}`;
            isNot
              ? queryBuilder.where(field, 'NOT LIKE', endsWithValue, actualLogicalOperator)
              : queryBuilder.where(field, 'LIKE', endsWithValue, actualLogicalOperator);
            break;
            
          case '=true':
            isNot
              ? queryBuilder.where(field, '=', 0, actualLogicalOperator)
              : queryBuilder.where(field, '=', 1, actualLogicalOperator);
            break;
            
          case '=false':
            isNot
              ? queryBuilder.where(field, '=', 1, actualLogicalOperator)
              : queryBuilder.where(field, '=', 0, actualLogicalOperator);
            break;
            
          default:
            // Handle standard operators
            isNot
              ? queryBuilder.whereNot(field, operator, value, actualLogicalOperator)
              : queryBuilder.where(field, operator, value, actualLogicalOperator);
        }
      });
      
      // Add condition groups
      currentGroups.forEach((group) => {
        if (group.conditions.length === 0) return;
        
        const groupId = queryBuilder.startGroup(group.logicalOperator);
        
        group.conditions.forEach((condition, index) => {
          const { field, operator, value, logicalOperator = 'AND', isNot = false } = condition;
          
          if (!field || !operator) return;
          
          // Skip first logical operator within group
          const actualLogicalOperator = index === 0 ? undefined : logicalOperator;
          
          // Handle various operator types for group conditions - similar to above
          switch (operator) {
            case 'IS NULL':
              queryBuilder.whereGroup(
                groupId, field, operator, '', actualLogicalOperator, isNot
              );
              break;
              
            case 'IS NOT NULL':
              queryBuilder.whereGroup(
                groupId, field, operator, '', actualLogicalOperator, isNot
              );
              break;
              
            case 'BETWEEN':
              if (Array.isArray(value) && value.length === 2) {
                queryBuilder.whereGroup(
                  groupId, field, operator, `${value[0]} AND ${value[1]}`, actualLogicalOperator, isNot
                );
              }
              break;
              
            default:
              // Handle standard operators
              queryBuilder.whereGroup(
                groupId, field, operator, value, actualLogicalOperator, isNot
              );
          }
        });
      });
      
      // Get WHERE clause part only
      const fullQuery = queryBuilder.build();
      const whereClause = fullQuery.split('WHERE')[1]?.trim() || '';
      
      setSqlQuery(whereClause);
    } catch (e) {
      console.error('Error building SQL query:', e);
      setSqlQuery('Error building query');
    }
  };
  
  // Add a new condition
  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: Date.now(),
        field: '',
        operator: '=',
        value: '',
        logicalOperator: conditions.length > 0 ? 'AND' : undefined,
        isNot: false
      }
    ]);
  };
  
  // Remove a condition
  const removeCondition = (id) => {
    setConditions(conditions.filter(c => c.id !== id));
  };
  
  // Update a specific condition
  const updateCondition = (id, field, value) => {
    setConditions(conditions.map(c => {
      if (c.id === id) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };
  
  // Add a new condition group
  const addGroup = () => {
    setGroups([
      ...groups,
      {
        id: Date.now(),
        logicalOperator: groups.length > 0 || conditions.length > 0 ? 'AND' : undefined,
        conditions: []
      }
    ]);
  };
  
  // Remove a group
  const removeGroup = (id) => {
    setGroups(groups.filter(g => g.id !== id));
  };
  
  // Add a condition to a group
  const addGroupCondition = (groupId) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          conditions: [
            ...g.conditions,
            {
              id: Date.now(),
              field: '',
              operator: '=',
              value: '',
              logicalOperator: g.conditions.length > 0 ? 'AND' : undefined,
              isNot: false
            }
          ]
        };
      }
      return g;
    }));
  };
  
  // Remove a condition from a group
  const removeGroupCondition = (groupId, conditionId) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          conditions: g.conditions.filter(c => c.id !== conditionId)
        };
      }
      return g;
    }));
  };
  
  // Update a condition within a group
  const updateGroupCondition = (groupId, conditionId, field, value) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          conditions: g.conditions.map(c => {
            if (c.id === conditionId) {
              return { ...c, [field]: value };
            }
            return c;
          })
        };
      }
      return g;
    }));
  };
  
  // Update the group's logical operator
  const updateGroupLogicalOperator = (groupId, value) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return { ...g, logicalOperator: value };
      }
      return g;
    }));
  };
  
  // Save current filter as a named preset
  const saveFilter = () => {
    Modal.confirm({
      title: 'Save Filter',
      content: (
        <Form layout="vertical">
          <Form.Item
            label="Filter Name"
            name="filterName"
            rules={[{ required: true, message: 'Please enter a name for this filter' }]}
          >
            <Input placeholder="Enter a name for this filter" />
          </Form.Item>
        </Form>
      ),
      onOk: (e) => {
        const filterName = e.target.closest('.ant-modal-content').querySelector('input').value;
        if (!filterName) {
          message.error('Please enter a name for the filter');
          return;
        }
        
        const newFilter = {
          id: Date.now(),
          name: filterName,
          conditions: [...conditions],
          groups: [...groups],
          sqlQuery
        };
        
        const updatedFilters = [...savedFilters, newFilter];
        setSavedFilters(updatedFilters);
        
        // Save to localStorage
        localStorage.setItem('savedAdvancedFilters', JSON.stringify(updatedFilters));
        message.success('Filter saved successfully');
      }
    });
  };
  
  // Load a saved filter
  const loadFilter = (filter) => {
    setConditions(filter.conditions || []);
    setGroups(filter.groups || []);
    setSqlQuery(filter.sqlQuery || '');
    message.success(`Filter "${filter.name}" loaded`);
  };
  
  // Delete a saved filter
  const deleteFilter = (id) => {
    Modal.confirm({
      title: 'Delete Filter',
      content: 'Are you sure you want to delete this saved filter?',
      onOk: () => {
        const updatedFilters = savedFilters.filter(f => f.id !== id);
        setSavedFilters(updatedFilters);
        
        // Update localStorage
        localStorage.setItem('savedAdvancedFilters', JSON.stringify(updatedFilters));
        message.success('Filter deleted');
      }
    });
  };
  
  // Apply the advanced filter
  const handleApply = () => {
    // Build the filter object to return
    const advancedFilters = {
      conditions,
      groups,
      sqlQuery
    };
    
    // Send it back to the parent component
    onApply(advancedFilters);
    onClose();
  };
  
  // Render a single condition row
  const renderCondition = (condition, index, inGroup = false, groupId = null) => {
    const fieldType = availableFields.length > 0 && condition.field
      ? determineFieldType(condition.field, section.data?.[0])
      : 'string';
    
    const operatorOptions = OPERATORS[fieldType] || OPERATORS.string;
    
    return (
      <div key={condition.id} style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start' }}>
        {/* Logical operator (AND/OR) - not shown for first condition */}
        {index > 0 && (
          <Form.Item style={{ width: 80, marginRight: 8 }}>
            <Select
              value={condition.logicalOperator || 'AND'}
              onChange={(value) => {
                if (inGroup) {
                  updateGroupCondition(groupId, condition.id, 'logicalOperator', value);
                } else {
                  updateCondition(condition.id, 'logicalOperator', value);
                }
              }}
            >
              <Option value="AND">AND</Option>
              <Option value="OR">OR</Option>
            </Select>
          </Form.Item>
        )}
        
        {/* NOT checkbox */}
        <Form.Item style={{ marginRight: 8, marginTop: 8 }}>
          <Checkbox
            checked={condition.isNot}
            onChange={(e) => {
              if (inGroup) {
                updateGroupCondition(groupId, condition.id, 'isNot', e.target.checked);
              } else {
                updateCondition(condition.id, 'isNot', e.target.checked);
              }
            }}
          >
            NOT
          </Checkbox>
        </Form.Item>
        
        {/* Field selection */}
        <Form.Item style={{ width: 180, marginRight: 8 }}>
          <Select
            placeholder="Select field"
            value={condition.field}
            onChange={(value) => {
              // When field changes, reset operator and value
              if (inGroup) {
                updateGroupCondition(groupId, condition.id, 'field', value);
                updateGroupCondition(groupId, condition.id, 'operator', '=');
                updateGroupCondition(groupId, condition.id, 'value', '');
              } else {
                updateCondition(condition.id, 'field', value);
                updateCondition(condition.id, 'operator', '=');
                updateCondition(condition.id, 'value', '');
              }
            }}
          >
            {availableFields.map(field => (
              <Option key={field} value={field}>
                {field}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        {/* Operator selection */}
        <Form.Item style={{ width: 180, marginRight: 8 }}>
          <Select
            placeholder="Operator"
            value={condition.operator}
            onChange={(value) => {
              // When operator changes, reset value for certain operators
              const newValue = ['IS NULL', 'IS NOT NULL'].includes(value) ? '' : condition.value;
              
              if (inGroup) {
                updateGroupCondition(groupId, condition.id, 'operator', value);
                updateGroupCondition(groupId, condition.id, 'value', newValue);
              } else {
                updateCondition(condition.id, 'operator', value);
                updateCondition(condition.id, 'value', newValue);
              }
            }}
          >
            {operatorOptions.map(op => (
              <Option key={op.value} value={op.value}>
                {op.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        {/* Value input - only shown for operators that need a value */}
        {condition.operator !== 'IS NULL' && condition.operator !== 'IS NOT NULL' && (
          <Form.Item style={{ flex: 1, marginRight: 8 }}>
            {fieldType === 'date' ? (
              condition.operator === 'BETWEEN' || condition.operator === 'NOT BETWEEN' ? (
                <RangePicker 
                  style={{ width: '100%' }}
                  value={condition.value}
                  onChange={(dates) => {
                    if (inGroup) {
                      updateGroupCondition(groupId, condition.id, 'value', dates);
                    } else {
                      updateCondition(condition.id, 'value', dates);
                    }
                  }}
                />
              ) : (
                <DatePicker 
                  style={{ width: '100%' }}
                  value={condition.value}
                  onChange={(date) => {
                    if (inGroup) {
                      updateGroupCondition(groupId, condition.id, 'value', date);
                    } else {
                      updateCondition(condition.id, 'value', date);
                    }
                  }}
                />
              )
            ) : fieldType === 'number' ? (
              condition.operator === 'BETWEEN' || condition.operator === 'NOT BETWEEN' ? (
                <Input.Group compact>
                  <Input
                    style={{ width: '45%' }} 
                    type="number"
                    placeholder="Min"
                    value={Array.isArray(condition.value) ? condition.value[0] : ''}
                    onChange={(e) => {
                      const value = [e.target.value, Array.isArray(condition.value) ? condition.value[1] : ''];
                      if (inGroup) {
                        updateGroupCondition(groupId, condition.id, 'value', value);
                      } else {
                        updateCondition(condition.id, 'value', value);
                      }
                    }}
                  />
                  <Input
                    style={{ width: '10%', borderLeft: 0, borderRight: 0, pointerEvents: 'none', textAlign: 'center' }}
                    placeholder="~"
                    disabled
                    value="~"
                  />
                  <Input
                    style={{ width: '45%' }}
                    type="number"
                    placeholder="Max"
                    value={Array.isArray(condition.value) ? condition.value[1] : ''}
                    onChange={(e) => {
                      const value = [Array.isArray(condition.value) ? condition.value[0] : '', e.target.value];
                      if (inGroup) {
                        updateGroupCondition(groupId, condition.id, 'value', value);
                      } else {
                        updateCondition(condition.id, 'value', value);
                      }
                    }}
                  />
                </Input.Group>
              ) : (
                <Input
                  type="number"
                  placeholder="Value"
                  value={condition.value}
                  onChange={(e) => {
                    if (inGroup) {
                      updateGroupCondition(groupId, condition.id, 'value', e.target.value);
                    } else {
                      updateCondition(condition.id, 'value', e.target.value);
                    }
                  }}
                />
              )
            ) : fieldType === 'boolean' ? (
              <Select
                placeholder="Value"
                value={condition.value}
                onChange={(value) => {
                  if (inGroup) {
                    updateGroupCondition(groupId, condition.id, 'value', value);
                  } else {
                    updateCondition(condition.id, 'value', value);
                  }
                }}
              >
                <Option value={true}>True</Option>
                <Option value={false}>False</Option>
              </Select>
            ) : (
              <Input
                placeholder="Value"
                value={condition.value}
                onChange={(e) => {
                  if (inGroup) {
                    updateGroupCondition(groupId, condition.id, 'value', e.target.value);
                  } else {
                    updateCondition(condition.id, 'value', e.target.value);
                  }
                }}
              />
            )}
          </Form.Item>
        )}
        
        {/* Delete button */}
        <Button
          type="text"
          danger
          icon={<MinusCircleOutlined />}
          onClick={() => {
            if (inGroup) {
              removeGroupCondition(groupId, condition.id);
            } else {
              removeCondition(condition.id);
            }
          }}
        />
      </div>
    );
  };
  
  // Render a condition group
  const renderGroup = (group, index) => {
    return (
      <Card 
        key={group.id}
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {index > 0 || conditions.length > 0 ? (
              <Select
                value={group.logicalOperator || 'AND'}
                style={{ width: 80, marginRight: 8 }}
                onChange={(value) => updateGroupLogicalOperator(group.id, value)}
              >
                <Option value="AND">AND</Option>
                <Option value="OR">OR</Option>
              </Select>
            ) : null}
            <span>Condition Group</span>
          </div>
        }
        extra={
          <Button
            type="text"
            danger
            icon={<MinusCircleOutlined />}
            onClick={() => removeGroup(group.id)}
          />
        }
        style={{ marginBottom: 16 }}
      >
        {group.conditions.map((condition, idx) => renderCondition(condition, idx, true, group.id))}
        
        <Button
          type="dashed"
          onClick={() => addGroupCondition(group.id)}
          icon={<PlusOutlined />}
          style={{ width: '100%' }}
        >
          Add Condition
        </Button>
      </Card>
    );
  };
  
  // Render the saved filters section
  const renderSavedFilters = () => {
    if (savedFilters.length === 0) {
      return (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Text type="secondary">No saved filters</Text>
        </div>
      );
    }
    
    return (
      <div style={{ marginBottom: 24 }}>
        {savedFilters.map(filter => (
          <div key={filter.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Tag color="blue" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {filter.name}
            </Tag>
            <Space>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => loadFilter(filter)}
              >
                Load
              </Button>
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteFilter(filter.id)}
              >
                Delete
              </Button>
            </Space>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FilterOutlined style={{ marginRight: 8 }} />
          Advanced Filters
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          icon={<SaveOutlined />}
          onClick={saveFilter}
          disabled={conditions.length === 0 && groups.length === 0}
        >
          Save Filter
        </Button>,
        <Button
          key="apply"
          type="primary"
          onClick={handleApply}
          disabled={conditions.length === 0 && groups.length === 0}
        >
          Apply Filters
        </Button>
      ]}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
      >
        <TabPane 
          tab={<span><FilterOutlined /> Visual Builder</span>} 
          key="visual"
        >
          <div style={{ maxHeight: 400, overflowY: 'auto', padding: '0 8px' }}>
            {/* Saved filters section */}
            {savedFilters.length > 0 && (
              <>
                <Title level={5}>Saved Filters</Title>
                {renderSavedFilters()}
                <Divider />
              </>
            )}
            
            {/* Individual conditions */}
            <Title level={5}>Conditions</Title>
            {conditions.map((condition, index) => renderCondition(condition, index))}
            
            <Button
              type="dashed"
              onClick={addCondition}
              icon={<PlusOutlined />}
              style={{ width: '100%', marginBottom: 16 }}
            >
              Add Condition
            </Button>
            
            <Divider />
            
            {/* Condition groups */}
            <Title level={5}>Condition Groups</Title>
            {groups.map((group, index) => renderGroup(group, index))}
            
            <Button
              type="dashed"
              onClick={addGroup}
              icon={<PlusOutlined />}
              style={{ width: '100%' }}
            >
              Add Condition Group
            </Button>
          </div>
        </TabPane>
        
        <TabPane 
          tab={<span><CodeOutlined /> SQL View</span>} 
          key="sql"
        >
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            <Text type="secondary">Generated SQL WHERE clause:</Text>
            <Input.TextArea
              value={sqlQuery}
              rows={10}
              readOnly
              style={{ marginTop: 8, fontFamily: 'monospace' }}
            />
            
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                <InfoCircleOutlined style={{ marginRight: 8 }} />
                This is a preview of the SQL WHERE clause that will be generated. You cannot edit it directly.
              </Text>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default SectionAdvancedFilter;