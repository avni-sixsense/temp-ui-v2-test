// This would take snapshot of loading page

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from 'app/configs/theme';
import React from 'react';
import renderer from 'react-test-renderer';

import LoadingPage from '../Pages/loading/Loading';

describe('<LoadingPage /> should render', () => {
  it('should work', () => {
    const wrapper = renderer
      .create(
        <MuiThemeProvider theme={theme}>
          <LoadingPage label='test' />
        </MuiThemeProvider>
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
