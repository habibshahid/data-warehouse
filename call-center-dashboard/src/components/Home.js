import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Input,
  Modal,
  Form,
  Select,
  Empty,
  Spin,
  message,
  Typography,
  Space,
  Tag,
  Dropdown,
  Menu,
  Divider, List, Avatar, Skeleton, Tooltip
}                                     from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  EllipsisOutlined,
  SearchOutlined,
  StarOutlined,
  StarFilled,
  FilterOutlined,
  SortAscendingOutlined,
  AppstoreOutlined, DashboardOutlined
}                                     from '@ant-design/icons';
import { useHistory }                 from 'react-router-dom';
import {
  listDashboards,
  createDashboard,
  deleteDashboard,
  cloneDashboard,
  toggleFavorite, updateDashboard
}                                     from '../apis/dashboard';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { confirm } = Modal;

const DashboardListPage = () => {

  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('updatedAt'); // 'updatedAt', 'name', 'createdAt'
  const [favorites, setFavorites] = useState(new Set());
  const history = useHistory();

  // Load dashboards on component mount
  useEffect(() => {
    fetchDashboards();
  }, []);

  // Fetch dashboards from API
  const fetchDashboards = async () => {
    try {
      setLoading(true);
      const result = await listDashboards();

      // Sort dashboards
      let sortedDashboards = [...result.dashboards];

      switch (sortBy) {
        case 'name':
          sortedDashboards.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'createdAt':
          sortedDashboards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'updatedAt':
        default:
          sortedDashboards.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          break;
      }

      setDashboards(sortedDashboards);

    }
    catch (error) {
      console.error('Error fetching dashboards:', error);
      message.error('Failed to load dashboards');
    } finally {
      setLoading(false);
    }
  };

  // Show create dashboard modal
  const showCreateModal = () => {
    form.resetFields();
    setCreateModalVisible(true);
  };

  // Show edit dashboard modal
  const showEditModal = (dashboard) => {
    setCurrentDashboard(dashboard);
    form.setFieldsValue({
      name: dashboard.name,
      description: dashboard.description,
      category: dashboard.category,
    });
    setEditModalVisible(true);
  };

  // Handle form submission for new dashboard
  const handleCreateDashboard = async (values) => {
    try {
      setLoading(true);

      await createDashboard(values);

      message.success('Dashboard created successfully');
      setCreateModalVisible(false);
      fetchDashboards();
    }
    catch (error) {
      console.error('Error creating dashboard:', error);
      message.error('Failed to create dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for edit dashboard
  const handleEditDashboard = async (values) => {
    try {
      setLoading(true);

      await updateDashboard(currentDashboard._id, values);

      message.success('Dashboard updated successfully');
      setEditModalVisible(false);
      fetchDashboards();
    }
    catch (error) {
      console.error('Error updating dashboard:', error);
      message.error('Failed to update dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Handle dashboard deletion
  const handleDeleteDashboard = (dashboard) => {
    confirm({
      title: `Are you sure you want to delete "${ dashboard.name }"?`,
      content: 'This action cannot be undone. All sections in this dashboard will also be deleted.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteDashboard(dashboard._id);
          message.success('Dashboard deleted successfully');
          fetchDashboards();
        }
        catch (error) {
          console.error('Error deleting dashboard:', error);
          message.error('Failed to delete dashboard');
          setLoading(false);
        }
      },
    });
  };

  // Handle dashboard cloning
  const handleCloneDashboard = async (dashboard) => {
    try {
      setLoading(true);
      await cloneDashboard(dashboard._id);
      message.success(`"${ dashboard.name }" cloned successfully`);
      fetchDashboards();
    }
    catch (error) {
      console.error('Error cloning dashboard:', error);
      message.error('Failed to clone dashboard');
      setLoading(false);
    }
  };

  // Handle toggling dashboard favorite status
  const handleToggleFavorite = async (dashboard) => {
    try {
      await toggleFavorite(dashboard._id);
      // Update local state to reflect the change immediately
      setDashboards(dashboards.map(d =>
        d._id === dashboard._id ? { ...d, favorite: !d.favorite } : d
      ));
    }
    catch (error) {
      console.error('Error toggling favorite:', error);
      message.error('Failed to update favorite status');
    }
  };

  // Handle search input change
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Handle category filter change
  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  // Handle favorites filter toggle
  const handleFavoritesToggle = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  // Get unique categories from dashboards
  const getCategories = () => {
    const categories = new Set(dashboards.map(d => d.category).filter(Boolean));
    return Array.from(categories);
  };

  // Get sort menu
  const sortMenu = (
    <Menu onClick={ ({ key }) => handleSortChange(key) }>
      <Menu.Item key="updatedAt">Last Updated</Menu.Item>
      <Menu.Item key="name">Name</Menu.Item>
      <Menu.Item key="createdAt">Creation Date</Menu.Item>
    </Menu>
  );

  // Get category filter menu
  const categoryMenu = (
    <Menu onClick={ ({ key }) => handleCategoryFilter(key === 'all' ? '' : key) }>
      <Menu.Item key="all">All Categories</Menu.Item>
      <Menu.Divider/>
      { getCategories().map(category => (
        <Menu.Item key={ category }>{ category }</Menu.Item>
      )) }
    </Menu>
  );

  // Get category color
  const getCategoryColor = (category) => {
    const categoryColors = {
      operations: 'blue',
      performance: 'green',
      customer: 'gold',
      executive: 'purple',
      campaigns: 'orange',
      support: 'cyan',
      sales: 'magenta',
    };

    return categoryColors[category] || 'default';
  };

  // Dashboard card more menu
  const getMoreMenu = (dashboard) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={ <EditOutlined/> }
        onClick={ () => showEditModal(dashboard) }
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="clone"
        icon={ <CopyOutlined/> }
        onClick={ () => handleCloneDashboard(dashboard) }
      >
        Clone
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={ <DeleteOutlined/> }
        danger
        onClick={ () => handleDeleteDashboard(dashboard) }
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  // Custom scrollbar styles as an object for reuse
  const scrollbarStyles = {
    // The scrollbar container - needed to enable overflow
    container: {
      flex: 1,
      marginBottom: 12,
      position: 'relative',
      overflow: 'auto',
      // Hide default scrollbar for webkit (Chrome, Safari, newer Edge)
      '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#bfbfbf',
        borderRadius: '4px',
        transition: 'background 0.2s ease',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#8c8c8c',
      },
      // Hide default scrollbar for Firefox
      scrollbarWidth: 'thin',
      scrollbarColor: '#bfbfbf transparent',
      // Hide scrollbar until hover
      '&:hover::-webkit-scrollbar-thumb': {
        background: '#bfbfbf',
      },
    },
    // The content inside the scrollable container
    content: {
      padding: '0 2px 0 0', // Small right padding for scrollbar space
      color: 'rgba(0, 0, 0, 0.45)', // Secondary text color
    }
  };

  // Render dashboard grid view
  const renderGridView = () => (
    <Row gutter={ [16, 16] }>
      { dashboards.map(dashboard => (
        <Col xs={ 24 } sm={ 12 } md={ 8 } lg={ 6 } key={ dashboard._id }>
          <Card
            hoverable
            style={ { height: '270px', display: 'flex', flexDirection: 'column' } }
            actions={ [
              <Button
                type="link"
                icon={ <EditOutlined/> }
                onClick={ (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  showEditModal(dashboard);
                } }
              >
                Edit
              </Button>,
              <Button
                type="link"
                icon={ <CopyOutlined/> }
                onClick={ (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCloneDashboard(dashboard);
                } }
              >
                Clone
              </Button>,
              <Button
                type="link"
                danger
                icon={ <DeleteOutlined/> }
                onClick={ (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteDashboard(dashboard);
                } }
              >
                Delete
              </Button>
            ] }
            bodyStyle={ {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              overflow: 'hidden'
            } }
            onClick={ () => history.push(`/bitools/${ dashboard._id }`) }
            title={
              <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>

                <Tooltip title={ dashboard.name }>
                  <Text
                    ellipsis
                    strong
                    style={ {
                      maxWidth: 'calc(100% - 30px)',
                      fontSize: '16px',
                      fontWeight: 600
                    } }
                  >
                    { dashboard.name }
                  </Text>
                </Tooltip>

                <Button
                  type="text"
                  size="small"
                  icon={ dashboard.favorite ?
                    <StarFilled style={ { color: '#faad14' } }/> :
                    <StarOutlined/>
                  }
                  onClick={ (e) => {
                    e.stopPropagation();
                    handleToggleFavorite(dashboard);
                  } }
                  style={ { marginLeft: 4 } }
                />
              </div>
            }
          >
            <div style={ {
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            } }>
              { dashboard.category && (
                <Tag color="blue" style={ { alignSelf: 'flex-start', marginBottom: 8 } }>
                  { dashboard.category }
                </Tag>
              ) }

              {/* Description with fancy scrollbar */ }
              <div
                className="fancy-scrollbar"
                style={ {
                  ...scrollbarStyles.container,
                  // Set a fixed height to ensure consistency
                  maxHeight: dashboard.category ? '70px' : '200px', // Adjust height based on whether category exists
                } }
              >
                <div style={ scrollbarStyles.content }>
                  { dashboard.description || 'No description' }
                </div>
              </div>

              {/* Date footer section always at bottom */ }
              <div style={ {
                fontSize: 12,
                color: '#8c8c8c',
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid #f0f0f0',
                paddingTop: 12,
                marginTop: 'auto'
              } }>
                <span>
                  Created: { new Date(dashboard.createdAt).toLocaleDateString() }
                </span>
                <span>
                  Updated: { new Date(dashboard.updatedAt).toLocaleDateString() }
                </span>
              </div>
            </div>
          </Card>
        </Col>
      )) }
    </Row>
  );

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${ diffDays } day${ diffDays === 1 ? '' : 's' } ago`;
    }
    if (diffHours > 0) {
      return `${ diffHours } hour${ diffHours === 1 ? '' : 's' } ago`;
    }
    if (diffMinutes > 0) {
      return `${ diffMinutes } minute${ diffMinutes === 1 ? '' : 's' } ago`;
    }
    return 'Just now';
  };

  // Render dashboard list view
  const renderListView = () => (
    <List
      className="dashboard-list"
      itemLayout="horizontal"
      dataSource={ dashboards }
      renderItem={ (dashboard) => (
        <List.Item
          key={ dashboard.id }
          actions={ [
            <Button
              type="text"
              icon={ favorites.has(dashboard.id) ? <StarFilled style={ { color: '#faad14' } }/> : <StarOutlined/> }
              onClick={ (e) => toggleFavorite(dashboard, e) }
            />,
            <Dropdown overlay={ getDashboardMenu(dashboard) } trigger={ ['click'] }>
              <Button type="text" icon={ <EllipsisOutlined/> } onClick={ (e) => e.stopPropagation() }/>
            </Dropdown>,
          ] }
          style={ {
            cursor: 'pointer',
            background: '#fff',
            border: "2px solid rgb(245, 245, 245)",
            marginBottom: '12px',
            padding: '16px',
          } }
          onClick={ () => handleDashboardClick(dashboard) }
        >
          <List.Item.Meta
            avatar={
              <Avatar
                style={ {
                  backgroundColor: dashboard.color,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                } }
                icon={ <DashboardOutlined/> }
              />
            }
            title={
              <Space>
                <Text
                  ellipsis
                  strong
                >
                  { dashboard.name }
                </Text>
                <Tag color={ getCategoryColor(dashboard.category) }>{ dashboard.category }</Tag>
              </Space>
            }
            description={ dashboard.description }
          />
          <div>
            <Text type="secondary"
                  style={ { marginRight: 16 } }>{ dashboard.sections } { dashboard.sections === 1 ? 'section' : 'sections' }</Text>
            <Text type="secondary">Updated { formatRelativeTime(dashboard.updatedAt) }</Text>
          </div>
        </List.Item>
      ) }
    />
  );

  const renderEmptyState = () => (
    <Empty
      image={ Empty.PRESENTED_IMAGE_SIMPLE }
      description="No dashboards yet"
    >
      <Button type="primary" icon={ <PlusOutlined/> } onClick={ handleCreateDashboard }>
        Create Dashboard
      </Button>
    </Empty>
  );

  // Dashboard actions menu
  const getDashboardMenu = (dashboard) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={ <EditOutlined/> }
        onClick={ (e) => {
          e.domEvent.stopPropagation();
          message.info('Edit functionality would open here');
        } }
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="duplicate"
        icon={ <CopyOutlined/> }
        onClick={ (e) => {
          e.domEvent.stopPropagation();
          handleDuplicateDashboard(dashboard);
        } }
      >
        Duplicate
      </Menu.Item>
      <Menu.Divider/>
      <Menu.Item
        key="delete"
        icon={ <DeleteOutlined/> }
        danger
        onClick={ (e) => {
          e.domEvent.stopPropagation();
          handleDeleteDashboard(dashboard);
        } }
      >
        Delete
      </Menu.Item>
    </Menu>
  );


  return (
    <Content style={ { padding: '24px 16px' } }>
      <div style={ { marginBottom: 24 } }>
        <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 } }>
          <div>
            <Title level={ 2 } style={ { margin: 0 } }>Dashboards</Title>
          </div>

          <div>
            <Select
              value={ viewMode }
              onChange={ setViewMode }
              style={ { width: 120, marginRight: "10px" } }
            >
              <Option value="grid">Grid View</Option>
              <Option value="list">List View</Option>
            </Select>

            <Button
              type="primary"
              icon={ <PlusOutlined/> }
              onClick={ showCreateModal }
            >
              Create Dashboard
            </Button>
          </div>

        </div>

        <div style={ { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' } }>
          <Search
            placeholder="Search dashboards"
            allowClear
            onSearch={ handleSearch }
            style={ { width: 300 } }
          />

          <Space>
            <Dropdown overlay={ categoryMenu } trigger={ ['click'] }>
              <Button icon={ <FilterOutlined/> }>
                { categoryFilter ? `Category: ${ categoryFilter }` : 'All Categories' }
              </Button>
            </Dropdown>

            <Button
              type={ showFavoritesOnly ? 'primary' : 'default' }
              icon={ <StarOutlined/> }
              onClick={ handleFavoritesToggle }
            >
              Favorites
            </Button>

            <Dropdown overlay={ sortMenu } trigger={ ['click'] }>
              <Button icon={ <SortAscendingOutlined/> }>
                Sort: { sortBy === 'updatedAt' ? 'Last Updated' : sortBy === 'name' ? 'Name' : 'Creation Date' }
              </Button>
            </Dropdown>
          </Space>
        </div>
      </div>

      {
        loading ? (
            viewMode === 'grid' ? (
              <Row gutter={ [16, 16] }>
                { [1, 2, 3, 4].map(i => (
                  <Col xs={ 24 } sm={ 12 } md={ 8 } lg={ 6 } key={ i }>
                    <Card style={ { height: 200 } }>
                      <Skeleton active paragraph={ { rows: 3 } }/>
                    </Card>
                  </Col>
                )) }
              </Row>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={ [1, 2, 3, 4] }
                renderItem={ item => (
                  <List.Item
                    actions={ [<Skeleton.Button active size="small"/>, <Skeleton.Button active size="small"/>] }
                  >
                    <Skeleton active avatar paragraph={ { rows: 1 } }/>
                  </List.Item>
                ) }
              />
            )
          ) :
          dashboards.length === 0 ? renderEmptyState() : viewMode === "grid" ? renderGridView() : renderListView() }

      {/* Create Dashboard Modal */ }
      <Modal
        title="Create Dashboard"
        visible={ createModalVisible }
        onCancel={ () => setCreateModalVisible(false) }
        footer={ null }
        destroyOnClose
      >
        <Form
          form={ form }
          layout="vertical"
          onFinish={ handleCreateDashboard }
        >
          <Form.Item
            name="name"
            label="Dashboard Name"
            rules={ [{ required: true, message: 'Please enter a name' }] }
          >
            <Input placeholder="Enter dashboard name"/>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              placeholder="Enter dashboard description"
              rows={ 3 }
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
          >
            <Select
              placeholder="Select a category"
              allowClear
              showSearch
            >
              { getCategories().map(category => (
                <Option key={ category } value={ category }>{ category }</Option>
              )) }
              <Option value="new">+ Add New Category</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={ loading }
            >
              Create Dashboard
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Dashboard Modal */ }
      <Modal
        title="Edit Dashboard"
        visible={ editModalVisible }
        onCancel={ () => setEditModalVisible(false) }
        footer={ null }
        destroyOnClose
      >
        <Form
          form={ form }
          layout="vertical"
          onFinish={ handleEditDashboard }
        >
          <Form.Item
            name="name"
            label="Dashboard Name"
            rules={ [{ required: true, message: 'Please enter a name' }] }
          >
            <Input placeholder="Enter dashboard name"/>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              placeholder="Enter dashboard description"
              rows={ 3 }
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
          >
            <Select
              placeholder="Select a category"
              allowClear
              showSearch
            >
              { getCategories().map(category => (
                <Option key={ category } value={ category }>{ category }</Option>
              )) }
              <Option value="new">+ Add New Category</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={ loading }
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default DashboardListPage;