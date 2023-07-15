import { useCallback, useEffect, useState } from 'react';

const EVENT_ID = 'onStateChange_231d2';

const event = new Event(EVENT_ID);

export const ACTION_CONSTS = {
  TOGGLE_STATUS_WIDGET: 'TOGGLE_STATUS_WIDGET',
  ADD_UPLOAD_FOLDER: 'ADD_UPLOAD_FOLDER',
  REMOVE_UPLOAD_FOLDER: 'REMOVE_UPLOAD_FOLDER',
  SET_FOLDER_RETRY: 'SET_FOLDER_RETRY',
  SET_FOLDER_ERROR: 'SET_FOLDER_ERROR',
  SET_FOLDER_UPLOAD_COMPLETE: 'SET_FOLDER_UPLOAD_COMPLETE',
  SET_FOLDER_UPLOAD_ID: 'SET_FOLDER_UPLOAD_ID',
  RESET_STATUS_WIDGET: 'RESET_STATUS_WIDGET'
};

export const STATE_KEYS = {
  IS_WIDGET_OPEN: 'isWidgetOpen',
  UPLOAD_FOLDERS: 'uploadFolders',
  UPLOAD_IDS: 'uploadIds'
};

const getInitialState = () => ({
  [STATE_KEYS.IS_WIDGET_OPEN]: false,
  [STATE_KEYS.UPLOAD_FOLDERS]: {},
  [STATE_KEYS.UPLOAD_IDS]: []
});

let state = getInitialState();

const reducer = action => {
  switch (action.type) {
    case ACTION_CONSTS.TOGGLE_STATUS_WIDGET:
      state = {
        ...state,
        [STATE_KEYS.IS_WIDGET_OPEN]: !state[STATE_KEYS.IS_WIDGET_OPEN]
      };
      break;

    case ACTION_CONSTS.ADD_UPLOAD_FOLDER:
      state = {
        ...state,
        [STATE_KEYS.UPLOAD_FOLDERS]: {
          [action.payload.session.id]: {
            ...action.payload,
            isRetry: false,
            isComplete: false,
            isError: false
          },
          ...state[STATE_KEYS.UPLOAD_FOLDERS]
        }
      };
      break;

    case ACTION_CONSTS.REMOVE_UPLOAD_FOLDER:
      delete state[STATE_KEYS.UPLOAD_FOLDERS][action.payload];
      state = { ...state };
      break;

    case ACTION_CONSTS.SET_FOLDER_RETRY:
      state[STATE_KEYS.UPLOAD_FOLDERS][action.payload] = {
        ...state[STATE_KEYS.UPLOAD_FOLDERS][action.payload],
        isError: false
      };
      state = {
        ...state,
        [STATE_KEYS.UPLOAD_IDS]: [
          action.payload,
          ...state[STATE_KEYS.UPLOAD_IDS]
        ]
      };
      break;

    case ACTION_CONSTS.SET_FOLDER_ERROR:
      state[STATE_KEYS.UPLOAD_FOLDERS][action.payload] = {
        ...state[STATE_KEYS.UPLOAD_FOLDERS][action.payload],
        isError: true,
        isRetry: true
      };
      state = {
        ...state,
        [STATE_KEYS.UPLOAD_IDS]: state[STATE_KEYS.UPLOAD_IDS].filter(
          d => d !== action.payload
        )
      };
      break;

    case ACTION_CONSTS.SET_FOLDER_UPLOAD_COMPLETE:
      state[STATE_KEYS.UPLOAD_FOLDERS][action.payload] = {
        ...state[STATE_KEYS.UPLOAD_FOLDERS][action.payload],
        isRetry: false,
        isError: false,
        isComplete: true
      };
      state = {
        ...state,
        [STATE_KEYS.UPLOAD_IDS]: state[STATE_KEYS.UPLOAD_IDS].filter(
          d => d !== action.payload
        )
      };
      break;

    case ACTION_CONSTS.SET_FOLDER_UPLOAD_ID:
      state = {
        ...state,
        [STATE_KEYS.UPLOAD_IDS]: [
          action.payload,
          ...state[STATE_KEYS.UPLOAD_IDS]
        ]
      };
      break;

    case ACTION_CONSTS.RESET_STATUS_WIDGET:
      state = getInitialState();
      break;

    default:
      break;
  }

  document.dispatchEvent(event);
};

function toggleStatusWidget() {
  return { type: ACTION_CONSTS.TOGGLE_STATUS_WIDGET };
}

function addUploadFolder(folder) {
  return { type: ACTION_CONSTS.ADD_UPLOAD_FOLDER, payload: folder };
}

function setFolderRetry(id) {
  return { type: ACTION_CONSTS.SET_FOLDER_RETRY, payload: id };
}

function setFolderError(id) {
  return { type: ACTION_CONSTS.SET_FOLDER_ERROR, payload: id };
}

function setFolderUploadComplete(id) {
  return { type: ACTION_CONSTS.SET_FOLDER_UPLOAD_COMPLETE, payload: id };
}

function setFolderUploadId(id) {
  return { type: ACTION_CONSTS.SET_FOLDER_UPLOAD_ID, payload: id };
}

function resetStatusWidget() {
  return { type: ACTION_CONSTS.RESET_STATUS_WIDGET };
}

const useFloatingStatusWidgetState = (subscribeToStateChange = false) => {
  const [, f] = useState({});

  const handleStateChange = useCallback(() => {
    f({});
  }, []);

  useEffect(() => {
    if (subscribeToStateChange) {
      document.addEventListener(EVENT_ID, handleStateChange);

      return () => {
        document.removeEventListener(EVENT_ID, handleStateChange);
      };
    }
  }, []);

  const dispatch = action => {
    reducer(action);
  };

  return [
    state,
    dispatch,
    {
      toggleStatusWidget,
      addUploadFolder,
      setFolderRetry,
      setFolderError,
      setFolderUploadComplete,
      setFolderUploadId,
      resetStatusWidget
    }
  ];
};

export default useFloatingStatusWidgetState;
