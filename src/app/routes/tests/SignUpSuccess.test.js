// This would create a snapshot of this page

import React from 'react';
import renderer from 'react-test-renderer';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from 'app/configs/theme';
import SignupSuccess from 'app/main/apps/signup/SignupSuccess';

describe('<LoadingPage /> should render', () => {
  it('should work', () => {
    const wrapper = renderer
      .create(
        <MuiThemeProvider theme={theme}>
          <SignupSuccess />
        </MuiThemeProvider>
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
