import React from 'react';

import CloseIcon from '@material-ui/icons/Close';

import classes from './SideDrawerHeader.module.scss';

const SideDrawerHeader = ({ text, onClick, disabled = false }) => {
  return (
    <div className={classes.container}>
      <h1>{text}</h1>

      <div
        className={classes.iconContainer}
        onClick={onClick}
        disabled={disabled}
      >
        <CloseIcon className={classes.icon} />
      </div>
    </div>
  );
};

export default SideDrawerHeader;
