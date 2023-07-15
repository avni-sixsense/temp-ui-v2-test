import produce from 'immer';
import initialState from 'store/constants/initial';

export default function modelLibrary(
  state = initialState.modelLibrary,
  action
) {
  return produce(state, draft => {
    switch (action.type) {
      case 'MODEL_LIB_SET_DRAWER': {
        draft.drawerOpen = action.status;
        break;
      }
      case 'MODEL_LIB_SET_ACTIVE_STEP': {
        draft.activeStep = action.step;
        break;
      }
      case 'MODEL_LIB_SET_SELECT_ALL': {
        draft.allSelected = action.status;
        break;
      }
      case 'MODEL_LIB_SET_SELECTED': {
        draft.selected = action.selected;
        break;
      }
      case 'MODEL_LIB_SET_BOOKMARK_ALL': {
        draft.allBookmarked = action.status;
        break;
      }
      case 'MODEL_LIB_SET_BOOKMARKED': {
        draft.bookmarked = action.bookmarked;
        break;
      }
      case 'MODEL_LIB_SET_OLD_MODEL_ID': {
        draft.trainModelId = action.id;
        break;
      }
      case 'MODEL_LIB_SET_MODEL': {
        draft.model = action.payload;
        break;
      }
      case 'MODEL_LIB_SHOW_TRAIN_PROGRESS': {
        draft.showTrainProgress = action.status;
        break;
      }
      case 'MODEL_LIB_SET_UPLOAD_MODEL_DRAWER_CLICK': {
        draft.uploadModelDrawer = action.status;
        break;
      }

      case 'MODEL_LIB_SET_TOTAL': {
        draft.total = action.total;
        break;
      }
      case 'MODEL_LIB_SHOW_PROGRESS': {
        draft.showProgress = action.status;
        break;
      }
      case 'MODEL_LIB_UPDATE_UPLOADED': {
        draft.uploaded += 1;
        break;
      }
      case 'MODEL_LIB_RESET_UPLOAD_MODEL': {
        draft.uploaded = 0;
        draft.total = 0;
        draft.showProgress = false;
        break;
      }
      default:
        break;
    }
  });
}
