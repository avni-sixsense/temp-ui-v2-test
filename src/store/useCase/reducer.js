import produce from 'immer';
import initialState from 'store/constants/initial';

export default function useCaseLibrary(state = initialState.usecase, action) {
  return produce(state, draft => {
    switch (action.type) {
      case 'USECASE_SET_DRAWER': {
        draft.drawerOpen = action.status;
        break;
      }
      case 'USECASE_SET_ACTIVE_STEP': {
        draft.activeStep = action.step;
        break;
      }
      case 'USECASE_SET_SELECT_ALL': {
        draft.allSelected = action.status;
        break;
      }
      case 'USECASE_SET_SELECTED': {
        draft.selected = action.selected;
        break;
      }
      case 'USECASE_SET_BOOKMARK_ALL': {
        draft.allBookmarked = action.status;
        break;
      }
      case 'USECASE_SET_BOOKMARKED': {
        draft.bookmarked = action.bookmarked;
        break;
      }
      case 'USECASE_SET_MODE': {
        draft.mode = action.mode;
        if (action.mode === 'create') {
          draft.usecase = {};
        }
        break;
      }
      case 'USECASE_SET_GLOBAL_MODE': {
        draft.globalMode = action.mode;
        break;
      }
      case 'USECASE_SET_USECASE': {
        draft.usecase = action.selected?.[0];
        break;
      }
      default:
        break;
    }
  });
}
