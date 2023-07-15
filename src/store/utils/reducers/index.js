import {
  actionStartType,
  actionSuccessType,
  actionFailureType,
  actionAddType,
  actionUpdateByIdType
} from '../actions';

const STATE_KEYS = { IS_LOADING: 'isLoading', DATA: 'data', ERROR: 'error' };

const getInitialState = () => ({
  [STATE_KEYS.IS_LOADING]: true,
  [STATE_KEYS.DATA]: null,
  [STATE_KEYS.ERROR]: null
});

export const createFromDefaultReducer =
  _reducerName =>
  (state = getInitialState(), action) => {
    const { type, payload } = action;

    switch (type) {
      case actionStartType(_reducerName):
        return { ...state, isLoading: true };

      case actionSuccessType(_reducerName):
        return {
          ...state,
          [STATE_KEYS.IS_LOADING]: false,
          [STATE_KEYS.DATA]: payload.data
        };

      case actionFailureType(_reducerName):
        return {
          ...state,
          [STATE_KEYS.IS_LOADING]: false,
          [STATE_KEYS.ERROR]: payload.error,
          [STATE_KEYS.DATA]: payload.data ?? null
        };

      case actionAddType(_reducerName):
        state[STATE_KEYS.DATA].results.unshift(payload);
        state[STATE_KEYS.DATA].count++;
        return { ...state };

      case actionUpdateByIdType(_reducerName):
        const data = state[STATE_KEYS.DATA].results ?? state[STATE_KEYS.DATA];
        const idx = data.findIndex(d => d.id === payload.id);
        data[idx] = { ...data[idx], ...payload };
        return { ...state };

      default:
        return state;
    }
  };
