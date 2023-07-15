import AppLayout from 'app/layouts/AppLayout';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const accessToken = useSelector(({ user }) => user.accessToken);

  return (
    <Route
      {...rest}
      render={props =>
        !!accessToken ? (
          <AppLayout>
            <Component {...props} />
          </AppLayout>
        ) : (
          <Navigate to='/login' replace />
        )
      }
    />
  );
};

export default PrivateRoute;
