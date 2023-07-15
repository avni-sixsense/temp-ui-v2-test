import initialState from 'store/constants/initial';

import * as t from './constants';

function setFilterQuery(state, { key, value }) {
  return {
    ...state,
    [key]: { ...state[key], ...value }
  };
}

function resetFilterQuery(state, { key }) {
  return {
    ...state,
    [key]: {}
  };
}

export default function (state = initialState.filterQuries, action) {
  switch (action.type) {
    case t.SET_FILTER_QUERY:
      return setFilterQuery(state, action.payload);
    case t.RESET_FILTER_QUERY:
      return resetFilterQuery(state, action.payload);
    default:
      return state;
  }
}
