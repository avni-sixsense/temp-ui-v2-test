import ReviewCheckbox from 'app/components/ReviewCheckbox';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setActiveImg, setSelectAll } from 'store/modelTraining/actions';
import {
  selectSelectAll,
  selectTrainingFilesetCount
} from 'store/modelTraining/selector';

import classes from './SelectAll.module.scss';

const mapSelectAllToState = createStructuredSelector({
  selectAll: selectSelectAll,
  count: selectTrainingFilesetCount
});

const SelectAllContainer = () => {
  const dispatch = useDispatch();
  const { selectAll, count } = useSelector(mapSelectAllToState);

  const handleSelectAll = event => {
    dispatch(setSelectAll(event.target.checked));
    if (event.target.checked) {
      dispatch(setActiveImg([]));
    }
  };

  return (
    <div className={classes.checkboxContainer}>
      <ReviewCheckbox
        label='Select All'
        lightTheme
        onChange={handleSelectAll}
        checked={selectAll}
        disabled={!count}
      />
    </div>
  );
};

export default SelectAllContainer;
