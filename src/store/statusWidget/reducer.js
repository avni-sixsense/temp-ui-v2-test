import { ACTION_CONSTS, STATE_KEYS } from './constants';

const { IS_WIDGET_OPEN, UPLOAD_FOLDERS, UPLOAD_IDS } = STATE_KEYS;

const INITIAL_STATE = {
  [IS_WIDGET_OPEN]: false,
  [UPLOAD_FOLDERS]: {},
  [UPLOAD_IDS]: []
};

function statusWidget(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_CONSTS.TOGGLE_STATUS_WIDGET:
      return { ...state, [IS_WIDGET_OPEN]: !state[IS_WIDGET_OPEN] };

    case ACTION_CONSTS.ADD_UPLOAD_FOLDER:
      return {
        ...state,
        [UPLOAD_FOLDERS]: {
          [action.payload.session.id]: {
            ...action.payload,
            isRetry: false,
            isComplete: false,
            isError: false
          },
          ...state[UPLOAD_FOLDERS]
        }
      };

    case ACTION_CONSTS.REMOVE_UPLOAD_FOLDER:
      delete state[UPLOAD_FOLDERS][action.payload];
      return { ...state };

    case ACTION_CONSTS.SET_FOLDER_RETRY:
      state[UPLOAD_FOLDERS][action.payload] = {
        ...state[UPLOAD_FOLDERS][action.payload],
        isError: false
      };
      return {
        ...state,
        [UPLOAD_IDS]: [action.payload, ...state[UPLOAD_IDS]]
      };

    case ACTION_CONSTS.SET_FOLDER_ERROR:
      state[UPLOAD_FOLDERS][action.payload] = {
        ...state[UPLOAD_FOLDERS][action.payload],
        isError: true,
        isRetry: true
      };
      return {
        ...state,
        [UPLOAD_IDS]: state[UPLOAD_IDS].filter(d => d !== action.payload)
      };

    case ACTION_CONSTS.SET_FOLDER_UPLOAD_COMPLETE:
      state[UPLOAD_FOLDERS][action.payload] = {
        ...state[UPLOAD_FOLDERS][action.payload],
        isRetry: false,
        isError: false,
        isComplete: true
      };
      return {
        ...state,
        [UPLOAD_IDS]: state[UPLOAD_IDS].filter(d => d !== action.payload)
      };

    case ACTION_CONSTS.SET_FOLDER_UPLOAD_ID:
      return {
        ...state,
        [UPLOAD_IDS]: [action.payload, ...state[UPLOAD_IDS]]
      };

    case ACTION_CONSTS.RESET_STATUS_WIDGET:
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}

export default statusWidget;
