import DataCardContainer from 'app/routes/dashboard/AIPerformance/components/BodyBox/components/dataCardContainer';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setMode, setUnit } from 'store/aiPerformance/actions';
import {
  MODEL_PERFORMANCE,
  AI_PERFORMANCE_ROUTES
} from 'store/aiPerformance/constants';

import Header from './Header';

import classes from './ModelPerformance.module.scss';
import { useParams } from 'react-router-dom';
import { DefectDistribution } from 'app/routes/dashboard/AIPerformance/components/DefectDistribution';
import { UATDefectDistribution } from 'app/routes/dashboard/AIPerformance/components/DefectDistribution/UATDefectDistribution';

const ModelPerformance = () => {
  const dispatch = useDispatch();
  const { modelId } = useParams();

  useEffect(() => {
    dispatch(setMode(MODEL_PERFORMANCE));
    dispatch(setUnit(AI_PERFORMANCE_ROUTES.UNIT_IMAGES.path));
  }, []);

  return (
    <div className={classes.root}>
      <Header />
      <DataCardContainer />
      <DefectDistribution mlModelId={Number(modelId)}>
        <UATDefectDistribution mlModelId={Number(modelId)} />
      </DefectDistribution>
    </div>
  );
};

export default ModelPerformance;
