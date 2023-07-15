import { getAIDefectsLabels, getGTDefects } from 'app/utils/helpers';
import { createSelector } from 'reselect';

import { STORE_KEYS } from '../storeKeys';
import { ADDED_FOR_TRAINING, NOT_ADDED_FOR_TRAINING } from './constants';

const TRAINING_MODE_STATE_KEY = {
  [ADDED_FOR_TRAINING]: 'addedToTraining',
  [NOT_ADDED_FOR_TRAINING]: 'notAddedToTraining'
};

const selectModelTraining = state => state[STORE_KEYS.MODEL_TRAINING];

export const selectTrainingActiveStep = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.activeStep
);

export const selectModelName = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.modelName
);

export const selectIsTrainingEdit = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.isEdit
);

export const selectNewTrainingModel = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.newModel
);

export const selectDefectInstancesCountAdded = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.defectsInstancesCountAdded
);

export const selectOldModel = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.oldModel
);

export const selectPendingTaskId = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.pendingTaskId
);

export const selectTrainingUsecase = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.usecase
);

export const selectTrainingConfiguration = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.trainingConfiguration
);

export const selectTrainingDataInformation = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.trainingDataInformation
);

export const selectAddedToTraining = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.addedToTraining
);

export const selectNotAddedToTraining = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.notAddedToTraining
);

export const selectSelectedDefects = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.selectedDefects
);

export const selectTrainingFilesetCount = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.count
);

export const selectTrainingFilesetDefects = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.fileSetDefects
);

export const selectActiveTrainingMode = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.activeTrainingMode
);

export const selectDefectsInstancesCount = createSelector(
  [selectModelTraining, selectActiveTrainingMode],
  (modelTraining, activeTrainingMode) =>
    activeTrainingMode === NOT_ADDED_FOR_TRAINING
      ? modelTraining.defectsInstancesCountNotAdded
      : modelTraining.defectsInstancesCountAdded
);

export const selectDefectsInstancesCountAdded = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.defectsInstancesCountAdded
);

export const selectIsTrainingDialogOpen = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.isDialogOpen
);

export const selectShouldTrainingOpen = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.shouldTrainingOpen
);

export const selectIsModelNameError = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.isSameModelNameError
);

export const selectFileSetData = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.fileSetData
);

export const selectFileSetCount = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.count
);

export const selectActiveTrainingModeCount = createSelector(
  [selectModelTraining, selectActiveTrainingMode],
  (modelTraining, activeTrainingMode) =>
    modelTraining[TRAINING_MODE_STATE_KEY[activeTrainingMode]] ?? 0
);

export const selectFetchingFileSets = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.fetchingFileSets
);

export const selectActiveImg = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.activeImg
);

export const selectSelectAll = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.selectAll
);

export const selectFileSetByIndex = index =>
  createSelector([selectFileSetData], fileSetData => fileSetData[index]);

export const selectIsSelectedByIndex = index =>
  createSelector(
    [selectActiveImg, selectSelectAll],
    (activeImg, selectAll) => selectAll || activeImg.includes(index)
  );

const selectUseCaseType = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.usecase?.type
);

export const selectGTLabelsByFileSetDefectsId = id =>
  createSelector(
    [selectTrainingFilesetDefects, selectUseCaseType],
    (fileSetDefects, usecaseType) => {
      if (usecaseType === 'CLASSIFICATION_AND_DETECTION') {
        return getGTDefects(fileSetDefects[id], usecaseType);
      }
      return getGTDefects(fileSetDefects[id]).map(d => d.name);
    }
  );

export const selectAILabelsByFileSetDefectsId = id =>
  createSelector([selectTrainingFilesetDefects], fileSetDefects =>
    getAIDefectsLabels(fileSetDefects[id]).join(', ')
  );

export const selectDialogVariant = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.dialogVariant
);

export const selectContainerMeta = createSelector(
  [selectModelTraining],
  modelTraining => modelTraining.containerMeta
);
