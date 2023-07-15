import React, { useState } from 'react';

import FilterBox from './FilterBox';

const info = {
  field: 'more',
  name: 'More'
};

const MoreFilter = ({
  lightTheme,
  data,
  value,
  setValue,
  handleApplyFilter
}) => {
  const [search, setSearch] = useState('');

  return (
    <FilterBox
      lightTheme={lightTheme}
      data={Object.values(data)}
      onClose={handleApplyFilter}
      title={`${info.name}`}
      id='virtualize-demo'
      handleSearch={setSearch}
      search={search}
      value={value}
      setValue={setValue}
    />
  );
};

export default MoreFilter;
