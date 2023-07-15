import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import { createCursor, getTimeDifference } from 'app/utils/helpers';
import dayjs from 'dayjs';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import InfiniteScroll from 'react-window-infinite-loader';
import {
  setNextCursor,
  setNotifications,
  setOlderNotifications
} from 'store/notifications/actions';

import NotificationCards from './components/notificationCard';

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.colors.grey[22]
  },
  headerContainer: {
    position: 'sticky',
    top: '15px'
  },
  notificationsContainer: {
    overflow: 'auto',
    width: '100%',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 0px white',
      borderRadius: '5px'
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: ' #dfdcdc',
      borderRadius: '10px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#cecece'
    }
  }
}));

const NotificationsContainer = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isNewNotificationLoading, setIsNewNotificationLoading] =
    useState(false);
  const {
    data = [],
    next,
    total
  } = useSelector(({ notifications }) => notifications);

  const rowRender = ({ index, ...rest }) => {
    if (!data[index]) {
      return '';
    }
    const {
      notification,
      id,
      created_ts: createdAt,
      is_read: isRead
    } = data[index];
    return (
      <>
        <NotificationCards
          key={index}
          title={notification.title}
          subTitle={notification.description}
          time={getTimeDifference(createdAt)}
          onClick={() =>
            handleClick(notification.navigation_link, id, isRead, createdAt)
          }
          priority={notification.priority}
          isRead={isRead}
          {...rest}
        />
      </>
    );
  };

  const { data: notifications, isLoading } = useQuery(
    [
      'notifications',
      data.length > 0 ? createCursor(true, data[0]?.created_ts) : ''
    ],
    context => api.getNotifications(...context.queryKey),
    { refetchInterval: 1000 * 10 }
  );

  useEffect(() => {
    dispatch(setNotifications(notifications?.results || []));
    if (notifications?.results.length) {
      dispatch(setNextCursor(notifications?.next));
    }
  }, [notifications]);

  const handleClick = (data, id, isRead, createdAt) => {
    if (isRead) {
      const urlStr = data
        .concat(
          `&date__gte=${dayjs(createdAt).format(
            'YYYY-MM-DD-HH-mm-ss'
          )}&date__lte=${dayjs(createdAt)
            .add(1, 'day')
            .startOf('day')
            .format('YYYY-MM-DD-HH-mm-ss')}`
        )
        .replaceAll('[', '')
        .replaceAll(']', '')
        .replaceAll(' ', '');
      navigate(urlStr);
    } else {
      api.setIsReadNotification(id).then(() => {
        navigate(
          data.replaceAll('[', '').replaceAll(']', '').replaceAll(' ', '')
        );
      });
    }
  };

  const loadMoreNotifications = () => {
    setIsNewNotificationLoading(true);
    const parsedParams = queryString.parse(next ? next.split('?')[1] : '', {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    api
      .getNotifications('', parsedParams?.cursor || '')
      .then(res => {
        const { next: newNext, results } = res;
        dispatch(setOlderNotifications(results || []));
        dispatch(setNextCursor(newNext));
        setIsNewNotificationLoading(false);
      })
      .catch(() => {
        setIsNewNotificationLoading(false);
      });
  };

  return (
    <Box py={1.875} pl={2.5} pr={3.125}>
      <Box className={classes.headerContainer} pb={3}>
        <Typography className={classes.header}>Notifications</Typography>
      </Box>
      {isLoading && (
        <Box display='flex' alignItems='center' justifyContent='center'>
          <CircularProgress />
        </Box>
      )}
      <InfiniteScroll
        isItemLoaded={index => !!data[index]}
        itemCount={total}
        loadMoreItems={
          !next || isNewNotificationLoading ? () => {} : loadMoreNotifications
        }
      >
        {({ onItemsRendered, ref }) => (
          <>
            <List
              className={`${classes.notificationsContainer} List`}
              height={window.innerHeight - 160}
              itemCount={total}
              itemSize={77}
              onItemsRendered={onItemsRendered}
              ref={ref}
            >
              {rowRender}
            </List>

            {isLoading && total > 0 ? (
              <div style={{ textAlign: 'center' }}>
                <h5>Loading...</h5>
              </div>
            ) : null}
          </>
        )}
      </InfiniteScroll>
    </Box>
  );
};

export default NotificationsContainer;
