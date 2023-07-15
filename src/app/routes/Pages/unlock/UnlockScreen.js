import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import CustomInput from 'app/components/Base/Input';
import useForm from 'app/hooks/useForm';
import Close from 'assests/images/close.svg';
import React from 'react';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '630px',
    display: 'flex',
    padding: 0,
    flexDirection: 'column',
    borderRadius: '10px',
    border: `1px solid ${alpha(theme.colors.marineBlue, 0.13)}`,
    boxShadow: `0 10px 20px 5px ${alpha(theme.colors.azure, 0.1)}`,
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
    // minHeight: '530px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  unlockForm: {
    width: '100%', // Fix IE 11 issue.
    padding: theme.spacing(4)
  },
  title: {
    ...theme.typeFace.futura125,
    fontWeight: 500,
    lineHeight: '2rem',
    textAlign: 'center',
    marginTop: theme.spacing(3)
  },
  closeBtn: {
    lineHeight: '2rem',
    textAlign: 'left',
    marginTop: theme.spacing(3)
  }
}));

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNo: '',
  message: ''
};

function UnlockScreen(props) {
  const classes = useStyles();

  const { state, dispatch } = useForm(initialState);
  const { firstName, lastName, email, phoneNo, message } = state;

  const onChange = e => {
    dispatch({
      type: 'form',
      field: e.target.name,
      value: e.target.value
    });
  };

  const onSubmit = () => {};

  return (
    <>
      <Paper elevation={3} className={classes.paper}>
        <Grid container justifyContent='center' spacing={5}>
          <Grid item xs={10} sm={10}>
            <Typography className={classes.title} variant='h1'>
              Unlock Backend
            </Typography>
          </Grid>
          <Grid item xs={1} sm={1}>
            <img src={Close} alt='' className={classes.closeBtn} />
          </Grid>
        </Grid>

        <form className={classes.unlockForm} noValidate>
          <Grid container justifyContent='center' spacing={4}>
            <Grid item xs={12} sm={6}>
              <CustomInput
                value={firstName}
                onChange={onChange}
                name='firstName'
                label='First Name'
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomInput
                value={lastName}
                onChange={onChange}
                name='lastName'
                label='Last Name'
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomInput
                value={email}
                onChange={onChange}
                name='email'
                label='Email Address'
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomInput
                value={phoneNo}
                onChange={onChange}
                name='phoneNo'
                label='Phone Number'
                required
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomInput
                value={message}
                onChange={onChange}
                name='message'
                label='Message'
                required
                multiline
              />
            </Grid>
            <Grid container item justifyContent='center'>
              <Button id='unlockBtn' onClick={() => onSubmit()}>
                Request For Unlock
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
}

export default UnlockScreen;
