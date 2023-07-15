import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import classes from './Spinner.module.scss';

const Spinner = props => {
  return (
    <div className={classes.spinnerContainer}>
      <CircularProgress {...props} />
    </div>
  );
};

export default Spinner;
