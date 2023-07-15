import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import reviewTheme from 'app/configs/reviewTheme';
import React from 'react';

import AIResultsPage from './components/AIResults';

const AIResults = ({ handleDrawer, showProgress, setShowProgress }) => {
  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />
      <AIResultsPage
        handleDrawer={handleDrawer}
        showProgress={showProgress}
        setShowProgress={setShowProgress}
      />
    </ThemeProvider>
  );
};

export default AIResults;
