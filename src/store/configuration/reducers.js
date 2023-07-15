import initialState from 'store/constants/initial';

import * as t from './constants';

function setConfigUsecases(state, payload) {
  return {
    ...state,
    usecases: payload
  };
}

export default function (state = initialState.configuration, action) {
  switch (action.type) {
    case t.SET_SYSTEM_CONFIG_USECASES:
      return setConfigUsecases(state, action.payload);
    default:
      return state;
  }
}
