// src/components/common/ErrorBoundary.jsx
import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    // Reset the error state and try to re-render
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle="An error occurred while rendering this component"
          extra={[
            <Button type="primary" key="reload" onClick={() => window.location.reload()}>
              Reload Page
            </Button>,
            <Button key="reset" onClick={this.handleReset}>
              Try Again
            </Button>,
          ]}
        >
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div style={{ textAlign: 'left', marginTop: 20 }}>
              <h4>Error details:</h4>
              <p style={{ color: 'red' }}>{this.state.error.toString()}</p>
              <pre style={{ 
                padding: 10, 
                background: '#f5f5f5', 
                overflowX: 'auto',
                fontSize: 12,
                lineHeight: 1.5,
                border: '1px solid #ddd',
                borderRadius: 4
              }}>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
        </Result>
      );
    }

    // If there's no error, render the children
    return this.props.children;
  }
}

export default ErrorBoundary;