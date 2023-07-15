import React from 'react';

import classes from './SideDrawerBody.module.scss';

const SideDrawerBody = ({ children }) => {
  return <div className={classes.sideDrawerBody}>{children}</div>;
};

export default SideDrawerBody;
