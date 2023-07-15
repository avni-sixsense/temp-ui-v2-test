import React, { useEffect, useState } from 'react';

import FilterBox from './FilterBox';

const data = [
  {
    id: 1,
    name: 'Yes',
    value: 'true'
  },
  {
    id: 2,
    name: 'No',
    value: 'false'
  }
];

const AutoClassifiedFilter = ({
  filterKey,
  setFilters,
  filters,
  lightTheme
}) => {
  const [search, setSearch] = useState('');
  const [value, setValue] = useState([]);

  useEffect(() => {
    if (filters[filterKey] === undefined) {
      setValue([]);
      return;
    }
    if (filters[filterKey]) {
      setValue([
        {
          id: 1,
          name: 'Yes',
          value: 'true'
        }
      ]);
      return;
    }
    if (!filters[filterKey]) {
      setValue([
        {
          id: 2,
          name: 'No',
          value: 'false'
        }
      ]);
    }
  }, [filters, data]);

  const handleApplyFilter = () => {
    const ids = value.map(v => v.value);

    if (ids.length === 1) {
      if (ids[0] === 'true') {
        const temp = {};
        temp[filterKey] = true;
        setFilters(prev => {
          return { ...prev, ...temp };
        });
      } else {
        const temp = {};
        temp[filterKey] = false;
        setFilters(prev => {
          return { ...prev, ...temp };
        });
      }
    } else {
      setFilters(prev => {
        delete prev[filterKey];
        return { ...prev };
      });
    }
  };
  const isItemLoaded = index => {
    return !!data[index];
  };
  const itemcount = () => {};
  return (
    <FilterBox
      lightTheme={lightTheme}
      data={data}
      id='is_autoclassified'
      onClose={handleApplyFilter}
      title='Auto-classified'
      isItemLoaded={isItemLoaded}
      itemcount={itemcount}
      handleSearch={setSearch}
      search={search}
      value={value}
      setValue={setValue}
    />
  );
};

export default AutoClassifiedFilter;
