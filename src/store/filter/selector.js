import { createSelector } from 'reselect';

import { STORE_KEYS } from '../storeKeys';
import { STATE_KEYS } from './constants';

const selectFilter = state => state[STORE_KEYS.FILTER];

export const selectAllFilters = createSelector(
  [selectFilter],
  filter => filter[STATE_KEYS.ALL_FILTERS]
);

export const selectFilterById = id =>
  createSelector([selectAllFilters], allFilters => allFilters[id]);

export const selectFilterSelectedOptionsById = id =>
  createSelector(
    [selectFilterById(id)],
    filterById => filterById?.selectedOptions ?? []
  );

export const selectIsFilterLoading = createSelector(
  [selectFilter],
  filter => filter[STATE_KEYS.IS_FILTER_LOADING]
);
