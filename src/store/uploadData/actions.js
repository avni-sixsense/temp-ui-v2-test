import { ACTION_CONSTS } from './constants';

export function toggleUploadDataModal() {
  return { type: ACTION_CONSTS.TOGGLE_UPLOAD_MODAL };
}

export function setSelectedSession(data) {
  return { type: ACTION_CONSTS.SET_SELECTED_SESSION, payload: data };
}

export function increaseFoldersUploadCount() {
  return { type: ACTION_CONSTS.INCREASE_FOLDERS_UPLOAD_COUNT };
}

export function decreaseFoldersUploadCount() {
  return { type: ACTION_CONSTS.DECREASE_FOLDERS_UPLOAD_COUNT };
}
