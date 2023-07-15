import React, { useEffect, useState } from 'react';

import FilterBox from './FilterBox';

const reviewedFilterData = [
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
const ReviewedFilter = ({ filterKey, setFilters, filters, lightTheme }) => {
  const [search, setSearch] = useState('');
  const [value, setValue] = useState([]);

  useEffect(() => {
    if (filters[filterKey] === undefined) {
      setValue([]);
      return;
    }
    if (String(filters[filterKey]) === 'true') {
      setValue([
        {
          id: 1,
          name: 'Yes',
          value: 'true'
        }
      ]);
      return;
    }
    if (String(filters[filterKey]) === 'false') {
      setValue([
        {
          id: 2,
          name: 'No',
          value: 'false'
        }
      ]);
    }
  }, [filters, reviewedFilterData]);

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
  return (
    <FilterBox
      lightTheme={lightTheme}
      data={reviewedFilterData}
      id='is_reviewed'
      onClose={handleApplyFilter}
      title='Reviewed'
      handleSearch={setSearch}
      search={search}
      value={value}
      setValue={setValue}
    />
  );
};

export default ReviewedFilter;
