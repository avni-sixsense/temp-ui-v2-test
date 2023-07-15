import { memo, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useQueryClient } from 'react-query';

import { ThemeProvider } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import CommonBackdrop from 'app/components/CommonBackdrop';
import reviewTheme from 'app/configs/reviewTheme';

import { getParamsObjFromEncodedString } from 'app/utils/helpers';
import {
  setModelsDict,
  setUsecaseDict,
  setWafersDict
} from 'store/helpers/actions';
import {
  setAppliedForAllModelId,
  resetReviewData
} from 'store/reviewData/actions';
import {
  AI_OUTPUT_FILTER,
  GROUND_TRUTH_FILTER
} from 'store/filterQueries/constants';
import { resetFilterQuery } from 'store/filterQueries/actions';

import ReviewDataV2 from './components/ReviewDataV2';

const ReviewPage = props => {
  const dispatch = useDispatch();
  const location = useLocation();

  const queryClient = useQueryClient();

  const { subscriptionId } = useParams();

  const [isLoadingModel, setIsLoadingModel] = useState(true);

  useEffect(() => {
    return () => {
      dispatch(resetReviewData());

      dispatch(resetFilterQuery({ key: GROUND_TRUTH_FILTER }));
      dispatch(resetFilterQuery({ key: AI_OUTPUT_FILTER }));

      queryClient.invalidateQueries('uploadSessions');
    };
  }, []);

  useEffect(() => {
    const params = getParamsObjFromEncodedString(location.search);

    if (params.ml_model_id__in) {
      dispatch(setAppliedForAllModelId(params.ml_model_id__in));
    }

    setIsLoadingModel(false);
  }, []);

  useEffect(() => {
    dispatch(setUsecaseDict(subscriptionId));
    dispatch(setModelsDict(subscriptionId));
    dispatch(setWafersDict());
  }, [subscriptionId]);

  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />

      {!isLoadingModel && <ReviewDataV2 {...props} />}

      <CommonBackdrop open={isLoadingModel} />
    </ThemeProvider>
  );
};

export default memo(ReviewPage);
