import { RESET_FILTER_QUERY, SET_FILTER_QUERY } from './constants';

export function setFilterQuery(payload) {
  return { type: SET_FILTER_QUERY, payload };
}

export function resetFilterQuery(payload) {
  return { type: RESET_FILTER_QUERY, payload };
}
