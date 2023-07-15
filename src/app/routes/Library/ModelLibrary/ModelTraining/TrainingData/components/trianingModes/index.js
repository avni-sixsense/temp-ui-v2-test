import UnderlineModeSelector from 'app/components/UnderlineModeSelector';
import { NumberFormater } from 'app/utils/helpers';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import {
  fetchFileSets,
  setActiveTrainingMode
} from 'store/modelTraining/actions';
import {
  ADDED_FOR_TRAINING,
  NOT_ADDED_FOR_TRAINING
} from 'store/modelTraining/constants';
import {
  selectActiveTrainingMode,
  selectAddedToTraining,
  selectNewTrainingModel,
  selectNotAddedToTraining,
  selectTrainingUsecase
} from 'store/modelTraining/selector';

const mapTrainingModeToState = createStructuredSelector({
  parentMode: selectActiveTrainingMode,
  addedToTraining: selectAddedToTraining,
  notAddedToTraining: selectNotAddedToTraining,
  newModel: selectNewTrainingModel,
  usecase: selectTrainingUsecase
});

const TrainingModes = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { subscriptionId } = useParams();

  const { parentMode, addedToTraining, notAddedToTraining, newModel, usecase } =
    useSelector(mapTrainingModeToState);

  const isModelDataPresent = Object.keys(newModel ?? {}).length > 0;

  const useCaseId = usecase.id;

  useEffect(() => {
    if (isModelDataPresent && parentMode && useCaseId) {
      dispatch(
        fetchFileSets(location.search, parentMode, subscriptionId, useCaseId)
      );
    }
  }, [location.search, parentMode, isModelDataPresent, useCaseId]);

  const handleParentModeChange = mode => {
    if (mode !== parentMode) {
      dispatch(setActiveTrainingMode(mode));
    }
  };

  const parentModesList = useMemo(
    () => [
      {
        label: ADDED_FOR_TRAINING,
        subLabel: NumberFormater(addedToTraining ?? 0)
      },
      {
        label: NOT_ADDED_FOR_TRAINING,
        subLabel: NumberFormater(notAddedToTraining ?? 0)
      }
    ],
    [addedToTraining, notAddedToTraining]
  );

  return (
    <UnderlineModeSelector
      modes={parentModesList}
      onChange={handleParentModeChange}
      active={parentMode}
    />
  );
};

export default TrainingModes;
