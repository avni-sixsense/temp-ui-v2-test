import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import api from 'app/api';
import axios from 'axios';
import CommonBackdrop from 'app/components/CommonBackdrop';
import { useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { VariableSizeList as List } from 'react-window';
import InfiniteScroll from 'react-window-infinite-loader';
import store from 'store/index';
import {
  addTasks,
  setPendingTasksIds,
  updateTasks,
  addNextPointer
} from 'store/taskQueue/actions';

import TaskCard from '../taskCard';

const useStyles = makeStyles(theme => ({
  scrollableDiv: {
    '& .List': {
      '&::-webkit-scrollbar ': {
        width: 3
      },

      /* Track */
      '&::-webkit-scrollbar-track': {
        borderRadius: 10
      },

      /* Handle */
      '&::-webkit-scrollbar-thumb': {
        background: '#31456A',
        borderRadius: 10
      },

      /* Handle on hover */
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#EEEEEE'
      }
    }
  }
}));

const LINE_HEIGHT = 21;
const INNER_PADDING = 32;
const TEXT_LENGTH = 38;

const InProgressMode = () => {
  let cancelToken;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isGettingTasks, setIsGettingTasks] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { tasks, pendingStatusIds, nextPointer } = useSelector(
    ({ TaskQueue }) => TaskQueue
  );

  const queryClient = useQueryClient();

  const { data = {}, isLoading: isTasksLoading } = useQuery(
    ['progressTaskQueue', `?status__in=STARTED,PENDING&cursor=`],
    context => api.getAllTasks(...context.queryKey),
    { refetchInterval: 1000 * 5 }
  );

  useEffect(() => {
    if (data.results) {
      const { results = [] } = data;
      const filteredTask = results.filter(
        task => task.status === 'PENDING' || task.status === 'STARTED'
      );

      dispatch(addTasks({ data: filteredTask, isNew: true }));
      dispatch(addNextPointer(data?.next));
    }
  }, [data]);

  useEffect(() => {
    const filteredTask = tasks.filter(
      task => task.status === 'PENDING' || task.status === 'STARTED'
    );
    dispatch(
      setPendingTasksIds(
        tasks
          .filter(x => x.status === 'PENDING' || x.status === 'STARTED')
          .map(x => x.task_id)
      )
    );

    if (tasks.length !== filteredTask.length) {
      queryClient.invalidateQueries('failedTaskQueue');
      queryClient.invalidateQueries('sucessTaskQueue');
      queryClient.invalidateQueries('allTaskQueue');
    }
  }, [tasks]);

  const { data: pendingTasksData } = useQuery(
    ['pendingTasksData', `?task_id__in=${pendingStatusIds.join(',')}`],
    context => api.getAllTasks(...context.queryKey),
    {
      enabled: !!pendingStatusIds.length,
      refetchInterval: 1000 * 5
    }
  );

  useEffect(() => {
    dispatch(updateTasks(pendingTasksData?.results || []));
  }, [pendingTasksData]);

  const ele = document.getElementById('scrollableDiv');

  const [compSize, setCompSize] = useState({
    width: 400,
    height: ele?.offsetHeight
  });

  useEffect(() => {
    setCompSize({ ...compSize, height: ele?.offsetHeight });
  }, [ele, ele?.offsetHeight]);

  useEffect(() => {
    setCompSize({
      ...compSize,
      width: 400
    });
    return () => {
      // reset pointer on unmount
      dispatch(addNextPointer(''));
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      const ele = document.getElementById('scrollableDiv');
      setCompSize({
        width: 400,
        height: ele?.offsetHeight
      });
    }
    window.addEventListener('resize', handleResize);
  }, []);

  const handleRetryClick = id => {
    setIsLoading(true);
    api
      .retryTask(id)
      .then(() => {
        const tempTasks = tasks.filter(task => task.task_id === id);
        dispatch(updateTasks([{ ...tempTasks[0], status: 'PENDING' }]));
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const rowRender = ({ index, key, style, ...rest }) => {
    if (!tasks?.[index]?.status) {
      return '';
    }
    return (
      <>
        <TaskCard
          {...rest}
          style={{
            ...style,
            left: style.left,
            top: style.top,
            width: style.width,
            height: style.height
          }}
          key={index}
          title={tasks[index].description}
          // timestamp={tasks[index].timestamp}
          status={tasks[index].status}
          onRetryClick={() => handleRetryClick(tasks[index].task_id)}
        />
      </>
    );
  };

  const isItemLoaded = index => !!tasks[index];

  const loadMoreFiles = () => {
    if (typeof cancelToken !== typeof undefined) {
      cancelToken.cancel('Cancel the prev request.');
    }

    const { accessToken } = store.getState().user;

    cancelToken = axios.CancelToken.source();

    if (!!nextPointer) {
      setIsGettingTasks(true);
      return axios
        .get(nextPointer, {
          cancelToken: cancelToken.token,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(({ data: res }) => {
          const { results = [] } = res;
          dispatch(addTasks({ data: results, isNew: false }));
          dispatch(addNextPointer(res?.next));
          setIsGettingTasks(false);
        })
        .catch(e => {
          if (axios.isCancel(e)) return;

          setIsGettingTasks(false);
        });
    }

    return new Promise(resolve => {
      resolve();
    });
  };

  const getItemSize = index => {
    return (tasks[index]?.description || '').length > TEXT_LENGTH
      ? Math.ceil((tasks[index]?.description || '').length / TEXT_LENGTH) *
          LINE_HEIGHT +
          INNER_PADDING
      : LINE_HEIGHT + INNER_PADDING;
  };

  return (
    <Box
      flex={1}
      width='100%'
      height='100%'
      id='scrollableDiv'
      className={classes.scrollableDiv}
    >
      <InfiniteScroll
        isItemLoaded={isItemLoaded}
        itemCount={tasks.length + 1}
        loadMoreItems={loadMoreFiles}
      >
        {({ onItemsRendered, ref }) => (
          <>
            <List
              className='List'
              height={compSize.height || 0}
              itemCount={tasks.length}
              itemSize={getItemSize}
              onItemsRendered={onItemsRendered}
              ref={ref}
              width={400}
            >
              {rowRender}
            </List>

            {isGettingTasks && tasks.length > 0 ? (
              <div style={{ textAlign: 'center' }}>
                <h5>Loading...</h5>
              </div>
            ) : null}
          </>
        )}
      </InfiniteScroll>
      <CommonBackdrop open={isTasksLoading || isLoading} />
    </Box>
  );
};

export default InProgressMode;
