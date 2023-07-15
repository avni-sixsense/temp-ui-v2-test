import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import clsx from 'clsx';

import { Typography } from '@material-ui/core';

import ModelTrainingLayout from '../components/Layout';
import OverlayComp from 'app/components/Overlay';
import SSRadioGroup from 'app/components/SSRadioGroup';
import DataInsightsContainer from './component/DataInsights';
import TrainingConfigContainer from './component/TrainingConfigSlider';

import {
  setDefectsInstancesCount,
  setModelUseCase,
  setNewModel,
  setProgressValue
} from 'store/modelTraining/actions';

import api from 'app/api';
import store from 'store';

import {
  convertTrainingSessionResToNewModel,
  precedentDefectInstancesCountAddedForTraining
} from 'app/utils/modelTraining';
import {
  selectDefectsInstancesCountAdded,
  selectNewTrainingModel,
  selectTrainingUsecase
} from 'store/modelTraining/selector';

import { DATE_RANGE_KEYS } from 'app/constants/filters';
import { SEARCH_FILTER_PARAMS_KEYS } from 'app/constants/searchParams';
import { encodeURL } from 'app/utils/helpers';

import classes from './TrainingStrategy.module.scss';

const TRAINING_STRATEGY_OPTIONS = [
  { value: 'false', label: 'Default' },
  { value: 'true', label: 'Customise based on data' }
];

const mapTrainingDataState = createStructuredSelector({
  newModel: selectNewTrainingModel,
  usecase: selectTrainingUsecase,
  defectsInstancesCountAdded: selectDefectsInstancesCountAdded
});

const TrainingStrategy = () => {
  const dispatch = useDispatch();

  const { subscriptionId, packId, trainingSessionId } = useParams();
  const navigate = useNavigate();

  const [isManuallyCustomise, setIsManuallyCustomise] = useState('false');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    newModel,
    usecase = {},
    defectsInstancesCountAdded
  } = useSelector(mapTrainingDataState);

  const useCaseId = usecase.id;

  useEffect(() => {
    if (!Object.keys(newModel ?? {}).length) {
      api.getTrainingSession(trainingSessionId).then(res => {
        dispatch(setNewModel(convertTrainingSessionResToNewModel(res)));
        dispatch(
          setDefectsInstancesCount({
            key: 'defectsInstancesCountAdded',
            value: res.training_session_file_set_count
          })
        );
        dispatch(setProgressValue(res.training_configuration));

        if (!useCaseId) {
          api.getMlModelByid(res.new_ml_model).then(d => {
            dispatch(setModelUseCase({ id: d.use_case, type: d.type }));
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (useCaseId) {
      precedentDefectInstancesCountAddedForTraining(
        trainingSessionId,
        useCaseId
      );
    }
  }, [useCaseId]);

  // useEffect(() => {
  //   if (isManuallyCustomise === 'true') {
  //     if (isDisabled) setIsDisabled(false);
  //     dispatch(resetConfigRadio());
  //   } else if (!isDisabled) {
  //     setIsDisabled(true);
  //   }
  // }, [isManuallyCustomise]);

  const handleClick = async () => {
    setIsLoading(true);

    const { trainingConfiguration } = store.getState().modelTraining;

    try {
      await api.trainingConfig(trainingSessionId, {
        training_configuration: trainingConfiguration
      });

      navigate(
        `/${subscriptionId}/${packId}/library/model/training-overview/${trainingSessionId}`
      );
    } catch (err) {
      toast.error('Something went wrong.', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackBtnClick = () => {
    const params = queryString.stringify({
      [SEARCH_FILTER_PARAMS_KEYS.CONTEXTUAL_FILTERS]: encodeURL({
        date: DATE_RANGE_KEYS.ALL_DATE_RANGE
      })
    });

    navigate(
      `/${subscriptionId}/${packId}/library/model/training-data/${trainingSessionId}?${params}`
    );
  };

  const handleManuallyCustomiseChange = e => {
    if (e !== isManuallyCustomise) {
      setIsManuallyCustomise(e);
    }
  };

  return (
    <ModelTrainingLayout
      title='Customise Training Configurations'
      isBtnDisabled={isDisabled || isManuallyCustomise === 'true'}
      btnText='Preview Training Details'
      onClick={handleClick}
      backBtnText='Edit Data and Defects'
      onBackBtnClick={handleBackBtnClick}
      isLoading={!defectsInstancesCountAdded || isLoading}
      className={classes.root}
    >
      <div className={classes.container}>
        {/* <div className={classes.headerContainer}>
          <Typography className={classes.header}>
            Training configurations
          </Typography>
        </div> */}

        <div className={classes.collapseContainer}>
          <div
            className={clsx(
              classes.flexBox,
              classes.radioGroup,
              classes.containerPadding
            )}
          >
            <Typography className={classes.strategyTitle}>
              Select Training Configuration:
            </Typography>

            <SSRadioGroup
              direction='column'
              config={{
                value: isManuallyCustomise,
                onChange: handleManuallyCustomiseChange
              }}
              options={TRAINING_STRATEGY_OPTIONS}
            />
          </div>

          <OverlayComp
            open={isManuallyCustomise === 'true'}
            title='Launching Soon'
          >
            <div className={classes.containerPadding}>
              {isManuallyCustomise === 'true' && <DataInsightsContainer />}

              <TrainingConfigContainer
                disabled={isDisabled}
                setDisabled={setIsDisabled}
              />
            </div>
          </OverlayComp>
        </div>
      </div>
    </ModelTrainingLayout>
  );
};

export default TrainingStrategy;
