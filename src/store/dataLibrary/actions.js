import {
  SAVE_SUBSCRIPTION,
  SAVE_TABLE_STRUCTURE,
  SAVE_UPLOAD_SESSIONS,
  SET_ACTIVE_INFO_HEADER
} from './constants';

export const SaveTableStructure = payload => {
  return { type: SAVE_TABLE_STRUCTURE, payload };
};

export const SaveUploadSessions = payload => {
  return { type: SAVE_UPLOAD_SESSIONS, payload };
};

export const SaveSubscription = payload => {
  return { type: SAVE_SUBSCRIPTION, payload };
};
export function changeInfoHeader(payload) {
  return { type: SET_ACTIVE_INFO_HEADER, payload };
}
