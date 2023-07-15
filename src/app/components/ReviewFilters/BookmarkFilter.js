import React, { useEffect, useState } from 'react';

import FilterBox from './FilterBox';

const bookmarkFilterData = [
  {
    id: 'bookmarked',
    name: 'Bookmarked'
  },
  {
    id: 'notBookmarked',
    name: 'Not Bookmarked'
  }
];
const BookmarkFilter = ({
  filterKey,
  setFilters,
  filters,
  lightTheme,
  clearFilter = false,
  handleClearFilter
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
          id: 'bookmarked',
          name: 'Bookmarked'
        }
      ]);
      return;
    }
    if (!filters[filterKey]) {
      setValue([
        {
          id: 'notBookmarked',
          name: 'Not Bookmarked'
        }
      ]);
    }
  }, [filters, bookmarkFilterData]);

  const handleApplyFilter = () => {
    const ids = value.map(v => v.id);
    if (ids.length === 1) {
      if (ids[0] === 'bookmarked') {
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
      setValue([]);
      setFilters(prev => {
        delete prev[filterKey];
        return { ...prev };
      });
    }
  };

  return (
    <FilterBox
      lightTheme={lightTheme}
      data={bookmarkFilterData}
      id='is_bookmarked'
      onClose={handleApplyFilter}
      title={`Bookmark`}
      handleSearch={setSearch}
      search={search}
      value={value}
      setValue={setValue}
      clearFilter={clearFilter}
      onClearFilter={handleClearFilter}
    />
  );
};

export default BookmarkFilter;
