import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  legendContainer: {
    cursor: isInteractive => (isInteractive ? 'pointer' : 'default')
  },
  subLabel: {
    color: '#5E7BAA',
    fontSize: 14
  }
}));

const ClickableBox = ({
  classes: parentClasses,
  label = '',
  subLabel = '',
  onClick,
  active,
  textGroupContainer
}) => {
  const isInteractive = typeof onClick === 'function';
  const classes = useStyles(isInteractive);
  const [activeClasses, inactiveClasses] = parentClasses;

  return (
    <Box
      className={classes.legendContainer}
      onClick={onClick}
      mr={3}
      display='flex'
      alignItems='center'
      flexWrap='wrap'
    >
      <Box mr={0.75} className={active ? activeClasses : inactiveClasses} />
      <Typography className={textGroupContainer}>
        {label}{' '}
        {subLabel && <span className={classes.subLabel}>({subLabel})</span>}
      </Typography>
    </Box>
  );
};

export default ClickableBox;
