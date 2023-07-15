import { lazy } from 'react';

import { ErrorBoundary } from 'app/components/ErrorBoundary';

const ErrorBoundaryUI = lazy(() => import('app/components/ErrorBoundaryUI'));

const WithErrorBoundary =
  WrappedComponent =>
  ({ ...props }) => {
    return (
      <ErrorBoundary fallbackUI={<ErrorBoundaryUI />}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };

export default WithErrorBoundary;
