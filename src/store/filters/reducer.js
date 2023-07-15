import { getTimeFormat } from 'app/utils/helpers';
import produce from 'immer';
import initialState, { end, start } from 'store/constants/initial';

export default function filterReducer(state = initialState.filters, action) {
  return produce(state, draft => {
    switch (action.type) {
      case 'SET_STATE': {
        Object.entries(action.state).forEach(([key, value]) => {
          draft[key] = value;
        });
        return draft;
      }
      case 'SET_FILTERS_LOADED': {
        draft.filtersLoaded = action.status;
        return draft;
      }
      case 'APPLY_FILTER': {
        draft[action.field] = {
          applied: action.selected
        };
        draft.params[action.param] = draft[action.field].applied;
        return draft;
      }
      case 'REMOVE_FILTER': {
        if (!draft[action.field]) return draft;
        const applied = draft[action.field].applied.filter(
          item => item !== action.item
        );
        draft[action.field].applied = applied;
        draft.params[action.param] = applied;
        return draft;
      }
      case 'SET_FOLDER_DICT': {
        action.data.forEach(item => {
          draft.folderDict[item.id] = item;
        });
        return draft;
      }
      case 'SET_PARAMS': {
        draft.paramsString = action.payload;
        return draft;
      }
      case 'SET_FOLDER_ITEMS': {
        const applied = action.state.map(row => row.id);
        draft.folder = {
          applied
        };
        action.state.forEach(row => {
          draft.folderDict[row.id] = row;
        });
        draft.params.upload_session_id__in = applied;
        return draft;
      }
      case 'SET_FOLDER_APPLIED': {
        draft.folder = {
          applied: action.state
        };
        return draft;
      }
      case 'SET_FOLDER_VALUES': {
        draft.filters.folder.values = action.values;
        return draft;
      }
      case 'RESET_APPLIED': {
        Object.entries(draft).forEach(([key, value]) => {
          if (value?.applied) {
            value.applied = [];
          }
        });
        // draft.date = {
        // 	start: '',
        // 	end: '',
        // }
        draft.timeFormat = getTimeFormat(start, end);
        draft.params = {};
        return draft;
      }
      case 'APPLY_MODEL_FILTER': {
        draft.model = {
          applied: action.payload
        };
        break;
      }
      case 'REMOVE_MODEL_FILTER': {
        draft.model = {
          applied: []
        };
        break;
      }
      case 'REMOVE_DEFECT_FILTER': {
        draft.defect = {
          applied: []
        };
        break;
      }
      case 'REMOVE_GROUND_TRUTH_FILTER': {
        draft.groundTruth = {
          applied: []
        };
        break;
      }
      case 'REMOVE_USECASE_FILTER': {
        draft.useCase = {
          applied: []
        };
        break;
      }
      case 'REMOVE_TYPE_FILTER': {
        draft.type = {
          applied: []
        };
        break;
      }
      case 'REMOVE_BOOKMARK_FILTER': {
        draft.bookmark = {
          applied: []
        };
        break;
      }
      case 'SET_DATE_FILTER': {
        draft.date = action.date;
        if (action.date?.start && action.date?.end) {
          draft.params.date__gte = action.date.start;
          draft.params.date__lte = action.date.end;
          draft.timeFormat = action.date.timeFormat;
        } else {
          delete draft.timeFormat;
          delete draft.params.date__gte;
          delete draft.params.date__lte;
        }
        return draft;
      }
      default: {
        return draft;
      }
    }
  });
}
