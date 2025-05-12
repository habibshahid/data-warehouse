// src/components/common/Loading.jsx
import React from 'react';
import { Spin, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = ({ size = 'default', tip = 'Loading...', fullPage = false }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 40 : 24 }} spin />;

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}>
        <Space direction="vertical" align="center">
          <Spin indicator={antIcon} size={size} tip={tip} />
        </Space>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      minHeight: 200,
    }}>
      <Space direction="vertical" align="center">
        <Spin indicator={antIcon} size={size} tip={tip} />
      </Space>
    </div>
  );
};

export default Loading;