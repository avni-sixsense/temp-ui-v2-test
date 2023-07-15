import { memo } from 'react';

import { CssBaseline, ThemeProvider } from '@material-ui/core';

import reviewTheme from 'app/configs/reviewTheme';
import ModelPerformance from './ModelPerformance';

const ModelPerformanceContainer = () => {
  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />
      <ModelPerformance />
    </ThemeProvider>
  );
};

export default memo(ModelPerformanceContainer);
