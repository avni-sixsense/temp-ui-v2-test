import { createSelector } from 'reselect';

import { STORE_KEYS } from '../storeKeys';
import { STATE_KEYS } from './constants';

const selectCreateDefectDialog = state =>
  state[STORE_KEYS.CREATE_DEFECT_DIALOG];

export const selectIsCreateDefectDialogOpen = createSelector(
  [selectCreateDefectDialog],
  createDefectDialog => createDefectDialog[STATE_KEYS.IS_OPEN]
);

export const selectCreateDefectDialogDefaultName = createSelector(
  [selectCreateDefectDialog],
  createDefectDialog => createDefectDialog[STATE_KEYS.DEFAULT_NAME]
);
