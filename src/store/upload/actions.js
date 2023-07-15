import * as t from './constants';

export function startSession(payload) {
  return {
    type: t.START_SESSION,
    payload
  };
}

export function setTotal(payload) {
  return {
    type: t.SET_TOTAL,
    payload
  };
}

export function setUploaded(payload) {
  return {
    type: t.SET_UPLOADED,
    payload
  };
}
export function clearSession() {
  return {
    type: t.CLEAR_SESSION
  };
}

export function setMetaUploadCount() {
  return {
    type: t.SET_META_UPLOAD_COUNT
  };
}

export function setUploadStatus(payload) {
  return {
    type: t.SET_UPLOAD_STATUS,
    payload
  };
}
