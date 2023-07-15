import { createSelector } from 'reselect';
import { selectActiveFileSet } from 'store/reviewData/selector';

const selectHelpers = state => state.helpers;

export const selectUseCaseDict = createSelector(
  [selectHelpers],
  helpers => helpers.usecases
);

export const selectWaferTableStructure = createSelector(
  [selectHelpers],
  helpers => helpers.waferTableStructure
);

export const selectUsecaseType = createSelector(
  [selectUseCaseDict, selectActiveFileSet],
  (useCaseDict, activeFileSet) => useCaseDict[activeFileSet?.use_case]?.type
);

export const selectUseCaseClassificationType = createSelector(
  [selectUseCaseDict, selectActiveFileSet],
  (useCaseDict, activeFileSet) =>
    useCaseDict[activeFileSet?.use_case]?.classification_type
);
