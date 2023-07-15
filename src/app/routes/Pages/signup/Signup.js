import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import CustomInput from 'app/components/Base/Input';
import Button from 'app/components/CommonButton';
import TermsAndConditions from 'app/components/TermsAndConditions/TermsAndConditions';
import useForm from 'app/hooks/useForm';
import React from 'react';
import { Link } from 'react-router-dom';

function ExistingAccount({ classes }) {
  return (
    <Grid container justifyContent='center' style={{ marginTop: '8%' }}>
      <Grid item>
        <Typography variant='caption' className={classes.caption1}>
          Already have an account?
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant='caption' className={classes.link1}>
          <Link to='/login'>Login</Link>
        </Typography>
      </Grid>
    </Grid>
  );
}

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
    minHeight: '530px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  signupForm: {
    width: '100%', // Fix IE 11 issue.
    // marginTop: theme.spacing(1),
    padding: theme.spacing(4)
  },
  title: {
    ...theme.typeFace.futura125,
    fontWeight: 500,
    lineHeight: '2rem',
    textAlign: 'center',
    marginTop: theme.spacing(3)
  },
  signUpBtn: {
    width: '234px',
    height: '43px',
    borderRadius: '100px'
  },
  link1: {
    ...theme.typeFace.link,
    fontFamily: 'Futura',
    fontSize: '0.875rem'
  },
  caption1: {
    ...theme.typeFace.cabin875,
    lineHeight: 1.43,
    marginRight: theme.spacing(0.5)
  }
}));

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  username: '',
  phone: ''
};

const SignUp = () => {
  const classes = useStyles();
  // const navigate = useNavigate()
  const { state, dispatch, isFormValid } = useForm(initialState);
  const { firstName, lastName, username, email, password, phone } = state;

  const onChange = e => {
    dispatch({
      type: 'form',
      field: e.target.name,
      value: e.target.value
    });
  };

  const onSubmit = () => {
    if (isFormValid()) {
      // jwtService
      // 	.userSignUp(firstName, lastName, username, email, password, phone)
      // 	.then(() => navigate('/success'))
    }
  };
  return (
    <>
      <Paper elevation={3} className={classes.paper}>
        <Typography className={classes.title} variant='h1'>
          Create New Account
        </Typography>
        <form className={classes.signupForm} noValidate>
          <Grid container justifyContent='center' spacing={4}>
            <Grid item xs={12} sm={6}>
              <CustomInput
                name='firstName'
                label='First Name'
                value={firstName}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomInput
                name='lastName'
                label='Last Name'
                value={lastName}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomInput
                name='email'
                label='Work Email'
                value={email}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomInput
                name='password'
                label='Password'
                value={password}
                onChange={onChange}
                required
                password
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomInput
                name='username'
                label='User Name'
                value={username}
                onChange={onChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomInput
                name='phone'
                label='Phone No.'
                value={phone}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid container item justifyContent='center'>
              <Button
                text='Create New Account'
                wrapperClass={classes.signUpBtn}
                onClick={() => onSubmit()}
              />
            </Grid>
          </Grid>
          <ExistingAccount classes={classes} />
        </form>
      </Paper>
      <TermsAndConditions />
    </>
  );
};

export default SignUp;
