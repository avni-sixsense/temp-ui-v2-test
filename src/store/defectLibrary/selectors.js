import { createSelector } from 'reselect';

const selectDefects = state => state.defectLibrary;

export const selectDefectsData = createSelector(
  [selectDefects],
  defects => defects.data
);

export const selectDefectById = id =>
  createSelector(
    [selectDefectsData],
    data => data.filter(item => item.id === id)[0] || {}
  );

export const selectDefectLibDrawerOpen = createSelector(
  [selectDefects],
  defects => defects.drawerOpen
);

export const selectDefectLibTotal = createSelector(
  [selectDefects],
  defects => defects.total
);

export const selectDefectLibExpandAll = createSelector(
  [selectDefects],
  defects => defects.expandAll
);

export const selectDefectLibSelected = createSelector(
  [selectDefects],
  defects => defects.selected
);

export const selectDefectLibRowsPerPage = createSelector(
  [selectDefects],
  defects => defects.rowsPerPage
);

export const selectDefectLibPage = createSelector(
  [selectDefects],
  defects => defects.page
);

export const selectDefectLibActiveStep = createSelector(
  [selectDefects],
  defects => defects.activeStep
);
export const selectDefectLibMode = createSelector(
  [selectDefects],
  defects => defects.mode
);
export const selectDefectLibNewDefect = createSelector(
  [selectDefects],
  defects => defects.defect
);
export const selectDefectLibGlobalMode = createSelector(
  [selectDefects],
  defects => defects.globalMode
);
