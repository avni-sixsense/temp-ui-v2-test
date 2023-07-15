import { ACTION_CONSTS, STATE_KEYS } from './constants';

const { IS_MODAL_OPEN, FOLDERS_UPLOAD_COUNT, SELECTED_SESSION } = STATE_KEYS;

const INITIAL_STATE = {
  [IS_MODAL_OPEN]: false,
  [FOLDERS_UPLOAD_COUNT]: 0,
  [SELECTED_SESSION]: null
};

function uploadData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_CONSTS.TOGGLE_UPLOAD_MODAL:
      return { ...state, [IS_MODAL_OPEN]: !state[IS_MODAL_OPEN] };

    case ACTION_CONSTS.SET_SELECTED_SESSION:
      return { ...state, [SELECTED_SESSION]: action.payload };

    case ACTION_CONSTS.INCREASE_FOLDERS_UPLOAD_COUNT:
      return {
        ...state,
        [FOLDERS_UPLOAD_COUNT]: state[FOLDERS_UPLOAD_COUNT] + 1
      };

    case ACTION_CONSTS.DECREASE_FOLDERS_UPLOAD_COUNT:
      return {
        ...state,
        [FOLDERS_UPLOAD_COUNT]: state[FOLDERS_UPLOAD_COUNT] - 1
      };

    default:
      return state;
  }
}

export default uploadData;
