import { createSelector } from 'reselect';

import { STORE_KEYS } from '../storeKeys';
import { STATE_KEYS } from './constants';

const selectInferenceDrawer = state => state[STORE_KEYS.INFERENCE_DRAWER];

export const selectIsInferenceModalOpen = createSelector(
  [selectInferenceDrawer],
  inferenceDrawer => inferenceDrawer[STATE_KEYS.IS_INFERENCE_OPEN]
);

export const selectInferenceSelectedSession = createSelector(
  [selectInferenceDrawer],
  inferenceDrawer => inferenceDrawer[STATE_KEYS.SELECTED_INFERENCE_SESSION]
);

export const selectISDownloadAiDrawer = createSelector(
  [selectInferenceDrawer],
  inferenceDrawer => inferenceDrawer[STATE_KEYS.IS_AI_DOWNLOAD_DRAWER]
);
