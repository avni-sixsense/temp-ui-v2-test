import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import api from 'app/api';

import { FILTER_IDS } from 'app/constants/filters';
import { setFilterMeta, getFiltersMeta } from 'app/utils/filters';

import { selectTableStructure } from 'store/dataLibrary/selector';
import { selectWaferTableStructure } from 'store/helpers/selector';

import { FilterList } from '../../FilterList';
import { FilterUrlBox } from '../FilterUrlBox/FilterUrlBox';

const mapMetaFilters = (isFilterSetMetaFilters, isWaferbookMetaFilters) =>
  createStructuredSelector({
    metaFilters: isFilterSetMetaFilters
      ? selectTableStructure
      : isWaferbookMetaFilters
      ? selectWaferTableStructure
      : () => []
  });

export const FilterUrlList = ({
  primaryFilters,
  secondaryFilters,
  isFilterSetMetaFilters,
  isWaferbookMetaFilters,
  isMetaFiltersAsSecondaryFilters = true,
  theme
}) => {
  const [filterList, setFilterList] = useState([]);

  const { metaFilters } = useSelector(
    mapMetaFilters(isFilterSetMetaFilters, isWaferbookMetaFilters),
    (prev, next) => {
      return prev.metaFilters.length === next.metaFilters.length;
    }
  );

  useEffect(() => {
    const newFilterList = [];

    newFilterList.push(
      ...primaryFilters.map(d => {
        if (typeof d === 'string') {
          return {
            id: d,
            isDropdownOpen: false,
            isSecondaryFilter: false,
            show: true,
            ...getFiltersMeta(d)
          };
        }

        const { id, defaultValue, ...rest } = d;

        return {
          id: id,
          isDropdownOpen: false,
          isSecondaryFilter: false,
          show: true,
          ...getFiltersMeta(id, defaultValue),
          ...rest
        };
      })
    );

    if (secondaryFilters.length > 0) {
      newFilterList.push(
        ...secondaryFilters.map(d => {
          if (typeof d === 'string') {
            return {
              id: d,
              isDropdownOpen: false,
              isSecondaryFilter: true,
              show: false,
              ...getFiltersMeta(d)
            };
          }

          const { id, ...rest } = d;

          return {
            id: id,
            isDropdownOpen: false,
            isSecondaryFilter: true,
            show: false,
            ...getFiltersMeta(id),
            ...rest
          };
        })
      );
    }

    if (metaFilters.length) {
      metaFilters
        .filter(d => d.is_filterable)
        .map(d =>
          newFilterList.push({
            id: d.field,
            isDropdownOpen: false,
            isSecondaryFilter: isMetaFiltersAsSecondaryFilters,
            show: !isMetaFiltersAsSecondaryFilters,
            ...setFilterMeta(
              d.field,
              'select',
              d.name,
              true,
              false,
              ({ value }) => value.toString()
            ),
            getList: ({ params }) =>
              isWaferbookMetaFilters
                ? api.getWaferMetaFilters(d.field, params)
                : api.getFilters(d.field, params),
            getListByIds: ({ params, ids }) =>
              isWaferbookMetaFilters
                ? api.getWaferMetaFilters(d.field, params, ids)
                : api.getFilters(d.field, params, ids)
          })
        );
    }

    if (newFilterList.find(d => d.isSecondaryFilter)) {
      newFilterList.push({
        id: FILTER_IDS.MORE,
        isDropdownOpen: false,
        isSecondaryFilter: false,
        show: true,
        ...getFiltersMeta(
          FILTER_IDS.MORE,
          newFilterList.filter(d => d.isSecondaryFilter)
        )
      });
    }

    setFilterList(newFilterList);
  }, [
    primaryFilters,
    secondaryFilters,
    metaFilters,
    isMetaFiltersAsSecondaryFilters
  ]);

  return (
    <FilterList
      filterList={filterList}
      setFilterList={setFilterList}
      theme={theme}
      filterBox={FilterUrlBox}
    />
  );
};
