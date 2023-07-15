// This would test all the input fields rendered or not

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { fireEvent, render } from '@testing-library/react';
import theme from 'app/configs/theme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import SignUp from '../Pages/signup/Signup';

function InputField(props) {
  const { onSubmit } = props;
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <SignUp />
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

const DataEntry = (container, id, data) => {
  const field = container.querySelector(`input${id}`);
  fireEvent.change(field, { target: { value: data } });
  return field;
};

test('sets the value to the upper version of the value', () => {
  const onSubmit = jest.fn();
  const { container } = render(<InputField onSubmit={onSubmit} />);
  const FirstName = DataEntry(container, '#base-input-firstName', 'John');
  const LastName = DataEntry(container, '#base-input-lastName', 'Doe');
  const WorkEmail = DataEntry(
    container,
    '#base-input-email',
    'newemail@sixsense.ai'
  );
  const JobTitle = DataEntry(container, '#base-input-jobTitle', 'developer');
  const Password = DataEntry(container, '#base-input-password', 'hahaha');
  const OrganizationCode = DataEntry(container, '#base-input-orgCode', '9999');

  const SignUp = container.querySelector('button#SignUpBtn');

  expect(FirstName.value).toEqual('John');
  expect(LastName.value).toEqual('Doe');

  expect(WorkEmail.value).toEqual('newemail@sixsense.ai');
  expect(JobTitle.value).toEqual('developer');

  expect(Password.value).toEqual('hahaha');
  expect(OrganizationCode.value).toEqual('9999');

  fireEvent.click(SignUp);
  // expect(onSubmit).toHaveBeenCalled()
});
