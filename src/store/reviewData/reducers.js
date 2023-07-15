import { getDictinctModelFromFileDefect } from 'app/utils/reviewData';
import { keyBy } from 'lodash';
import initialState from 'store/constants/initial';

import * as t from './constants';

function setReviewData(state, payload) {
  if (payload.isNewData) {
    return {
      ...state,
      data: payload.data,
      fetchingReviewData: false,
      activeImg: [0]
    };
  }
  const tempData = Object.keys(keyBy(state.data, 'id'));
  const newTempData = Object.keys(keyBy(payload.data, 'id'));
  if (!newTempData.every(x => tempData.includes(x))) {
    return {
      ...state,
      data: [...state.data, ...payload.data],
      fetchingReviewData: false
    };
  }
  return { ...state, fetchingReviewData: false };
}

function setFetchingReviewData(state, payload) {
  return {
    ...state,
    fetchingReviewData: payload
  };
}

function setReviewDataNextApi(state, payload) {
  return {
    ...state,
    next: payload,
    fetchingReviewData: false
  };
}

function setReviewDataCount(state, payload) {
  return {
    ...state,
    fileSetCount: payload
  };
}

function resetReviewData() {
  return initialState.review;
}

function setUploadSession(state, payload) {
  return {
    ...state,
    uploadSessionId: payload
  };
}

function updateReviewData(state, payload) {
  return {
    ...state,
    data: payload,
    fileSetCount: payload.length
  };
}

function setActiveGridMode(state, payload) {
  return {
    ...state,
    activeGridMode: payload
  };
}

function setActiveImageMode(state, payload) {
  return {
    ...state,
    activeImageMode: payload,
    data: [],
    fileSetDefects: {},
    fetchingReviewData: true,
    next: '',
    selectAll: false
  };
}

function setActiveImages(state, payload) {
  return {
    ...state,
    activeImg: payload
  };
}

function setImageModes(state, payload) {
  if (payload === t.AUDIT) {
    return {
      ...state,
      imageModes: [{ label: 'Unaudited' }, { label: 'Audited' }],
      activeImageMode: 'Unaudited'
    };
  }
  if (payload === t.MANUAL_CLASSIFY) {
    return {
      ...state,
      imageModes: [{ label: 'Unclassified' }, { label: 'Classified' }],
      activeImageMode: 'Unclassified'
    };
  }
  if (payload === t.Review) {
    return {
      ...state,
      imageModes: [],
      activeImageMode: ''
    };
  }
  return {
    ...state,
    imageModes: [],
    activeImageMode: ''
  };
}

function setPositiveImageCount(state, payload) {
  if (state.imageModes.length) {
    if (payload.isLeftCount) {
      return {
        ...state,
        imageModes: [
          { ...state.imageModes[0], subLabel: payload.count },
          {
            ...state.imageModes[1],
            subLabel: state.fileSetCount - payload.count
          }
        ]
      };
    }
    return {
      ...state,
      imageModes: [
        {
          ...state.imageModes[0],
          subLabel: state.fileSetCount - payload.count
        },
        { ...state.imageModes[1], subLabel: payload.count }
      ]
    };
  }
  return state;
}

function setReviewDefects(state, payload) {
  const filesArray = [].concat(
    ...Object.values(payload).map(item => item.files)
  );

  const isModelDataAvailable = filesArray.some(
    item => item.model_classifications || item.model_detections
  );

  const keyByFiles = keyBy(filesArray, 'id');

  let tempModelVisibilityObj = {};
  const { modelVisibilityObj } = state;

  if (isModelDataAvailable) {
    const distinctModels = getDictinctModelFromFileDefect(keyByFiles);
    distinctModels.forEach(modelId => {
      if (modelVisibilityObj[modelId] === undefined) {
        tempModelVisibilityObj[modelId] = true;
      }
    });
  }

  return {
    ...state,
    fileSetDefects: { ...state.fileSetDefects, ...keyByFiles },
    isFileSetDefectsLoading: false,
    modelVisibilityObj: {
      ...state.modelVisibilityObj,
      ...tempModelVisibilityObj
    }
  };
}

function clearReviewDefects(state, payload) {
  return {
    ...state,
    fileSetDefects: payload
  };
}

function setFileSetDefectsLoading(state, payload) {
  return {
    ...state,
    isFileSetDefectsLoading: payload
  };
}

function removeFileSetsByIds(state, payload) {
  return {
    ...state,
    data: state.data.filter(x => !payload.includes(x.id))
  };
}

function updateImageModes(state, payload) {
  const delta =
    state.activeImageMode === 'Unaudited' ||
    state.activeImageMode === 'Unclassified'
      ? -1
      : 1;

  return {
    ...state,
    imageModes: [
      {
        ...state.imageModes[0],
        subLabel: state.imageModes[0].subLabel + payload.length * delta
      },
      {
        ...state.imageModes[1],
        subLabel: state.imageModes[1].subLabel + payload.length * delta * -1
      }
    ]
  };
}

function setFileSetDefectsById(state, payload) {
  const tempFileSetDefects = state.fileSetDefects;
  Object.keys(payload).forEach(id => {
    tempFileSetDefects[id].gt_defect_names = payload[id];
  });
  return {
    ...state,
    fileSetDefects: tempFileSetDefects
  };
}

function setUserClassification(state, payload) {
  const { count, data } = payload;
  const tempList = data.map(x => {
    return {
      ...x,
      defects: x.defects.map(item => {
        return {
          ...item,
          name: `${item?.organization_defect_code || ''}-${item?.name || ''}`
        };
      })
    };
  });
  return {
    ...state,
    isUserClassificationLoading: false,
    userClassification: { count, data: keyBy(tempList, 'file') }
  };
}

function updateUserClassificationById(state, payload) {
  return {
    ...state,
    userClassification: {
      ...state.userClassification,
      data: {
        ...state.userClassification.data,
        [payload.id]: {
          ...payload.data,
          defects: payload.data.defects.map(item => {
            return {
              ...item,
              name: `${item?.organization_defect_code || ''}-${
                item?.name || ''
              }`
            };
          })
        }
      }
    }
  };
}

function clearUserClassification(state, payload) {
  const tempData = state.userClassification.data;
  if (tempData[payload]) {
    delete tempData[payload];
    return {
      ...state,
      isUserClassificationLoading: true,
      userClassification: {
        ...state.userClassification,
        data: tempData,
        count: state.userClassification.count - 1
      }
    };
  }

  return state;
}

function setSelectedTool(state, payload) {
  return {
    ...state,
    selectedTool: payload
  };
}

function setAnnotatorInput(state, payload) {
  return {
    ...state,
    annotatorInput: payload
  };
}

function setAppliedForAllModelId(state, payload) {
  return { ...state, appliedForAllModelId: payload };
}

function setUseAIAssistance(state, payload) {
  return { ...state, useAIAssistance: payload };
}

function setModelVisibilityObj(state, payload) {
  return { ...state, modelVisibilityObj: payload };
}

function setUserDetectionList(state, payload) {
  return { ...state, userDetectionList: payload };
}

function setModelDetectionList(state, payload) {
  return {
    ...state,
    modelDetectionList: payload
  };
}

function updateReviewModelDict(state, payload) {
  if (state.modelsDict[payload.id]) {
    return state;
  }

  return {
    ...state,
    modelsDict: { ...state.modelsDict, [payload.id]: payload }
  };
}

function setAiDefects(state, payload) {
  const tempObj = {};
  Object.keys(payload).forEach(key => {
    tempObj[key] = payload[key].map(x => {
      return {
        ...x,
        name: `${x?.organization_defect_code || ''}-${x?.name || ''}`
      };
    });
  });
  return {
    ...state,
    aiDefects: { ...state.aiDefects, ...tempObj }
  };
}

function clearAiDefects(state) {
  return {
    ...state,
    aiDefects: {}
  };
}

function setTaskId(state, payload) {
  return {
    ...state,
    taskId: payload
  };
}

function updateFilesetById(state, payload) {
  const ids = Object.keys(payload);
  const data = state.data.map(x => {
    if (ids.includes(`${x.id}`)) {
      return payload[x.id];
    }
    return x;
  });
  return {
    ...state,
    data
  };
}

function setOtherDefects(state, payload) {
  const tempList = payload.map(x => {
    return {
      ...x,
      name: `${x?.organization_defect_code || ''}-${x?.name || ''}`
    };
  });
  return {
    ...state,
    otherDefects: tempList
  };
}
function setSorting(state, payload) {
  return {
    ...state,
    sorting: {
      ...state.sorting,
      ...payload
    }
  };
}

function setSelectAll(state, payload) {
  return {
    ...state,
    selectAll: payload
  };
}

function removeGtDefect(state, payload) {
  const { fileId, defectId } = payload;

  state.fileSetDefects[fileId].gt_detections.detection_regions =
    state.fileSetDefects[fileId].gt_detections.detection_regions.filter(
      d => d.id !== defectId
    );

  return { ...state };
}

function setIsBulkClassificationUpdating(state, payload) {
  return {
    ...state,
    isBulkClassificationUpdating: payload
  };
}

function setSearchText(state, payload) {
  return {
    ...state,
    searchText: payload
  };
}

export default function (state = initialState.review, action) {
  switch (action.type) {
    case t.SET_REVIEW_DATA:
      return setReviewData(state, action.payload);
    case t.FETCHING_REVIEW_DATA:
      return setFetchingReviewData(state, action.payload);
    case t.SET_REVIEW_DATA_COUNT:
      return setReviewDataCount(state, action.payload);
    case t.RESET_REVIEW_DATA:
      return resetReviewData(state);
    case t.SET_UPLOAD_SESSION_ID:
      return setUploadSession(state, action.payload);
    case t.UPDATE_REVIEW_DATA:
      return updateReviewData(state, action.payload);
    case t.SET_REVIEW_DATA_NEXT_API:
      return setReviewDataNextApi(state, action.payload);
    case t.SET_ACTIVE_GRID_MODE:
      return setActiveGridMode(state, action.payload);
    case t.SET_IMAGE_MODES:
      return setImageModes(state, action.payload);
    case t.SET_ACTIVE_IMAGE_MODE:
      return setActiveImageMode(state, action.payload);
    case t.SET_ACTIVE_IMG:
      return setActiveImages(state, action.payload);
    case t.SET_REVIEW_IMAGE_POSITIVE_COUNT:
      return setPositiveImageCount(state, action.payload);
    case t.SET_REVIEW_DEFECTS:
      return setReviewDefects(state, action.payload);
    case t.CLEAR_REVIEW_DEFECTS:
      return clearReviewDefects(state, action.payload);
    case t.SET_FILE_SET_DEFECTS_LOADING:
      return setFileSetDefectsLoading(state, action.payload);
    case t.REMOVE_FILE_SET_BY_IDS:
      return removeFileSetsByIds(state, action.payload);
    case t.UPDATE_IMAGE_MODES:
      return updateImageModes(state, action.payload);
    case t.SET_FILE_SET_DEFECTS_BY_ID:
      return setFileSetDefectsById(state, action.payload);
    case t.SET_USER_CLASSIFICATION:
      return setUserClassification(state, action.payload);
    case t.UPDATE_USER_CLASSIFICATION_BY_ID:
      return updateUserClassificationById(state, action.payload);
    case t.CLEAR_USER_CLASSIFICATION:
      return clearUserClassification(state, action.payload);
    case t.SET_SELECTED_TOOL:
      return setSelectedTool(state, action.payload);
    case t.SET_ANNOTATOR_INPUT:
      return setAnnotatorInput(state, action.payload);
    case t.SET_APPLIED_FOR_ALL_MODEL_ID:
      return setAppliedForAllModelId(state, action.payload);
    case t.SET_USE_AI_ASSISTANCE:
      return setUseAIAssistance(state, action.payload);
    case t.SET_MODEL_OUTPUT_LIST:
      return setModelVisibilityObj(state, action.payload);
    case t.SET_USER_DETECTION_LIST:
      return setUserDetectionList(state, action.payload);
    case t.SET_MODEL_DETECTION_LIST:
      return setModelDetectionList(state, action.payload);
    case t.SET_REVIEW_MODEL_DICT:
      return updateReviewModelDict(state, action.payload);
    case t.SET_AI_DEFECTS:
      return setAiDefects(state, action.payload);
    case t.CLEAR_AI_DEFECTS:
      return clearAiDefects(state);
    case t.SET_TASK_ID:
      return setTaskId(state, action.payload);
    case t.UPDATE_FILESET_BY_ID:
      return updateFilesetById(state, action.payload);
    case t.SET_OTHER_DEFECTS:
      return setOtherDefects(state, action.payload);
    case t.SET_SORTING:
      return setSorting(state, action.payload);
    case t.SET_SELECT_ALL:
      return setSelectAll(state, action.payload);
    case t.SET_CONTAINER_META:
      return { ...state, containerMeta: action.payload };
    case t.REMOVE_GT_DEFECT:
      return removeGtDefect(state, action.payload);
    case t.SET_BULK_CLASSIFICATION_UPDATING:
      return setIsBulkClassificationUpdating(state, action.payload);
    case t.SET_SEARCH_TEXT:
      return setSearchText(state, action.payload);
    default:
      return state;
  }
}
