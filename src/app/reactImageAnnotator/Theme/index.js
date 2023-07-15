// @flow

import React from 'react';
import {
  ThemeProvider,
  createTheme,
  makeStyles
} from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    fontFamily: '"Inter", sans-serif'
  }
});

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif'
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none'
      }
    }
  }
});

export default ({ children }: any) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>{children}</div>
    </ThemeProvider>
  );
};
