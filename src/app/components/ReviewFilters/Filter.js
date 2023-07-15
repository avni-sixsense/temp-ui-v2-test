import api from 'app/api';
import { keyBy } from 'lodash';
import PropType from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import FilterBox from './FilterBox';

const Filter = ({
  info,
  setFilters,
  filters,
  lightTheme,
  date,
  clearFilter = false,
  handleClearFilter,
  waferMeta = false
}) => {
  const { data: filtersData, isLoading: isFilterLoading } = useQuery(
    [info.field, date],
    context => api.getFilters(...context.queryKey),
    { enabled: !!(date.start && date.end) && !waferMeta }
  );

  const { data: waferFiltersData, isLoading: isWaferFilterLoading } = useQuery(
    [info.field, date],
    context => api.getWaferMetaFilters(...context.queryKey),
    { enabled: !!(date.start && date.end) && waferMeta }
  );

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [value, setValue] = useState([]);

  useEffect(() => {
    const keys = keyBy(items, 'name');
    if (
      Array.isArray(filters[`meta_info__${info.field}__in`]) &&
      items.length
    ) {
      setValue(filters[`meta_info__${info.field}__in`].map(x => keys[x]));
    } else {
      setValue([]);
    }
  }, [filters, items]);

  useEffect(() => {
    if (filtersData) {
      setItems(
        filtersData.map((item, index) => {
          return {
            id: index,
            name: item || 'BLANK'
          };
        })
      );
    }
  }, [filtersData]);

  useEffect(() => {
    if (waferFiltersData) {
      setItems(
        waferFiltersData.map((item, index) => {
          return {
            id: index,
            name: item || 'BLANK'
          };
        })
      );
    }
  }, [waferFiltersData]);

  const handleApplyFilter = () => {
    const temp = {};
    const key = `meta_info__${info.field}__in`;

    temp[key] = value.map(item => item.name);

    setFilters(prev => {
      return { ...prev, ...temp };
    });
  };

  const isItemLoaded = index => {
    return !!items[index];
  };
  return (
    <FilterBox
      lightTheme={lightTheme}
      data={items.filter(item =>
        (item.name || '').toLowerCase().includes(search.toLowerCase())
      )}
      isLoading={isFilterLoading || isWaferFilterLoading}
      id='virtualize-demo'
      onClose={handleApplyFilter}
      title={`${info.name}`}
      isItemLoaded={isItemLoaded}
      itemcount={items.length || 0}
      handleSearch={setSearch}
      search={search}
      value={value}
      setValue={setValue}
      clearFilter={clearFilter}
      onClearFilter={handleClearFilter}
    />
  );
};

export default Filter;

Filter.propTypes = {
  info: PropType.object.isRequired
};
