import PublicLayout from 'app/components/Layouts/PublicLayout';
import React from 'react';
import { Route } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        <PublicLayout {...props}>
          <Component />
        </PublicLayout>
      )}
    />
  );
};

export default PublicRoute;
