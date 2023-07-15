import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import queryString from 'query-string';

import {
  handleApplyFilters,
  handleClearFilters,
  isDateFilter,
  decodeParamsValue
} from 'app/utils/filters';
import { decodeURL } from 'app/utils/helpers';
import { FILTER_IDS } from 'app/constants/filters';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faFilter } from '@fortawesome/pro-solid-svg-icons';

import { selectAllFilters } from 'store/filter/selector';
import { FilterAction } from '../../FilterAction';

const mapFilterState = createStructuredSelector({
  allFilters: selectAllFilters
});

export const FilterUrlAction = ({ ignoreFilterKeys = [], theme }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { allFilters } = useSelector(mapFilterState);

  const [isClearFilters, setIsClearFilters] = useState(false);
  const [isApplyFiltersDisabled, setIsApplyFiltersDisabled] = useState(true);

  useEffect(() => {
    const decodedUrl = queryString.parse(location.search);

    // const contextualFilters = decodeURL(decodedUrl.contextual_filters);
    const otherFilters = decodeURL(decodedUrl.other_filters);

    // const paramsObj = {  ...otherFilters };

    ignoreFilterKeys.forEach(d => {
      delete otherFilters[d];
    });

    let isFiltersApplied = false;

    const copiedAllFilters = { ...allFilters };
    delete copiedAllFilters[FILTER_IDS.MORE];

    if (
      Object.keys(otherFilters).length !== Object.keys(copiedAllFilters).length
    ) {
      isFiltersApplied = true;
    }

    if (!isFiltersApplied) {
      for (const x in copiedAllFilters) {
        const { url_key, selectedOptions } = copiedAllFilters[x];

        const paramsVal = otherFilters[url_key];

        if (isDateFilter(url_key)) {
          if (!paramsVal) {
            continue;
          } else if (paramsVal !== selectedOptions) {
            isFiltersApplied = true;
            break;
          }
        } else {
          if (!paramsVal) {
            isFiltersApplied = true;
            break;
          }

          if (Array.isArray(selectedOptions)) {
            if (Array.isArray(paramsVal)) {
              if (selectedOptions.length !== paramsVal.length) {
                isFiltersApplied = true;
                break;
              }

              for (const y of paramsVal) {
                if (!selectedOptions.some(d => d.id === y)) {
                  isFiltersApplied = true;
                  break;
                }
              }
            } else if (typeof paramsVal === 'string') {
              if (
                selectedOptions.length > 1 ||
                selectedOptions[0].value !== paramsVal
              ) {
                isFiltersApplied = true;
                break;
              }
            } else {
              console.warn(`Uncaught params value in FilterUrlAction`);
            }
          } else if (decodeParamsValue(paramsVal) !== selectedOptions.value) {
            isFiltersApplied = true;
            break;
          }
        }
      }
    }

    setIsClearFilters(Object.keys(otherFilters).length > 0);
    setIsApplyFiltersDisabled(!isFiltersApplied);
  }, [location.search, allFilters, ignoreFilterKeys]);

  const actionBtns = useMemo(
    () => [
      {
        show: isClearFilters,
        text: 'Clear Filters',
        onClick: () => handleClearFilters({ searchParams, setSearchParams }),
        variant: theme === 'dark' ? 'primary' : 'tertiary',
        icon: <FontAwesomeIcon icon={faClose} />
      },
      {
        show: true,
        text: 'Apply Filters',
        onClick: () => handleApplyFilters({ searchParams, setSearchParams }),
        variant: 'primary',
        icon: <FontAwesomeIcon icon={faFilter} />,
        disabled: isApplyFiltersDisabled
      }
    ],
    [isClearFilters, isApplyFiltersDisabled]
  );

  return <FilterAction theme={theme} actionBtns={actionBtns} />;
};
