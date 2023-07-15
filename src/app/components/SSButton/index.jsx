import React from 'react';

import Button from '@material-ui/core/Button';

import classes from './SSButton.module.scss';

const SSButton = ({ children, ...props }) => {
  return (
    <Button
      classes={{
        root: classes.btn,
        disabled: classes.btnDisabled,
        ...props.classes
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SSButton;
