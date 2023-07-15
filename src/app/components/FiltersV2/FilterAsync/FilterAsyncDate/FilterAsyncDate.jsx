import { FilterDropdownDate } from '../../FilterDropdownDate';

export const FilterAsyncDate = ({ data, ...props }) => {
  const value = data[props.id]?.selectedOptions ?? [];
  return <FilterDropdownDate {...props} value={value} />;
};
