import { Grid, makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyle = makeStyles(theme => ({
  root: {
    background: 'rgba(2, 67, 93, 0.03);',
    borderRadius: '6px',
    padding: theme.spacing(3.5),
    marginTop: theme.spacing(1),
    '& .MuiGrid-item': {
      marginBottom: theme.spacing(1.5)
    }
  }
}));

const ChartSummary = () => {
  const classes = useStyle();
  return (
    <Box mt={2}>
      <Typography variant='h2'>Chart Summary</Typography>
      <Grid container className={classes.root}>
        <Grid item xs={6}>
          <Box>
            <Typography variant='subtitle1'>Applications:</Typography>
            <Typography variant='h2'>12/12/2020 - 11/10/2021</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <Typography variant='subtitle1'>Defects:</Typography>
            <Typography variant='h2'>A, B, C, .......</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <Typography variant='subtitle1'>Chart Type:</Typography>
            <Typography variant='h2'>Ring</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <Typography variant='subtitle1'>Tools:</Typography>
            <Typography variant='h2'>KLA 108, KLA 109, KLA 110</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <Typography variant='subtitle1'>Batches:</Typography>
            <Typography variant='h2'>87KK, 90KK, ...... + 25 more</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChartSummary;
