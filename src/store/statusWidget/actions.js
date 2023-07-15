import { ACTION_CONSTS } from './constants';

export function toggleStatusWidget() {
  return { type: ACTION_CONSTS.TOGGLE_STATUS_WIDGET };
}

export function addUploadFolder(folder) {
  return { type: ACTION_CONSTS.ADD_UPLOAD_FOLDER, payload: folder };
}

export function setFolderRetry(id) {
  return { type: ACTION_CONSTS.SET_FOLDER_RETRY, payload: id };
}

export function setFolderError(id) {
  return { type: ACTION_CONSTS.SET_FOLDER_ERROR, payload: id };
}

export function setFolderUploadComplete(id) {
  return { type: ACTION_CONSTS.SET_FOLDER_UPLOAD_COMPLETE, payload: id };
}

export function setFolderUploadId(id) {
  return { type: ACTION_CONSTS.SET_FOLDER_UPLOAD_ID, payload: id };
}

export function resetStatusWidget() {
  return { type: ACTION_CONSTS.RESET_STATUS_WIDGET };
}
