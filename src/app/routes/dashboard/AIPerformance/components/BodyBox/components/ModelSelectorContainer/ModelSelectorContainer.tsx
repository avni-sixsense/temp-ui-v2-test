import { useCallback, useEffect, useState } from 'react';
import { ModelSelector } from './ModelSelector';
import { CircularProgress, Paper } from '@material-ui/core';
import classes from './ModelSelector.module.scss';
import Label from 'app/components/Label';
import { DefectDistribution } from '../../../DefectDistribution';
import useApi from 'app/hooks/useApi';
import { getModelDeploymentHistory } from 'app/api/MlModel/DeploymentHistory';
import type {
  FetchModelDeploymentHistory,
  ModelDeploymentHistoryResponse,
  UnitType
} from 'app/api/MlModel/DeploymentHistory/types';
import WithCondition from 'app/hoc/WithCondition';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { selectConfusionUsecase } from 'store/aiPerformance/selectors';
import { useSelector } from 'react-redux';
import { getDateFromParams, getMaxDate, getMinDate } from 'app/utils/helpers';
import dayjs from 'dayjs';
import { DEFAULT_DATE_FORMAT } from 'app/utils/date';
import { OnDemandDefectDistribution } from '../../../DefectDistribution/OnDemandDefectDistribution';
import { FILTER_KEYS } from 'app/utils/constants';

const mapModelSelectorToState = createStructuredSelector({
  confusionUsecase: selectConfusionUsecase
});

const getDeployedModelUnit = (unit: string | undefined): 'image' | 'wafer' => {
  if (unit === 'file') return 'image';
  return 'wafer';
};

export const ModelSelectorContainer = () => {
  const { unit } = useParams();
  const { confusionUsecase } = useSelector(mapModelSelectorToState);
  const [modelList, setModelList] = useState<ModelDeploymentHistoryResponse[]>(
    []
  );
  const [value, setValue] = useState<ModelDeploymentHistoryResponse | null>(
    null
  );

  const {
    BOOKMARK_FILTER_KEY,
    DATE_FILTERS_KEYS,
    GROUND_TRUTH_FILTER_KEY,
    WAFER_FILTER_KEY
  } = FILTER_KEYS;

  const { data: deployedModelList, isLoading } = useApi<
    FetchModelDeploymentHistory & UnitType,
    ModelDeploymentHistoryResponse[]
  >(
    getModelDeploymentHistory,
    {
      allowedKeys: [
        ...DATE_FILTERS_KEYS,
        GROUND_TRUTH_FILTER_KEY,
        BOOKMARK_FILTER_KEY,
        WAFER_FILTER_KEY
      ],
      unit: getDeployedModelUnit(unit),
      use_case_id: confusionUsecase?.id
    },
    { enabled: !!confusionUsecase?.id }
  );

  useEffect(() => {
    setModelList([]);
    setValue(null);
  }, [confusionUsecase]);

  useEffect(() => {
    setModelList(deployedModelList || []);
    setValue(deployedModelList?.[0] || null);
  }, [deployedModelList]);

  const onModelChange = (model: ModelDeploymentHistoryResponse | null) => {
    if (model) {
      setValue(model);
    }
  };

  const getOptionLabel = (option: ModelDeploymentHistoryResponse) => {
    const { date__gte, date__lte } = getDateFromParams(window.location.search);
    const getStartDate = dayjs(
      getMaxDate(dayjs(date__gte, DEFAULT_DATE_FORMAT), option.starts_at)
    ).format("DD MMM'YY");
    const getEndDate = option.ends_at
      ? dayjs(
          getMinDate(dayjs(date__lte, DEFAULT_DATE_FORMAT), option.ends_at)
        ).format("DD MMM'YY")
      : 'Today';

    return `${option.ml_model_name} (${getStartDate} - ${getEndDate}) | ${option.auto_classification_percentage}% automation`;
  };

  if (!confusionUsecase?.id) return null;

  return (
    <div>
      <Paper className={classes.paper}>
        <WithCondition
          when={isLoading}
          then={<CircularProgress />}
          or={
            <div className={classes.container}>
              <Label
                label='Deployed Model'
                size='large'
                fontWeight='500'
                variant='tertiary'
              />
              <ModelSelector
                options={modelList}
                value={value}
                onChange={onModelChange}
                getOptionLabel={getOptionLabel}
              />
            </div>
          }
        />
      </Paper>
      {value?.ml_model_id && (
        <DefectDistribution mlModelId={value.ml_model_id}>
          <OnDemandDefectDistribution mlModelId={value.ml_model_id} />
        </DefectDistribution>
      )}
    </div>
  );
};
