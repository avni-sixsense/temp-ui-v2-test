import { Outlet } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import Header from '../components/Header';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: `calc(100vh - 66px)`,
    width: '100%',
    marginTop: 66,
    overflowY: 'auto',
    overflowX: 'hidden',
    // background: `url(${background})`,
    backgroundPositionY: -60,
    '-webkit-background-size': 'cover',
    '-moz-background-size': 'cover',
    '-o-background-size': 'cover',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundColor: '#F0F7FF',
    '& .MuiGrid-spacing-xs-5': {
      margin: 0
    }
  },
  container: {
    display: 'flex'
  }
}));

const PrimaryLayout = () => {
  const classes = useStyles();

  return (
    <Container maxWidth={false} disableGutters>
      <Header withAppLayout />

      <div className={classes.container}>
        <div className={classes.root}>
          <Outlet />
        </div>
      </div>
    </Container>
  );
};

export default PrimaryLayout;
