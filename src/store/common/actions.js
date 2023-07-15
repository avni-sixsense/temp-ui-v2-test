/* eslint-disable import/prefer-default-export */
import api from 'app/api';

import * as c from './constants';

export function setUserInfo(payload) {
  return { type: c.SET_USER_INFO, payload };
}

export function setUserInfoLoading(payload) {
  return { type: c.SET_USER_INFO_LOADING, payload };
}

export function getUserInfo() {
  return function (dispatch) {
    dispatch(setUserInfoLoading(true));
    return api
      .getUserInfo()
      .then(_ => {
        dispatch(setUserInfo(_));
      })
      .finally(() => {
        dispatch(setUserInfoLoading(false));
      });
  };
}

export function setModels(payload) {
  return { type: c.SET_MODELS, models: payload };
}

export function setModelsLoading(payload) {
  return { type: c.SET_MODELS_LOADING, payload };
}

export function getModels(subscriptionId) {
  return function (dispatch) {
    dispatch(setModelsLoading(true));
    return api
      .getMlModels('', subscriptionId, false)
      .then(_ => {
        dispatch(setModels(_?.results || []));
      })
      .finally(() => {
        dispatch(setModelsLoading(false));
      });
  };
}

export function updateModelList(subscriptionId) {
  return function (dispatch) {
    return api
      .getMlModels('', subscriptionId, false)
      .then(_ => {
        dispatch(setModels(_?.results || []));
      })
      .finally(() => {
        dispatch(setModelsLoading(false));
      });
  };
}

export function setDefects(payload) {
  return { type: c.SET_DEFECTS, defects: payload };
}

export function setDefectsLoading(payload) {
  return { type: c.SET_DEFECTS_LOADING, payload };
}

export function getDefects() {
  return function (dispatch) {
    dispatch(setDefectsLoading(true));
    return api
      .getDefects('')
      .then(_ => {
        dispatch(setDefects(_));
      })
      .finnaly(() => {
        dispatch(setDefectsLoading(false));
      });
  };
}

export function setUseCase(payload) {
  return { type: c.SET_USE_CASE, payload };
}

export function setUseCaseLoading(payload) {
  return { type: c.SET_USE_CASE_LOADING, payload };
}

export function getUseCase() {
  return function (dispatch) {
    dispatch(setUseCaseLoading(true));
    return api
      .useCase('')
      .then(_ => {
        dispatch(setUseCase(_));
      })
      .finally(() => {
        dispatch(setUseCaseLoading(false));
      });
  };
}
