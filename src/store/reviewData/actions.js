import api from 'app/api';
import { DEFECT_HOT_KEYS, GLOBAL_CONSTS } from 'app/utils/constants';
import {
  encodeString,
  encodeURL,
  getDateFromParams,
  getParamsFromEncodedString,
  updateNextDataURL
} from 'app/utils/helpers';
import {
  getCurrentModelFromState,
  handleOtherDefectChange
} from 'app/utils/reviewData';
import { toast } from 'react-toastify';
import store from 'store';
import { setFilterQuery } from 'store/filterQueries/actions';
import {
  AI_OUTPUT_FILTER,
  GROUND_TRUTH_FILTER
} from 'store/filterQueries/constants';

import {
  AUDIT,
  CLEAR_AI_DEFECTS,
  CLEAR_REVIEW_DEFECTS,
  CLEAR_USER_CLASSIFICATION,
  FETCHING_REVIEW_DATA,
  MANUAL_CLASSIFY,
  REMOVE_FILE_SET_BY_IDS,
  RESET_REVIEW_DATA,
  SET_ACTIVE_GRID_MODE,
  SET_ACTIVE_IMAGE_MODE,
  SET_ACTIVE_IMG,
  SET_AI_DEFECTS,
  SET_ANNOTATOR_INPUT,
  SET_CONTAINER_META,
  SET_FILE_SET_DEFECTS_BY_ID,
  SET_FILE_SET_DEFECTS_LOADING,
  SET_IMAGE_MODES,
  SET_MODEL_DETECTION_LIST,
  SET_APPLIED_FOR_ALL_MODEL_ID,
  SET_MODEL_OUTPUT_LIST,
  SET_OTHER_DEFECTS,
  SET_PARAMS,
  SET_REVIEW_DATA,
  SET_REVIEW_DATA_COUNT,
  SET_REVIEW_DATA_NEXT_API,
  SET_REVIEW_DEFECTS,
  SET_REVIEW_IMAGE_POSITIVE_COUNT,
  SET_SELECT_ALL,
  SET_SELECTED_TOOL,
  SET_SORTING,
  SET_TASK_ID,
  SET_UPLOAD_SESSION_ID,
  SET_USE_AI_ASSISTANCE,
  SET_USER_CLASSIFICATION,
  SET_USER_DETECTION_LIST,
  UPDATE_FILESET_BY_ID,
  UPDATE_IMAGE_MODES,
  UPDATE_REVIEW_DATA,
  UPDATE_USER_CLASSIFICATION_BY_ID,
  SET_REVIEW_MODEL_DICT,
  REMOVE_GT_DEFECT,
  Review,
  SET_BULK_CLASSIFICATION_UPDATING,
  SET_SEARCH_TEXT,
  SORTING_CONSTANTS
} from './constants';

const FILE_SET_COUNT_API_PARAMS_ANNOTATION_TYPE = {
  [AUDIT]: `&is_confident_defect=true`,
  [MANUAL_CLASSIFY]: `&model_selection=latest`
};

const getFileSetApiParamAnnotationType = (type, active, isFetchingTotal) => {
  if (isFetchingTotal && type === AUDIT) {
    return `&is_confident_defect=true`;
  }
  if (isFetchingTotal) return '';

  if (type === AUDIT) {
    return `&is_audited=${active === 'Audited'}`;
  }
  if (type === MANUAL_CLASSIFY) {
    return `&is_ai_or_gt_classified=${active === 'Classified'}`;
  }
  return '';
};

export const getApiParams = (
  locationParam,
  annotationType,
  searchParams,
  isFetchingTotal
) => {
  const { activeImageMode } = store.getState().review;
  let params = locationParam;
  if (annotationType === AUDIT || annotationType === MANUAL_CLASSIFY) {
    params = params.concat(
      getFileSetApiParamAnnotationType(
        annotationType,
        activeImageMode,
        isFetchingTotal
      )
    );
  }
  if (searchParams) {
    params = params.concat(`&files__name__icontains=${searchParams}`);
  }
  return params;
};

export function setReviewData(payload) {
  return dispatch => {
    const { data, isNewData, modelId } = payload;
    const filteredData = [];
    data.forEach(item => {
      const { metaInfo } = item;
      const sessionid = item.upload_session;
      const folder = item.upload_session_name;
      item.files.forEach(el => {
        const temp = {
          ...item,
          ...el,
          ...metaInfo
        };
        temp.id = el.id;
        temp.fileSetId = el.file_set;
        temp.Images = el.url;
        temp.src = el.url;
        temp.Folder = folder;
        temp.sessionId = sessionid;
        filteredData.push(temp);
      });
    });
    // TODO: THINK ABOUT IT FOR BETTER APPROACH
    // const tempFilteredId = filteredData.map((x) => x.fileSetId)
    // const tempDefectKeys = Object.keys(fileSetDefects)
    // if (!tempFilteredId.every((val) => tempDefectKeys.includes(val))) {
    // 	dispatch(
    // 		getDefect(
    // 			filteredData.map((x) => x.fileSetId),
    // 			getFileSetDefectsFields(annotationType, activeImageMode === 'Classified')
    // 		)
    // 	)
    // }
    if (filteredData.length) {
      dispatch(
        getDefect(
          filteredData.map(x => x.fileSetId),
          modelId
        )
      );
    }
    dispatch({
      type: SET_REVIEW_DATA,
      payload: { data: filteredData, isNewData }
    });
  };
}

export function setFetchingReviewData(payload) {
  return { type: FETCHING_REVIEW_DATA, payload };
}

export function changeGridMode(payload) {
  return { type: SET_ACTIVE_GRID_MODE, payload };
}

export function setImageModes(payload) {
  return { type: SET_IMAGE_MODES, payload };
}

export function changeImageMode(payload) {
  return { type: SET_ACTIVE_IMAGE_MODE, payload };
}

export function setActiveImg(payload) {
  return { type: SET_ACTIVE_IMG, payload };
}

export function setPositiveFileCount(payload) {
  return { type: SET_REVIEW_IMAGE_POSITIVE_COUNT, payload };
}

export function reviewDataFetcher(suffix, modelId, subscriptionId) {
  // eslint-disable-next-line func-names
  return function (dispatch) {
    return api
      .getFileSets(
        '',
        50,
        [
          SORTING_CONSTANTS.SIMILARITY,
          'files__gt_classifications__defects__name',
          SORTING_CONSTANTS.AI_OUTPUT
        ].some(item => suffix.includes(item))
          ? 0
          : undefined,
        subscriptionId,
        `${suffix}${
          [
            SORTING_CONSTANTS.SIMILARITY,
            'files__gt_classifications__defects__name',
            SORTING_CONSTANTS.AI_OUTPUT
          ].some(item => suffix.includes(item))
            ? ''
            : '&cursor='
        }`,
        modelId
      )
      .then(res => {
        dispatch(setReviewDataNextApi(updateNextDataURL(res.next)));

        dispatch(
          setReviewData({
            data: res.results ?? [],
            isNewData: true,
            modelId
          })
        );

        const [firstFileSet] = res.results;

        if (firstFileSet) {
          dispatch(
            setFilterQuery({
              key: AI_OUTPUT_FILTER,
              value: { use_case_id__in: firstFileSet.use_case }
            })
          );
          dispatch(
            setFilterQuery({
              key: GROUND_TRUTH_FILTER,
              value: { use_case_id__in: firstFileSet.use_case }
            })
          );
        }
      });
  };
}

export function setReviewDataCount(payload) {
  return { type: SET_REVIEW_DATA_COUNT, payload };
}

export function resetReviewData() {
  return { type: RESET_REVIEW_DATA };
}

export function setUploadSession(payload) {
  return { type: SET_UPLOAD_SESSION_ID, payload };
}

export function setParams(payload) {
  return { type: SET_PARAMS, payload };
}

export function updateReviewData(payload) {
  return { type: UPDATE_REVIEW_DATA, payload };
}

export function setReviewDataNextApi(payload) {
  return { type: SET_REVIEW_DATA_NEXT_API, payload };
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
        dispatch({ type: SET_REVIEW_DEFECTS, payload: res || {} });
      })
      .catch(() => {
        dispatch({ type: SET_REVIEW_DEFECTS, payload: {} });
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

export function removeGtDefect({ fileId, defectId }) {
  return { type: REMOVE_GT_DEFECT, payload: { fileId, defectId } };
}

export function clearReviewDefects() {
  return { type: CLEAR_REVIEW_DEFECTS, payload: {} };
}

export function removeFileSet(data) {
  return { type: REMOVE_FILE_SET_BY_IDS, payload: data };
}

export function updateImageModes(data) {
  return { type: UPDATE_IMAGE_MODES, payload: data };
}

export function setFileSetDefectsById(payload) {
  return { type: SET_FILE_SET_DEFECTS_BY_ID, payload };
}

export function setUserClassification(payload) {
  return { type: SET_USER_CLASSIFICATION, payload };
}

export function updateUserClassificationById(payload) {
  return { type: UPDATE_USER_CLASSIFICATION_BY_ID, payload };
}

export function clearUserClassification(payload) {
  return { type: CLEAR_USER_CLASSIFICATION, payload };
}

export function setSelectedTool(payload) {
  return { type: SET_SELECTED_TOOL, payload };
}

export function setAnnotatorInput(payload) {
  return { type: SET_ANNOTATOR_INPUT, payload };
}

export function setAppliedForAllModelId(payload) {
  return { type: SET_APPLIED_FOR_ALL_MODEL_ID, payload };
}

export function setUseAIAssistance(payload) {
  return { type: SET_USE_AI_ASSISTANCE, payload };
}

export function setModelVisibilityObj(payload) {
  return { type: SET_MODEL_OUTPUT_LIST, payload };
}

export function setUserDetectionList(payload) {
  return { type: SET_USER_DETECTION_LIST, payload };
}

export function setModelDetectionList(payload) {
  return { type: SET_MODEL_DETECTION_LIST, payload };
}

export function setReviewModelsDict(payload) {
  return { type: SET_REVIEW_MODEL_DICT, payload };
}

export function setAiDefects(payload) {
  return { type: SET_AI_DEFECTS, payload };
}

export function clearAiDefects() {
  return { type: CLEAR_AI_DEFECTS };
}

export function setTaskId(payload) {
  return { type: SET_TASK_ID, payload };
}

export function updateFilsetById(payload) {
  return { type: UPDATE_FILESET_BY_ID, payload };
}

export function setOtherDefects(payload) {
  payload
    .filter(item => item.hot_key)
    .forEach(item => (DEFECT_HOT_KEYS[item.hot_key] = item));

  return { type: SET_OTHER_DEFECTS, payload };
}

export function setSorting(payload) {
  return { type: SET_SORTING, payload };
}

export function setSelectAll(payload) {
  return { type: SET_SELECT_ALL, payload };
}

export function setContainerMeta(payload) {
  return { type: SET_CONTAINER_META, payload };
}

const getFilesetCount = async (subId, params, modelId) => {
  const { count } = await api.getFileSets('', 1, 0, subId, params, modelId);
  return count;
};

const setImageModesCount = (type, active, count) => {
  return dispatch => {
    if (
      (type === AUDIT && active === 'Audited') ||
      (type === MANUAL_CLASSIFY && active === 'Classified')
    ) {
      dispatch(setPositiveFileCount({ isLeftCount: false, count }));
    } else {
      dispatch(setPositiveFileCount({ isLeftCount: true, count }));
    }
  };
};

const checkIfSingleAutoModel = params => {
  return dispatch => {
    api.checkDistinctAutoModel(params).then(res => {
      const { appliedForAllModelId } = store.getState().review;
      if (!appliedForAllModelId && res['model-availability'])
        dispatch(setAppliedForAllModelId(res['distinct_models'][0]));
    });
  };
};

export const fetchFileSets = (
  locationParam,
  annotationType,
  activeImageMode,
  searchParams,
  subscriptionId
) => {
  return async dispatch => {
    dispatch(setFetchingReviewData(true));
    const { appliedForAllModelId, useAIAssistance } = store.getState().review;
    if (!appliedForAllModelId) {
      dispatch(
        checkIfSingleAutoModel(
          encodeString(
            getParamsFromEncodedString(
              `${getApiParams(
                locationParam,
                annotationType,
                searchParams,
                true
              )}&model_selection=latest`,
              true
            )
          )
        )
      );
    }

    const fileSetCount = await getFilesetCount(
      subscriptionId,
      `${getApiParams(locationParam, annotationType, searchParams, true)}${
        FILE_SET_COUNT_API_PARAMS_ANNOTATION_TYPE[activeImageMode] || ''
      }`,
      appliedForAllModelId && useAIAssistance ? appliedForAllModelId : null
    );

    dispatch({ type: SET_REVIEW_DATA_COUNT, payload: fileSetCount });

    if (annotationType === AUDIT || annotationType === MANUAL_CLASSIFY) {
      getFilesetCount(
        subscriptionId,
        getApiParams(locationParam, annotationType, searchParams),
        appliedForAllModelId && useAIAssistance ? appliedForAllModelId : null
      ).then(res => {
        dispatch(setImageModesCount(annotationType, activeImageMode, res));
      });
    }

    dispatch(
      reviewDataFetcher(
        getApiParams(locationParam, annotationType, searchParams),
        appliedForAllModelId && useAIAssistance ? appliedForAllModelId : null,
        subscriptionId
      )
    );
  };
};

export const addUserClassification = ({
  defects,
  fileSet,
  userId,
  modelId
}) => {
  return async dispatch => {
    const res = await api.addUserClassification({
      is_no_defect: false,
      defects,
      file: fileSet.id,
      user: userId
    });

    dispatch(
      setUserClassification({
        count: 1 || 0,
        data: res.data ? [res.data] : []
      })
    );

    dispatch(getDefect([fileSet.fileSetId], modelId));
  };
};

export const updateUserClassification = ({
  gtDefectId,
  defectIds,
  fileSet,
  userInfo,
  modelId
}) => {
  return async dispatch => {
    try {
      if (defectIds.length) {
        const data = {
          defects: defectIds,
          file: fileSet.id,
          is_no_defect: false,
          userId: userInfo
        };
        const res = await api.updateUserClassification(gtDefectId, data);
        const { file } = res.data;
        dispatch(updateUserClassificationById({ id: file, data: res.data }));
        dispatch(getDefect([fileSet.fileSetId], modelId));
      } else {
        await api.deleteGTClassification(gtDefectId);
        dispatch(getDefect([fileSet.fileSetId], modelId));
      }
    } catch {
      toast('Something went wrong.');
    }
  };
};

export const addGTDetections = regions => {
  return dispatch => {
    // exclude no defect region
    const filterRegions = regions.filter(
      ({ defects }) => !defects.includes(9999)
    );
    const isNoDefect = regions.length !== filterRegions.length;

    const { userInfo } = store.getState().common;
    const { data, activeImg, fileSetDefects } = store.getState().review;
    const fileSet = data[activeImg[0]];

    if (filterRegions.length === 1 && !isNoDefect) {
      try {
        api
          .addUserDetection({
            is_no_defect: false,
            file: fileSet.id,
            user: userInfo.id,
            detection_regions: filterRegions
          })
          .then(() => {
            dispatch(
              getDefect([fileSet.fileSetId], getCurrentModelFromState())
            );
          });
      } catch {
        toast('something went wrong.');
      }
    } else {
      const gtDetectionId = fileSetDefects[fileSet.id]?.gt_detections?.id;

      if (!gtDetectionId) {
        // create the GT
        try {
          api
            .addUserDetection({
              is_no_defect: true,
              file: fileSet.id,
              user: 1,
              detection_regions: []
            })
            .then(res => {
              dispatch(
                getDefect([fileSet.fileSetId], getCurrentModelFromState())
              );
            });
        } catch {
          toast('something went wrong.');
        }
      } else {
        try {
          api
            .updateUserDetection(gtDetectionId, {
              is_no_defect: false,
              file: fileSet.id,
              user: userInfo.id,
              detection_regions: filterRegions
            })
            .then(res => {
              dispatch(
                getDefect([fileSet.fileSetId], getCurrentModelFromState())
              );
            });
        } catch {
          toast('something went wrong.');
        }
      }
    }
  };
};

export const updateGTDetections = regions => {
  return dispatch => {
    // exclude no defect region
    const filterRegions = regions.filter(
      ({ defects }) => !defects.includes(9999)
    );
    const { userInfo } = store.getState().common;
    const { data, activeImg, fileSetDefects } = store.getState().review;

    const fileSet = data[activeImg[0]];

    const gtDetectionId = fileSetDefects[fileSet.id].gt_detections.id;

    if (filterRegions.length) {
      try {
        api
          .updateUserDetection(gtDetectionId, {
            is_no_defect: false,
            file: fileSet.id,
            user: userInfo.id,
            detection_regions: filterRegions
          })
          .then(() => {
            dispatch(
              getDefect([fileSet.fileSetId], getCurrentModelFromState())
            );
          });
      } catch {
        toast('Something went wrong.');
      }
    } else {
      // if there is only one detection is remaining we have to delete the GT
      try {
        api.deleteUserDetection(gtDetectionId).then(() => {
          dispatch(getDefect([fileSet.fileSetId], getCurrentModelFromState()));
        });
      } catch {
        toast('Something went wrong.');
      }
    }
  };
};

export const getUserClassification = fileId => {
  return async dispatch => {
    const { count = 0, results: data = [] } = await api.getUserClassification(
      'userClassification',
      fileId
    );
    dispatch(
      setUserClassification({
        count,
        data
      })
    );
  };
};

export const setIsBulkClassificationUpdating = payload => {
  return { type: SET_BULK_CLASSIFICATION_UPDATING, payload };
};

export const setSearchText = payload => {
  return { type: SET_SEARCH_TEXT, payload };
};

export const refetchUpdatedFileSetDefects = () => {
  const { getState, dispatch } = store;

  const { activeImg, selectAll, data: fileSets } = getState().review;
  const fileSetIds = activeImg.map(fileIndex => fileSets[fileIndex].fileSetId);

  if (selectAll) {
    dispatch(getDefect(fileSets.map(item => item.fileSetId)));
  } else if (fileSetIds.length < 50) {
    dispatch(getDefect(fileSetIds));
  } else {
    toast('Please refresh to see updated labels.');
  }
};

export const reArrangeManualAuditFiles = annotationType => {
  const { getState, dispatch } = store;

  const { activeImg, selectAll, data: fileSets } = getState().review;

  const fileIds = activeImg.map(fileIndex => fileSets[fileIndex].id);

  dispatch(removeFileSet(selectAll ? fileSets.map(item => item.id) : fileIds));
  dispatch(
    updateImageModes(selectAll ? fileSets.map(item => item.id) : fileIds)
  );

  toast(
    `${
      fileIds.length > 1
        ? `${fileIds.length} images are`
        : `${fileIds.length} image is`
    } ${
      annotationType === MANUAL_CLASSIFY ? 'classified' : 'Audited'
    } successfully.`
  );
};

export const addBulkUserClassification = (
  defects,
  annotationType,
  shouldReplace = true
) => {
  const { getState, dispatch } = store;

  const {
    activeImg,
    selectAll,
    data: fileSets,
    activeImageMode,
    searchText
  } = getState().review;

  dispatch(setIsBulkClassificationUpdating(true));

  const fileSetIds = activeImg.map(fileIndex => fileSets[fileIndex].fileSetId);
  const isAsync = fileSetIds.length >= GLOBAL_CONSTS.BULK_CREATE_SYNC_LIMIT;

  const tempObj = {};

  tempObj.is_no_defect = false;
  if (Array.isArray(defects)) {
    tempObj.defects = defects.map(item => item.id);
  } else {
    tempObj.defects = [defects.id];
  }

  if (selectAll) {
    const params = getDateFromParams(window.location.search, undefined, true);
    if (searchText) {
      params['files__name__icontains'] = searchText;
    }

    tempObj.file_set_filters = encodeURL(params);
  } else {
    tempObj.file_set_filters = encodeURL({
      id__in: fileSetIds
    });
  }

  tempObj.replace_existing_labels = shouldReplace;

  api
    .addBulkClassification(tempObj, isAsync)
    .then(() => {
      if (isAsync || (selectAll && fileSets.length >= 50)) {
        window.location.reload();
        return;
      }

      refetchUpdatedFileSetDefects();

      toast(
        `${
          selectAll ? 'All' : fileSetIds.length
        } images are updated successfully.`
      );

      if (
        annotationType !== Review &&
        (activeImageMode === 'Unclassified' || activeImageMode === 'Unaudited')
      ) {
        setTimeout(() => {
          reArrangeManualAuditFiles(annotationType);
        }, 1000);
      }
    })
    .finally(() => {
      dispatch(setIsBulkClassificationUpdating(false));
    });
};

export const handleUserClassificationChange = (defect, annotationType) => {
  const { selectAll, isUserClassificationLoading, activeImg } =
    store.getState().review;

  if (selectAll || activeImg.length > 1) {
    return addBulkUserClassification(defect, annotationType);
  }

  if (isUserClassificationLoading)
    return toast('User classification is still loading.');

  return handleOtherDefectChange(defect, annotationType);
};

export const getSelectedImageCount = () => {
  const { activeImg, selectAll, fileSetCount } = store.getState().review;

  return selectAll ? fileSetCount : activeImg.length;
};
