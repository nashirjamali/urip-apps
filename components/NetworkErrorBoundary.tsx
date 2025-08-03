"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  isNetworkError: boolean;
}

export class NetworkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      isNetworkError: false 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a network-related error
    const isNetworkError = 
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network request failed') ||
      error.message.includes('fetch') ||
      error.message.includes('connection') ||
      error.message.includes('timeout');

    return { 
      hasError: true, 
      error, 
      isNetworkError 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('NetworkErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, isNetworkError: false });
    // Force a page reload to retry the connection
    window.location.reload();
  };

  handleSwitchNetwork = () => {
    // This could open a modal to switch networks or redirect to network selection
    console.log('Switch network functionality would go here');
  };

  render() {
    if (this.state.hasError) {
      if (this.state.isNetworkError) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-bg-primary to-dark-bg-secondary flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                <WifiOff className="h-4 w-4" />
                <AlertDescription className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-red-400 mb-2">Network Connection Error</h3>
                    <p className="text-sm text-red-300/80">
                      Unable to connect to the Lisk Sepolia network. This could be due to:
                    </p>
                    <ul className="text-sm text-red-300/70 mt-2 space-y-1 list-disc list-inside">
                      <li>Network connectivity issues</li>
                      <li>RPC endpoint temporarily unavailable</li>
                      <li>Wallet not connected to the correct network</li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-col space-y-2 pt-2">
                    <Button 
                      onClick={this.handleRetry}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Connection
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={this.handleSwitchNetwork}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Wifi className="h-4 w-4 mr-2" />
                      Switch Network
                    </Button>
                  </div>
                  
                  <div className="text-xs text-red-300/60 pt-2 border-t border-red-500/20">
                    <p>Error details: {this.state.error?.message}</p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );
      }

      // For non-network errors, show a generic error
      return (
        <div className="min-h-screen bg-gradient-to-br from-dark-bg-primary to-dark-bg-secondary flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Something went wrong</h3>
                  <p className="text-sm opacity-80">
                    An unexpected error occurred. Please try refreshing the page.
                  </p>
                </div>
                
                <Button onClick={this.handleRetry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
                
                <div className="text-xs opacity-60 pt-2 border-t border-current/20">
                  <p>Error: {this.state.error?.message}</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 