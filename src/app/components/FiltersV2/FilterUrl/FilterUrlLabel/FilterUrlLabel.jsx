import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { FilterLabel } from '../../FilterLabel';

import { selectFilterSelectedOptionsById } from 'store/filter/selector';

import { getDateLabels } from 'app/utils/date';
import { isCustomDateRange, isDateFilter } from 'app/utils/filters';

const mapFilterState = id =>
  createStructuredSelector({
    selectedOptions: selectFilterSelectedOptionsById(id)
  });

export const FilterUrlLabel = ({
  id,
  label,
  defaultLabel,
  theme,
  mode = 'edit'
}) => {
  const { selectedOptions } = useSelector(mapFilterState(id));

  const isModeEdit = mode === 'edit';

  const filterLabel = isDateFilter(id)
    ? selectedOptions.length
      ? isCustomDateRange(selectedOptions)
        ? getDateLabels(selectedOptions.split(','), 'YYYY-MM-DD').join(' - ')
        : selectedOptions
      : defaultLabel
    : label;

  const len = !isDateFilter(id)
    ? Array.isArray(selectedOptions)
      ? selectedOptions.length
      : 1
    : 0;

  const labelValues = !isModeEdit
    ? !isDateFilter(id)
      ? Array.isArray(selectedOptions)
        ? selectedOptions.length
          ? selectedOptions.slice(0, 2).map(item => {
              const { name, organization_wafer_id } = item;

              const newName = name || organization_wafer_id;

              return newName.substring(0, 6);
            })
          : 'All'
        : selectedOptions.name
      : 0
    : null;

  return (
    <FilterLabel
      label={filterLabel}
      subLabel={len}
      theme={theme}
      values={labelValues}
    />
  );
};
