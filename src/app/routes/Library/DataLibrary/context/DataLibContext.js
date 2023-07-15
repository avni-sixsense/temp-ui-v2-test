/* eslint-disable default-case */

import produce from 'immer';
import React, { createContext, useContext, useReducer } from 'react';
import globalState from 'store/constants/initial';

const DataLibStateContext = createContext();
const DataLibDispatchContext = createContext();

const initialState = {
  drawerOpen: false,
  activeStep: 0,
  selected: [],
  data: [],
  downloadBtn: false,
  downloading: false,
  page: 1,
  rowsPerPage: globalState.pagination.defaultPageSize,
  total: 0,
  modelDefectDrawer: false
};

const uploadReducer = produce((draft, action) => {
  switch (action.type) {
    case 'SET_DRAWER': {
      draft.drawerOpen = action.status;
      break;
    }
    case 'SET_MODEL_DEFECT_DRAWER': {
      draft.modelDefectDrawer = action.status;
      break;
    }
    case 'SET_ACTIVE_STEP': {
      draft.activeStep = action.step;
      break;
    }
    case 'SET_SELECTED': {
      draft.selected = action.selected.filter(element => element !== undefined);
      break;
    }
    case 'SET_DOWNLOADING': {
      draft.downloading = action.status;
      break;
    }
    case 'SET_DOWNLOAD_BTN': {
      draft.downloadBtn = action.status;
      break;
    }
    case 'SET_DATA': {
      draft.data = action.payload;
      break;
    }
    case 'SET_DOWNLOAD': {
      draft.selectedSessions = action.selected;
      draft.activeStep = 2;
      draft.downloadBtn = true;
      draft.drawerOpen = true;
      break;
    }
    case 'SET_PAGE': {
      draft.page = action.payload;
      break;
    }
    case 'SET_ROWS_PER_PAGE': {
      draft.rowsPerPage = action.payload;
      break;
    }
    case 'SET_TOTAL': {
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
  }
});

function DataLibProvider({ children }) {
  const [state, dispatch] = useReducer(uploadReducer, initialState);

  return (
    <DataLibStateContext.Provider value={state}>
      <DataLibDispatchContext.Provider value={dispatch}>
        {children}
      </DataLibDispatchContext.Provider>
    </DataLibStateContext.Provider>
  );
}

function useDataLibState() {
  const context = useContext(DataLibStateContext);
  if (context === undefined) {
    throw new Error('useDataLibState must be used within a CountProvider');
  }
  return context;
}

function useDataLibDispatch() {
  const context = useContext(DataLibDispatchContext);
  if (context === undefined) {
    throw new Error('useDataLibDispatch must be used within a CountProvider');
  }
  return context;
}

export { DataLibProvider, useDataLibState, useDataLibDispatch };
