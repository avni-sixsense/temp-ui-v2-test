import {
  faAngleLeft,
  faAngleRight,
  faTimes
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import api from 'app/api';
// import WorkspaceIcon from 'assests/images/sidebar/workspace.svg'
import clsx from 'clsx';
import React, { useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTasks,
  setActiveMode,
  setPendingTasksIds
} from 'store/taskQueue/actions';

import AllMode from './components/modesContainer/all';
import FailedMode from './components/modesContainer/failed';
import InProgressMode from './components/modesContainer/progress';
import SuccessMode from './components/modesContainer/success';
// import { useDispatch } from 'react-redux'
// import { useNavigate, useParams } from 'react-router-dom'
import ModeSelector from './components/modeSelector';
// import TasksContainer from './components/taskContainer'

const drawerWidth = 400;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    height: '100%',
    flexShrink: 0,
    // whiteSpace: 'nowrap',
    borderRight: 'none !important',
    '& .MuiListItemIcon-root': {
      minWidth: '40px'
    }
  },
  toggleBtn: {
    height: '30px',
    width: '30px',
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: '50%',
    // borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    position: 'fixed',
    bottom: 57,
    right: 380,
    zIndex: 1300,
    marginLeft: '180px',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    cursor: 'pointer'
  },
  toggleBtnContainer: {
    height: 40,
    width: 40,
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: '50%',
    // borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    position: 'fixed',
    bottom: 57,
    right: -15,
    zIndex: 1300,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    cursor: 'pointer'
  },
  rightBtn: {
    marginLeft: 8,
    fontSize: '1rem',
    fontWeight: 900,
    color: '#162236'
  },
  border: {
    // borderTop: '1px solid #FFFFFF',
    // borderLeft: '1px solid #0E1623',
    // borderRight: '1px solid #FFFFFF',
    // borderBottom: '1px solid #FFFFFF',
  },
  header: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.colors.grey[22]
  },
  closeIcon: {
    cursor: 'pointer'
  },
  circularProgress: {
    '& svg': {
      color: theme.colors.grey[16]
    }
  }
}));

const TaskQueue = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { activeMode } = useSelector(({ TaskQueue }) => TaskQueue);

  const queryClient = useQueryClient();

  function CircularProgressWithLabel(props) {
    return (
      <Box position='relative' display='inline-flex'>
        <CircularProgress {...props} />
        <Box
          top={0}
          left={-16}
          bottom={0}
          right={0}
          position='absolute'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <FontAwesomeIcon icon={faAngleLeft} className={classes.rightBtn} />
        </Box>
      </Box>
    );
  }

  const { data: taskCount } = useQuery(
    ['taskCount', '?status__in=STARTED,PENDING'],
    context => api.getAllTasks(...context.queryKey),
    { refetchInterval: 1000 * 5, enabled: !open }
  );

  const modes = ['All', 'In progress', 'Successful', 'Failed'];

  const handleDrawerOpen = () => {
    dispatch(setActiveMode('All'));
    queryClient.invalidateQueries('allTaskQueue');
    queryClient.invalidateQueries('failedTaskQueue');
    queryClient.invalidateQueries('progressTaskQueue');
    queryClient.invalidateQueries('sucessTaskQueue');
    localStorage.setItem('drawer', true);
    setOpen(true);
  };

  const handleDrawerClose = () => {
    localStorage.setItem('drawer', false);
    setOpen(false);
  };

  const handleModeChange = value => {
    dispatch(addTasks({ data: [], isNew: true }));
    dispatch(setPendingTasksIds([]));
    dispatch(setActiveMode(value));
  };

  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        className={clsx(classes.drawer)}
        classes={{
          paper: classes.drawer
        }}
      >
        <Box height='100%' py={2.5}>
          <Box
            px={1.5}
            mb={1.5}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            borderBottom='1px solid #E8F2FE'
            padding='0px 20px 12px 16px'
          >
            <Typography className={classes.header}>Tasks in queue</Typography>
            <FontAwesomeIcon
              onClick={handleDrawerClose}
              className={classes.closeIcon}
              icon={faTimes}
              size='2x'
            />
          </Box>
          <Box px={1.5} mb={2}>
            <ModeSelector
              modes={modes}
              selectedMode={activeMode}
              onChange={handleModeChange}
            />
          </Box>
          <Box width='400' height='calc(100% - 90px)'>
            {/* {open && <TasksContainer />} */}
            {open && activeMode === 'All' && <AllMode />}
            {open && activeMode === 'In progress' && <InProgressMode />}
            {open && activeMode === 'Successful' && <SuccessMode />}
            {open && activeMode === 'Failed' && <FailedMode />}
          </Box>
        </Box>
        <Box onClick={handleDrawerClose} className={classes.toggleBtn}>
          <FontAwesomeIcon icon={faAngleRight} className={classes.rightBtn} />
        </Box>
      </Drawer>
      <Box
        onClick={handleDrawerOpen}
        className={clsx(classes.border, {
          [classes.toggleBtnContainer]: !open
        })}
      >
        {/* {!open && <FontAwesomeIcon icon={faAngleLeft} className={classes.rightBtn} />} */}
        {!open && (
          <CircularProgressWithLabel
            value={100}
            variant={taskCount?.count > 0 ? 'indeterminate' : 'determinate'}
            size={44}
            className={classes.circularProgress}
          />
        )}
      </Box>
    </>
  );
};

export default TaskQueue;
