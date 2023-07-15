import { combineReducers } from 'redux';

import actionButtons from 'store/actionButtons/reducer';
import aiPerformance from 'store/aiPerformance/reducers';
import allUploads from 'store/allUploads/reducer';
import configuration from 'store/configuration/reducers';
import dataLibrary from 'store/dataLibrary/reducer';
import defectLibrary from 'store/defectLibrary/reducer';
import filterQuries from 'store/filterQueries/reducers';
import filterReducer from 'store/filters/reducer';
import modelLibrary from 'store/modelLibrary/reducer';
import modelTraining from 'store/modelTraining/reducers';
import notifications from 'store/notifications/reducer';
import reviewReducer from 'store/reviewData/reducers';
import TaskQueue from 'store/taskQueue/reducer';
import uploadReducer from 'store/upload/reducers';
import uploadData from 'store/uploadData/reducer';
import useCaseLibrary from 'store/useCase/reducer';
import statusWidget from 'store/statusWidget/reducer';
import user from 'store/user/reducers';
import filter from 'store/filter/reducer';
import createDefectDialog from './createDefectDialog/reducer';

import commonReducer from './common/reducer';
import helpers from './helpers/reducer';
import inferenceDrawer from './inferenceDrawer/reducer';
import { STORE_KEYS } from './storeKeys';
import { createFromDefaultReducer } from './utils/reducers';
import * as actionTypes from './utils/actions/types';

const allReducers = combineReducers({
  upload: uploadReducer,
  dataLibrary,
  allUploads,
  modelLibrary,
  defectLibrary,
  useCaseLibrary,
  actionButtons,
  notifications,
  [STORE_KEYS.REVIEW_DATA]: reviewReducer,
  filters: filterReducer,
  common: commonReducer,
  aiPerformance,
  configuration,
  helpers,
  TaskQueue,
  filterQuries,
  [STORE_KEYS.UPLOAD_DATA]: uploadData,
  [STORE_KEYS.STATUS_WIDGET]: statusWidget,
  [STORE_KEYS.INFERENCE_DRAWER]: inferenceDrawer,
  [STORE_KEYS.USER]: user,
  [STORE_KEYS.MODEL_TRAINING]: modelTraining,
  [STORE_KEYS.FILTER]: filter,
  [STORE_KEYS.CREATE_DEFECT_DIALOG]: createDefectDialog,
  [STORE_KEYS.USE_CASE]: combineReducers({
    list: createFromDefaultReducer(actionTypes.FETCH_USE_CASE_LIST)
  })
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined;
  }

  return allReducers(state, action);
};

export default rootReducer;
