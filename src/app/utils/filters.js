import {
  dateRanges,
  FILTERS_ALLOWED_API_KEYS,
  FILTERS_META,
  FILTER_IDS
} from 'app/constants/filters';
import {
  SEARCH_FILTER_PARAMS_KEYS,
  SEARCH_PAGE_PARAMS_KEYS
} from 'app/constants/searchParams';
import {
  encodeString,
  getParamsFromEncodedString,
  objectToParams
} from 'app/utils/helpers';

import store from 'store/index';

import { STORE_KEYS } from 'store/storeKeys';
import { STATE_KEYS } from 'store/filter/constants';

import {
  clearFilterById,
  clearFilterValue,
  removeFromMoreFilterById
} from 'store/filter/actions';
import dayjs from 'dayjs';
import { DEFAULT_DATE_FORMAT } from './date';

const { CONTEXTUAL_FILTERS, OTHER_FILTERS } = SEARCH_FILTER_PARAMS_KEYS;
const { FILTER } = STORE_KEYS;
const { ALL_FILTERS } = STATE_KEYS;

export function getFiltersMeta(id, param) {
  const meta = FILTERS_META[id];
  return typeof meta === 'function' ? meta(param) : meta;
}

export function isDateFilter(type) {
  return type === FILTER_IDS.DATE;
}

export function isMoreFilter(id) {
  return id === FILTER_IDS.MORE;
}

export function isCustomDateRange(value) {
  return !dateRanges[value];
}

export function decodeParamsValue(value) {
  if (value === 'true') return true;

  if (value === 'false') return false;

  return value;
}

export function clearSearchPageParamsKeys(searchParams) {
  Object.values(SEARCH_PAGE_PARAMS_KEYS).forEach(d => {
    searchParams.delete(d);
  });
}

export const precedentFilters = allFilters => {
  return Object.values(allFilters)
    .map(item => {
      const { url_key, selectedOptions } = item;
      if (isDateFilter(url_key)) {
        if (selectedOptions) {
          return `${url_key}=${
            isCustomDateRange(selectedOptions)
              ? selectedOptions
                  .split(',')
                  .map(date =>
                    dayjs(date, DEFAULT_DATE_FORMAT)
                      .utc()
                      .format(DEFAULT_DATE_FORMAT)
                  )
                  .join(',')
              : selectedOptions
          }`;
        }
        return '';
      }

      if (Array.isArray(selectedOptions)) {
        return `${url_key}=${selectedOptions.map(d => d.id).join(',')}`;
      }

      return `${url_key}=${selectedOptions.value}`;
    })
    .filter(d => d)
    .join('&');
};

export function handleApplyFilters({ searchParams, setSearchParams }) {
  const { getState } = store;
  const allFilters = getState()[FILTER][ALL_FILTERS];

  delete allFilters[FILTER_IDS.MORE];

  const newFilters = precedentFilters(allFilters);

  if (newFilters.length) {
    searchParams.set(OTHER_FILTERS, encodeString(newFilters));
  } else {
    searchParams.delete(OTHER_FILTERS);
  }

  clearSearchPageParamsKeys(searchParams);
  setSearchParams(searchParams);
}

export function handleClearFilters({ searchParams, setSearchParams }) {
  const { dispatch } = store;

  dispatch(clearFilterValue());
  searchParams.delete(OTHER_FILTERS);

  clearSearchPageParamsKeys(searchParams);
  setSearchParams(searchParams);
}

export function handleCloseSecondaryFilter(e, id, setFilterList) {
  const { dispatch } = store;

  e.stopPropagation();

  setFilterList(prev => {
    const idx = prev.findIndex(d => d.id === id);

    if (idx > -1) {
      prev[idx].isDropdownOpen = false;
      prev[idx].show = false;
    }

    return [...prev];
  });

  dispatch(clearFilterById(id));
  dispatch(removeFromMoreFilterById(id));
}

export function setSessionFilter(key, params) {
  sessionStorage.setItem(key, params);
}

export function getSessionFilter(key, setSearchParams) {
  const sessionFilter = sessionStorage.getItem(key);
  if (sessionFilter) setSearchParams(sessionFilter, { replace: true });
}

export function setFilterMeta(
  url_key,
  type,
  label,
  isMultiSelect,
  shouldCache,
  titleGetter
) {
  return {
    url_key: `meta_info__${url_key}__in`,
    id: `meta_info__${url_key}__in`,
    type,
    label,
    isMultiSelect,
    shouldCache,
    titleGetter
  };
}

// This function will filter the URL params from the allowed api keys list
// and will only send the params which are allowed on the respective api.

export function getAllowedKeysFromParams(params, filterId) {
  // getParamsFromEncodedString => this will always return object
  const decodedParams = getParamsFromEncodedString(params);

  // FILTERS_ALLOWED_API_KEYS[key] => this will always return Array<string>
  const allowedApiFilters = FILTERS_ALLOWED_API_KEYS[filterId];

  return objectToParams(
    (allowedApiFilters || []).reduce((prev, curr) => {
      if (decodedParams[curr]) {
        return { ...prev, [curr]: decodedParams[curr] };
      }

      return prev;
    }, {})
  );
}
