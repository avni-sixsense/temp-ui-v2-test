import initialState from 'store/constants/initial';

import * as t from './constants';

function setDrawerState(state, payload) {
  return {
    ...state,
    drawerOpen: payload
  };
}

function setDrawerStatus(state, payload) {
  return {
    ...state,
    drawerStatus: payload
  };
}

function setMode(state, payload) {
  return {
    ...state,
    mode: payload
  };
}

function setUnit(state, payload) {
  return {
    ...state,
    unit: payload
  };
}

function confusionUsecase(state, payload) {
  return {
    ...state,
    confusionUsecase: payload
  };
}

function confusionModel(state, payload) {
  return {
    ...state,
    confusionModel: payload
  };
}

function setDrawerUsecase(state, payload) {
  return {
    ...state,
    drawerUsecase: payload
  };
}

function setMisclassificationImagesRowIds(state, payload) {
  let { misclassificationImagesRowIds } = state;
  const { id } = payload;
  if (!misclassificationImagesRowIds[id]) {
    misclassificationImagesRowIds[id] = {
      ...payload
    };
  } else {
    delete misclassificationImagesRowIds[id];
  }

  return {
    ...state,
    misclassificationImagesRowIds
  };
}

function setActiveUsecaseCount(state, payload) {
  return {
    ...state,
    activeUsecaseCount: payload
  };
}

const setDefectDistributionIndividualLoading = (state, payload) => {
  return {
    ...state,
    defectDistribution: {
      ...state.defectDistribution,
      [payload]: {
        ...state.defectDistribution[payload],
        isLoading: true,
        isError: false
      }
    }
  };
};

const setDefectDistributionData = (state, payload) => {
  return {
    ...state,
    defectDistribution: {
      ...state.defectDistribution,
      [payload.type]: {
        data: payload.data,
        isLoading: false,
        isError: false
      }
    }
  };
};

const resetDefectDistributionData = state => {
  return {
    ...state,
    defectDistribution: initialState.aiPerformance.defectDistribution
  };
};

export default function (state = initialState.aiPerformance, action) {
  switch (action.type) {
    case t.SET_DRAWER_STATE:
      return setDrawerState(state, action.payload);
    case t.SET_DRAWER_STATUS:
      return setDrawerStatus(state, action.payload);
    case t.SET_MODE:
      return setMode(state, action.payload);
    case t.SET_UNIT:
      return setUnit(state, action.payload);
    case t.SET_CONFUSION_USE_CASE:
      return confusionUsecase(state, action.payload);
    case t.SET_CONFUSION_MODEL:
      return confusionModel(state, action.payload);
    case t.SET_DRAWER_USECASE:
      return setDrawerUsecase(state, action.payload);
    case t.SET_ACTIVE_USECASE_COUNT:
      return setActiveUsecaseCount(state, action.payload);
    case t.SET_MISSCLASSIFICATION_IMAGES_ROW_IDS:
      return setMisclassificationImagesRowIds(state, action.payload);
    case t.SET_DEFECT_DISTRIBUTION_INDIVIDUAL_LOADING:
      return setDefectDistributionIndividualLoading(state, action.payload);
    case t.SET_DEFECT_DISTRIBUTION_DATA:
      return setDefectDistributionData(state, action.payload);
    case t.RESET_DEFECT_DISTRIBUTION_DATA:
      return resetDefectDistributionData(state);
    default:
      return state;
  }
}
