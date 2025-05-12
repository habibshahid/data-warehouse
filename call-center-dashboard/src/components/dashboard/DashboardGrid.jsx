import React, { useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SectionContainer from '../sections/SectionContainer';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Create a responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardGrid = ({ 
  sections = [], 
  onAddSection, 
  onUpdateSection, 
  onDeleteSection,
  timeInterval,
  dateRange,
  refreshTrigger = 0 // New prop to trigger refreshes
}) => {
  // Log when refresh is triggered
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log("DashboardGrid received refreshTrigger:", refreshTrigger);
    }
  }, [refreshTrigger]);

  // Handle layout change
  const handleLayoutChange = (layout, layouts) => {
    // Update the layout of each section
    layout.forEach(item => {
      const section = sections.find(s => s.id === item.i);
      if (section && (
        section.layout.x !== item.x ||
        section.layout.y !== item.y ||
        section.layout.w !== item.w ||
        section.layout.h !== item.h
      )) {
        onUpdateSection({
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
    
    // Safety check: ensure sections is an array
    if (!Array.isArray(sections)) {
      console.error("Sections is not an array:", sections);
      return layouts;
    }
    
    // Sort sections by y-position to ensure consistent layout
    const sortedSections = [...sections].sort((a, b) => 
      ((a.layout?.y || 0) - (b.layout?.y || 0))
    );
    
    sortedSections.forEach((section, index) => {
      // Ensure there's a valid layout object
      if (!section.layout) {
        section.layout = { x: 0, y: index * 6, w: 12, h: 6 };
      }
      
      // Default position if none exists
      const x = section.layout.x !== undefined ? section.layout.x : 0;
      const y = section.layout.y !== undefined ? section.layout.y : index * 6; 
      const w = section.layout.w !== undefined ? section.layout.w : 12;
      const h = section.layout.h !== undefined ? section.layout.h : 6;
      
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
        w: Math.min(w, 10),
        x: 0,
      });
      
      layouts.sm.push({
        ...layoutItem,
        w: 6,
        x: 0,
      });
      
      layouts.xs.push({
        ...layoutItem,
        w: 4,
        x: 0,
      });
    });
    
    return layouts;
  };
  
  // If there are no sections, show an empty state
  if (!sections || sections.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No dashboard sections yet"
      >
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => onAddSection({
            id: `section-${Date.now()}`,
            title: 'New Section',
            visualizationType: 'table',
            columns: [],
            filters: {
              queues: [],
              channels: [],
            },
            groupBy: null,
            layout: {
              x: 0,
              y: 0,
              w: 12,
              h: 6
            },
          })}
        >
          Add Section
        </Button>
      </Empty>
    );
  }
  
  // Check and fix any layout issues before rendering
  const validSections = sections.map(section => {
    if (!section.layout) {
      return {
        ...section,
        layout: { x: 0, y: 0, w: 12, h: 6 }
      };
    }
    
    const validLayout = {
      x: section.layout.x ?? 0,
      y: section.layout.y ?? 0,
      w: section.layout.w ?? 12,
      h: section.layout.h ?? 6
    };
    
    return {
      ...section,
      layout: validLayout
    };
  });
  
  // Generate layouts
  const layouts = generateLayouts();
  
  // Ensure we have valid layouts before rendering
  if (!layouts.lg.length) {
    console.error("No valid layouts generated");
    return <div>Error loading dashboard layout</div>;
  }
  
  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
      rowHeight={100}
      margin={[16, 16]}
      containerPadding={[0, 0]}
      onLayoutChange={handleLayoutChange}
      isDraggable
      isResizable
      draggableHandle=".ant-card-head"
    >
      {validSections.map(section => (
        <div key={section.id}>
          <SectionContainer 
            section={section} 
            onUpdate={onUpdateSection} 
            onDelete={() => onDeleteSection(section.id)}
            timeInterval={timeInterval}
            dateRange={dateRange}
            refreshTrigger={refreshTrigger} // Pass the refresh trigger to force section refresh
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DashboardGrid;