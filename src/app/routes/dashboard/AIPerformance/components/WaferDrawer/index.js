import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import reviewTheme from 'app/configs/reviewTheme';

import WaferBook from './NewWaferDrawer';

const WaferBookContainer = props => {
  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />
      <WaferBook {...props} />
    </ThemeProvider>
  );
};

export default WaferBookContainer;
