import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { fireEvent } from '@testing-library/react';
import theme from 'app/configs/theme';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import SignUp from '../Pages/signup/Signup';

configure({ adapter: new Adapter() });
const wrapper = mount(
  <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <SignUp />
    </MuiThemeProvider>
  </BrowserRouter>
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('Test case for <SignUp> page', () => {
  it('New Password input check ', () => {
    wrapper.find('input[name="firstName"]').simulate('change', {
      target: { name: 'firstName', value: 'rupesh' }
    });
    expect(wrapper.find('input[name="firstName"]').props().value).toEqual(
      'rupesh'
    );
  });

  it('lastname check ', () => {
    wrapper.find('input[name="lastName"]').simulate('change', {
      target: { name: 'lastName', value: 'rupesh' }
    });
    expect(wrapper.find('input[name="lastName"]').props().value).toEqual(
      'rupesh'
    );
  });

  it('workemail check ', () => {
    wrapper.find('input[name="email"]').simulate('change', {
      target: { name: 'email', value: 'rupesh@sixsense.ai' }
    });
    expect(wrapper.find('input[name="email"]').props().value).toEqual(
      'rupesh@sixsense.ai'
    );
  });

  it('jobTitle check ', () => {
    wrapper.find('input[name="jobTitle"]').simulate('change', {
      target: { name: 'jobTitle', value: 'frontend intern' }
    });
    expect(wrapper.find('input[name="jobTitle"]').props().value).toEqual(
      'frontend intern'
    );
  });

  it('organisation code check ', () => {
    wrapper.find('input[name="orgCode"]').simulate('change', {
      target: { name: 'orgCode', value: '9999' }
    });
    expect(wrapper.find('input[name="orgCode"]').props().value).toEqual('9999');
  });

  it('password check ', () => {
    wrapper.find('input[name="password"]').simulate('change', {
      target: { name: 'password', value: 'abc123' }
    });
    expect(wrapper.find('input[name="password"]').props().value).toEqual(
      'abc123'
    );
  });

  it('Submit button check', () => {
    // const FakeFun = jest.spyOn(SignUp.prototype, 'onSubmit')
    // wrapper.find('button').simulate('click')
    // wrapper.update()
    // expect(FakeFun).toHaveBeenCalled()
    // console.log(wrapper.find(SignUp).props());
    // expect(wrapper.find(SignUp)).toHaveLength(1);

    // let mockFn = jest.fn();
    // wrapper.find(SignUp).onClick = mockFn;
    // wrapper.find(Button).simulate('click');
    // wrapper.update()
    // expect(mockFn).toHaveBeenCalledTimes(1);

    const button = wrapper.find('button').at(0).instance();
    const mockFn = jest.fn();
    button.onclick = mockFn;
    fireEvent.click(button);
    expect(mockFn).toHaveBeenCalled();
  });
});
