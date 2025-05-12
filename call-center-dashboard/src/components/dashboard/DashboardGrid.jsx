import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Empty, Button, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDashboard } from '../../hooks/useDashboard';
import SectionContainer from '../sections/SectionContainer';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Create a responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardGrid = ({ sections = [] }) => {
  const { updateSection, createSection } = useDashboard();
  
  // Track layout changes
  const [currentLayouts, setCurrentLayouts] = useState({});
  
  // Handle layout change
  const handleLayoutChange = (layout, layouts) => {
    setCurrentLayouts(layouts);
    
    // Update the layout of each section
    layout.forEach(item => {
      const section = sections.find(s => s.id === item.i);
      if (section && (
        section.layout.x !== item.x ||
        section.layout.y !== item.y ||
        section.layout.w !== item.w ||
        section.layout.h !== item.h
      )) {
        updateSection({
          ...section,
          layout: {
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
          },
        });
      }
    });
  };
  
  // Generate layouts for the grid
  const generateLayouts = () => {
    const layouts = {
      lg: [],
      md: [],
      sm: [],
      xs: [],
    };
    
    // Sort sections by y-position to ensure consistent layout
    const sortedSections = [...sections].sort((a, b) => 
      (a.layout?.y || 0) - (b.layout?.y || 0)
    );
    
    sortedSections.forEach((section, index) => {
      // Default position if none exists
      const x = section.layout?.x !== undefined ? section.layout.x : 0;
      const y = section.layout?.y !== undefined ? section.layout.y : index * 4; // Stack vertically
      const w = section.layout?.w || 12; // Default to full width
      const h = section.layout?.h || 4;  // Default height
      
      const layoutItem = {
        i: section.id,
        x,
        y,
        w,
        h,
        minW: 3,
        minH: 3,
      };
      
      layouts.lg.push(layoutItem);
      
      // Adjust for smaller screens
      layouts.md.push({
        ...layoutItem,
        w: Math.min(w, 10), // 10 columns on medium screens
        x: 0, // Start at the left edge on medium screens
      });
      
      layouts.sm.push({
        ...layoutItem,
        w: 6, // 6 columns on small screens
        x: 0, // Start at the left edge on small screens
      });
      
      layouts.xs.push({
        ...layoutItem,
        w: 4, // 4 columns on extra small screens
        x: 0, // Start at the left edge on extra small screens
      });
    });
    
    return layouts;
  };
  
  // Handle adding a new section
  const handleAddSection = () => {
    createSection({
      title: 'New Section',
      visualizationType: 'table',
    });
  };
  
  // Add custom drag handle class to make grid draggable only by card headers
  const dragHandleClass = ".ant-card-head";
  
  // If there are no sections, show an empty state
  if (sections.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No dashboard sections yet"
      >
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddSection}
        >
          Add Section
        </Button>
      </Empty>
    );
  }
  
  return (
    <>
      <Alert 
        message="Tip: You can drag sections by their headers to rearrange them and resize them using the handle at the bottom-right corner."
        type="info" 
        showIcon 
        style={{ marginBottom: 16 }}
        closable
      />
      
      <ResponsiveGridLayout
        className="layout"
        layouts={currentLayouts.lg ? currentLayouts : generateLayouts()}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
        rowHeight={100}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        onLayoutChange={handleLayoutChange}
        isDraggable
        isResizable
        draggableHandle={dragHandleClass}
        compactType="vertical"
        preventCollision={false}
      >
        {sections.map(section => (
          <div key={section.id}>
            <SectionContainer section={section} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </>
  );
};

export default DashboardGrid;