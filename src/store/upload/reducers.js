import * as t from './constants';

const { default: initialState } = require('store/constants/initial');

function startSession(state, payload) {
  return {
    ...state,
    [payload.session]: {
      uploaded: payload.uploaded,
      total: payload.total
    }
  };
}

function setUploaded(state, payload) {
  return {
    ...state,
    [payload.session]: {
      ...state[payload.session],
      uploaded: state[payload.session].uploaded + 1
    }
  };
}

export default function uploadReducer(state = initialState.upload, action) {
  switch (action.type) {
    case t.START_SESSION:
      return startSession(state, action.payload);
    case t.SET_UPLOADED:
      return setUploaded(state, action.payload);
    case t.CLEAR_SESSION:
      return {
        ...state,
        sessions: [],
        session: [],
        metaCount: 0
      };
    case t.SET_META_UPLOAD_COUNT:
      return {
        ...state,
        metaCount: 1
      };
    case t.SET_UPLOAD_STATUS: {
      return {
        ...state,
        uploadInProgress: action.payload
      };
    }
    default:
      return state;
  }
}
