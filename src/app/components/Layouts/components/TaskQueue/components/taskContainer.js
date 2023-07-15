import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import api from 'app/api';
import axios from 'axios';
import CommonBackdrop from 'app/components/CommonBackdrop';
import { updateNextDataURL } from 'app/utils/helpers';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { VariableSizeList as List } from 'react-window';
import InfiniteScroll from 'react-window-infinite-loader';
import store from 'store/index';
import {
  addTasks,
  setPendingTasksIds,
  updateTasks
} from 'store/taskQueue/actions';

import TaskCard from './taskCard';

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

const TasksContainer = () => {
  let cancelToken;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isGettingTasks, setIsGettingTasks] = useState(false);
  const [nextApi, setNextApi] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { tasks, pendingStatusIds, activeMode } = useSelector(
    ({ TaskQueue }) => TaskQueue
  );

  const getStatus = mode => {
    if (mode === 'In progress') {
      return 'status__in=STARTED,PENDING&cursor=';
    }
    if (mode === 'Successful') {
      return 'status=SUCCESS&cursor=';
    }
    if (mode === 'Failed') {
      return 'status=FAILURE&cursor=';
    }
    return 'cursor=';
  };

  const { data, isLoading: isTasksLoading } = useQuery(
    ['taskQueue', `?${getStatus(activeMode)}`],
    context => api.getAllTasks(...context.queryKey),
    { enabled: !!activeMode }
  );

  useEffect(() => {
    dispatch(addTasks({ data: data?.results || [], isNew: true }));
  }, [data]);

  useEffect(() => {
    dispatch(
      setPendingTasksIds(
        tasks
          .filter(x => x.status === 'PENDING' || x.status === 'STARTED')
          .map(x => x.task_id)
      )
    );
  }, [tasks]);

  const { data: pendingTasksData } = useQuery(
    ['pendingTasksData', `?task_id__in=${pendingStatusIds.join(',')}`],
    context => api.getAllTasks(...context.queryKey),
    { enabled: !!pendingStatusIds.length, refetchInterval: 1000 * 5 }
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

  const getItemSize = index => {
    if (tasks[index]?.status === 'FAILURE') {
      return 73;
    }
    return 41;
  };

  const loadMoreFiles = () => {
    if (typeof cancelToken !== typeof undefined) {
      cancelToken.cancel('Cancel the prev request.');
    }

    const { accessToken } = store.getState().user;

    cancelToken = axios.CancelToken.source();

    if (!isGettingTasks && !!nextApi) {
      setIsGettingTasks(true);
      return axios
        .get(nextApi, {
          cancelToken: cancelToken.token,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(({ data: res }) => {
          const { results = [] } = res;
          dispatch(addTasks({ data: results, isNew: false }));
          setNextApi(updateNextDataURL(res?.next));
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
        itemCount={tasks.length}
        loadMoreItems={isGettingTasks ? () => {} : loadMoreFiles}
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

export default TasksContainer;
