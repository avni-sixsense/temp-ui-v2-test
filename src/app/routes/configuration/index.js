import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import reviewTheme from 'app/configs/reviewTheme';

import ConfigurationsContainer from './configurations';

const Configurations = props => {
  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />

      <ConfigurationsContainer {...props} />
    </ThemeProvider>
  );
};

export default Configurations;
