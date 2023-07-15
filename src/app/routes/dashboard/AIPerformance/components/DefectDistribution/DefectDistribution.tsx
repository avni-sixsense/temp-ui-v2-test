import { useSelector } from 'react-redux';
import useApi from 'app/hooks/useApi';
import { getRawConfusionMatrics } from 'app/api/AiPerformance/RawConfusionMatrics';
import { selectIsFilterLoading } from 'store/filter/selector';
import { useEffect } from 'react';
import { useAppDispatch } from 'store';
import {
  resetDefectDistributionData,
  setConfusionMatrics,
  setDefectBasedDistribution,
  setDefectDistributionIndividualLoading,
  setMisclassificationPairs
} from 'store/aiPerformance/actions';
import { DEFECT_DISTRIBUTION_CONSTANTS } from 'store/aiPerformance/constants';
import type {
  RawConfusionMatricsParams,
  RawConfusionMatricsResponse
} from 'app/api/AiPerformance/RawConfusionMatrics/types';
import { FILTER_KEYS } from 'app/utils/constants';

export const DefectDistribution = ({
  mlModelId,
  children
}: {
  mlModelId: number;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const isFilterLoading = useSelector(selectIsFilterLoading);

  const {
    BOOKMARK_FILTER_KEY,
    DATE_FILTERS_KEYS,
    FOLDER_FILTER_KEY,
    GROUND_TRUTH_FILTER_KEY,
    IMAGE_TAG_FILTER_KEY,
    TRAINING_TYPE_FILTER_KEY,
    WAFER_FILTER_KEY
  } = FILTER_KEYS;
  const { data, isLoading } = useApi<
    RawConfusionMatricsParams,
    RawConfusionMatricsResponse
  >(
    getRawConfusionMatrics,
    {
      allowedKeys: [
        ...DATE_FILTERS_KEYS,
        FOLDER_FILTER_KEY,
        WAFER_FILTER_KEY,
        IMAGE_TAG_FILTER_KEY,
        GROUND_TRUTH_FILTER_KEY,
        TRAINING_TYPE_FILTER_KEY,
        BOOKMARK_FILTER_KEY
      ],
      mlModelId
    },
    {
      enabled: !isFilterLoading && !!mlModelId
    }
  );

  useEffect(() => {
    if (data && !isLoading) {
      dispatch(setConfusionMatrics(data));
      dispatch(setMisclassificationPairs(data));
      dispatch(setDefectBasedDistribution(data));
    } else if (isLoading) {
      dispatch(
        setDefectDistributionIndividualLoading(
          DEFECT_DISTRIBUTION_CONSTANTS.CONFUSION_MATRICS
        )
      );
      dispatch(
        setDefectDistributionIndividualLoading(
          DEFECT_DISTRIBUTION_CONSTANTS.MISCLASSIFICATION_PAIR
        )
      );
      dispatch(
        setDefectDistributionIndividualLoading(
          DEFECT_DISTRIBUTION_CONSTANTS.DEFECT_BASED_DISTRIBUTION
        )
      );
      dispatch(
        setDefectDistributionIndividualLoading(
          DEFECT_DISTRIBUTION_CONSTANTS.USECASE_DEFECTS
        )
      );
    }

    return () => {
      dispatch(resetDefectDistributionData());
    };
  }, [data, isLoading]);

  if (!mlModelId) return null;

  return <>{children}</>;
};
