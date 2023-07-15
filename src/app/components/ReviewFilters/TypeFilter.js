import { keyBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import FilterBox from './FilterBox';

const TypeFilter = ({ filterKey, data, setFilters, filters, lightTheme }) => {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [value, setValue] = useState([]);
  const typeDict = keyBy(data, 'value');

  const handleApplyFilter = () => {
    const ids = value.map(v => v.value);
    const temp = {};
    temp[filterKey] = ids;

    setFilters(prev => {
      return { ...prev, ...temp };
    });
  };
  useEffect(() => {
    if (Array.isArray(filters[filterKey]) && data.length) {
      setValue(filters[filterKey].map(x => typeDict[x]));
    } else {
      setValue([]);
    }
  }, [filters, data]);

  const isItemLoaded = index => {
    return !!data[index];
  };
  const itemcount = () => {};
  return (
    <FilterBox
      lightTheme={lightTheme}
      data={data}
      id={filterKey}
      onClose={handleApplyFilter}
      title={`${
        (location.pathname.includes('results') &&
          location.pathname.includes('data')) ||
        location.pathname.includes('dashboard')
          ? 'Training Type'
          : 'Type'
      }`}
      isItemLoaded={isItemLoaded}
      itemcount={itemcount}
      handleSearch={setSearch}
      search={search}
      value={value}
      setValue={setValue}
    />
  );
};

export default TypeFilter;
