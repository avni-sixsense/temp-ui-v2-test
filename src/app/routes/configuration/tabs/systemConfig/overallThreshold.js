import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[16]
  },
  value: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[16],
    marginLeft: theme.spacing(2)
  }
}));

const OverallThreshold = () => {
  const classes = useStyles();

  return (
    <Box pl={2.625} py={1.75} display='flex' alignItems='center'>
      <Box display='flex' alignItems='center' mr={6.25}>
        <Typography className={classes.header}>Auto-classification</Typography>
        <Typography className={classes.value}>90%</Typography>
      </Box>
      <Box display='flex' alignItems='center'>
        <Typography className={classes.header}>Accuracy</Typography>
        <Typography className={classes.value}>90%</Typography>
      </Box>
    </Box>
  );
};

export default OverallThreshold;
