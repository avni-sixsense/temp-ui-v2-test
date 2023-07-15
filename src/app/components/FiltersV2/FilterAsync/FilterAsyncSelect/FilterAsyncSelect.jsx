import { FilterDropdownSelect } from '../../FilterDropdownSelect';

export const FilterAsyncSelect = ({ data, ...props }) => {
  const value = data[props.id]?.selectedOptions ?? [];
  return <FilterDropdownSelect {...props} value={value} />;
};
