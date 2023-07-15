import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import CustomInput from 'app/components/Base/Input';
import useForm from 'app/hooks/useForm';
import React from 'react';

const useStyles = makeStyles(theme => ({
  container: {},
  paper: {
    width: '413px',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    borderRadius: '10px',
    border: `1px solid ${alpha(theme.colors.marineBlue, 0.13)}`,
    boxShadow: `0 10px 20px 5px ${alpha(theme.colors.azure, 0.1)}`,
    marginTop: theme.spacing(5),
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
  form: {
    width: '100%', // Fix IE 11 issue.
    padding: theme.spacing(4)
  },
  subTitle: {
    ...theme.typeFace.futuraBT1,
    lineHeight: '1.5rem',
    textAlign: 'center',
    opacity: 0.8,
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(4)
  },
  grid: {}
}));

const initialState = {
  password: '',
  confirmPassword: ''
};

const ForgotPassword = () => {
  const classes = useStyles();
  const { state, dispatch } = useForm(initialState);
  const { confirmPassword, password } = state;

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
        <Typography variant='h1' className={classes.title}>
          Set A New Password
        </Typography>
        <Typography variant='h1' className={classes.subTitle}>
          Password should be atleast 8 characters
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container className={classes.grid} spacing={4}>
            <Grid item xs={12}>
              <CustomInput
                name='password'
                value={password}
                onChange={onChange}
                label='New Password'
                required
                password
              />
            </Grid>
            <Grid item xs={12}>
              <CustomInput
                name='confirmPassword'
                value={confirmPassword}
                onChange={onChange}
                label='Confirm Password'
                required
                password
              />
            </Grid>
            <Grid container item justifyContent='center'>
              <Button name='updateBtn' onClick={() => onSubmit()}>
                Update Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default ForgotPassword;
