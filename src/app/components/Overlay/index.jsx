import clsx from 'clsx';

import { Box, Typography } from '@material-ui/core';

import classes from './Overlay.module.scss';

const OverlayComp = ({ title, children, open = false, ...rest }) => {
  return (
    <Box {...rest} className={classes.container}>
      {open && (
        <Box className={classes.infoContainer}>
          <Box className={classes.infoPaper}>
            <Typography>{title}</Typography>
          </Box>
        </Box>
      )}

      <Box className={clsx({ [classes.childrenContainer]: open })}>
        {children}
      </Box>
    </Box>
  );
};

export default OverlayComp;
