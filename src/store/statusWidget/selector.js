import { createSelector } from 'reselect';
import { STATE_KEYS } from './constants';
import { STORE_KEYS } from '../storeKeys';

const selectStatusWidget = state => state[STORE_KEYS.STATUS_WIDGET];

export const selectIsStatusWidgetOpen = createSelector(
  [selectStatusWidget],
  statusWidget => statusWidget[STATE_KEYS.IS_WIDGET_OPEN]
);

export const selectUploadIds = createSelector(
  [selectStatusWidget],
  statusWidget => statusWidget[STATE_KEYS.UPLOAD_IDS]
);

export const selectUploadFolders = createSelector(
  [selectStatusWidget],
  statusWidget => statusWidget[STATE_KEYS.UPLOAD_FOLDERS]
);

export const selectIsFolderUploadingById = id =>
  createSelector(
    [selectUploadIds],
    uploadIds => uploadIds[uploadIds.length - 1] === id
  );
