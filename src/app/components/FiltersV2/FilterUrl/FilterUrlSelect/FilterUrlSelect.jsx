import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { FilterDropdownSelect } from '../../FilterDropdownSelect';

import { selectFilterSelectedOptionsById } from 'store/filter/selector';

const mapFilterState = id =>
  createStructuredSelector({
    value: selectFilterSelectedOptionsById(id)
  });

export const FilterUrlSelect = props => {
  const { value } = useSelector(mapFilterState(props.id));

  return <FilterDropdownSelect {...props} value={value} />;
};
