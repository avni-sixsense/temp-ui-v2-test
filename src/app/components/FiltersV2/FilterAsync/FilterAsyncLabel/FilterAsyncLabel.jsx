import { getDateLabels } from 'app/utils/date';
import { isCustomDateRange, isDateFilter } from 'app/utils/filters';

import { FilterLabel } from '../../FilterLabel';

export const FilterAsyncLabel = ({
  id,
  label,
  defaultLabel,
  theme,
  data,
  mode = 'edit'
}) => {
  const selectedOptions = data[id]?.selectedOptions ?? [];

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
