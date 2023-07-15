import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import axios from 'app/api/base';
import CustomInput from 'app/components/Base/Input';
import Button from 'app/components/CommonButton';
import TermsAndConditions from 'app/components/TermsAndConditions/TermsAndConditions';
import useForm from 'app/hooks/useForm';
import { getLandingPage } from 'app/utils/helpers';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setToken } from 'store/user/actions';
import IndexedDbService from 'app/services/IndexedDbService';
import { setSessionLogger } from 'app/utils/sessionLogger';
import { setUserInfo } from 'app/utils';

// function NewAccount({ classes }) {
// 	return (
// 		<Grid container justifyContent="center" style={{ marginTop: '18%' }}>
// 			<Grid item>
// 				<Typography variant="caption" className={classes.caption1}>
// 					Don’t have an account?{' '}
// 				</Typography>
// 			</Grid>
// 			<Grid item>
// 				<Typography variant="caption" className={classes.link1}>
// 					<Link to="/signup">Create New Account</Link>
// 				</Typography>
// 			</Grid>
// 		</Grid>
// 	)
// }
const useStyles = makeStyles(theme => ({
  paper: {
    width: '413px',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    borderRadius: '10px',
    border: `1px solid ${alpha(theme.colors.marineBlue, 0.13)}`,
    boxShadow: `0 10px 20px 5px ${alpha(theme.colors.azure, 0.1)}`,
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '468px'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    // marginTop: theme.spacing(1),
    padding: theme.spacing(0, 4)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
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
  link1: {
    ...theme.typeFace.link,
    fontFamily: 'Futura',
    fontSize: '0.875rem'
  },

  caption1: {
    ...theme.typeFace.cabin875,
    lineHeight: 1.43,
    marginRight: theme.spacing(0.5)
  },
  loginBtn: {
    borderRadius: '100px',
    width: '140px',
    height: '43px'
  }
}));

const initialState = {
  email: '',
  password: ''
};

export default function SignIn() {
  const classes = useStyles();

  const navigate = useNavigate();
  const location = useLocation();

  const globalDispatch = useDispatch();

  const [credWrongMessage, setCredWrongMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const { state, dispatch, isFormValid } = useForm(initialState);
  const { email, password, errors } = state;

  const onChange = e => {
    dispatch({
      type: 'form',
      field: e.target.name,
      value: e.target.value
    });
  };

  const onSubmit = async () => {
    if (isFormValid()) {
      const payload = { email, password };

      api
        .login(payload)
        .then(async response => {
          setCredWrongMessage(false);
          setErrorMessage(false);

          globalDispatch(setToken(response.data.access));
          if (process.env.REACT_APP_USE_AUTH_COOKIES === 'true') {
            await IndexedDbService.setToken(response.data.refresh);
          }

          axios.defaults.headers.Authorization = `Bearer ${response.data.access}`;

          setUserInfo();
          setSessionLogger();

          api
            .getSubscriptions('', 1)
            .then(res => {
              if (res.length === 1) {
                api.getPackById('', 1, res[0].pack).then(packResponse => {
                  const { id, home_page: homePage } = packResponse;
                  globalDispatch({ type: 'RESET_APPLIED' });
                  navigate(getLandingPage(homePage, res[0]?.id, id));
                });
              } else {
                const next = location?.state?.next;
                navigate(next || '/');
              }
            })
            .catch(() => {
              const next = location?.state?.next;
              navigate(next || '/');
            });
        })
        .catch(({ response = {} }) => {
          const { status = 500 } = response;
          if (status === 401 || status === 403) {
            setCredWrongMessage(true);
            setErrorMessage(false);
          } else {
            setErrorMessage(true);
            setCredWrongMessage(false);
          }
        });
    }
  };

  const onEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant='h1' className={classes.title}>
          Welcome Back!
        </Typography>
        <Typography variant='h1' className={classes.subTitle}>
          Please login to continue
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <CustomInput
                label='Registered Email'
                required
                name='email'
                value={email}
                onChange={onChange}
                error={errors ? errors.email : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomInput
                label='Password'
                required
                password
                name='password'
                value={password}
                onChange={onChange}
                error={errors ? errors.password : ''}
                onKeyDown={onEnterPress}
              />
            </Grid>
            {credWrongMessage && (
              <Typography
                variant='body2'
                style={{ color: 'red', paddingLeft: 16 }}
              >
                The credentials provided are invalid
              </Typography>
            )}
            {errorMessage && (
              <Typography
                variant='body2'
                style={{ color: 'red', paddingLeft: 16 }}
              >
                Something went wrong please try again later.
              </Typography>
            )}
            <Grid container item xs={12}>
              <Grid container item xs={6} alignItems='center'>
                {/* <Typography variant="h6" className={classes.link1}>
									<Link to="/forgotpassword">Forgot Password</Link>
								</Typography> */}
              </Grid>
              <Grid container item xs={6} justifyContent='flex-end'>
                <Button
                  text='Login'
                  id='login_btn_login'
                  wrapperClass={classes.loginBtn}
                  onClick={onSubmit}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* <NewAccount classes={classes} /> */}
        </form>
      </Paper>
      <TermsAndConditions />
    </>
  );
}
