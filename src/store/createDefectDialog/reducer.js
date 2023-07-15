import { ACTION_CONSTS, STATE_KEYS } from './constants';

const { IS_OPEN, DEFAULT_NAME } = STATE_KEYS;

const INITIAL_STATE = {
  [IS_OPEN]: false,
  [DEFAULT_NAME]: ''
};

function createDefectDialog(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_CONSTS.OPEN_CREATE_DEFECT_DIALOG:
      return { ...state, [IS_OPEN]: true, [DEFAULT_NAME]: action.payload.name };

    case ACTION_CONSTS.CLOSE_CREATE_DEFECT_DIALOG:
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}

export default createDefectDialog;
