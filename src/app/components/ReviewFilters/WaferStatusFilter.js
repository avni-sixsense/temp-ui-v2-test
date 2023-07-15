import { keyBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { WAFER_STATUS_CONSTANTS } from 'store/aiPerformance/constants';

import FilterBox from './FilterBox';

const data = keyBy(
  Object.keys(WAFER_STATUS_CONSTANTS).map((key, index) => {
    return {
      id: index,
      name: WAFER_STATUS_CONSTANTS[key],
      value: key
    };
  }),
  'value'
);

const WaferStatusFilter = ({ filterKey, setFilters, filters, lightTheme }) => {
  const [search, setSearch] = useState('');
  const [value, setValue] = useState([]);

  useEffect(() => {
    if (filters[filterKey] === undefined) {
      setValue([]);
      return;
    }
    if (filters[filterKey]) {
      const appliedValues = filters[filterKey].split(',');
      setValue(appliedValues.map(key => data[key]));
      return;
    }
  }, [filters, filterKey]);

  const handleApplyFilter = () => {
    const ids = value.map(v => v.value);

    setFilters(prev => {
      return { ...prev, [filterKey]: ids.join(',') };
    });
  };

  const isItemLoaded = index => {
    return !!Object.values(data)[index];
  };

  const itemcount = () => {};

  return (
    <FilterBox
      lightTheme={lightTheme}
      data={Object.values(data).filter(item =>
        (item.name || '').toLowerCase().includes(search.toLowerCase())
      )}
      id='status__in'
      onClose={handleApplyFilter}
      title='Wafer Status'
      isItemLoaded={isItemLoaded}
      itemcount={itemcount}
      handleSearch={setSearch}
      search={search}
      value={value}
      setValue={setValue}
    />
  );
};

export default WaferStatusFilter;
