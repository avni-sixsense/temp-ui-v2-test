import { useEffect, useState } from 'react';
import { keyBy } from 'lodash';

import { MODEL_STATUS_CONSTANTS } from 'store/aiPerformance/constants';

import FilterBox from './FilterBox';

const data = keyBy(
  Object.keys(MODEL_STATUS_CONSTANTS).map((key, index) => {
    return { id: index, name: MODEL_STATUS_CONSTANTS[key], value: key };
  }),
  'value'
);

const ModelStatusFilter = ({ filterKey, setFilters, filters, lightTheme }) => {
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
      id='status'
      onClose={handleApplyFilter}
      title='Status'
      isItemLoaded={isItemLoaded}
      itemcount={itemcount}
      handleSearch={setSearch}
      search={search}
      value={value}
      setValue={setValue}
    />
  );
};

export default ModelStatusFilter;
