import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import reviewTheme from 'app/configs/reviewTheme';
import React from 'react';

import NotificationsContainer from './notifications';

const Notifications = props => {
  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />
      <NotificationsContainer {...props} />
    </ThemeProvider>
  );
};

export default Notifications;
