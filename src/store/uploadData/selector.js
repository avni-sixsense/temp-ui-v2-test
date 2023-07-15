import { createSelector } from 'reselect';
import { STATE_KEYS } from './constants';
import { STORE_KEYS } from '../storeKeys';

const selectUploadData = state => state[STORE_KEYS.UPLOAD_DATA];

export const selectIsUploadDataModalOpen = createSelector(
  [selectUploadData],
  uploadData => uploadData[STATE_KEYS.IS_MODAL_OPEN]
);

export const selectFoldersUploadCount = createSelector(
  [selectUploadData],
  uploadData => uploadData[STATE_KEYS.FOLDERS_UPLOAD_COUNT]
);

export const selectSelectedSession = createSelector(
  [selectUploadData],
  uploadData => uploadData[STATE_KEYS.SELECTED_SESSION]
);
