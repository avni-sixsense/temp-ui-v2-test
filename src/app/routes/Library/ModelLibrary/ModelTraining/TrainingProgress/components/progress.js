import Box from '@material-ui/core/Box';
// import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { getTrainingTimeDifference } from 'app/utils/helpers';
import dayjs from 'dayjs';
import React from 'react';
import Loader from 'assests/images/modelLibrary/loader.gif';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  timeTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: theme.colors.grey[15]
  },
  time: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: theme.colors.grey[19],
    marginTop: theme.spacing(0.75)
  }
  // 	percentage: {
  // 		fontSize: '0.875rem',
  // 		fontWeight: 500,
  // 		color: theme.colors.grey[12],
  // 	},
  // 	progressName: {
  // 		fontSize: '0.875rem',
  // 		fontWeight: 600,
  // 		color: theme.colors.grey[19],
  // 	},
  // 	percentageBox: {
  // 		backgroundColor: theme.colors.grey[4],
  // 		padding: theme.spacing(0, 0.25),
  // 		borderRadius: '4px',
  // 	},
  // 	subPercentage: {
  // 		fontSize: '0.75rem',
  // 		fontWeight: 500,
  // 		color: theme.colors.grey[14],
  // 	},
}));

// const BorderLinearProgress = withStyles((theme) => ({
// 	root: {
// 		height: (props) => (props.size === 'small' ? 3 : 7),
// 		borderRadius: 1000,
// 	},
// 	colorPrimary: {
// 		backgroundColor: theme.colors.grey[4],
// 	},
// 	bar: {
// 		borderRadius: 1000,
// 		backgroundColor: (props) => (props.error ? theme.colors.red[500] : theme.colors.blue[600]),
// 	},
// }))(LinearProgress)

const ModelProgresses = ({ pollInfo }) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box height={200}>
        <img src={Loader} alt='Loading...' height='100%' />
      </Box>

      <Box>
        <Typography className={classes.timeTitle}>
          Model training in progress...
        </Typography>

        <Typography className={classes.time}>
          Time Elapsed:{'  '}
          {getTrainingTimeDifference(
            dayjs.utc(),
            dayjs.utc(pollInfo?.status?.started_at)
          ) || '0 min'}
        </Typography>
      </Box>
    </Box>
  );

  // return (
  // 	<>
  // 		{Object.keys(pollInfo?.status || {}).length > 0 && (
  // 			<Box className={classes.mainProgressContainer} mb={3}>
  // 				<Box display="flex" alignItems="flex-end" justifyContent="space-between" mb={0.75}>
  // 					<Box>
  // 						<Typography className={classes.timeTitle}>Time Elapsed</Typography>
  // 						<Box display="flex" alignItems="flex-end">
  // 							<Typography className={classes.time}>
  // 								{getTrainingTimeDifference(dayjs.utc(), dayjs.utc(pollInfo?.status?.started_at))}
  // 							</Typography>
  // 							<Typography className={classes.percentage}>{`${Math.floor(
  // 								pollInfo?.status?.progress_percentage
  // 							)}%`}</Typography>
  // 						</Box>
  // 					</Box>
  // 					<Box textAlign="right">
  // 						<Typography className={classes.timeTitle}>Time Remaining</Typography>
  // 						<Box display="flex" alignItems="flex-end">
  // 							<Typography className={classes.time}>
  // 								{getTrainingTimeDifference(dayjs.utc(pollInfo?.status?.ends_at), dayjs.utc())}
  // 							</Typography>
  // 							<Typography className={classes.percentage}>{`${
  // 								100 - Math.floor(pollInfo?.status?.progress_percentage)
  // 							}%`}</Typography>
  // 						</Box>
  // 					</Box>
  // 				</Box>
  // 				<Box>
  // 					<BorderLinearProgress
  // 						value={Math.floor(pollInfo?.status?.progress_percentage)}
  // 						variant="determinate"
  // 					/>
  // 				</Box>
  // 			</Box>
  // 		)}

  // 		{/* DEMO CODE */}

  // 		{/* <Box mb={1} display="flex" justifyContent="space-between" width="100%" alignItems="center">
  // 			<Box width="70%">
  // 				<Typography className={classes.progressName}>Data preparation</Typography>
  // 			</Box>
  // 			<Box display="flex" width="7%" justifyContent="space-between" alignItems="center">
  // 				<Box width="60%">
  // 					<BorderLinearProgress value={21} variant="determinate" size="small" />
  // 				</Box>
  // 				<Box className={classes.percentageBox}>
  // 					<Typography className={classes.subPercentage}>{`${21}%`}</Typography>
  // 				</Box>
  // 			</Box>
  // 		</Box> */}

  // 		{/* ACTUAL CODE */}

  // 		{pollInfo?.status?.steps
  // 			? pollInfo?.status?.steps.map((progress) => (
  // 					<Box mb={1} display="flex" justifyContent="space-between" width="100%" alignItems="center">
  // 						<Box width="70%">
  // 							<Typography className={classes.progressName}>{progress.name}</Typography>
  // 						</Box>
  // 						<Box display="flex" width="7%" justifyContent="space-between" alignItems="center">
  // 							<Box width="60%">
  // 								<BorderLinearProgress
  // 									value={progress.progress_percentage}
  // 									variant="determinate"
  // 									size="small"
  // 								/>
  // 							</Box>
  // 							<Box className={classes.percentageBox}>
  // 								<Typography
  // 									className={classes.subPercentage}
  // 								>{`${progress.progress_percentage}%`}</Typography>
  // 							</Box>
  // 						</Box>
  // 					</Box>
  // 			  ))
  // 			: ''}
  // 	</>
  // )
};

export default ModelProgresses;
