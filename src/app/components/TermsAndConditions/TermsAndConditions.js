import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  grid: {
    marginBottom: theme.spacing(15)
  },
  link: {
    ...theme.typeFace.link,
    fontFamily: 'Cabin',
    fontSize: '0.75rem'
  },
  caption: {
    ...theme.typeFace.cabin75,
    WebkitTextFillColor: theme.colors.marineBlue
  }
}));
export default function TermsAndConditions() {
  const classes = useStyles();

  return (
    <Grid container className={classes.grid}>
      <Grid container item justifyContent='center' alignItems='flex-end'>
        <Typography variant='caption' className={classes.caption}>
          By signing in or creating an account, you agree with our
        </Typography>
      </Grid>
      <Grid container item justifyContent='center'>
        <Typography variant='caption' className={classes.link}>
          Terms & conditions <span className={classes.caption}>and </span>{' '}
          Privacy statement
        </Typography>
      </Grid>
    </Grid>
  );
}
