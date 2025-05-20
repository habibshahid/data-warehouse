import React                         from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import SectionCard                   from './SectionCard';

// Create responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);

const SectionGrid = ({
                       sections,
                       onLayoutChange,
                       onSectionUpdated,
                       onSectionDeleted
                     }) => {


  // Convert section layouts to the format required by react-grid-layout
  const getLayoutItems = () => {

    return sections.map(section => {

      console.log(section)

      console.log({
        i: section._id,
        x: section.layout.x || 0,
        y: section.layout.y || 0,
        w: section.layout.w || 12,
        h: section.layout.h || 6,

      }, "ooooooooooooooooooooooooooooooosssssssss")

      return {
        i: section._id,
        x: section.layout.x || 0,
        y: section.layout.y || 0,
        w: section.layout.w || 12,
        h: section.layout.h || 6,

      }
    });
  };

  // Create layouts for different breakpoints
  const getLayouts = () => {
    const layoutItems = getLayoutItems();

    return {
      lg: layoutItems,
      md: layoutItems.map(item => ({ ...item, w: Math.min(item.w, 10), x: 0 })),
      sm: layoutItems.map(item => ({ ...item, w: 6, x: 0 })),
      xs: layoutItems.map(item => ({ ...item, w: 4, x: 0 }))
    };
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={ getLayouts() }
      breakpoints={ { lg: 1200, md: 996, sm: 768, xs: 480 } }
      cols={ { lg: 12, md: 10, sm: 6, xs: 4 } }
      rowHeight={ 80 }
      margin={ [16, 16] }
      containerPadding={ [0, 0] }
      onLayoutChange={ (layout) => onLayoutChange(layout) }
      isDraggable
      isResizable
      draggableHandle=".section-card-header"
    >
      { sections.map(section => (
        <div key={ section._id }>
          <SectionCard
            section={ section }
            onSectionUpdated={ onSectionUpdated }
            onSectionDeleted={ onSectionDeleted }
          />
        </div>
      )) }
    </ResponsiveGridLayout>
  );
};

export default SectionGrid;