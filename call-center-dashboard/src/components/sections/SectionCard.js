import React, { useState, useEffect }                         from 'react';
import { Card, Button, Tooltip, Spin, message, Space, Modal } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  FilterOutlined
}                                                             from '@ant-design/icons';
import { updateSection, deleteSection }                       from '../../apis/sections';
// import { fetchDashboardData }                                 from '../../apis/dashboard';
import EditSectionModal                                       from './EditSectionModal';
import VisualizationRenderer                                  from './VisualizationRenderer';
import { formatDateTime }                                     from '../../utils/dateUtils';

const { confirm } = Modal;

const SectionCard = ({
                       section,
                       dateRange = ["2025-04-10", "2025-04-20"],
                       timeInterval,
                       onSectionUpdated,
                       onSectionDeleted
                     }) => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] = useState(false);

  // Load section data when section, dateRange or timeInterval changes
  useEffect(() => {
    if (section) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    if (!section) return;

    try {
      setLoading(true);
      // Prepare parameters for the API call
      const params = {
        timeInterval,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
        columns: section.columns || [],
        filters: section.filters || {},
        groupBy: section.groupBy,
        visualizationType: section.visualizationType,
        sectionId: section._id,
        advancedFilters: section.advancedFilters
      };

      // const result = await fetchDashboardData(params);
      setData([]);
      setLastUpdated(new Date());
    }
    catch (error) {
      console.error('Error loading section data:', error);
      message.error(`Failed to load data for section "${ section.title }"`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleUpdateSection = async (updatedData) => {
    try {
      setLoading(true);
      const result = await updateSection(section._id, updatedData);

      if (result.success && result.updatedSection) {
        onSectionUpdated(result.updatedSection);
        message.success('Section updated successfully');
        setIsEditModalVisible(false);

        // Reload data with new settings
        // await loadData();
      }
    }
    catch (error) {
      console.error('Error updating section:', error);
      message.error('Failed to update section');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    confirm({
      title: `Are you sure you want to delete the section "${ section.title }"?`,
      icon: <ExclamationCircleOutlined/>,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteSection(section._id);
          message.success('Section deleted successfully');
          onSectionDeleted(section._id);
        }
        catch (error) {
          console.error('Error deleting section:', error);
          message.error('Failed to delete section');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleApplyAdvancedFilter = (advancedFilters) => {
    try {
      setLoading(true);

      // Update section with advanced filters
      const updatedSection = {
        ...section,
        advancedFilters
      };

      // Update section on the server
      updateSection(section._id, { advancedFilters })
        .then(() => {
          // Update locally
          onSectionUpdated(updatedSection);
          message.success('Advanced filters applied');
        })
        .catch(error => {
          console.error('Error updating advanced filters:', error);
          message.error('Failed to apply advanced filters');
        })
        .finally(() => {
          // Reload data with the new filters regardless of server update success
          loadData();
        });

    }
    catch (error) {
      console.error('Error applying advanced filters:', error);
      message.error('Failed to apply advanced filters');
      setLoading(false);
    }
  };

  // Custom title with buttons
  const titleContent = (
    <div className="section-card-header" style={ {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    } }>
      <div>
        { section?.title || 'Untitled Section' }
      </div>
    </div>
  );

  return (
    <Card
      className="section-card"
      title={ titleContent }
      extra={
        <Space>
          { lastUpdated && (
            <span style={ { fontSize: '12px', color: '#999' } }>
              Updated: { formatDateTime(lastUpdated) }
            </span>
          ) }
          <Tooltip title="Advanced Filters">
            <Button
              type="text"
              icon={ <FilterOutlined/> }
              onClick={ () => setIsAdvancedFilterVisible(true) }
              size="small"
            />
          </Tooltip>
          <Tooltip title="Refresh">
            <Button
              type="text"
              icon={ <ReloadOutlined/> }
              onClick={ loadData }
              loading={ loading }
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={ <EditOutlined/> }
              onClick={ handleEdit }
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={ <DeleteOutlined/> }
              onClick={ handleDelete }
              danger
              size="small"
            />
          </Tooltip>
        </Space>
      }
      bordered={ false }
      style={ {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      } }
      bodyStyle={ {
        flex: 1,
        overflow: 'auto',
        padding: section?.visualizationType === 'card' ? 0 : 16,
        height: '100%'
      } }
    >
      { loading ? (
        <div style={ {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        } }>
          <Spin/>
        </div>
      ) : (
        <VisualizationRenderer
          type={ section?.visualizationType || 'table' }
          data={ data }
          section={ section }
          chartOptions={ section?.chartOptions }
        />
      ) }

      { isEditModalVisible && (
        <EditSectionModal
          visible={ isEditModalVisible }
          section={ section }
          onCancel={ () => setIsEditModalVisible(false) }
          onUpdate={ handleUpdateSection }
        />
      ) }

      { isAdvancedFilterVisible && (
        <Modal
          title="Advanced Filters"
          visible={ isAdvancedFilterVisible }
          onCancel={ () => setIsAdvancedFilterVisible(false) }
          footer={ null }
          width={ 800 }
        >
          <div>
            <p>Advanced filtering options would go here.</p>
            <Button
              type="primary"
              onClick={ () => {
                // Apply some dummy filter for testing
                const dummyFilter = {
                  conditions: [
                    {
                      field: "inbound",
                      operator: ">",
                      value: 100
                    }
                  ]
                };
                handleApplyAdvancedFilter(dummyFilter);
                setIsAdvancedFilterVisible(false);
              } }
            >
              Apply Filters
            </Button>
          </div>
        </Modal>
      ) }
    </Card>
  );
};

export default SectionCard;