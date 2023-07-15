import {
  SAVE_SUBSCRIPTION,
  SAVE_TABLE_STRUCTURE,
  SAVE_UPLOAD_SESSIONS
} from './constants';

const initialState = {
  tableStructure: [],
  uploadSessions: [],
  subscription: {},
  allUploadSelected: [],
  uploadResultSelected: [],
  allImagesSelectedForInference: false,
  locked: true
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_TABLE_STRUCTURE:
      return {
        ...state,
        tableStructure: action.payload
      };
    case SAVE_UPLOAD_SESSIONS:
      return {
        ...state,
        uploadSessions: action.payload
      };
    case SAVE_SUBSCRIPTION:
      return {
        ...state,
        subscription: action.payload
      };
    case 'SET_ALL_UPLOAD_SELECTED':
      return {
        ...state,
        allUploadSelected: action.selected.filter(
          element => element !== undefined
        )
      };
    case 'SET_UPLOAD_RESULT_SELECTED':
      return {
        ...state,
        uploadResultSelected: action.selected.filter(
          element => element !== undefined
        )
      };
    case 'SET_ALL_IMAGES_INFERENCE_SELECTED':
      return {
        ...state,
        allImagesSelectedForInference: action.status
      };

    default:
      return state;
  }
}
