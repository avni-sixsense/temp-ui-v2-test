import { useState, memo, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useQuery } from 'react-query';
import CommonButton from 'app/components/ReviewButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import reviewTheme from 'app/configs/reviewTheme';
import { ThemeProvider } from '@material-ui/core/styles';
import api from 'app/api';
import { useDispatch, useSelector } from 'react-redux';
import { setMisclassificationImagesRowIds } from 'store/aiPerformance/actions';

const useStyles = makeStyles(theme => ({
  root: {
    width: 360,
    borderRadius: '4px',
    color: theme.colors.grey?.[20]
  },
  header: {
    padding: '12px 12px 8px 12px',
    fontSize: 14,
    fontWeight: 600,
    borderBottom: `1px solid ${theme.colors.grey?.[4]}`
  },
  body: {
    padding: '8px 12px 8px 12px',
    fontSize: 12
  },
  imgContainer: {
    textAlign: 'center',
    padding: '0px 0px 12px 0px'
  },
  footer: {
    padding: 12,
    fontSize: 14,
    display: 'flex',
    background: '#F0F7FF'
  },
  buttonRight: {
    marginLeft: 12
  },
  dark: {
    fontWeight: 600
  }
}));

const TIME_INTERVAL_MILLISECONDS = 5000;

const DownloadConfirmDialogBoxWrapper = () => {
  const classes = useStyles();
  const [shouldFetch, setIsShouldFetch] = useState(false);
  const [url, setUrl] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const { misclassificationImagesRowIds } = useSelector(
    ({ aiPerformance }) => aiPerformance
  );

  const misclassificationImagesRowList = Object.values(
    misclassificationImagesRowIds
  );
  const taskIdList = misclassificationImagesRowList.map(({ taskId }) => taskId);

  const misclassificationImagesRowListLength =
    misclassificationImagesRowList.length;

  const { data } = useQuery(
    [
      'pendingTasksData',
      `?task_id__in=${taskIdList.join(',')}
        &limit=${misclassificationImagesRowListLength}`
    ],
    context => api.getAllTasks(...context.queryKey),
    {
      enabled: shouldFetch,
      refetchInterval: misclassificationImagesRowListLength
        ? TIME_INTERVAL_MILLISECONDS
        : false
    }
  );

  useEffect(() => {
    if (misclassificationImagesRowListLength) {
      setIsShouldFetch(true);
      const taskData = data?.results || [];
      const fitlerTaskData = taskData.find(
        ({ task_id, status }) =>
          taskIdList.includes(task_id) && status === 'SUCCESS'
      );
      if (fitlerTaskData) {
        const { url, task_id } = fitlerTaskData;
        setUrl(url);
        setTaskId(task_id);
      }
    } else {
      setIsShouldFetch(false);
      setTaskId(null);
    }
  }, [
    misclassificationImagesRowListLength,
    data,
    misclassificationImagesRowIds,
    taskIdList
  ]);

  const dispatch = useDispatch();

  if (!taskId) return null;

  const {
    gtDefectName,
    modalDefectName,
    modelOrganizationDefectCode,
    gtOrganizationDefectCode,
    selectedModal,
    id
  } = misclassificationImagesRowList.find(item => item.taskId === taskId);

  const onDownloadCTA = () => {
    const link = document.createElement('a');
    link.href = url;
    link.click();
    setTaskId(null);
    dispatch(setMisclassificationImagesRowIds({ id }));
  };

  const onCancelCTAHandler = () => {
    dispatch(setMisclassificationImagesRowIds({ id }));
    setTaskId(null);
  };

  const DIALOGUE_BOX_TEXT = {
    DOWNLOAD_CONFIRMATION: {
      header: 'Ready for download',
      para: (
        <>
          Similar training images for the misclassification pair{' '}
          <span className={classes.dark}>
            {gtOrganizationDefectCode} - {gtDefectName} &{' '}
            {modelOrganizationDefectCode} - {modalDefectName}
          </span>{' '}
          of modal <span className={classes.dark}>{selectedModal}</span> is
          ready for download.
        </>
      ),
      imageContainer: null,
      confirmButton: <CommonButton onClick={onDownloadCTA} text='Download' />,
      cancelButton: (
        <CommonButton
          variant='tertiary'
          wrapperClass={classes.buttonRight}
          onClick={onCancelCTAHandler}
          text='No, Cancel'
        />
      )
    }
  };

  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />
      <Dialog open>
        <Box className={classes.root}>
          <Box className={classes.header}>
            {DIALOGUE_BOX_TEXT['DOWNLOAD_CONFIRMATION'].header}
          </Box>
          <Box className={classes.body}>
            {DIALOGUE_BOX_TEXT['DOWNLOAD_CONFIRMATION'].para}
          </Box>
          {DIALOGUE_BOX_TEXT['DOWNLOAD_CONFIRMATION'].imageContainer}

          <Box className={classes.footer}>
            {DIALOGUE_BOX_TEXT['DOWNLOAD_CONFIRMATION'].confirmButton}
            {DIALOGUE_BOX_TEXT['DOWNLOAD_CONFIRMATION'].cancelButton}
          </Box>
        </Box>
      </Dialog>
    </ThemeProvider>
  );
};

export default memo(DownloadConfirmDialogBoxWrapper);
