import React, { useState, useEffect }                                       from 'react';
import { Card, Button, Row, Col, Empty, message, Spin, Layout }             from 'antd';
import { PlusOutlined, ReloadOutlined }                                     from '@ant-design/icons';
import { useParams }                                                        from 'react-router-dom';
import { fetchSections, createSection, updateSectionLayout, updateLayouts } from '../../apis/sections';
import SectionGrid                                                          from './SectionGrid';
import AddSectionModal                                                      from './AddSectionModal';
import { useMetadata }                                                      from '../../hooks/useMetadata';

const { Content } = Layout;

const DashboardSectionsPanel = () => {

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { availableMetadata } = useMetadata();
  const { dashboardId } = useParams()

  // Load sections when dashboard ID changes
  useEffect(() => {
    if (dashboardId) {
      console.log(dashboardId, "...............")
      loadSections();
    }
  }, [dashboardId]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const result = await fetchSections(dashboardId);
      console.log(result, "axd")
      if (result.success && result.sections) {
        setSections(result.sections);
      }
    }
    catch (error) {
      console.error('Error loading sections:', error);
      message.error('Failed to load dashboard sections');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new section
  const handleAddSection = async (sectionData) => {
    try {
      setLoading(true);

      const result = await createSection({ ...sectionData, dashboardId });
      if (result.success && result.savedSection) {
        // Add the new section to the list
        setSections([...sections, result.savedSection]);
        message.success('Section added successfully');
        setIsAddModalVisible(false);
      }
    }
    catch (error) {
      console.error('Error adding section:', error);
      message.error('Failed to add section');
    } finally {
      setLoading(false);
    }
  };

  // Handle layout changes
  const handleLayoutChange = async (layouts, id) => {

    console.log(layouts, "^^^^^^^^^^^^^^^^^6", id)

    // Convert the layouts to the format expected by the API
    const formattedLayouts = layouts.map(layout => ({
      id: layout.i,
      layout: {
        x: layout.x,
        y: layout.y,
        w: layout.w,
        h: layout.h
      }
    }));

    try {
      await updateLayouts(formattedLayouts);
      // No need to reload the sections here as the layout changes are already reflected in state
    }
    catch (error) {
      console.error('Error updating layouts:', error);
      message.error('Failed to save layout changes');
    }
  };

  return (
    <Layout style={ { width: '100%', minHeight: '100vh', background: '#f0f2f5' } }>
      <Content style={ { padding: '24px', width: '100%', maxWidth: '100%' } }>
        <div className="dashboard-sections-panel" style={ { width: '100%' } }>
          <div style={ { marginBottom: 16, display: 'flex', justifyContent: 'flex-end' } }>
            <Button
              type="primary"
              icon={ <PlusOutlined/> }
              onClick={ () => setIsAddModalVisible(true) }
              style={ { marginRight: 8 } }
            >
              Add Section
            </Button>
            <Button
              icon={ <ReloadOutlined/> }
              onClick={ loadSections }
              loading={ loading }
            >
              Refresh
            </Button>
          </div>

          { loading && sections.length === 0 ? (
            <div style={ { textAlign: 'center', padding: 50 } }>
              <Spin size="large"/>
            </div>
          ) : sections.length === 0 ? (
            <Empty
              description="No sections in this dashboard yet"
              image={ Empty.PRESENTED_IMAGE_SIMPLE }
            >
              <Button
                type="primary"
                icon={ <PlusOutlined/> }
                onClick={ () => setIsAddModalVisible(true) }
              >
                Add Your First Section
              </Button>
            </Empty>
          ) : (
            <div style={ { width: '100%' } }>
              <SectionGrid
                sections={ sections }
                onLayoutChange={ handleLayoutChange }
                onSectionUpdated={ (updatedSection) => {
                  const newSections = sections.map(section =>
                    section._id === updatedSection._id ? updatedSection : section
                  );
                  setSections(newSections);
                } }
                onSectionDeleted={ (deletedId) => {
                  setSections(sections.filter(section => section._id !== deletedId));
                } }
              />
            </div>
          ) }

          <AddSectionModal
            visible={ isAddModalVisible }
            onCancel={ () => setIsAddModalVisible(false) }
            onAdd={ handleAddSection }
            availableMetadata={ availableMetadata }
          />
        </div>
      </Content>
    </Layout>
  );
};

export default DashboardSectionsPanel;