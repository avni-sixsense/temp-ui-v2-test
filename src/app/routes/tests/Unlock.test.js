import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { fireEvent, render } from '@testing-library/react';
import theme from 'app/configs/theme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import UnlockScreen from '../Pages/unlock/UnlockScreen';

function InputField(props) {
  const { onSubmit } = props;
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <UnlockScreen />
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

const DataEntry = (container, name, data) => {
  let field;
  if (name !== 'message') {
    field = container.querySelector(`input[name=${name}]`);
  } else {
    field = container.querySelector(`textarea`);
  }
  fireEvent.change(field, { target: { value: data } });
  return field;
};

test('sets the value to the upper version of the value', () => {
  const onSubmit = jest.fn();
  const { container } = render(<InputField />);

  const FirstName = DataEntry(container, 'firstName', 'John');
  const LastName = DataEntry(container, 'lastName', 'Doe');
  const Email = DataEntry(container, 'email', 'newemail@sixsense.ai');
  const Phone = DataEntry(container, 'phoneNo', '1234567890');
  const Message = DataEntry(container, 'message', 'hahaha');

  const UnlockBtn = container.querySelector('button#unlockBtn');

  expect(FirstName.value).toEqual('John');
  expect(LastName.value).toEqual('Doe');

  expect(Email.value).toEqual('newemail@sixsense.ai');
  expect(Phone.value).toEqual('1234567890');

  expect(Message.value).toEqual('hahaha');

  fireEvent.click(UnlockBtn);
  // expect(onSubmit).toHaveBeenCalled()
});
