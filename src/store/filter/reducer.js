import { FILTER_IDS } from 'app/constants/filters';
import { ACTION_CONSTS, STATE_KEYS } from './constants';

const { ALL_FILTERS, IS_FILTER_LOADING } = STATE_KEYS;

const INITIAL_STATE = {
  [ALL_FILTERS]: {},
  [IS_FILTER_LOADING]: true
};

function clearFilterById(state, id) {
  delete state[ALL_FILTERS][id];
  return { ...state, [ALL_FILTERS]: { ...state[ALL_FILTERS] } };
}

function addToMoreFilter(state, { id, name }) {
  if (!state[ALL_FILTERS][FILTER_IDS.MORE]) {
    state[ALL_FILTERS][FILTER_IDS.MORE] = {
      url_key: FILTER_IDS.MORE,
      selectedOptions: []
    };
  }

  if (
    !state[ALL_FILTERS][FILTER_IDS.MORE].selectedOptions.some(d => d.id === id)
  ) {
    state[ALL_FILTERS][FILTER_IDS.MORE].selectedOptions.push({ id, name });
  }

  return { ...state };
}

function removeFromMoreFilter(state, id) {
  state[ALL_FILTERS][FILTER_IDS.MORE].selectedOptions = state[ALL_FILTERS][
    FILTER_IDS.MORE
  ].selectedOptions.filter(d => d.id !== id);

  return {
    ...state,
    [ALL_FILTERS]: {
      ...state[ALL_FILTERS],
      [FILTER_IDS.MORE]: { ...state[ALL_FILTERS][FILTER_IDS.MORE] }
    }
  };
}

function filter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_CONSTS.SET_FILTER_VALUE: {
      const { id, url_key, selectedOptions } = action.payload;

      const isSelectedOptions =
        (Array.isArray(selectedOptions)
          ? selectedOptions.length
          : Object.keys(selectedOptions).length) > 0;

      if (isSelectedOptions) {
        return {
          ...state,
          [ALL_FILTERS]: {
            ...state[ALL_FILTERS],
            [id]: { url_key, selectedOptions }
          }
        };
      } else {
        return clearFilterById(state, id);
      }
    }

    case ACTION_CONSTS.CLEAR_FILTER_BY_ID:
      return clearFilterById(state, action.payload);

    case ACTION_CONSTS.CLEAR_FILTER_VALUES:
      return {
        ...state,
        [ALL_FILTERS]: {
          ...INITIAL_STATE[ALL_FILTERS],
          [FILTER_IDS.MORE]: state[ALL_FILTERS][FILTER_IDS.MORE]
        }
      };

    case ACTION_CONSTS.CLEAR_ALL_FILTERS:
      return { ...state, [ALL_FILTERS]: {}, [IS_FILTER_LOADING]: true };

    case ACTION_CONSTS.ADD_TO_MORE_FILTER_BY_ID:
      return addToMoreFilter(state, action.payload);

    case ACTION_CONSTS.REMOVE_FROM_MORE_FILTER_BY_ID:
      return removeFromMoreFilter(state, action.payload);

    case ACTION_CONSTS.SET_IS_FILTER_LOADING:
      return { ...state, [IS_FILTER_LOADING]: action.payload };

    default:
      return state;
  }
}

export default filter;
