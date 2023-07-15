import { faRedo } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/ReviewButton';
import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { useStopwatch } from 'react-timer-hook';
import { AI_PERFORMANCE_ROUTES } from 'store/aiPerformance/constants';
import { updateModelList } from 'store/common/actions';

const useStyles = makeStyles(theme => ({
  refreshText: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[14]
  }
}));

const TimerContainer = ({ mode }) => {
  const classes = useStyles();
  const location = useLocation();
  const { subscriptionId } = useParams();
  const dispatch = useDispatch();
  const { minutes, reset } = useStopwatch({ autoStart: true });

  const queryClient = useQueryClient();

  const handleRefreshApi = () => {
    queryClient.invalidateQueries();
    dispatch(updateModelList(subscriptionId));
    reset();
  };

  useEffect(() => {
    reset();
  }, [location.search]);

  useEffect(() => {
    if (minutes === 3 && mode === AI_PERFORMANCE_ROUTES.MONITORING.path) {
      handleRefreshApi();
    }
  }, [minutes, mode]);

  return (
    <>
      <Typography
        className={classes.refreshText}
      >{`Page was Loaded ${minutes} min ago`}</Typography>
      <Box ml={1.25}>
        <CommonButton
          text='Refresh'
          icon={<FontAwesomeIcon icon={faRedo} />}
          variant='tertiary'
          onClick={handleRefreshApi}
        />
      </Box>
    </>
  );
};

export default TimerContainer;
