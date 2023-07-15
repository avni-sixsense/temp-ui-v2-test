import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectFilterSelectedOptionsById } from 'store/filter/selector';

import { FilterDropdownDate } from '../../FilterDropdownDate';

const mapFilterDropdownDateState = id =>
  createStructuredSelector({
    value: selectFilterSelectedOptionsById(id)
  });

export const FilterUrlDate = props => {
  const { value } = useSelector(mapFilterDropdownDateState(props.id));
  return <FilterDropdownDate {...props} value={value} />;
};
