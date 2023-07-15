import { createSelector } from 'reselect';
import { STORE_KEYS } from '../storeKeys';
import { DEFECT_DISTRIBUTION_CONSTANTS } from './constants';

const selectAiPerformance = state => state[STORE_KEYS.AI_PERFORMANCE];

export const selectConfusionUsecase = createSelector(
  [selectAiPerformance],
  aiPerformance => aiPerformance.confusionUsecase
);

export const selectConfusionModel = createSelector(
  [selectAiPerformance],
  aiPerformance => aiPerformance.confusionModel
);

export const selectMisclassificationImagesRowIds = createSelector(
  [selectAiPerformance],
  aiPerformance => aiPerformance.misclassificationImagesRowIds
);

export const selectConfusionMatrics = createSelector(
  [selectAiPerformance],
  aiPerformance =>
    aiPerformance.defectDistribution[
      DEFECT_DISTRIBUTION_CONSTANTS.CONFUSION_MATRICS
    ]
);

export const selectMisclassificationPairs = createSelector(
  [selectAiPerformance],
  aiPerformance =>
    aiPerformance.defectDistribution[
      DEFECT_DISTRIBUTION_CONSTANTS.MISCLASSIFICATION_PAIR
    ]
);

export const selectDefectBasedDistribution = createSelector(
  [selectAiPerformance],
  aiPerformance =>
    aiPerformance.defectDistribution[
      DEFECT_DISTRIBUTION_CONSTANTS.DEFECT_BASED_DISTRIBUTION
    ]
);

export const selectFolderBasedDistribution = createSelector(
  [selectAiPerformance],
  aiPerformance =>
    aiPerformance.defectDistribution[
      DEFECT_DISTRIBUTION_CONSTANTS.FOLDER_BASED_DISTRIBUTION
    ]
);

export const selectWaferBasedDistribution = createSelector(
  [selectAiPerformance],
  aiPerformance =>
    aiPerformance.defectDistribution[
      DEFECT_DISTRIBUTION_CONSTANTS.WAFER_BASED_DISTRIBUTION
    ]
);

export const selectUsecaseDefects = createSelector(
  [selectAiPerformance],
  aiPerformance =>
    aiPerformance.defectDistribution[
      DEFECT_DISTRIBUTION_CONSTANTS.USECASE_DEFECTS
    ]
);
