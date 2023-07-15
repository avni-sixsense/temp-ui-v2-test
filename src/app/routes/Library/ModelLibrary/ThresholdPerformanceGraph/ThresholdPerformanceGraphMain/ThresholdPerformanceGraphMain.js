import { Header } from '../Header';
import { FilterGraphContainer } from '../FilterGraphContainer';
import { useParams } from 'react-router-dom';
import useApi from 'app/hooks/useApi';
import { getModalInfo } from 'app/api/ModalPerformance';
import { CircularProgress } from '@material-ui/core';
import { transformKeyValuestIntoObject } from 'app/utils/helpers';
import classes from './ThresholdPerformanceGraphMain.module.scss';

const ThresholdPerformanceGraphMain = () => {
  const { modelId } = useParams();

  const { data: apiData = {}, isLoading } = useApi(getModalInfo, {
    modelId,
    allowedKeys: []
  });

  if (isLoading) {
    return (
      <div className={classes.progressBarContainer}>
        <CircularProgress />
      </div>
    );
  }

  const {
    name,
    confidence_threshold,
    similarity_vs_perf_filters = {}
  } = apiData;

  return (
    <>
      <Header name={name} />

      <FilterGraphContainer
        similarityThresholdValue={confidence_threshold}
        filterValues={transformKeyValuestIntoObject({
          obj: similarity_vs_perf_filters,
          keyNames: [
            'selected_options',
            'indistribution_filters',
            'outdistribution_filters'
          ]
        })}
      />
    </>
  );
};

export { ThresholdPerformanceGraphMain };
