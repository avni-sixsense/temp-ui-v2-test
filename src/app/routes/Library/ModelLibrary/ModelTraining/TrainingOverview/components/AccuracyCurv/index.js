import { CircularProgress } from '@material-ui/core';
import api from 'app/api';
import Show from 'app/hoc/Show';
import { formatFloatToXDecimal } from 'app/utils/helpers';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectNewTrainingModel } from 'store/modelTraining/selector';

import classes from './AccuracyCurv.module.scss';
import ChartContainer from './components/chartContainer';
import TrainingDetails from './components/TrainingDetails';

const mapTrainingToState = createStructuredSelector({
  newModel: selectNewTrainingModel
});

const AccuracyCurvContainer = () => {
  const [lossCurvData, setLossCurvData] = useState([]);
  const [accuracyCurvData, setaccuracyCurvData] = useState([]);
  const { newModel } = useSelector(mapTrainingToState);
  const { data, isLoading } = useQuery(
    ['AccuracyCurvChart', newModel?.training_session],
    context => api.getAccuracyCurv(...context.queryKey),
    {
      enabled: !!newModel?.training_session,
      refetchInterval: 1000 * 30 // refetch on every 30 seconds
    }
  );
  useEffect(() => {
    if (!isLoading && data?.results && data?.results.length) {
      const trainingLoss = {
        name: 'Training Loss',
        type: 'line',
        color: '#2563EB',
        data: []
      };
      const validationLoss = {
        name: 'Validation Loss',
        type: 'line',
        color: '#D97706',
        data: []
      };
      const trainingAccuracy = {
        name: 'Training Acccuracy',
        type: 'line',
        color: '#2563EB',
        data: []
      };
      const validationAccuracy = {
        name: 'Validation Accuracy',
        type: 'line',
        color: '#D97706',
        data: []
      };
      data.results.forEach(item => {
        trainingLoss.data.push({
          x: item.iteration_count,
          y: formatFloatToXDecimal(item.training_loss),
          description: {
            'No of iterations': item.iteration_count,
            'Training Loss': formatFloatToXDecimal(item.training_loss),
            'Validation Loss': formatFloatToXDecimal(item.validation_loss)
          }
        });

        validationLoss.data.push({
          x: item.iteration_count,
          y: formatFloatToXDecimal(item.validation_loss),
          description: {
            'No of iterations': item.iteration_count,
            'Training Loss': formatFloatToXDecimal(item.training_loss),
            'Validation Loss': formatFloatToXDecimal(item.validation_loss)
          }
        });

        trainingAccuracy.data.push({
          x: item.iteration_count,
          y: formatFloatToXDecimal(item.training_accuracy),
          description: {
            'No of iterations': item.iteration_count,
            'Training Accuracy': formatFloatToXDecimal(item.training_accuracy),
            'Validation Accuracy': formatFloatToXDecimal(
              item.validation_accuracy
            )
          }
        });

        validationAccuracy.data.push({
          x: item.iteration_count,
          y: formatFloatToXDecimal(item.validation_accuracy),
          description: {
            'No of iterations': item.iteration_count,
            'Training Accuracy': formatFloatToXDecimal(item.training_accuracy),
            'Validation Accuracy': formatFloatToXDecimal(
              item.validation_accuracy
            )
          }
        });
      });
      setLossCurvData([trainingLoss, validationLoss]);
      setaccuracyCurvData([trainingAccuracy, validationAccuracy]);
    } else {
      setLossCurvData([]);
      setaccuracyCurvData([]);
    }
  }, [data, isLoading]);

  return (
    <div className={classes.container}>
      <TrainingDetails />
      <Show when={isLoading}>
        <CircularProgress />
      </Show>
      <Show when={!isLoading}>
        <div className={classes.chartContainer}>
          <ChartContainer title='Loss Curve' data={lossCurvData} />
          <ChartContainer title='Accuracy Curve' data={accuracyCurvData} />
        </div>
      </Show>
    </div>
  );
};

export default AccuracyCurvContainer;
