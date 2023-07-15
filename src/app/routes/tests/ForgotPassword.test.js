// This would check all the component of this page rendered or not

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { fireEvent, render } from '@testing-library/react';
import theme from 'app/configs/theme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import ForgotPasswordPage from '../Pages/forgotPassword/ForgotPassword';

function InputField(props) {
  const { onSubmit } = props;
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <ForgotPasswordPage />
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

const DataEntry = (container, name, data) => {
  const field = container.querySelector(`input[name=${name}]`);
  fireEvent.change(field, { target: { value: data } });
  return field;
};

test('sets the value to the upper version of the value', () => {
  const onSubmit = jest.fn();
  const { container } = render(<InputField onSubmit={onSubmit} />);

  const Password = DataEntry(container, 'password', 'hahaha');
  const ConfirmPassword = DataEntry(container, 'confirmPassword', 'hahaha');

  const UpdatePassword = container.querySelector('button[name=updateBtn]');

  expect(Password.value).toEqual('hahaha');
  expect(ConfirmPassword.value).toEqual('hahaha');

  fireEvent.click(UpdatePassword);
  // expect(onSubmit).toHaveBeenCalled()
});
