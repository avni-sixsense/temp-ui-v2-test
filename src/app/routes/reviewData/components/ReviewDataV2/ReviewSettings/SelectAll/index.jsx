import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@material-ui/core/Box';
import CustomizedCheckbox from 'app/components/ReviewCheckbox';

import { setSelectAll } from 'store/reviewData/actions';
import { selectSelectAll } from 'store/reviewData/selector';

const SelecteAllImages = () => {
  const dispatch = useDispatch();
  const selectAll = useSelector(selectSelectAll);

  const handleSelectAll = useCallback(event => {
    dispatch(setSelectAll(event.target.checked));
  }, []);

  return (
    <Box display='flex' alignItems='center'>
      <CustomizedCheckbox
        checked={selectAll}
        onChange={handleSelectAll}
        label='Select All'
      />
    </Box>
  );
};

export default SelecteAllImages;
