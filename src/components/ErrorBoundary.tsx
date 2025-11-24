'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorDialog}>
          <div className={styles.titleBar}>
            <span className={styles.title}>Error</span>
            <button
              className={styles.closeButton}
              onClick={this.handleReload}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className={styles.content}>
            <div className={styles.iconSection}>
              <span className={styles.errorIcon}>⚠️</span>
            </div>
            <div className={styles.messageSection}>
              <p className={styles.message}>
                An error has occurred in the application.
              </p>
              {this.state.error && (
                <details className={styles.details}>
                  <summary>Error details</summary>
                  <pre className={styles.errorText}>
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
          <div className={styles.buttonBar}>
            <button className={styles.button} onClick={this.handleReset}>
              Try Again
            </button>
            <button className={styles.button} onClick={this.handleReload}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
