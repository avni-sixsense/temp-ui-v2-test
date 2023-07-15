import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { FloatingStatusWidget } from 'app/components';
import DownloadConfirmDialogBox from 'app/components/DownloadConfirmDialogBox';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getModels } from 'store/common/actions';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TaskQueue from '../components/TaskQueue';

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

const SecondaryLayout = () => {
  const classes = useStyles();

  const { subscriptionId } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getModels(subscriptionId));
  }, []);

  return (
    <Container maxWidth={false} disableGutters>
      <Header withAppLayout />

      <div className={classes.container}>
        <Sidebar />

        <div className={classes.root}>
          <Outlet />
        </div>
      </div>
    </Container>
  );
};

export default SecondaryLayout;
