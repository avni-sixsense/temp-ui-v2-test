import { CssBaseline, ThemeProvider } from '@material-ui/core';

import reviewTheme from 'app/configs/reviewTheme';

import AllModels from './AllModels';

const ModelLibraryContainer = () => {
  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />

      <AllModels />
    </ThemeProvider>
  );
};

export default ModelLibraryContainer;
