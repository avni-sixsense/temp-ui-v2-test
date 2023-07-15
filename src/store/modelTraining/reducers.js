import { keyBy } from 'lodash';
import initialState from 'store/constants/initial';

import * as t from './constants';

const DEFAULT_TRAINING_CONFIG = {
  training_data_percentage: 60,
  validation_data_percentage: 20,
  test_data_percentage: 20,
  image_resolution: 576,
  no_of_epochs: 0
};

function setActiveStep(state, payload) {
  return {
    ...state,
    activeStep: payload
  };
}

function setModelName(state, payload) {
  return {
    ...state,
    modelName: payload
  };
}

function setNewModel(state, payload) {
  return {
    ...state,
    newModel: { ...state.newModel, ...payload }
  };
}

function setEditMode(state, payload) {
  return {
    ...state,
    isEdit: payload
  };
}

function setDialogOpen(state, payload) {
  return {
    ...state,
    isDialogOpen: payload
  };
}

function setDialogVariant(state, payload) {
  return {
    ...state,
    dialogVariant: payload
  };
}

function resetTraining(payload) {
  return payload;
}

function setActiveImg(state, payload) {
  return {
    ...state,
    activeImg: payload
  };
}

function setSelectAll(state, payload) {
  return {
    ...state,
    selectAll: payload
  };
}

function setFileSetData(state, payload) {
  if (payload.isNewData) {
    return {
      ...state,
      fileSetData: payload.data
    };
  }
  return {
    ...state,
    fileSetData: [...state.fileSetData, ...payload.data]
  };
}

function setDefectsInstancesCount(state, payload) {
  const { key, value } = payload;
  return { ...state, [key]: value };
}

function setFileSetCount(state, payload) {
  // TODO: depreciate this.
  return {
    ...state,
    count: payload,
    selectAll: false,
    activeImg: []
  };
}

function setModelUseCase(state, payload) {
  return {
    ...state,
    usecase: payload
  };
}

function setOldModel(state, payload) {
  return {
    ...state,
    oldModel: payload
  };
}

function setSelectedDefects(state, payload) {
  return {
    ...state,
    selectedDefects: payload
  };
}

function setSameModelNameError(state, payload) {
  return {
    ...state,
    isSameModelNameError: payload
  };
}

function setFilesetDefects(state, payload) {
  const filesArray = [].concat(
    ...Object.values(payload).map(item => item.files)
  );

  const keyByFiles = keyBy(filesArray, 'id');

  return {
    ...state,
    fileSetDefects: { ...state.fileSetDefects, ...keyByFiles },
    isFileSetDefectsLoading: false
  };
}

function setFileSetDefectsLoading(state, payload) {
  return {
    ...state,
    isFileSetDefectsLoading: payload
  };
}

function setActiveTrainingMode(state, payload) {
  return {
    ...state,
    activeTrainingMode: payload,
    selectAll: false,
    activeImg: [],
    fileSetData: [],
    fileSetDefects: {},
    containerMeta: {}
  };
}

function removeSelectedFiles(state) {
  const { activeImg, fileSetData } = state;
  const deletableFileSetIds = activeImg.map(x => fileSetData[x]?.fileSetId);
  return {
    ...state,
    fileSetData: state.fileSetData.filter(
      x => !deletableFileSetIds.includes(x.fileSetId)
    ),
    activeImg: []
  };
}

function setPendingTaskId(state, payload) {
  return {
    ...state,
    pendingTaskId: payload
  };
}

function setShouldTrainingOpen(state, payload) {
  return {
    ...state,
    shouldTrainingOpen: payload
  };
}

function setTrainingCount(state, payload) {
  return { ...state, ...payload };
}

function setConfigRadio(state, payload) {
  return {
    ...state,
    trainingDataInformation: { ...state.trainingDataInformation, ...payload }
  };
}

function setProgressValue(state, payload) {
  return {
    ...state,
    trainingConfiguration: {
      ...state.trainingConfiguration,
      ...payload
    }
  };
}

function setEpochCount(state, payload) {
  return {
    ...state,
    trainingConfiguration: {
      ...state.trainingConfiguration,
      no_of_epochs: payload
    }
  };
}

function setImageResolution(state, payload) {
  return {
    ...state,
    trainingConfiguration: {
      ...state.trainingConfiguration,
      image_resolution: payload
    }
  };
}

function resetConfigRadio(state) {
  return {
    ...state,
    trainingDataInformation: {}
  };
}

function setTrainingDataInformation(state, payload) {
  return {
    ...state,
    trainingDataInformation: payload
  };
}

function setFetchingTrainingFilesets(state, payload) {
  return {
    ...state,
    fetchingFileSets: payload
  };
}

function setTrainingFileSetNextApi(state, payload) {
  return {
    ...state,
    next: payload,
    fetchingFileSets: false
  };
}

export default function (state = initialState.modelTraining, action) {
  switch (action.type) {
    case t.SET_MODEL_LIB_ACTIVE_STEP:
      return setActiveStep(state, action.payload);
    case t.SET_MODEL_NAME:
      return setModelName(state, action.payload);
    case t.SET_NEW_MODEL:
      return setNewModel(state, action.payload);
    case t.SET_EDIT_MODE:
      return setEditMode(state, action.payload);
    case t.SET_DIALOG_OPEN:
      return setDialogOpen(state, action.payload);
    case t.SET_DIALOG_VARIANT:
      return setDialogVariant(state, action.payload);
    case t.RESET_TRAINING:
      return resetTraining(initialState.modelTraining);
    case t.SET_ACTIVE_IMG:
      return setActiveImg(state, action.payload);
    case t.SET_SELECT_ALL:
      return setSelectAll(state, action.payload);
    case t.SET_FILE_SET_DATA:
      return setFileSetData(state, action.payload);
    case t.SET_FILE_SET_COUNT:
      return setFileSetCount(state, action.payload);
    case t.SET_MODEL_USECASE:
      return setModelUseCase(state, action.payload);
    case t.SET_OLD_MODEL:
      return setOldModel(state, action.payload);
    case t.SET_SELECTED_DEFECTS:
      return setSelectedDefects(state, action.payload);
    case t.SET_SAME_MODEL_NAME_ERROR:
      return setSameModelNameError(state, action.payload);
    case t.SET_FILE_SET_DEFECTS:
      return setFilesetDefects(state, action.payload);
    case t.SET_FILE_SET_DEFECTS_LOADING:
      return setFileSetDefectsLoading(state, action.payload);
    case t.SET_ACTIVE_TRAINING_MODE:
      return setActiveTrainingMode(state, action.payload);
    case t.REMOVE_SELECTED_FILES:
      return removeSelectedFiles(state);
    case t.SET_PENDING_TASK_ID:
      return setPendingTaskId(state, action.payload);
    case t.SET_SHOULD_TRAINING_OPEN:
      return setShouldTrainingOpen(state, action.payload);
    case t.SET_TRAINING_COUNT:
      return setTrainingCount(state, action.payload);
    case t.SET_RADIO_CONFIG:
      return setConfigRadio(state, action.payload);
    case t.SET_TRAINING_PROGRESS_VALUE:
      return setProgressValue(state, action.payload);
    case t.SET_EPOCH_COUNT:
      return setEpochCount(state, action.payload);
    case t.RESET_RADIO_CONFIG:
      return resetConfigRadio(state, action.payload);
    case t.SET_TRAINING_DATA_INFORMATION:
      return setTrainingDataInformation(state, action.payload);
    case t.SET_IMAGE_RESOLUTION:
      return setImageResolution(state, action.payload);
    case t.SET_IS_VIEW_DETAILS:
      return { ...state, isViewDetails: action.payload };
    case t.SET_FETCHING_TRAINING_FILESETS:
      return setFetchingTrainingFilesets(state, action.payload);
    case t.SET_TRAINING_FILESET_NEXT_API:
      return setTrainingFileSetNextApi(state, action.payload);
    case t.SET_MODEL_TRAINING_CONTAINER_META:
      return { ...state, containerMeta: action.payload };
    case t.SET_DEFECT_INSTANCES_COUNT:
      return setDefectsInstancesCount(state, action.payload);
    case t.RESET_MODEL_TRAINING:
      return initialState.modelTraining;
    default:
      return state;
  }
}
