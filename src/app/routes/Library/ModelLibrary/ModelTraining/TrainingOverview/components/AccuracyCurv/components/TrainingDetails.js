import { faRedo } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommonButton from 'app/components/ReviewButton';
import React, { memo } from 'react';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectNewTrainingModel } from 'store/modelTraining/selector';

import classes from './TrainingDetails.module.scss';

const MODEL_STATUS = {
  ready_for_deployment: 'Ready for Deployment',
  training: 'Training',
  user_terminated: 'User Terminated',
  retired: 'Retired'
};

const mapTrainingToState = createStructuredSelector({
  newModel: selectNewTrainingModel
});

const TrainingDetails = () => {
  const { newModel } = useSelector(mapTrainingToState);

  const queryClient = useQueryClient();
  // useEffect(() => {
  // 	api.getTrainingSession(newModel?.training_session)
  // 		.then((res) => {
  // 			console.log({ res })
  // 		})
  // 		.catch(() => {
  // 			toast('Something went wrong.')
  // 		})
  // }, [])

  const handleRefreshBtn = () => {
    queryClient.invalidateQueries('AccuracyCurvChart');
  };

  return (
    <div className={classes.headerContainer}>
      <div className={classes.header}>
        <div className={classes.title}>Training Details</div>
        <div className={classes.refreshBtn}>
          <CommonButton
            onClick={handleRefreshBtn}
            text='Refresh'
            icon={<FontAwesomeIcon icon={faRedo} />}
            variant='tertiary'
          />
        </div>
      </div>
      <div className={classes.detailsContainer}>
        <div className={classes.title}>Status</div>
        <div className={classes.value}>{MODEL_STATUS[newModel.status]}</div>
      </div>
      {/* <div className={classes.timeEstimateContainer}>
				<div className={classes.detailsContainer}>
					<div className={classes.title}>Time Elapsed</div>
					<div className={classes.value}>2h 34min</div>
				</div>
				<div className={classes.detailsContainer}>
					<div className={classes.title}>Estimated Time</div>
					<div className={classes.value}>4h 34min</div>
				</div>
			</div> */}
    </div>
  );
};

export default memo(TrainingDetails);
