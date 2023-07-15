import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import React from 'react';

const SSSwitch = withStyles(theme => ({
  root: {
    width: 26,
    height: 14,
    padding: 0,
    display: 'flex',
    alignItems: 'center',

    '& .Mui-disabled': { opacity: 0.5 },
    '& .Mui-disabled + span': { opacity: '0.5 !important' }
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(12.5px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none'
      }
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff'
    }
  },
  thumb: {
    width: 12,
    height: 12
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.colors.grey[10],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border'])
  },
  checked: {},
  focusVisible: {}
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked
      }}
      {...props}
    />
  );
});

export default SSSwitch;
