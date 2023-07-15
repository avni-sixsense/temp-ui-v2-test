import api from 'app/api';
import { formatFileSetData, updateNextDataURL } from 'app/utils/helpers';
import store from 'store';

import queryString from 'query-string';

import {
  REMOVE_SELECTED_FILES,
  RESET_RADIO_CONFIG,
  RESET_TRAINING,
  SET_ACTIVE_IMG,
  SET_ACTIVE_TRAINING_MODE,
  SET_DIALOG_OPEN,
  SET_DIALOG_VARIANT,
  SET_EDIT_MODE,
  SET_EPOCH_COUNT,
  SET_FILE_SET_COUNT,
  SET_FILE_SET_DATA,
  SET_DEFECT_INSTANCES_COUNT,
  SET_FILE_SET_DEFECTS,
  SET_FILE_SET_DEFECTS_LOADING,
  SET_IMAGE_RESOLUTION,
  SET_IS_VIEW_DETAILS,
  SET_MODEL_LIB_ACTIVE_STEP,
  SET_MODEL_NAME,
  SET_MODEL_USECASE,
  SET_NEW_MODEL,
  SET_OLD_MODEL,
  SET_PENDING_TASK_ID,
  SET_RADIO_CONFIG,
  SET_SAME_MODEL_NAME_ERROR,
  SET_SELECT_ALL,
  SET_SELECTED_DEFECTS,
  SET_SHOULD_TRAINING_OPEN,
  SET_TRAINING_CONFIG,
  SET_TRAINING_COUNT,
  SET_TRAINING_DATA_INFORMATION,
  SET_TRAINING_PROGRESS_VALUE,
  SET_FETCHING_TRAINING_FILESETS,
  SET_TRAINING_FILESET_NEXT_API,
  ADDED_FOR_TRAINING,
  NOT_ADDED_FOR_TRAINING,
  SET_MODEL_TRAINING_CONTAINER_META,
  RESET_MODEL_TRAINING
} from './constants';

const TRAINING_MODE_STATUS = {
  [ADDED_FOR_TRAINING]: 'TRAIN,TEST,VALIDATION,',
  [NOT_ADDED_FOR_TRAINING]: 'NOT_TRAINED'
};

export function setActiveStep(payload) {
  return { type: SET_MODEL_LIB_ACTIVE_STEP, payload };
}

export function setModelName(payload) {
  return { type: SET_MODEL_NAME, payload };
}

export function setNewModel(payload) {
  return { type: SET_NEW_MODEL, payload };
}

export function setEditMode(payload) {
  return { type: SET_EDIT_MODE, payload };
}

export function setDialogOpen(payload) {
  return { type: SET_DIALOG_OPEN, payload };
}

export function setDialogVariant(payload) {
  return { type: SET_DIALOG_VARIANT, payload };
}

export function resetTraining() {
  return { type: RESET_TRAINING };
}

export function setActiveImg(payload) {
  return { type: SET_ACTIVE_IMG, payload };
}

export function setSelectAll(payload) {
  return { type: SET_SELECT_ALL, payload };
}

export function setFileSetData(payload) {
  return { type: SET_FILE_SET_DATA, payload };
}

export function setDefectsInstancesCount(payload) {
  return { type: SET_DEFECT_INSTANCES_COUNT, payload };
}
export function setFileSetCount(payload) {
  return { type: SET_FILE_SET_COUNT, payload };
}

export function setModelUseCase(payload) {
  return { type: SET_MODEL_USECASE, payload };
}

export function setOldModel(payload) {
  return { type: SET_OLD_MODEL, payload };
}

export function setSelectedDefects(payload) {
  return { type: SET_SELECTED_DEFECTS, payload };
}

export function setSameModelNameError(payload) {
  return { type: SET_SAME_MODEL_NAME_ERROR, payload };
}

export function setFileSetDefectsLoading() {
  return { type: SET_FILE_SET_DEFECTS_LOADING, payload: true };
}

export function fetchFileSetDefects(fileSetFilters, modelFilters) {
  return dispatch => {
    dispatch(setFileSetDefectsLoading());
    api
      .annotationDefectsByFileSet(fileSetFilters, modelFilters)
      .then(res => {
        dispatch({ type: SET_FILE_SET_DEFECTS, payload: res || {} });
      })
      .catch(() => {
        dispatch({ type: SET_FILE_SET_DEFECTS, payload: {} });
      });
  };
}

export function getDefect(ids = [], modelId) {
  return dispatch => {
    const encodedFilesetFilters = btoa(`id__in=${ids.join(',')}`);
    let encodedModelFilter = btoa(`model_selection=latest`);

    if (modelId) {
      encodedModelFilter = btoa(`ml_model_id__in=${modelId}`);
    }

    dispatch(fetchFileSetDefects(encodedFilesetFilters, encodedModelFilter));
  };
}

export function setActiveTrainingMode(payload) {
  return { type: SET_ACTIVE_TRAINING_MODE, payload };
}

export function removeSelectedFiles() {
  return { type: REMOVE_SELECTED_FILES };
}

export function setPendingTaskId(payload) {
  return { type: SET_PENDING_TASK_ID, payload };
}

export function setShouldTrainingOpen(payload) {
  return { type: SET_SHOULD_TRAINING_OPEN, payload };
}

export const setTrainingFilesCount = payload => {
  return {
    type: SET_TRAINING_COUNT,
    payload
  };
};

export function setConfigRadio(payload) {
  return { type: SET_RADIO_CONFIG, payload };
}

export function setProgressValue(payload) {
  return { type: SET_TRAINING_PROGRESS_VALUE, payload };
}

export function setEpochCount(payload) {
  return { type: SET_EPOCH_COUNT, payload };
}

export function setImageResolution(payload) {
  return { type: SET_IMAGE_RESOLUTION, payload };
}

export function resetConfigRadio() {
  return { type: RESET_RADIO_CONFIG };
}

export function setTrainingDataInformation(payload) {
  return { type: SET_TRAINING_DATA_INFORMATION, payload };
}

export function setIsViewDetails(payload) {
  return { type: SET_IS_VIEW_DETAILS, payload };
}

export function setFetchingTrainingFilesets(payload) {
  return { type: SET_FETCHING_TRAINING_FILESETS, payload };
}

export function setTrainingFileSetNextApi(payload) {
  return { type: SET_TRAINING_FILESET_NEXT_API, payload };
}

export function setTrainingFileSet(payload) {
  return dispatch => {
    const { data, isNewData } = payload;
    const filteredData = formatFileSetData(data);

    if (filteredData.length) {
      dispatch(getDefect(filteredData.map(x => x.fileSetId)));
    }

    dispatch(setFileSetData({ data: filteredData, isNewData }));
  };
}

export function trainingFilesetDataFetcher(suffix, modelId, subId) {
  // eslint-disable-next-line func-names
  return function (dispatch) {
    return api
      .getFileSets('', 50, undefined, subId, `${suffix}&cursor=`)
      .then(res => {
        dispatch(setTrainingFileSetNextApi(updateNextDataURL(res.next)));

        dispatch(
          setTrainingFileSet({
            data: res.results ?? [],
            isNewData: true,
            modelId
          })
        );
      });
  };
}

const getFilesetCount = async (subId, params) => {
  const { count } = await api.getFileSets('', 1, 0, subId, params);
  return count;
};

export const getTrainingFileSetApiParams = (
  locationParams,
  mode,
  removeOtherFilters = false
) => {
  const { newModel } = store.getState().modelTraining;
  let finalParams = locationParams;

  if (removeOtherFilters) {
    const params = queryString.parse(finalParams);
    delete params.other_filters;
    finalParams = queryString.stringify(params);
  }

  return `${finalParams}&train_type__in=${
    TRAINING_MODE_STATUS[mode]
  }&training_ml_model__in=${newModel.id}${
    mode === ADDED_FOR_TRAINING ? '' : '&is_gt_classified=true'
  }`;
};

export function setTrainingCount(locationParam, subId, useCaseId) {
  locationParam += `&use_case_id__in=${useCaseId}`;

  return async (dispatch, getState) => {
    const addedRes = await api.getFileSets(
      'addedToTrainingFileCount',
      1,
      0,
      subId,
      getTrainingFileSetApiParams(locationParam, ADDED_FOR_TRAINING, true)
    );

    const notAddedRes = await api.getFileSets(
      'notAddedToTrainingFileCount',
      1,
      0,
      subId,
      getTrainingFileSetApiParams(locationParam, NOT_ADDED_FOR_TRAINING, true)
    );

    const { activeTrainingMode } = getState().modelTraining;

    const fileSetCount = await getFilesetCount(
      subId,
      getTrainingFileSetApiParams(
        locationParam,
        activeTrainingMode,
        false,
        subId
      )
    );

    dispatch(setFileSetCount(fileSetCount));

    dispatch(
      setTrainingFilesCount({
        addedToTraining: addedRes.count,
        notAddedToTraining: notAddedRes.count
      })
    );
  };
}

export const fetchFileSets = (
  locationParam,
  activeImageMode,
  subId,
  useCaseId
) => {
  return async dispatch => {
    dispatch(setFetchingTrainingFilesets(true));

    dispatch(setTrainingCount(locationParam, subId, useCaseId));

    locationParam += `&use_case_id__in=${useCaseId}`;

    dispatch(
      trainingFilesetDataFetcher(
        getTrainingFileSetApiParams(
          locationParam,
          activeImageMode,
          false,
          subId
        ),
        undefined,
        subId
      )
    );
  };
};

export function setContainerMeta(payload) {
  return { type: SET_MODEL_TRAINING_CONTAINER_META, payload };
}

export function resetModelTraining() {
  return { type: RESET_MODEL_TRAINING };
}
