import { ACTION_CONSTS } from './constants';

export function setFilterValue({ id, url_key, selectedOptions }) {
  return {
    type: ACTION_CONSTS.SET_FILTER_VALUE,
    payload: { id, url_key, selectedOptions }
  };
}

export function clearFilterValue() {
  return { type: ACTION_CONSTS.CLEAR_FILTER_VALUES };
}

export function clearAllFilters() {
  return { type: ACTION_CONSTS.CLEAR_ALL_FILTERS };
}

export function clearFilterById(id) {
  return { type: ACTION_CONSTS.CLEAR_FILTER_BY_ID, payload: id };
}

export function addToMoreFilterById(payload) {
  return { type: ACTION_CONSTS.ADD_TO_MORE_FILTER_BY_ID, payload };
}

export function removeFromMoreFilterById(id) {
  return { type: ACTION_CONSTS.REMOVE_FROM_MORE_FILTER_BY_ID, payload: id };
}

export function setIsFilterLoading(payload) {
  return { type: ACTION_CONSTS.SET_IS_FILTER_LOADING, payload };
}
