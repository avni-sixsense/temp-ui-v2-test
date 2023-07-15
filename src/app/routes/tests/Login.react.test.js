// This would check all the component of this page rendered or not

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { fireEvent, render } from '@testing-library/react';
import theme from 'app/configs/theme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import SignIn from '../Pages/login/LoginPage';

function InputField(props) {
  const { onSubmit } = props;
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <SignIn />
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

  const Email = DataEntry(container, 'email', 'newemail@sixsense.ai');
  const Password = DataEntry(container, 'password', 'hahaha');

  const Login = container.querySelector('button[name=loginBtn]');

  expect(Email.value).toEqual('newemail@sixsense.ai');
  expect(Password.value).toEqual('hahaha');

  fireEvent.click(Login);
  // expect(onSubmit).toHaveBeenCalled()
});
