import api from 'app/api';

import {
  SAVE_WAFER_TABLE_STRUCTURE,
  SET_MODEL_DICT,
  SET_MODEL_DICT_LOADING,
  SET_USE_CASE_DICT,
  SET_USE_CASE_DICT_LOADING,
  SET_WAFER_DICT,
  SET_WAFER_DICT_LOADING
} from './constants';

export const setUsecaseDict = subscriptionId => {
  return dispatch => {
    dispatch({ type: SET_USE_CASE_DICT_LOADING, payload: true });
    return api
      .useCase('useCase', undefined, undefined, subscriptionId, '', true)
      .then(res => {
        dispatch({ type: SET_USE_CASE_DICT, payload: res?.results || [] });
      });
  };
};

export const setWafersDict = () => {
  return dispatch => {
    dispatch({ type: SET_WAFER_DICT_LOADING, payload: true });
    return api.getWaferMap('wafers', undefined, true).then(res => {
      dispatch({ type: SET_WAFER_DICT, payload: res?.results || [] });
    });
  };
};

export const setModelsDict = (subscriptionId, ids = []) => {
  return dispatch => {
    dispatch({ type: SET_MODEL_DICT_LOADING, payload: true });
    return api
      .getMlModels('models', subscriptionId, false, ids.join(','))
      .then(res => {
        dispatch({ type: SET_MODEL_DICT, payload: res });
      });
  };
};

export const SaveWaferTableStructure = payload => {
  return { type: SAVE_WAFER_TABLE_STRUCTURE, payload };
};
