import produce from 'immer';
import { keyBy } from 'lodash';
import initialState from 'store/constants/initial';

import * as c from './constants';

export default function commonReducer(state = initialState.common, action) {
  return produce(state, draft => {
    switch (action.type) {
      case c.SET_USER_INFO: {
        draft.userInfo = action.payload;
        draft.userInfoLoaded = true;
        return draft;
      }
      case c.SET_DEFECTS: {
        draft.defects = action.defects;
        draft.defectsDict = {};
        action.defects.forEach(defect => {
          draft.defectsDict[defect.id] = defect;
        });
        draft.defectsLoaded = true;
        return draft;
      }
      case c.SET_MODELS: {
        draft.models = action.models;
        draft.modelsDict = keyBy(action.models, 'id');
        draft.modelsLoaded = true;
        return draft;
      }
      case c.SET_DEFECTS_LOADING: {
        draft.defectsLoading = action.payload;
        return draft;
      }
      case c.SET_MODELS_LOADING: {
        draft.modelsLoading = action.payload;
        return draft;
      }
      case c.SET_USER_INFO_LOADING: {
        draft.userInfoLoading = action.payload;
        return draft;
      }
      case c.SET_USE_CASE: {
        draft.useCase = action.payload;
        draft.useCaseLoaded = true;
        return draft;
      }
      case c.SET_USE_CASE_LOADING: {
        draft.useCaseLoading = action.payload;
        return draft;
      }
      case 'SET_SUBSCRIPTION_LOADED': {
        draft.subscriptionLoaded = true;
        return draft;
      }
      default: {
        return draft;
      }
    }
  });
}
