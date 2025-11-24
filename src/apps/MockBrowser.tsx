'use client';

import { useState } from 'react';
import styles from './MockBrowser.module.css';

interface MockBrowserProps {
  initialUrl?: string;
  initialContent?: string;
  initialFilename?: string;
}

interface BrowserState {
  currentUrl: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
}

// AWS-themed content pages - function to generate content with click handlers
const getAWSPages = (onNavigate: (url: string) => void): Record<string, { title: string; content: React.ReactElement }> => ({
  'aws://home': {
    title: 'AWS Home - Internet Explorer',
    content: (
      <div className={styles.page}>
        <h1>Welcome to Amazon Web Services</h1>
        <p>The world&apos;s most comprehensive and broadly adopted cloud platform.</p>
        
        <div className={styles.section}>
          <h2>Popular Services</h2>
          <ul>
            <li><a href="aws://ec2" onClick={(e) => { e.preventDefault(); onNavigate('aws://ec2'); }}>Amazon EC2 - Virtual Servers in the Cloud</a></li>
            <li><a href="aws://s3" onClick={(e) => { e.preventDefault(); onNavigate('aws://s3'); }}>Amazon S3 - Scalable Storage in the Cloud</a></li>
            <li><a href="aws://lambda" onClick={(e) => { e.preventDefault(); onNavigate('aws://lambda'); }}>AWS Lambda - Run Code without Servers</a></li>
            <li><a href="aws://bedrock" onClick={(e) => { e.preventDefault(); onNavigate('aws://bedrock'); }}>Amazon Bedrock - Build with Foundation Models</a></li>
            <li><a href="aws://amplify" onClick={(e) => { e.preventDefault(); onNavigate('aws://amplify'); }}>AWS Amplify - Build and Deploy Web Apps</a></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Getting Started</h2>
          <p>New to AWS? Start with our free tier and explore over 100 services.</p>
          <button className={styles.button}>Create Free Account</button>
        </div>
      </div>
    ),
  },
  'aws://ec2': {
    title: 'Amazon EC2 - Internet Explorer',
    content: (
      <div className={styles.page}>
        <h1>Amazon Elastic Compute Cloud (EC2)</h1>
        <p>Secure and resizable compute capacity for virtually any workload.</p>
        
        <div className={styles.section}>
          <h2>What is Amazon EC2?</h2>
          <p>
            Amazon EC2 provides scalable computing capacity in the AWS Cloud. 
            Using Amazon EC2 eliminates your need to invest in hardware up front, 
            so you can develop and deploy applications faster.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Key Features</h2>
          <ul>
            <li>Virtual computing environments (instances)</li>
            <li>Preconfigured templates (AMIs)</li>
            <li>Various instance types optimized for different use cases</li>
            <li>Secure login with key pairs</li>
            <li>Storage volumes for temporary data (instance store volumes)</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Instance Types</h2>
          <p>Choose from General Purpose, Compute Optimized, Memory Optimized, and more.</p>
        </div>

        <p><a href="aws://home" onClick={(e) => { e.preventDefault(); onNavigate('aws://home'); }}>← Back to AWS Home</a></p>
      </div>
    ),
  },
  'aws://s3': {
    title: 'Amazon S3 - Internet Explorer',
    content: (
      <div className={styles.page}>
        <h1>Amazon Simple Storage Service (S3)</h1>
        <p>Object storage built to retrieve any amount of data from anywhere.</p>
        
        <div className={styles.section}>
          <h2>What is Amazon S3?</h2>
          <p>
            Amazon S3 is an object storage service offering industry-leading scalability, 
            data availability, security, and performance.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Use Cases</h2>
          <ul>
            <li>Backup and restore</li>
            <li>Disaster recovery</li>
            <li>Archive data</li>
            <li>Data lakes and big data analytics</li>
            <li>Static website hosting</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Storage Classes</h2>
          <p>S3 Standard, S3 Intelligent-Tiering, S3 Glacier, and more.</p>
        </div>

        <p><a href="aws://home" onClick={(e) => { e.preventDefault(); onNavigate('aws://home'); }}>← Back to AWS Home</a></p>
      </div>
    ),
  },
  'aws://lambda': {
    title: 'AWS Lambda - Internet Explorer',
    content: (
      <div className={styles.page}>
        <h1>AWS Lambda</h1>
        <p>Run code without thinking about servers or clusters.</p>
        
        <div className={styles.section}>
          <h2>What is AWS Lambda?</h2>
          <p>
            AWS Lambda is a serverless compute service that runs your code in response 
            to events and automatically manages the underlying compute resources.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Benefits</h2>
          <ul>
            <li>No servers to manage</li>
            <li>Continuous scaling</li>
            <li>Subsecond metering</li>
            <li>Consistent performance</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Supported Languages</h2>
          <p>Node.js, Python, Java, Go, Ruby, .NET Core, and custom runtimes.</p>
        </div>

        <p><a href="aws://home" onClick={(e) => { e.preventDefault(); onNavigate('aws://home'); }}>← Back to AWS Home</a></p>
      </div>
    ),
  },
  'aws://bedrock': {
    title: 'Amazon Bedrock - Internet Explorer',
    content: (
      <div className={styles.page}>
        <h1>Amazon Bedrock</h1>
        <p>Build and scale generative AI applications with foundation models.</p>
        
        <div className={styles.section}>
          <h2>What is Amazon Bedrock?</h2>
          <p>
            Amazon Bedrock is a fully managed service that offers a choice of 
            high-performing foundation models (FMs) from leading AI companies.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Available Models</h2>
          <ul>
            <li>Anthropic Claude</li>
            <li>AI21 Labs Jurassic</li>
            <li>Stability AI Stable Diffusion</li>
            <li>Amazon Titan</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Use Cases</h2>
          <p>Text generation, chatbots, search, summarization, image generation, and more.</p>
        </div>

        <p><a href="aws://home" onClick={(e) => { e.preventDefault(); onNavigate('aws://home'); }}>← Back to AWS Home</a></p>
      </div>
    ),
  },
  'aws://amplify': {
    title: 'AWS Amplify - Internet Explorer',
    content: (
      <div className={styles.page}>
        <h1>AWS Amplify</h1>
        <p>Build full-stack web and mobile apps in hours.</p>
        
        <div className={styles.section}>
          <h2>What is AWS Amplify?</h2>
          <p>
            AWS Amplify is a complete solution for building, deploying, and hosting 
            full-stack applications on AWS.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Features</h2>
          <ul>
            <li>Hosting with CI/CD</li>
            <li>Authentication</li>
            <li>Data storage</li>
            <li>APIs (REST and GraphQL)</li>
            <li>Analytics</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Supported Frameworks</h2>
          <p>React, Next.js, Vue, Angular, and more.</p>
        </div>

        <p><a href="aws://home" onClick={(e) => { e.preventDefault(); onNavigate('aws://home'); }}>← Back to AWS Home</a></p>
      </div>
    ),
  },
});

export default function MockBrowser({ initialUrl = 'aws://home', initialContent, initialFilename }: MockBrowserProps) {
  // If HTML content is provided, use file:// URL
  const startUrl = initialContent ? `file:///${initialFilename || 'document.html'}` : initialUrl;
  
  const [state, setState] = useState<BrowserState>({
    currentUrl: startUrl,
    history: [startUrl],
    historyIndex: 0,
    isLoading: false,
  });

  // Address bar input value (separate from current URL for editing)
  const [inputValue, setInputValue] = useState(state.currentUrl);

  const navigate = (url: string) => {
    // Simulate loading
    setState((prev) => ({ ...prev, isLoading: true }));

    setTimeout(() => {
      setState((prev) => {
        const newHistory = prev.history.slice(0, prev.historyIndex + 1);
        newHistory.push(url);
        
        return {
          currentUrl: url,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isLoading: false,
        };
      });
      // Update input value after navigation completes
      setInputValue(url);
    }, 300);
  };

  const goBack = () => {
    if (state.historyIndex > 0) {
      const newUrl = state.history[state.historyIndex - 1];
      setState((prev) => ({
        ...prev,
        currentUrl: newUrl,
        historyIndex: prev.historyIndex - 1,
      }));
      setInputValue(newUrl);
    }
  };

  const goForward = () => {
    if (state.historyIndex < state.history.length - 1) {
      const newUrl = state.history[state.historyIndex + 1];
      setState((prev) => ({
        ...prev,
        currentUrl: newUrl,
        historyIndex: prev.historyIndex + 1,
      }));
      setInputValue(newUrl);
    }
  };

  const refresh = () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, isLoading: false }));
    }, 300);
  };

  const handleAddressBarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue && inputValue !== state.currentUrl) {
      navigate(inputValue);
    }
  };

  // Get current page content with navigation handler
  const AWS_PAGES = getAWSPages(navigate);
  
  // If viewing a file:// URL and we have content, render it
  let currentPage;
  if (state.currentUrl.startsWith('file:///') && initialContent) {
    currentPage = {
      title: `${initialFilename || 'Document'} - Internet Explorer`,
      content: (
        <div className={styles.page}>
          <div dangerouslySetInnerHTML={{ __html: initialContent }} />
        </div>
      ),
    };
  } else {
    currentPage = AWS_PAGES[state.currentUrl] || {
      title: '404 Not Found - Internet Explorer',
      content: (
        <div className={styles.page}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <p><a href="aws://home" onClick={(e) => { e.preventDefault(); navigate('aws://home'); }}>Go to AWS Home</a></p>
        </div>
      ),
    };
  }

  const canGoBack = state.historyIndex > 0;
  const canGoForward = state.historyIndex < state.history.length - 1;

  return (
    <div className={styles.browser}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <button
          className={styles.navButton}
          onClick={goBack}
          disabled={!canGoBack}
          title="Back"
        >
          ←
        </button>
        <button
          className={styles.navButton}
          onClick={goForward}
          disabled={!canGoForward}
          title="Forward"
        >
          →
        </button>
        <button
          className={styles.navButton}
          onClick={refresh}
          title="Refresh"
        >
          ↻
        </button>
        
        <form onSubmit={handleAddressBarSubmit} className={styles.addressBarForm}>
          <label className={styles.addressLabel}>Address:</label>
          <input
            type="text"
            className={styles.addressBar}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
          <button type="submit" className={styles.goButton}>
            Go
          </button>
        </form>
      </div>

      {/* Status Bar */}
      {state.isLoading && (
        <div className={styles.statusBar}>
          Loading...
        </div>
      )}

      {/* Content Area */}
      <div className={styles.content}>
        {currentPage.content}
      </div>

      {/* Bottom Status Bar */}
      <div className={styles.bottomBar}>
        <span>Done</span>
      </div>
    </div>
  );
}
