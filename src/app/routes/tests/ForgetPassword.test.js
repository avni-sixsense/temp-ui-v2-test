import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from 'app/configs/theme';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

import ForgotPasswordPage from '../Pages/forgotPassword/ForgotPassword';

configure({ adapter: new Adapter() });
const wrapper = mount(
  <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <ForgotPasswordPage />
    </MuiThemeProvider>
  </BrowserRouter>
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('Test case for <ForgetPassword> page', () => {
  it('password check ', () => {
    const input = wrapper.find('input').at(0);
    input.props().value = 'new password';
    input.simulate('change');
    expect(input.props().value).toEqual('new password');
  });

  it('confirm password check ', () => {
    const input = wrapper.find('input').at(1);
    input.props().value = 'new password';
    input.simulate('change');
    expect(input.props().value).toEqual('new password');
  });

  it('should have same markup', () => {
    const template = renderer.create(wrapper).toJSON();
    expect(template).toMatchSnapshot();
  });

  it('button tests', () => {
    const button = wrapper.find('button').at(0).instance();
    expect(wrapper.find('button').exists()).toBeTruthy();
    const mockFn = jest.fn(() => 1);
    button.onclick = mockFn;
    button.onclick();
    // console.log(button.onclick)
    expect(mockFn.mock.calls.length).toEqual(1);
  });
});
