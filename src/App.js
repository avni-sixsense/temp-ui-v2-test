import 'react-toastify/dist/ReactToastify.css';

import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  createGenerateClassName,
  jssPreset,
  StylesProvider,
  ThemeProvider
} from '@material-ui/core/styles';
import sixsenseTheme from 'app/configs/theme';
import Routing from 'app/services/Routing';
import { create } from 'jss';
import jssExtend from 'jss-plugin-extend';
import { Suspense } from 'react';
import { QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import store from './store';
import { globalQueryClient } from 'app/configs/queryClientConfig';
import { StableNavigateContextProvider } from 'context/StableNavigateContext';

const jss = create({
  ...jssPreset(),
  plugins: [...jssPreset().plugins, jssExtend()],
  insertionPoint: document.getElementById('jss-insertion-point')
});

const generateClassName = createGenerateClassName();

function App() {
  return (
    <Suspense
      fallback={
        <CircularProgress
          style={{ position: 'absolute', top: '45%', left: '50%' }}
        />
      }
    >
      <StylesProvider jss={jss} generateClassName={generateClassName}>
        <Provider store={store}>
          <ThemeProvider theme={sixsenseTheme}>
            <CssBaseline />

            <QueryClientProvider client={globalQueryClient}>
              <BrowserRouter>
                <StableNavigateContextProvider>
                  <Routing />
                </StableNavigateContextProvider>
              </BrowserRouter>

              <ToastContainer
                position='bottom-center'
                autoClose={2500}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastClassName='toastContainer'
                bodyClassName='toastBody'
              />
            </QueryClientProvider>
          </ThemeProvider>
        </Provider>
      </StylesProvider>
    </Suspense>
  );
}

export default App;
