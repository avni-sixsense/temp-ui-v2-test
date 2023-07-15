import { useParams } from 'react-router-dom';

import ReviewArea from './ReviewArea';
import Sidebar from './Sidebar';

import { AUDIT, MANUAL_CLASSIFY, Review } from 'store/reviewData/constants';

import classes from './ReviewBody.module.scss';
import { createStructuredSelector } from 'reselect';
import { selectUsecaseType } from 'store/helpers/selector';
import { useSelector } from 'react-redux';
import { FilterUrl } from 'app/components/FiltersV2';
import { FILTER_IDS } from 'app/constants/filters';
import { useEffect, useMemo } from 'react';
import {
  selectIsModelAppliedForAll,
  selectUseAiAssistance
} from 'store/reviewData/selector';
import { encodeURL, getDecodedURL } from 'app/utils/helpers';
import queryString from 'query-string';
import useStableNavigate from 'app/hooks/useStableNavigate';
import { toast } from 'react-toastify';

const mapReviewBodyState = createStructuredSelector({
  useCaseType: selectUsecaseType
});

const mapReviewToState = createStructuredSelector({
  useAiAssitance: selectUseAiAssistance,
  isModelAppliedForAll: selectIsModelAppliedForAll
});

const {
  DATE,
  IMAGE_TAG,
  GROUND_TRUTH,
  REVIEWED,
  AUTO_CLASSIFIED,
  WAFER,
  BOOKMARK,
  AI_OUTPUT,
  MODEL
} = FILTER_IDS;

const ReviewBody = () => {
  const navigate = useStableNavigate();
  const { annotationType } = useParams();

  const { useCaseType } = useSelector(mapReviewBodyState);

  const { useAiAssitance, isModelAppliedForAll } =
    useSelector(mapReviewToState);

  useEffect(() => {
    if (!(useAiAssitance && isModelAppliedForAll)) {
      const { decodedContextual, decodedOther, ...rest } = getDecodedURL(
        window.location.search
      );

      if (
        !useAiAssitance &&
        (decodedContextual.ai_predicted_label__in ||
          decodedOther.ai_predicted_label__in)
      ) {
        delete decodedContextual.ai_predicted_label__in;
        delete decodedOther.ai_predicted_label__in;

        const params = queryString.stringify({
          contextual_filters: encodeURL(decodedContextual),
          other_filters: encodeURL(decodedOther),
          ...rest
        });

        toast(
          'Use AI Assistance turned off. AI Output filter will be removed.'
        );

        navigate(`${window.location.pathname}?${params}`);
      }
    }
  }, [useAiAssitance, isModelAppliedForAll]);

  const primaryFilters = useMemo(
    () =>
      [
        { type: DATE, show: true },
        { type: IMAGE_TAG, show: true },
        {
          type: GROUND_TRUTH,
          show:
            annotationType === MANUAL_CLASSIFY ||
            (annotationType !== MANUAL_CLASSIFY &&
              useCaseType === 'CLASSIFICATION')
        },
        { type: REVIEWED, show: true },
        {
          type: AUTO_CLASSIFIED,
          show: annotationType !== AUDIT && useCaseType === 'CLASSIFICATION'
        },
        { type: WAFER, show: annotationType === Review },
        {
          type: AI_OUTPUT,
          show:
            useCaseType === 'CLASSIFICATION' &&
            useAiAssitance &&
            isModelAppliedForAll
        }
      ]
        .filter(d => d.show)
        .map(d => d.type),
    [useCaseType, useAiAssitance, isModelAppliedForAll]
  );
  const secondaryFilters = useMemo(
    () => [
      BOOKMARK,
      { id: MODEL, url_key: 'training_ml_model__in', label: 'Training Model' }
    ],
    []
  );
  const ignoreFilterKeys = useMemo(
    () => ['upload_session_id__in', 'allWafersId', 'wafer_id__in'],
    []
  );

  return (
    <main className={classes.reviewBody}>
      <div className={classes.mainArea}>
        <FilterUrl
          primaryFilters={primaryFilters}
          secondaryFilters={secondaryFilters}
          isFilterSetMetaFilters
          ignoreFilterKeys={ignoreFilterKeys}
          theme='dark'
        />

        <ReviewArea />
      </div>

      <Sidebar />
    </main>
  );
};

export default ReviewBody;
