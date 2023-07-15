import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackUI: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (!this.props.fallbackUI) {
      throw new Error('fallbackUI prop is required.');
    }

    if (this.state.hasError) {
      return this.props.fallbackUI;
    }

    return this.props.children;
  }
}
