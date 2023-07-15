import { CssBaseline, ThemeProvider } from '@material-ui/core';
import reviewTheme from 'app/configs/reviewTheme';
import { ThresholdPerformanceGraphMain } from './ThresholdPerformanceGraphMain';
import { memo } from 'react';

const ThresholdPerformanceGraph = memo(() => {
  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />
      <ThresholdPerformanceGraphMain />
    </ThemeProvider>
  );
});

export { ThresholdPerformanceGraph };
