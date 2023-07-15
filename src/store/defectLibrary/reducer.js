import produce from 'immer';
import initialState from 'store/constants/initial';

export default function defectLibrary(
  state = initialState.defectLibrary,
  action
) {
  return produce(state, draft => {
    switch (action.type) {
      case 'SET_DRAWER': {
        draft.drawerOpen = action.status;
        break;
      }
      case 'SET_DEFECT_LIB_ACTIVE_STEP': {
        draft.activeStep = action.step;
        draft.stepMode = action.mode;
        break;
      }
      case 'SET_SELECT_ALL': {
        draft.allSelected = action.status;
        break;
      }
      case 'SET_SELECTED': {
        draft.selected = action.selected;
        break;
      }
      case 'SET_BOOKMARK_ALL': {
        draft.allBookmarked = action.status;
        break;
      }
      case 'SET_BOOKMARKED': {
        draft.bookmarked = action.bookmarked;
        break;
      }
      case 'SET_MODE': {
        draft.mode = action.mode;
        if (action.mode === 'create') {
          draft.defect = {};
        }
        break;
      }
      case 'SET_GLOBAL_MODE': {
        draft.globalMode = action.mode;
        break;
      }
      case 'SET_DEFECT': {
        draft.defect = draft.selected?.[0] || {};
        break;
      }
      case 'SET_TOTAL': {
        draft.total = action.payload;
        break;
      }
      case 'SET_DEFECT_LIB_EXPAND_ALL': {
        draft.expandAll = action.payload;
        break;
      }
      case 'UPDATE_DEFECT': {
        draft.defect = action.defect;
        if (draft.selected.length) {
          draft.selected = [action.defect];
        }
        break;
      }
      case 'RESET': {
        draft.defect = {};
        draft.activeStep = 0;
        draft.mode = '';
        draft.globalMode = '';
        draft.stepMode = '';
        break;
      }
      case 'SET_DEFECT_LIB_DATA': {
        draft.data = action.payload;
        break;
      }
      case 'SET_DEFECT_LIB_ROWS_PER_PAGE': {
        draft.rowsPerPage = action.payload;
        draft.page = 1;
        break;
      }
      case 'SET_DEFECT_LIB_PAGE': {
        draft.page = action.payload;
        break;
      }
      case 'UPDATE_DEFECT_LIB_DATA_BY_ID': {
        draft.data = draft.data.map(item => {
          if (item.id === action.payload.id)
            return { ...item, ...action.payload.data };
          return item;
        });
        break;
      }
      default: {
        break;
      }
    }
  });
}
