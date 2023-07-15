import { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import clsx from 'clsx';

import useStableNavigate from 'app/hooks/useStableNavigate';

import { SEARCH_FILTER_PARAMS_KEYS } from 'app/constants/searchParams';
import { DEFAULT_DATE_RANGE } from 'app/constants/filters';
import { decodeURL, encodeURL } from 'app/utils/helpers';
import { isDateFilter } from 'app/utils/filters';

import { clearAllFilters, setIsFilterLoading } from 'store/filter/actions';

import { FilterUrlList } from './FilterUrlList';
import { FilterUrlAction } from './FilterUrlAction';

import classes from './FilterUrl.module.scss';

export const FilterUrl = memo(
  ({
    primaryFilters = [],
    secondaryFilters = [],
    isFilterSetMetaFilters,
    isWaferbookMetaFilters,
    isMetaFiltersAsSecondaryFilters,
    ignoreFilterKeys = [],
    theme
  }) => {
    const dispatch = useDispatch();
    const navigate = useStableNavigate();

    useEffect(() => {
      dispatch(setIsFilterLoading(true));

      const params = queryString.parse(window.location.search);

      let contextualFilters = {};

      primaryFilters.forEach(d => {
        if (typeof d !== 'string' && d.defaultValue) {
          contextualFilters[d.id] = d.defaultValue;
        } else if (isDateFilter(d)) {
          contextualFilters[d] = DEFAULT_DATE_RANGE;
        }
      });

      if (Object.keys(contextualFilters).length > 0) {
        const prev = decodeURL(
          params[SEARCH_FILTER_PARAMS_KEYS.CONTEXTUAL_FILTERS]
        );

        if (prev) {
          contextualFilters = { ...contextualFilters, ...prev };
        }

        params[SEARCH_FILTER_PARAMS_KEYS.CONTEXTUAL_FILTERS] =
          encodeURL(contextualFilters);

        navigate(
          `${window.location.pathname}?${queryString.stringify(params)}`,
          {
            replace: true
          }
        );
      }

      dispatch(setIsFilterLoading(false));

      return () => {
        dispatch(clearAllFilters());
      };
    }, [
      primaryFilters,
      secondaryFilters,
      isFilterSetMetaFilters,
      isWaferbookMetaFilters,
      isMetaFiltersAsSecondaryFilters,
      ignoreFilterKeys
    ]);

    return (
      <div
        className={clsx(
          classes.filterUrl,
          theme === 'dark' && classes.darkFilterUrl
        )}
      >
        <FilterUrlList
          primaryFilters={primaryFilters}
          secondaryFilters={secondaryFilters}
          isFilterSetMetaFilters={isFilterSetMetaFilters}
          isWaferbookMetaFilters={isWaferbookMetaFilters}
          isMetaFiltersAsSecondaryFilters={isMetaFiltersAsSecondaryFilters}
          theme={theme}
        />

        <FilterUrlAction ignoreFilterKeys={ignoreFilterKeys} theme={theme} />
      </div>
    );
  }
);
