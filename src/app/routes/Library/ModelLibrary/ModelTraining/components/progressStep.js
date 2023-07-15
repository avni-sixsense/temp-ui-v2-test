import { faBan } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonDialog from 'app/components/CommonDialog';
import CommonButton from 'app/components/ReviewButton';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.colors.grey[19]
  },
  subtitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  // LineProgress: {
  // 	width: '100%',
  // 	'& .MuiLinearProgress-colorPrimary': {
  // 		background: theme.colors.grey[4],
  // 		height: '7px !important',
  // 		borderRadius: '1000px',
  // 	},
  // 	'& .MuiLinearProgress-barColorPrimary': {
  // 		background: theme.colors.blue[600],
  // 	},
  // },
  // LineProgressSub: {
  // 	width: '40%',
  // 	'& .MuiLinearProgress-colorPrimary': {
  // 		background: '#E5E5E5',
  // 		height: '6px',
  // 		borderRadius: '6px',
  // 	},
  // 	'& .MuiLinearProgress-barColorPrimary': {
  // 		background: '#65D7C8',
  // 	},
  // },
  usecaseHeader: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  usecaseText: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[18]
  },
  timeText: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[15]
  },
  time: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: theme.colors.grey[19]
  },
  mainPercentage: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[12]
  },
  progressName: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[19]
  },
  percentageBox: {
    backgroundColor: theme.colors.grey[4],
    padding: theme.spacing(0, 0.25),
    borderRadius: '4px'
  },
  subPercentage: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[14]
  }
}));

const BorderLinearProgress = withStyles(theme => ({
  root: {
    height: props => (props.size === 'small' ? 3 : 7),
    borderRadius: 1000
  },
  colorPrimary: {
    backgroundColor: theme.colors.grey[4]
  },
  bar: {
    borderRadius: 1000,
    backgroundColor: props =>
      props.error ? theme.colors.red[500] : theme.colors.blue[600]
  }
}))(LinearProgress);

const ProgressStep = ({ sessionId, model, setShowProgress }) => {
  const classes = useStyles();

  const [showTerminateDialog, setShowTerminateDialog] = useState(false);

  const { data: pollInfo } = useQuery(
    ['pollTrainingSession', sessionId],
    context => api.pollTrainingSession(...context.queryKey),
    {
      enabled: !!sessionId,
      refetchInterval: 10 * 100
    }
  );

  useEffect(() => {
    if (pollInfo?.status?.progress) {
      if (pollInfo.status.progress === 100) {
        setShowProgress(false);
      }
    }
  }, [pollInfo, setShowProgress]);

  const handleShowTerminateDialog = status => {
    setShowTerminateDialog(status);
  };

  const handleTerminate = () => {
    api
      .terminateModelProgress(sessionId)
      .then(() => {
        toast.success('Session terminated successfully');
      })
      .finally(() => {
        setShowTerminateDialog(false);
        // handleDrawer([], false)
      })
      .catch(() => {
        toast.error('Failed to terminate session.');
      });
  };

  const terminateDialogAction = [
    {
      text: 'Cancel',
      variant: 'tertiary',
      callback: () => handleShowTerminateDialog(false)
    },
    {
      text: 'Continue',
      callback: handleTerminate
    }
  ];

  return (
    <Box pt={4.25} px={21.25}>
      <Box mb={3}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography className={classes.header}>
            {Object.keys(pollInfo?.status || {}).length === 0
              ? 'Training is not yet started'
              : Object.keys(pollInfo?.status || {}).length > 0 &&
                !pollInfo?.status?.progress_percentage &&
                pollInfo?.status?.progress_percentage !== 0
              ? 'Progress is not available for this model.'
              : 'Training is in progress...'}
          </Typography>
          <CommonButton
            text='Stop Training'
            icon={<FontAwesomeIcon icon={faBan} />}
            variant='tertiary'
            size='sm'
            onClick={() => handleShowTerminateDialog(true)}
          />
        </Box>
        <Typography className={classes.subtitle}>
          This information will be displayed publicly so be careful what you
          share.{' '}
        </Typography>
      </Box>
      <Box mb={3}>
        <Box display='flex' width='30%'>
          <Box width='30%'>
            <Typography className={classes.usecaseHeader}>
              Model Name
            </Typography>
          </Box>
          <Box width='30%'>
            <Typography className={classes.usecaseHeader}>Use Case</Typography>
          </Box>
          <Box width='40%'>
            <Typography className={classes.usecaseHeader}>Type</Typography>
          </Box>
        </Box>
        <Box display='flex' width='30%'>
          <Box width='30%'>
            <Typography className={classes.usecaseText}>MDL-000001</Typography>
          </Box>
          <Box width='30%'>
            <Typography className={classes.usecaseText}>Top Lead</Typography>
          </Box>
          <Box width='40%'>
            <Typography className={classes.usecaseText}>
              Multi Label Classification
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box display='flex' flexDirection='column'>
        <Box mb={3}>
          <Box
            my={2}
            mb={5}
            display='flex'
            width='100%'
            justifyContent='space-between'
            alignItems='center'
          >
            <Box width='100%'>
              <Box display='flex' width='100%' justifyContent='space-between'>
                <Box>
                  <Typography className={classes.timeText}>
                    Time Elapsed
                  </Typography>
                  <Box display='flex' alignItems='flex-end'>
                    <Typography className={classes.time}>
                      31 hours 21 min
                    </Typography>
                    &nbsp;
                    <Typography className={classes.mainPercentage}>
                      {` ${Math.min(
                        pollInfo?.status?.progress_percentage || 0,
                        100
                      )}%`}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display='flex'
                  flexDirection='column'
                  alignItems='flex-end'
                >
                  {Object.keys(pollInfo?.status || {}).length !== 0 ? (
                    <>
                      <Typography className={classes.timeText}>
                        Time Remaining
                      </Typography>
                      <Box display='flex' alignItems='flex-end'>
                        <Typography className={classes.time}>
                          5 hours 14 min
                        </Typography>
                        &nbsp;
                        <Typography className={classes.mainPercentage}>
                          {` ${
                            100 -
                            Math.min(
                              pollInfo?.status?.progress_percentage || 0,
                              100
                            )
                          }%`}
                        </Typography>
                        {/* <Typography className={classes.mainPercentage}>
											{getTimeDiff(pollInfo?.status?.started_at, pollInfo?.status?.ends_at, true)}
										</Typography> */}
                      </Box>
                    </>
                  ) : (
                    ''
                  )}
                </Box>
              </Box>
              <Box mt={1} className={classes.LineProgress}>
                <BorderLinearProgress
                  value={Math.min(
                    pollInfo?.status?.progress_percentage || 0,
                    100
                  )}
                  variant='determinate'
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {pollInfo?.status?.steps
          ? pollInfo?.status?.steps.map(progress => (
              <Box
                mb={1}
                display='flex'
                justifyContent='space-between'
                width='100%'
                alignItems='center'
              >
                <Box width='70%'>
                  <Typography className={classes.progressName}>
                    {progress.name}
                  </Typography>
                </Box>
                <Box
                  display='flex'
                  width='7%'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box width='60%'>
                    <BorderLinearProgress
                      value={progress.progress_percentage}
                      variant='determinate'
                      size='small'
                    />
                  </Box>
                  <Box className={classes.percentageBox}>
                    <Typography
                      className={classes.subPercentage}
                    >{`${progress.progress_percentage}%`}</Typography>
                  </Box>
                </Box>
                {/* <Box display="flex" width="40%" justifyContent="space-between">
									<Typography variant="body2">{`${
										progress.name
									} ${`( ${progress.progress_percentage}% complete) ...`}`}</Typography>
									<Typography variant="body2">
										{progress.progress_percentage === 100
											? 'Complete'
											: getTimeDiff(
													progress?.started_at,
													progress?.ends_at,
													progress.progress_percentage > 0
											  )}
									</Typography>
								</Box> */}
                {/* {progress.progress_percentage > 0 && progress.progress_percentage < 100 && ( */}
                {/* <Box mt={1} className={classes.LineProgressSub}>
									<BorderLinearProgress
										value={progress.progress_percentage}
										variant="determinate"
										size="small"
									/>
								</Box> */}
                {/* )} */}
              </Box>
            ))
          : ''}
        {showTerminateDialog && (
          <CommonDialog
            open={showTerminateDialog}
            message={`Are you sure you want to terminate ${model.name} ?`}
            actions={terminateDialogAction}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProgressStep;
