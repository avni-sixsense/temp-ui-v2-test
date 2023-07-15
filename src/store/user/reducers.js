import { ACTION_CONSTS, STATE_KEYS } from './constants';

const { ACCESS_TOKEN } = STATE_KEYS;

const INITIAL_STATE = {
  [ACCESS_TOKEN]: null
};

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_CONSTS.SET_TOKEN:
      return { ...state, [ACCESS_TOKEN]: action.payload };

    default:
      return state;
  }
};

export default user;
