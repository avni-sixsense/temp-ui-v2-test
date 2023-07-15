import { keyBy } from 'lodash';
import initialState from 'store/constants/initial';

import * as t from './constants';

const setUsecaseDict = (state, payload) => {
  const dict = keyBy(payload, 'id');
  return {
    ...state,
    usecases: dict,
    usecasesLoading: false
  };
};

const setWafersDict = (state, payload) => {
  const dict = keyBy(payload, 'id');
  return {
    ...state,
    wafers: dict,
    wafersLoading: false
  };
};

const setModelDict = (state, payload) => {
  const dict = keyBy(payload, 'id');
  return {
    ...state,
    models: dict,
    modelLoading: false
  };
};

const setUsecaseDictLoading = (state, payload) => {
  return {
    ...state,
    usecasesLoading: payload
  };
};

const setWafersDictLoading = (state, payload) => {
  return {
    ...state,
    wafersLoading: payload
  };
};

const setModelDictLoading = (state, payload) => {
  return {
    ...state,
    modelLoading: payload
  };
};

const setWaferTableStructure = (state, payload) => {
  if (Array.isArray(payload)) {
    return {
      ...state,
      waferTableStructure: payload
    };
  }
  return state;
};

export default function (state = initialState.helpers, action) {
  switch (action.type) {
    case t.SET_USE_CASE_DICT:
      return setUsecaseDict(state, action.payload);
    case t.SET_WAFER_DICT:
      return setWafersDict(state, action.payload);
    case t.SET_MODEL_DICT:
      return setModelDict(state, action.payload);
    case t.SET_USE_CASE_DICT_LOADING:
      return setUsecaseDictLoading(state, action.payload);
    case t.SET_WAFER_DICT_LOADING:
      return setWafersDictLoading(state, action.payload);
    case t.SET_MODEL_DICT_LOADING:
      return setModelDictLoading(state, action.payload);
    case t.SAVE_WAFER_TABLE_STRUCTURE:
      return setWaferTableStructure(state, action.payload);
    default:
      return state;
  }
}
