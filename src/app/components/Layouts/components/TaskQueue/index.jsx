import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import reviewTheme from 'app/configs/reviewTheme';
import React from 'react';

import TaskQueue from './taskQueue';

const TaskQueueContainer = () => {
  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />
      <TaskQueue />
    </ThemeProvider>
  );
};

export default TaskQueueContainer;
