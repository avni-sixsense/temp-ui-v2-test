import { createSelector } from 'reselect';

const selectDataLibrary = state => state.dataLibrary;

export const selectTableStructure = createSelector(
  [selectDataLibrary],
  dataLibrary => dataLibrary.tableStructure
);
