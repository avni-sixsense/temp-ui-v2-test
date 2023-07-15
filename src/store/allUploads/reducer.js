import produce from 'immer';
import initialState from 'store/constants/initial';

function updateFilesetById(state, payload) {
  const ids = Object.keys(payload);

  const data = state.data.map(x => {
    if (ids.includes(`${x.id}`)) {
      return { ...x, ...payload[x.id] };
    }

    return x;
  });

  return { ...state, data };
}

export default function allUploadReducer(
  state = initialState.allUploads,
  action
) {
  return produce(state, draft => {
    switch (action.type) {
      case 'SET_ALL_UPLOAD_DRAWER': {
        draft.drawerOpen = action.status;
        break;
      }
      case 'SET_ALL_UPLOAD_ACTIVE_STEP': {
        draft.activeStep = action.step;
        break;
      }
      case 'SET_ALL_UPLOAD_INFERENCE_SELECTED': {
        draft.inferenceSelected = action.selected;
        break;
      }
      case 'SET_ALL_UPLOAD_SELECTED': {
        draft.selected = action.selected.filter(
          element => element !== undefined
        );
        break;
      }
      case 'SET_ALL_UPLOAD_DOWNLOADING': {
        draft.downloading = action.status;
        break;
      }
      case 'SET_ALL_UPLOAD_DOWNLOAD_BTN': {
        draft.downloadBtn = action.status;
        break;
      }
      case 'SET_ALL_UPLOAD_DATA': {
        draft.data = action.payload;
        break;
      }
      case 'SET_ALL_DATASET_DATA': {
        draft.dataset = action.payload;
        break;
      }
      case 'SET_ALL_UPLOAD_BOOKMARK': {
        const tempData = draft.data.map(x =>
          x.id === action.payload
            ? { ...x, is_bookmarked: !x.is_bookmarked }
            : x
        );
        draft.data = tempData;
        break;
      }
      case 'SET_DATA_SET_LOCKED': {
        const tempData = draft.dataset.map(x =>
          x.id === action.payload ? { ...x, is_locked: !x.is_locked } : x
        );
        draft.dataset = tempData;
        break;
      }
      case 'SET_ALL_UPLOAD_DOWNLOAD': {
        draft.selectedSessions = action.selected;
        draft.activeStep = 2;
        draft.downloadBtn = true;
        draft.drawerOpen = true;
        break;
      }
      case 'SET_ALL_UPLOAD_PAGE': {
        draft.page = action.payload;
        break;
      }
      case 'SET_ALL_UPLOAD_ROWS_PER_PAGE': {
        draft.rowsPerPage = action.payload;
        break;
      }
      case 'SET_ALL_UPLOAD_TOTAL': {
        draft.total = action.payload;
        break;
      }
      case 'RESET': {
        draft.activeStep = 0;
        draft.drawerOpen = false;
        draft.downloadBtn = false;
        draft.downloading = false;
        break;
      }
      case 'SET_MODEL_DEFECT_DRAWER': {
        draft.modelDefectDrawer = action.status;
        break;
      }
      case 'UPDATE_UPLOADSESSION_BY_ID':
        return updateFilesetById(draft, action.payload);

      case 'SET_ACTIVE_INFO_HEADER':
        draft.infoMode = action.payload;
        break;

      case 'ADD_ALL_UPLOAD_DATA':
        return { ...state, data: [action.payload, ...state.data] };

      case 'UPDATE_ALL_UPLOAD_DATA_BY_ID': {
        const idx = draft.data.findIndex(d => d.id === action.payload.id);
        if (idx > -1) {
          draft.data[idx] = action.payload;
        } else {
          return { ...state, data: [action.payload, ...state.data] };
        }
        break;
      }

      default: {
        break;
      }
    }
  });
}
