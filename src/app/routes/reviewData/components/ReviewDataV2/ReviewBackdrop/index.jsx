import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { createStructuredSelector } from 'reselect';

import api from 'app/api';

import CommonBackdrop from 'app/components/CommonBackdrop';

import { AUDIT, MANUAL_CLASSIFY } from 'store/reviewData/constants';
import {
  selectActiveImageMode,
  selectActiveImg,
  selectContainerMeta,
  selectFetchingReviewData,
  selectIsBulkClassificationUpdating,
  selectReviewData,
  selectSearchText,
  selectSelectAll,
  selectSorting
} from 'store/reviewData/selector';
import {
  fetchFileSets,
  setImageModes,
  setOtherDefects,
  setUseAIAssistance
} from 'store/reviewData/actions';
import { getSortingParams } from 'app/utils/reviewData';

const mapReviewBackdropState = createStructuredSelector({
  containerMeta: selectContainerMeta,
  fetchingReviewData: selectFetchingReviewData,
  fileSets: selectReviewData,
  activeImageMode: selectActiveImageMode,
  sorting: selectSorting,
  activeImg: selectActiveImg,
  isBulkClassificationUpdating: selectIsBulkClassificationUpdating,
  selectAll: selectSelectAll,
  searchText: selectSearchText
});

const ReviewBackdrop = () => {
  const {
    containerMeta,
    fetchingReviewData,
    fileSets,
    activeImageMode,
    sorting,
    activeImg,
    isBulkClassificationUpdating,
    selectAll,
    searchText
  } = useSelector(mapReviewBackdropState);

  const location = useLocation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { annotationType, subscriptionId } = useParams();

  useEffect(() => {
    if (
      (annotationType === AUDIT || annotationType === MANUAL_CLASSIFY) &&
      !activeImageMode
    ) {
      return;
    }

    dispatch(
      fetchFileSets(
        `${location.search.replace('?', '')}${getSortingParams()}`,
        annotationType,
        activeImageMode,
        searchText,
        subscriptionId
      )
    );
  }, [location.search, activeImageMode, annotationType, sorting, searchText]);

  useEffect(() => {
    dispatch(setImageModes(annotationType));

    if (annotationType === AUDIT) {
      dispatch(setUseAIAssistance(false));
    }
  }, [annotationType]);

  const { data: defects } = useQuery(
    ['useCaseDefects', fileSets[activeImg[0]]?.use_case, subscriptionId],
    context => api.getUseCaseDefects(...context.queryKey),
    {
      enabled: !!(
        fileSets.length &&
        activeImg.length &&
        fileSets[activeImg[0]]?.use_case &&
        !fetchingReviewData &&
        subscriptionId
      )
    }
  );

  useEffect(() => {
    dispatch({
      type: 'SET_REVIEW_ACTION_BUTTONS',
      payload: {
        annotationType,
        multipleFilesets: activeImg.length > 1 || selectAll
      }
    });
  }, [activeImg, annotationType, selectAll]);

  useEffect(() => {
    if (defects?.results) {
      dispatch(setOtherDefects(defects.results));
    }
  }, [defects]);

  useEffect(() => {
    queryClient.invalidateQueries('inferenceStatus');
  }, [activeImg]);

  const isLoading =
    fetchingReviewData ||
    (fileSets.length > 0 && !containerMeta) ||
    isBulkClassificationUpdating;

  return <CommonBackdrop open={isLoading} invisible />;
};

export default ReviewBackdrop;
