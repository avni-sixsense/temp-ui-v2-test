// This would take snapshot of loading page

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import theme from 'app/configs/theme';
import LearnMore from '../learnMore/LearnMore';

function DetailsScreen(props) {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <LearnMore />
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

test('<LearnMore /> SnapShot Test', () => {
  const { container } = render(<DetailsScreen />);

  expect(container).toMatchSnapshot();
});

test('<LearnMore /> button test', () => {
  const { container } = render(<DetailsScreen />);

  const BackBtn = container.querySelector('a');
  const TryDemoBtn = container.querySelector('button[name=tryDemoBtn]');
  const UnlockBtn = container.querySelector('button[name=unlockBtn]');

  fireEvent.click(BackBtn);
  fireEvent.click(TryDemoBtn);
  fireEvent.click(UnlockBtn);
});
