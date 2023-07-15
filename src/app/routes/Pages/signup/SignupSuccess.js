import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Success from 'assests/images/group-29.svg';
import React from 'react';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '413px',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    marginTop: theme.spacing(5),
    backgroundColor: 'transparent',
    marginBottom: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  title: {
    ...theme.typeFace.futura125,
    fontWeight: 500,
    lineHeight: '2rem',
    textAlign: 'center',
    marginTop: theme.spacing(3)
  },
  subTitle: {
    ...theme.typeFace.futuraBT1,
    lineHeight: '1.5rem',
    textAlign: 'center',
    opacity: 0.8,
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(4)
  },
  successImg: {
    margin: 'auto',
    width: '248px',
    height: '182px'
  }
}));

const SignupSuccess = () => {
  const classes = useStyles();
  return (
    <>
      <Paper elevation={0} className={classes.paper}>
        <Grid container className={classes.container} justifyContent='center'>
          <Grid item>
            <img src={Success} className={classes.successImg} alt='' />
          </Grid>
          <Grid item>
            <Typography variant='h1' className={classes.title}>
              Signup Successful
            </Typography>
            <Typography variant='h1' className={classes.subTitle}>
              We are processing your request from our end. Your admin will be
              sending out the credentials over the email.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default SignupSuccess;
