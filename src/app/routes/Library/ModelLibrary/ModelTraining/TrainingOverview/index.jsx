import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Show from 'app/hoc/Show';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectNewTrainingModel } from 'store/modelTraining/selector';
import ModelTrainingLayout from '../components/Layout';
import queryString from 'query-string';
import TrainingConfigContainer from '../TrainingConfiguration/component/TrainingConfigSlider';
import AccuracyCurvContainer from './components/AccuracyCurv';
import DefectDataSummary from './components/defectDataSummary';
import ModelDetails from './components/modelDetails';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import api from 'app/api';
import { useEffect, useState } from 'react';
import {
  setDefectsInstancesCount,
  setModelUseCase,
  setNewModel,
  setOldModel,
  setProgressValue
} from 'store/modelTraining/actions';
import {
  convertTrainingSessionResToNewModel,
  isViewDetailsHash
} from 'app/utils/modelTraining';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { encodeURL } from 'app/utils/helpers';

const usestyle = makeStyles(theme => ({
  root: {
    backgroundColor: theme.colors.grey[0]
  },
  subHeader: {
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.colors.grey[15]
  },
  estimationContainer: {
    backgroundColor: theme.colors.blue[600],
    borderRadius: '4px'
  },
  estimatedTimeTitleContainer: {
    '& svg': {
      color: theme.colors.grey[4],
      marginRight: theme.spacing(0.75),
      fontSize: '0.8125rem'
    },
    '& p': {
      color: theme.colors.grey[0],
      fontWeight: 500,
      fontSize: '0.75rem'
    }
  },
  estimatedTime: {
    color: theme.colors.grey[0],
    fontWeight: 600,
    fontSize: '0.875rem'
  },
  tainingConfigContainer: {
    backgroundColor: theme.colors.grey[1],

    '& > div': {
      padding: 0
    }
  }
}));

const mapTrainingToState = createStructuredSelector({
  newModel: selectNewTrainingModel
});

const TrainingConfiguration = () => {
  const classes = usestyle();

  const dispatch = useDispatch();

  const { subscriptionId, packId, trainingSessionId } = useParams();
  const navigate = useNavigate();

  const { newModel } = useSelector(mapTrainingToState);

  const isViewDetails = isViewDetailsHash();

  const [isAsyncLoading, setIsAsyncLoading] = useState(false);

  const { data = {}, isLoading: isTrainingSessionLoading } = useQuery(
    [trainingSessionId],
    context => api.getTrainingSession(...context.queryKey),
    { enabled: !Object.keys(newModel).length }
  );

  useEffect(() => {
    if (data.new_ml_model) {
      dispatch(setNewModel(convertTrainingSessionResToNewModel(data)));
      dispatch(
        setDefectsInstancesCount({
          key: 'defectsInstancesCountAdded',
          value: data.training_session_file_set_count
        })
      );
      dispatch(setProgressValue(data.training_configuration));
    }
  }, [data.new_ml_model]);

  const { data: newModelData = {}, isLoading: isNewModelLoading } = useQuery(
    [newModel.new_ml_model],
    context => api.getMlModelByid(...context.queryKey),
    { enabled: !!newModel.new_ml_model }
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

  const prevModelApiFn = newModel.base_ml_model
    ? api.getBaseMlModelById
    : api.getMlModelByid;

  const prevModelId = newModel.base_ml_model ?? newModel.old_ml_model;

  const { data: prevModelData, isLoading: isPrevModelDataLoading } = useQuery(
    [prevModelId],
    context => prevModelApiFn(...context.queryKey),
    { enabled: !!prevModelId }
  );

  useEffect(() => {
    if (prevModelData) {
      dispatch(setOldModel(prevModelData));
    }
  }, [prevModelData]);

  const isLoading =
    isTrainingSessionLoading ||
    isNewModelLoading ||
    isPrevModelDataLoading ||
    isUseCaseLoading ||
    isAsyncLoading;

  const handleClick = async () => {
    if (!isViewDetails) {
      setIsAsyncLoading(true);

      try {
        await api.startModelTraining(trainingSessionId);

        navigate(
          `/${subscriptionId}/${packId}/library/model/training-progress/${trainingSessionId}`
        );
      } catch (err) {
        setIsAsyncLoading(false);
        toast.error(`Something went wrong.`);
      }
    } else if (newModel) {
      const params = queryString.stringify({
        contextual_filters: encodeURL(
          { date: 'ALL_DATE_RANGE', ml_model_id__in: newModel.id },
          { arrayFormat: 'comma' }
        )
      });

      navigate(
        `/${subscriptionId}/${packId}/library/model/performance/${newModel.id}?${params}`
      );
    }
  };

  const handleBackBtnClick = () => {
    navigate(
      `/${subscriptionId}/${packId}/library/model/training-configuration/${trainingSessionId}`
    );
  };

  return (
    <ModelTrainingLayout
      title='Overview of Training Details'
      isBtnDisabled={false}
      btnText={isViewDetails ? 'View Performance' : 'Train Model'}
      onClick={handleClick}
      backBtnText={isViewDetails ? null : 'Edit Training Configurations'}
      onBackBtnClick={handleBackBtnClick}
      isLoading={isLoading}
      className={classes.root}
    >
      <Box mb={2}>
        <Typography className={classes.subHeader}>
          Review Training Details
        </Typography>
      </Box>

      <Box mb={3}>
        <ModelDetails />
      </Box>

      <Show when={isViewDetails}>
        <Box mb={3}>
          <AccuracyCurvContainer />
        </Box>
      </Show>

      <Show when={isViewDetails}>
        <Box mb={2}>
          <Typography className={classes.subHeader}>
            Training Configuration
          </Typography>
        </Box>

        <Box
          mb={3}
          pt={2.75}
          px={1.25}
          pb={2}
          className={classes.tainingConfigContainer}
        >
          <TrainingConfigContainer isSliderDisabled />
        </Box>
      </Show>

      <Box mb={1.25}>
        <Typography className={classes.subHeader}>
          Review Training defect and data
        </Typography>
      </Box>

      <Box>
        <DefectDataSummary />
      </Box>
    </ModelTrainingLayout>
  );
};

export default TrainingConfiguration;
