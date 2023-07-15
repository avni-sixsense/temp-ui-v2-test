// This would test the components of DataCard

import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { configure } from 'enzyme';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import Adapter from 'enzyme-adapter-react-16';
import DataCard from 'app/components/Card/Card';
import theme from 'app/configs/theme';

configure({ adapter: new Adapter() });

function Router() {
  this.router = [];

  this.push = function (a) {
    this.router.push(a);
  };

  this.get = function (index) {
    return this.router[index];
  };
  this.length = function () {
    return this.router.length;
  };
}

function History() {
  this.history = [];

  this.push = function (a) {
    this.history.push(a);
  };

  this.get = function (index) {
    return this.history[index];
  };
  this.length = function () {
    return this.history.length;
  };
}

describe('<DataCard /> should render', () => {
  let mount;

  mount = createMount();

  it('should work', () => {
    const wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <DataCard label='test' />
      </MuiThemeProvider>,
      { context: { router: new Router(), history: new History() } }
    );
    // const button = wrapper.find('button')
    // const text = button.simulate('click')
  });
});
