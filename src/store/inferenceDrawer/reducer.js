import { ACTION_CONSTS, STATE_KEYS } from './constants';

const { IS_INFERENCE_OPEN, SELECTED_INFERENCE_SESSION, IS_AI_DOWNLOAD_DRAWER } =
  STATE_KEYS;

const INITIAL_STATE = {
  [IS_INFERENCE_OPEN]: false,
  [SELECTED_INFERENCE_SESSION]: [],
  [IS_AI_DOWNLOAD_DRAWER]: false
};

function inferenceDrawer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_CONSTS.TOGGLE_INFERENCE_MODAL:
      return { ...state, [IS_INFERENCE_OPEN]: !state[IS_INFERENCE_OPEN] };

    case ACTION_CONSTS.SET_SELECTED_INFERENCE_SESSION:
      return { ...state, [SELECTED_INFERENCE_SESSION]: action.payload };

    case ACTION_CONSTS.IS_AI_DOWNLOAD_DRAWER:
      return { ...state, [IS_AI_DOWNLOAD_DRAWER]: action.payload };

    default:
      return state;
  }
}

export default inferenceDrawer;
