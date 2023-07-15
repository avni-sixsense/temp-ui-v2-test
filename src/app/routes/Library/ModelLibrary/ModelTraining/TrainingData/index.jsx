import { useEffect, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { FILTER_IDS } from 'app/constants/filters';

import ModelTrainingLayout from '../components/Layout';
import { FilterUrl } from 'app/components/FiltersV2';
import ImageContainer from './components/ImageListContainer';
import InstaceCountBtn from './components/intanceCountBtn';
import TrainingModes from './components/trianingModes';
import DefectSummary from './components/defectSummary';
import { createStructuredSelector } from 'reselect';
import {
  selectAddedToTraining,
  selectNewTrainingModel,
  selectTrainingUsecase
} from 'store/modelTraining/selector';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import api from 'app/api';
import { convertTrainingSessionResToNewModel } from 'app/utils/modelTraining';
import { setModelUseCase, setNewModel } from 'store/modelTraining/actions';
import { useDispatch } from 'react-redux';

const { DATE, IMAGE_TAG, GROUND_TRUTH, REVIEWED, FOLDER, BOOKMARK } =
  FILTER_IDS;

const usestyle = makeStyles(theme => ({
  root: {
    backgroundColor: theme.colors.grey[0],
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  insetenceContainer: {
    backgroundColor: theme.colors.grey[2],
    borderRadius: '3px'
  },
  insetenceCount: {
    fontSize: '0.625rem',
    fontWeight: 500,
    color: theme.colors.grey[12]
  },
  insetenceText: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[13],
    margin: theme.spacing(0, 1)
  },
  checkboxContainer: {
    backgroundColor: theme.colors.grey[0],
    borderRadius: '2px',
    border: `1px solid ${theme.colors.grey[4]}`,
    boxShadow: theme.colors.shadow.sm
  },
  container: {
    width: 'calc(100% - 292px - 46px)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  imageContainer: {
    width: '100%',
    flex: 1
  }
}));

const mapTrainingDataState = createStructuredSelector({
  newModel: selectNewTrainingModel,
  addedToTraining: selectAddedToTraining,
  usecase: selectTrainingUsecase
});

const TrainingData = () => {
  const classes = usestyle();

  const navigate = useNavigate();
  const { subscriptionId, packId, trainingSessionId } = useParams();

  const dispatch = useDispatch();

  const { newModel, addedToTraining, usecase } =
    useSelector(mapTrainingDataState);

  const isUseCaseLoading = !Object.keys(usecase).length;

  useEffect(() => {
    if (!Object.keys(newModel ?? {}).length) {
      api.getTrainingSession(trainingSessionId).then(res => {
        dispatch(setNewModel(convertTrainingSessionResToNewModel(res)));

        if (isUseCaseLoading) {
          api.getMlModelByid(res.new_ml_model).then(({ use_case }) => {
            api.getUsecaseById(use_case).then(useCase => {
              dispatch(setModelUseCase(useCase));
            });
          });
        }
      });
    }
  }, []);

  const handleClick = () => {
    navigate(
      `/${subscriptionId}/${packId}/library/model/training-configuration/${trainingSessionId}`
    );
  };

  const handleBackBtnClick = () => {
    navigate(
      `/${subscriptionId}/${packId}/library/model/resume/${trainingSessionId}`
    );
  };

  const primaryFilters = useMemo(
    () => [DATE, IMAGE_TAG, GROUND_TRUTH, REVIEWED, FOLDER],
    []
  );
  const secondaryFilters = useMemo(() => [BOOKMARK], []);

  return (
    <ModelTrainingLayout
      title='Defects & Training Data'
      isBtnDisabled={!addedToTraining}
      btnText='Training Configuration'
      onClick={handleClick}
      backBtnText='Edit Model Details'
      onBackBtnClick={handleBackBtnClick}
      isLoading={isUseCaseLoading}
      className={classes.root}
    >
      <Box className={classes.container}>
        <Box
          mb={1.5}
          py={1}
          className={classes.modelSelector}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <TrainingModes />
        </Box>

        <Box mb={2}>
          <FilterUrl
            primaryFilters={primaryFilters}
            secondaryFilters={secondaryFilters}
            isFilterSetMetaFilters
          />
        </Box>

        <InstaceCountBtn />

        <Box className={classes.imageContainer}>
          <ImageContainer />
        </Box>
      </Box>

      <DefectSummary />
    </ModelTrainingLayout>
  );
};

export default TrainingData;
