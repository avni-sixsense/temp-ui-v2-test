import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  setModelDetectionList,
  setSorting,
  setUseAIAssistance
} from 'store/reviewData/actions';
import { SORTING_CONSTANTS } from 'store/reviewData/constants';
import {
  selectSorting,
  selectUseAiAssistance
} from 'store/reviewData/selector';

const mapReviewState = createStructuredSelector({
  useAIAssistance: selectUseAiAssistance,
  sorting: selectSorting
});

const UseAiAssistanceContainer = ({ onChange }) => {
  const dispatch = useDispatch();
  const { useAIAssistance, sorting } = useSelector(mapReviewState);

  const handleUseAIAssistanceChange = event => {
    dispatch({
      type: 'SET_AI_ASSISTANCE_BUTTON',
      payload: event.target.checked
    });
    if (event.target.checked) {
      dispatch(setUseAIAssistance(true));
    } else {
      if (
        sorting.sortBy === SORTING_CONSTANTS.SIMILARITY ||
        sorting.sortBy === SORTING_CONSTANTS.AI_OUTPUT
      ) {
        dispatch(
          setSorting({
            sortDirection: 'ascending',
            sortBy: 'image_data'
          })
        );
      }
      dispatch(setUseAIAssistance(false));
      onChange({});
      dispatch(setModelDetectionList([]));
    }
  };

  return (
    <CustomizedCheckbox
      checked={useAIAssistance}
      onChange={handleUseAIAssistanceChange}
      label='Use AI Assistance'
    />
  );
};

export default UseAiAssistanceContainer;
