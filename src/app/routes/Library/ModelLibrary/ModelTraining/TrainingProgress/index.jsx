import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
// import { faBan } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
// import CommonButton from 'app/components/ReviewButton'
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectNewTrainingModel,
  selectOldModel,
  selectTrainingUsecase
} from 'store/modelTraining/selector';

// import { setDialogOpen, setDialogVariant } from 'store/modelTraining/actions'
import ModelProgresses from './components/progress';
import ModelTrainingLayout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  setModelUseCase,
  setNewModel,
  setOldModel
} from 'store/modelTraining/actions';
import { convertTrainingSessionResToNewModel } from 'app/utils/modelTraining';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.colors.grey[0],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  header: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.colors.grey[19]
  },
  title: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[13],
    marginRight: theme.spacing(1)
  },
  value: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[19]
  },
  detailsContainer: {
    border: `1px solid ${theme.colors.grey[3]}`,
    borderRadius: '4px'
  },
  timeTitle: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[15]
  },
  time: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: theme.colors.grey[19],
    marginRight: theme.spacing(0.75)
  },
  percentage: {
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
  },
  infoContainer: {
    backgroundColor: theme.colors.grey[1],
    border: `1px solid ${theme.colors.grey[6]}`,
    borderRadius: '4px',
    '& svg': {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: theme.colors.grey[13]
    }
  },
  infoText: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[13],
    marginLeft: theme.spacing(1.75)
  }
}));

const mapTrainingToState = createStructuredSelector({
  oldModel: selectOldModel,
  newModel: selectNewTrainingModel,
  usecase: selectTrainingUsecase
});

const TrainingProgress = () => {
  const classes = useStyles();

  const { subscriptionId, packId, trainingSessionId } = useParams();
  const navigate = useNavigate();

  const { oldModel, newModel, usecase } = useSelector(mapTrainingToState);
  const dispatch = useDispatch();

  const { data = {}, isLoading: isTrainingSessionLoading } = useQuery(
    [trainingSessionId],
    context => api.getTrainingSession(...context.queryKey),
    { enabled: !Object.keys(newModel).length }
  );

  useEffect(() => {
    if (data.new_ml_model) {
      dispatch(setNewModel(convertTrainingSessionResToNewModel(data)));
    }
  }, [data.new_ml_model]);

  const { data: newModelData = {}, isLoading: isNewModelLoading } = useQuery(
    [newModel.new_ml_model],
    context => api.getMlModelByid(...context.queryKey),
    { enabled: !!newModel.new_ml_model }
  );

  const prevModelApiFn = newModel.base_ml_model
    ? api.getBaseMlModelById
    : api.getMlModelByid;

  const prevModelId = newModel.base_ml_model ?? newModel.old_ml_model;

  const { data: prevModelData, isLoading: isPrevModelDataLoading } = useQuery(
    [prevModelId],
    context => prevModelApiFn(...context.queryKey),
    { enabled: !!prevModelId }
  );

  const { data: useCase, isLoading: isUseCaseLoading } = useQuery(
    [newModelData.use_case],
    context => api.getUsecaseById(...context.queryKey),
    { enabled: !!newModelData.use_case }
  );

  useEffect(() => {
    if (newModelData.id) {
      dispatch(setNewModel(newModelData));
    }
  }, [newModelData.id]);

  useEffect(() => {
    if (useCase) {
      dispatch(setModelUseCase(useCase));
    }
  }, [useCase]);

  useEffect(() => {
    if (prevModelData) {
      dispatch(setOldModel(prevModelData));
    }
  }, [prevModelData]);

  // const handleTerminate = () => {
  // 	dispatch(setDialogVariant('stop_training'))
  // 	dispatch(setDialogOpen(true))
  // }

  const { data: pollInfo } = useQuery(
    ['pollTrainingSession', trainingSessionId],
    context => api.pollTrainingSession(...context.queryKey),
    { refetchInterval: 5 * 1000 }
  );

  const handleClick = () => {
    navigate(`/${subscriptionId}/${packId}/library/model`);
  };

  const isLoading =
    isTrainingSessionLoading ||
    isNewModelLoading ||
    isPrevModelDataLoading ||
    isUseCaseLoading;

  return (
    <ModelTrainingLayout
      title='Train Model'
      isBtnDisabled={false}
      btnText='Close'
      onClick={handleClick}
      isLoading={isLoading}
      className={classes.root}
    >
      <Box>
        <Box
          mb={3}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          {/* <Box mb={2} display="flex" alignItems="flex-end">
						<Typography className={classes.header}>
							{Object.keys(pollInfo?.status || {}).length > 0
								? 'Training is in progress'
								: 'Training is not yet started.'}
						</Typography>
						{Object.keys(pollInfo?.status || {}).length > 0 && <ThreeDotsLoading />}
					</Box> */}
          {/* <Box>
						{Object.keys(pollInfo?.status || {}).length > 0 && (
							<CommonButton
								text="Stop Training"
								icon={<FontAwesomeIcon icon={faBan} />}
								variant="negative"
								onClick={handleTerminate}
							/>
						)}
					</Box> */}
        </Box>

        <Box
          display='flex'
          alignItems='center'
          flexWrap='wrap'
          py={2}
          px={1.25}
          mb={3}
          className={classes.detailsContainer}
        >
          <Box display='flex' alignItems='center' mr={7}>
            <Typography className={classes.title}>Model Name</Typography>
            <Typography className={classes.value}>
              {newModel?.name || ''}
            </Typography>
          </Box>

          <Box display='flex' alignItems='center' mr={7}>
            <Typography className={classes.title}>Parent Model</Typography>
            <Typography className={classes.value}>
              {oldModel?.name || ''}
            </Typography>
          </Box>

          <Box display='flex' alignItems='center' mr={7}>
            <Typography className={classes.title}>Usecase</Typography>
            <Typography className={classes.value}>
              {usecase?.name || ''}
            </Typography>
          </Box>
        </Box>

        <ModelProgresses pollInfo={pollInfo} />
      </Box>

      <Box
        display='flex'
        alignItems='center'
        className={classes.infoContainer}
        p={2}
        mb={3}
      >
        <FontAwesomeIcon icon={faInfoCircle} />

        <Typography className={classes.infoText}>
          Model Training is happening in background, closing this window will
          not hinder model training.{' '}
        </Typography>
      </Box>
    </ModelTrainingLayout>
  );
};

export default TrainingProgress;
