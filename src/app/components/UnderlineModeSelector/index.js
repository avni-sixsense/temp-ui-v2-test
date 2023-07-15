import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  modRoot: {
    cursor: 'pointer'
  },
  text: {
    color: theme.colors.grey[900],
    fontSize: '0.875rem',
    fontWeight: 600
  },
  divider: {
    height: '3px',
    width: '100%',
    marginTop: theme.spacing(1),
    borderRadius: '1000px',
    opacity: 1
  },
  active: {
    backgroundColor: theme.colors.blue[600]
  },
  inActive: {
    backgroundColor: theme.colors.grey[4]
  },
  subLabel: {
    backgroundColor: theme.colors.grey[2],
    borderRadius: '3px',
    '& p': {
      color: theme.colors.grey[12],
      fontWeight: 500,
      fontSize: '0.625rem'
    }
  }
}));

const UnderlineModeSelector = ({
  onChange,
  active,
  modes = [],
  lightTheme = false,
  blueLightTheme = false
}) => {
  const classes = useStyles();
  return (
    <Box p={0.375} display='flex'>
      {modes.map((mode, index) => (
        <Box
          key={index}
          pr={1.5}
          onClick={() => onChange(mode.label)}
          display='flex'
          alignItems='center'
          flexDirection='column'
          className={classes.modRoot}
        >
          <Box display='flex' alignItems='center'>
            {mode?.icon && mode.icon}
            <Typography className={classes.text}>{mode.label}</Typography>
            {(mode.subLabel || mode.subLabel === 0) && (
              <Box className={classes.subLabel} mx={0.25} px={0.375} py={0.125}>
                <Typography>{mode.subLabel}</Typography>
              </Box>
            )}
          </Box>
          <Divider
            className={`${classes.divider} ${
              active === mode.label ? classes.active : classes.inActive
            }`}
          />
        </Box>
      ))}
    </Box>
  );
};

export default UnderlineModeSelector;
