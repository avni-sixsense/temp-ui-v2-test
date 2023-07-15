import { useState, useEffect } from 'react';

import WithCondition from 'app/hoc/WithCondition';

import { LineChart } from './LineChart';
import { similarityPerformanceChart } from 'app/api/ThresholdPerformanceGraph';

import { useParams } from 'react-router-dom';
import useApi from 'app/hooks/useApi';
import { LoadingState } from '../LoadingState/LoadingState';
import { ErrorView } from '../ErrorState';
import { isEmptyObject } from 'app/utils/helpers';

import classes from './GraphSection.module.scss';
import ClickableBoxGroup from 'app/routes/dashboard/AIPerformance/components/BodyBox/Charts/DistributionAccuracyContainer/components/ClickableBoxGroup';

export const GRAPH_LEGENDS = [
  {
    value: 'automation_in',
    subLabel: 'In-Distribution',
    label: `Automation %`,
    classes: [classes.greenBox, classes.greenBoxLight],
    color: '#059669'
  },
  {
    value: 'accuracy',
    subLabel: 'In-Distribution',
    label: 'Accuracy %',
    color: '#fbbf24',
    classes: [classes.yellowBox, classes.yellowBoxLight]
  },
  {
    value: 'automation_out',
    subLabel: 'Out-Distribution',
    label: 'Automation %',
    color: '#82a0ce',
    classes: [classes.grayBox, classes.grayBoxLight]
  }
];

const transformData = (dataInDistribution = [], dataOutDistribution = []) =>
  dataInDistribution.map((item, index) => {
    const { accuracy, automation, similarity_threshold } = item;

    return {
      similarity_threshold: similarity_threshold,
      automation_in: automation,
      automation_out: dataOutDistribution[index]?.automation,
      accuracy
    };
  });

const GraphSection = ({
  isOutDistributionDataSelected,
  inDistributionFilters,
  outDistributionFilters,
  thresholdValue
}) => {
  const [selectedGraphData, setSelectedGraphData] = useState([
    'automation_in',
    'accuracy',
    'automation_out'
  ]);

  const { modelId } = useParams();

  const {
    data: dataInDistribution = [],
    isLoading: isLoadingInDistribution,
    isError: isErrorInDistribution,
    refetch: refetchInDistributionData
  } = useApi(
    similarityPerformanceChart,
    {
      allowedKeys: [],
      ml_model_id: modelId,
      file_set_filters: inDistributionFilters,
      type: 'IN_DISTRIBUTION'
    },
    { enabled: !isEmptyObject(inDistributionFilters) }
  );

  const {
    data: dataOutDistribution = [],
    isLoading: isLoadingOutDistribution,
    isError: isErrorOutDistribution,
    refetch: refetchOutDistributionData
  } = useApi(
    similarityPerformanceChart,
    {
      allowedKeys: [],
      ml_model_id: modelId,
      file_set_filters: outDistributionFilters,
      type: 'OUT_DISTRIBUTION'
    },
    {
      enabled:
        !isEmptyObject(outDistributionFilters) && isOutDistributionDataSelected
    }
  );

  const isLoading = isLoadingInDistribution || isLoadingOutDistribution;

  const isError = isErrorInDistribution || isErrorOutDistribution;

  useEffect(() => {
    if (!isOutDistributionDataSelected) {
      setSelectedGraphData(['automation_in', 'accuracy']);
    } else {
      setSelectedGraphData(['automation_in', 'accuracy', 'automation_out']);
    }
  }, [isOutDistributionDataSelected]);

  const handleGraphClick = value => {
    if (Array.isArray(value)) {
      setSelectedGraphData(value);
    } else if (selectedGraphData.includes(value)) {
      setSelectedGraphData(selectedGraphData.filter(x => x !== value));
    } else {
      setSelectedGraphData([...selectedGraphData, value]);
    }
  };

  const handleRefetchApis = () => {
    if (isErrorInDistribution) refetchInDistributionData();
    if (isErrorOutDistribution) refetchOutDistributionData();
  };

  const filterChartOptions = GRAPH_LEGENDS.filter(data =>
    selectedGraphData.includes(data.value)
  );

  const unifiedData = transformData(dataInDistribution, dataOutDistribution);

  const chartData = filterChartOptions.map(legend => {
    return {
      name: 'Similarity threshold',
      type: 'line',
      data: unifiedData.map(item => ({
        x: item.similarity_threshold,
        y: item[legend.value],
        color: legend.color,
        description: isOutDistributionDataSelected
          ? {
              automation_in_distrtibution: item.automation_in,
              automation_out_distribution: item.automation_out,
              accuracy: item.accuracy
            }
          : {
              automation_in_distrtibution: item.automation_in,

              accuracy: item.accuracy
            }
      }))
    };
  });

  const colors = filterChartOptions.map(({ color }) => color);

  const filterCheckboxGroup = GRAPH_LEGENDS.filter(item =>
    isOutDistributionDataSelected ? true : item.value !== 'automation_out'
  );
  return (
    <WithCondition
      when={isLoading}
      then={<LoadingState />}
      or={
        <>
          <WithCondition
            when={isError}
            then={<ErrorView refetch={handleRefetchApis} />}
            or={
              <>
                <div className={classes.graph}>
                  <LineChart
                    thresholdValue={thresholdValue}
                    data={chartData}
                    colors={colors}
                  />
                </div>

                <div className={classes.clickableContainer}>
                  <ClickableBoxGroup
                    textGroupContainer={classes.textStyle}
                    onClick={handleGraphClick}
                    data={filterCheckboxGroup}
                    active={selectedGraphData}
                  />
                </div>
              </>
            }
          />
        </>
      }
    />
  );
};

export { GraphSection };
