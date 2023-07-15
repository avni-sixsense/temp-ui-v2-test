import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress } from '@material-ui/core';
import api from 'app/api';
import { FilterUrl } from 'app/components/FiltersV2';
import { FILTER_IDS } from 'app/constants/filters';
import Show from 'app/hoc/Show';
import {
  converObjArraytoString,
  getDateFromParams,
  getParamsObjFromEncodedString
} from 'app/utils/helpers';
import useApi from 'app/hooks/useApi';

import { goToPreviousRoute } from 'app/utils/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { DataCard } from 'app/components/DataCard';
import { setConfusionModel } from 'store/aiPerformance/actions';
import SimilarityThresholdSection from '../SimilarityThresholdSection';
import { getModalAccuracyData } from 'app/api/ModalPerformance';
import { DeployModelContainer } from './DeployModelContainer';

import classes from './Header.module.scss';
import { MODEL_STATUS_CONSTANTS } from 'store/aiPerformance/constants';

const { DATE, FOLDER, GROUND_TRUTH, WAFER, BOOKMARK } = FILTER_IDS;

const OVERALL_CARDS = [
  {
    key: 'auto_classified_percentage',
    title: 'Auto-classification',
    isPercent: true,
    //improvement: '-5',
    unit: '',
    onClickData: { is_confident_defect: true }
  },
  {
    title: 'Accuracy',
    key: 'accuracy_percentage',
    isPercent: true,
    // improvement: '5',
    unit: '',
    onClickData: { is_accurate: true }
  },
  {
    key: 'total',
    title: 'Total Images',
    unit: '',
    onClickData: { is_inferenced: true }
  },
  {
    key: 'audited',
    title: 'Audited Images',
    value: '9000',
    unit: '',
    onClickData: { is_audited: true }
  },
  {
    key: 'accurate',
    title: 'Correctly Classified Images',
    value: '8000',
    unit: '',
    onClickData: { is_accurate: true }
  }
];

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { subscriptionId, packId, modelId } = useParams();
  const [model, setModel] = useState(null);
  const [usecase, setUsecase] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const decodedDateParams = getDateFromParams(window.location.search);
  const paramsObj = getParamsObjFromEncodedString(window.location.search, [
    'date',
    'ml_model_id__in',
    'accuracy'
  ]);

  const APIParams = converObjArraytoString(paramsObj);

  const { data = {}, isLoading: isApiLoading } = useApi(getModalAccuracyData, {
    allowedKeys: [],
    unit: 'file',
    ml_model_id__in: modelId,
    ...APIParams,
    ...decodedDateParams
  });

  useEffect(() => {
    const params = getParamsObjFromEncodedString(location.search);
    if (params.ml_model_id__in) {
      setIsLoading(true);
      api
        .getMlModelByid(params.ml_model_id__in)
        .then(res => {
          dispatch(setConfusionModel(res));
          setModel(res);
          api.getUsecaseById(res.use_case).then(res => {
            setUsecase(res);
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [location.search]);

  const handlePreviousClick = () => {
    goToPreviousRoute(navigate, `/${subscriptionId}/${packId}/library/model`);
  };

  const onDeploySuccess = () => {
    setModel(d => ({ ...d, status: 'deployed_in_prod' }));
  };

  const onUndeploySuccess = () => {
    setModel(d => ({ ...d, status: 'retired' }));
  };

  const primaryFilters = useMemo(() => [DATE, FOLDER, GROUND_TRUTH, WAFER], []);
  const secondaryFilters = useMemo(() => [BOOKMARK], []);

  const cardList = OVERALL_CARDS.map(item => {
    return { ...item, value: data[item.key] || 0 };
  });

  return (
    <div className={classes.headerContainer}>
      <div className={classes.titleContainer}>
        <div className={classes.title}>
          <FontAwesomeIcon icon={faArrowLeft} onClick={handlePreviousClick} />
          Model Performance
        </div>

        <DeployModelContainer
          model={model}
          onDeploySuccess={onDeploySuccess}
          onUndeploySuccess={onUndeploySuccess}
        />
      </div>

      <div className={classes.infoContainer}>
        <Show when={isLoading}>
          <CircularProgress />
        </Show>

        <Show when={!isLoading}>
          <div className={classes.detailsContainer}>
            <div className={classes.valueContainer}>
              <div className={classes.title}>Model</div>
              <div className={classes.value}>{model?.name || ''}</div>
            </div>

            <div className={classes.valueContainer}>
              <div className={classes.title}>Usecase</div>
              <div className={classes.value}>{usecase?.name || ''}</div>
            </div>

            <div className={classes.valueContainer}>
              <div className={classes.title}>Status</div>
              <div className={classes.value}>
                {MODEL_STATUS_CONSTANTS[model?.status] || ''}
              </div>
            </div>
          </div>
        </Show>

        <SimilarityThresholdSection />

        <div className={classes.filterContainer}>
          <FilterUrl
            primaryFilters={primaryFilters}
            secondaryFilters={secondaryFilters}
            isFilterSetMetaFilters
          />
        </div>
        <DataCard
          isLoading={isApiLoading}
          cardList={cardList}
          containerOuter={classes.containerOuter}
          isModelPerformance
        />
      </div>
    </div>
  );
};

export default Header;
