import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import WithCondition from 'app/hoc/WithCondition';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Spinner from 'app/components/Spinner';
import { setSessionLogger } from 'app/utils/sessionLogger';
import { refreshToken } from 'app/utils/refreshToken';

import logo from 'assests/images/logo.png';
import background from 'assests/images/background.svg';

const useStyles = makeStyles(() => ({
  bg: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    // height: '100vh',
    background: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    '-webkit-background-size': 'cover',
    '-moz-background-size': 'cover',
    '-o-background-size': 'cover',
    backgroundSize: 'cover'
  },
  logo: {
    padding: '2% 0 0 3.1%'
  }
}));

const PublicLayout = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const validateRouter = async () => {
    try {
      const newRefreshToken = await refreshToken();
      if (!!newRefreshToken) {
        navigate('/');
      }
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateRouter();
  }, []);

    return (
      <WithCondition
        when={!isLoading}
        then={
          <Container maxWidth={false} disableGutters>
            <CssBaseline />
            <div className={classes.bg}>
              <Grid container item className={classes.logo}>
                <img alt='' src={logo} />
              </Grid>
              <Grid container item>
                <Outlet />
              </Grid>
            </div>
          </Container>
        }
        or={<Spinner />}
      />
    );
};

export default PublicLayout;
