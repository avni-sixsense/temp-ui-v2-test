import { memo, useEffect, useState } from 'react';

import { getFiltersMeta } from 'app/utils/filters';

import { FilterList } from '../FilterList';

import { FilterAsyncBox } from './FilterAsyncBox';

export const FilterAsync = memo(
  ({ primaryFilters = [], theme = 'light', data, setData, mode = 'edit' }) => {
    const [filterList, setFilterList] = useState([]);

    useEffect(() => {
      setFilterList(
        primaryFilters.map(d => {
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
    }, []);

    return (
      <FilterList
        filterList={filterList}
        setFilterList={setFilterList}
        theme={theme}
        filterBox={FilterAsyncBox}
        data={data}
        setData={setData}
        mode={mode}
      />
    );
  }
);
