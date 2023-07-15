import ErrorBoundaryImg from 'assests/images/errorBoundary/errorBoundary.png';
import React from 'react';

import SSButton from '../SSButton';
import classes from './ErrorBoundary.module.scss';

const ErrorBoundaryUI = () => {
  return (
    <div className={classes.errorBoundaryUI}>
      <img
        src={ErrorBoundaryImg}
        alt='Something went wrong'
        className={classes.img}
      />

      <div className={classes.header}>Oops! Something went wrong.</div>

      <div className={classes.subHeader}>
        We encountered an error. Please try reloading the page. <br />
        If the problem persists, kindly reach out to SixSense.
      </div>

      <SSButton
        onClick={() => {
          window.location.reload();
        }}
      >
        Reload
      </SSButton>
    </div>
  );
};

export default ErrorBoundaryUI;
