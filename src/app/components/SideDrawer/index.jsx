import React from 'react';

import Drawer from '@material-ui/core/Drawer';

import SideDrawerHeader from '../SideDrawerHeader';
import SideDrawerFooter from '../SideDrawerFooter';

import classes from './SideDrawer.module.scss';

const SideDrawer = ({
  id,
  open,
  drawerProps,
  headerProps,
  footerProps,
  children
}) => {
  return (
    <Drawer id={id} open={open} anchor='right' {...drawerProps}>
      <div className={classes.container}>
        {headerProps && <SideDrawerHeader {...headerProps} />}

        {children}

        {footerProps && <SideDrawerFooter {...footerProps} />}
      </div>
    </Drawer>
  );
};

export default SideDrawer;
