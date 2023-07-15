import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import reviewTheme from 'app/configs/reviewTheme';

import AIPerformancePage from './components/AiPerformance';

const AIPerformance = () => {
  return (
    <>
      <ThemeProvider theme={reviewTheme}>
        <CssBaseline />
        <AIPerformancePage />
      </ThemeProvider>
    </>
  );
};

export default AIPerformance;
