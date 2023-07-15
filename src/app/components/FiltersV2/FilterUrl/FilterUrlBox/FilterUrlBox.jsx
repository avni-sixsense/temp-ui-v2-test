import { useEffect, useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import queryString from 'query-string';

import { decodeURL } from 'app/utils/helpers';
import {
  decodeParamsValue,
  getAllowedKeysFromParams,
  isCustomDateRange,
  isDateFilter,
  isMoreFilter
} from 'app/utils/filters';
import { dateRangeFormatter } from 'app/utils/date';

import {
  addToMoreFilterById,
  clearFilterById,
  setFilterValue
} from 'store/filter/actions';

import { FilterBox } from '../../FilterBox';
import { FilterUrlLabel } from '../FilterUrlLabel/FilterUrlLabel';
import { FilterUrlDate } from '../FilterUrlDate';
import { FilterUrlSelect } from '../FilterUrlSelect';

export const FilterUrlBox = memo(
  props => {
    const {
      id,
      label,
      type,
      isSecondaryFilter,
      setFilterList,
      defaultOptions,
      url_key,
      isMultiSelect,
      getListByIds,
      uniqueId,
      defaultValue
    } = props;

    const { subscriptionId } = useParams();

    const dispatch = useDispatch();

    const [optionsByIds, setOptionsByIds] = useState([]);

    function onClearFilterById(id) {
      dispatch(clearFilterById(id));
    }

    function onFilterValueChange(payload) {
      dispatch(setFilterValue(payload));
    }

    useEffect(() => {
      if (!isMoreFilter(id)) {
        const decodedUrl = queryString.parse(window.location.search);

        const contextualFilters = decodeURL(decodedUrl.contextual_filters);
        const otherFilters = decodeURL(decodedUrl.other_filters);

        const newParamsObj = { ...contextualFilters, ...otherFilters };

        let paramsVal = newParamsObj[url_key];

        if (paramsVal) {
          if (!isMultiSelect && Array.isArray(paramsVal)) {
            paramsVal = paramsVal.join(',');
          }

          if (isDateFilter(type)) {
            const dateVal = isCustomDateRange(paramsVal)
              ? dateRangeFormatter(paramsVal.split(',')).join(',')
              : paramsVal;

            if (dateVal !== defaultValue?.label) {
              onFilterValueChange({ id, url_key, selectedOptions: dateVal });
            }
          } else if (defaultOptions) {
            const selectedOptions = isMultiSelect
              ? (Array.isArray(paramsVal) ? paramsVal : [paramsVal]).map(d =>
                  defaultOptions.find(e => e.id === d)
                )
              : defaultOptions.find(
                  e => (e.value ?? e.id) === decodeParamsValue(paramsVal)
                );

            onFilterValueChange({ id, url_key, selectedOptions });

            if (isSecondaryFilter) {
              dispatch(addToMoreFilterById({ id, name: label }));
            }

            setOptionsByIds(selectedOptions);

            setFilterList(prev => {
              const idx = prev.findIndex(d => d.id === id);
              prev[idx].show = true;
              return [...prev];
            });
          } else {
            (async () => {
              const { results } = await getListByIds({
                subscriptionId,
                ids: paramsVal,
                params: getAllowedKeysFromParams(window.location.search, id)
              });

              onFilterValueChange({ id, url_key, selectedOptions: results });
              setOptionsByIds(results);
            })();
          }
        } else {
          setOptionsByIds([]);
        }
      }
    }, [uniqueId]);

    return (
      <FilterBox
        {...props}
        optionsByIds={optionsByIds}
        onClearFilterById={onClearFilterById}
        onFilterValueChange={onFilterValueChange}
        filterLabel={FilterUrlLabel}
        filterDate={FilterUrlDate}
        filterSelect={FilterUrlSelect}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.uniqueId === nextProps.uniqueId &&
      prevProps.show === nextProps.show &&
      prevProps.isDropdownOpen === nextProps.isDropdownOpen
    );
  }
);
