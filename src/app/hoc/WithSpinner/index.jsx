import React from 'react';

import Spinner from 'app/components/Spinner';

const WithSpinner =
  WrappedComponet =>
  ({ spinnerProps: { isLoading, spinnerSize = 25 }, ...props }) => {
    if (isLoading) {
      return <Spinner size={spinnerSize} />;
    }

    return <WrappedComponet {...props} />;
  };

export default WithSpinner;
