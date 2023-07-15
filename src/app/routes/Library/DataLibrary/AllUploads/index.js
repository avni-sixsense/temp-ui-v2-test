import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import reviewTheme from 'app/configs/reviewTheme';

import AllUploads from './AllUploads';

const AllUploadsContainer = props => {
  return (
    <>
      <ThemeProvider theme={reviewTheme}>
        <CssBaseline />

        <AllUploads {...props} />
      </ThemeProvider>
    </>
  );
};

export default AllUploadsContainer;
