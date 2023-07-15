// This would test the input fields of CustomInput

import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from 'app/configs/theme';
import Input from 'app/components/Base/Input';

function InputField() {
  const [value, setValue] = useState('');

  const onChange = event => {
    setValue(event.target.value);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Input
        label='Registered Email'
        required
        name='email'
        value={value}
        onChange={onChange}
        error=''
      />
    </MuiThemeProvider>
  );
}

test('sets the value to the upper version of the value', () => {
  const { container } = render(<InputField />);
  const InputData = container.querySelector('input');
  const NewData = 'newemail@sixsense.ai';

  fireEvent.change(InputData, { target: { value: NewData } });
  expect(InputData.value).toEqual(NewData);
});
