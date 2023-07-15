import ScrollingPaginatedTable from 'app/components/ScrollingPaginatedTable';
import classes from '../DistributionAccuracy.module.scss';
import useApi from 'app/hooks/useApi';
import { useEffect, useState } from 'react';
import BarChart from '../Charts/bar-chart';
import { ChartLegends } from '../Charts/Legends';
import {
  getOnDemandWaferLevelDistributionAccuracy,
  getOnDemandWaferLevelDistributionAccuracyCohort
} from 'app/api/AiPerformance/RawConfusionMatrics';
import {
  COHORT_COLOR_MAPPING_CONSTANT,
  encodeURL,
  getParamsObjFromEncodedString,
  getPercentage
} from 'app/utils/helpers';
import { useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { FILTER_KEYS } from 'app/utils/constants';

const CHART_LEGENDS = [
  {
    name: '>=90%',
    color: '#6FCF97'
  },
  {
    name: '80%- 90%<',
    color: '#F2C94C'
  },
  {
    name: '<80%',
    color: '#EB5757'
  },
  {
    name: 'No Images with feedback',
    color: 'rgba(251, 113, 133, 0.4)'
  }
];

export const OnDemandWaferLevel = ({
  columns,
  mlModelId,
  modelSelection,
  cohortDistribution
}) => {
  const location = useLocation();
  const { subscriptionId, packId } = useParams();
  const [barChartData, setBarChartData] = useState({});

  const {
    BOOKMARK_FILTER_KEY,
    DATE_FILTERS_KEYS,
    FOLDER_FILTER_KEY,
    GROUND_TRUTH_FILTER_KEY,
    IMAGE_TAG_FILTER_KEY,
    TRAINING_TYPE_FILTER_KEY,
    WAFER_FILTER_KEY
  } = FILTER_KEYS;

  const { data: cohort, isLoading: isCohortLoading } = useApi(
    getOnDemandWaferLevelDistributionAccuracyCohort,
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
      mlModelId,
      ...cohortDistribution
    }
  );

  useEffect(() => {
    if (cohort && !isCohortLoading) {
      const tempChartData = {};
      const total = cohort.reduce((prev, curr) => prev + curr.count || 0, 0);
      const dataList = cohort.map(item => ({
        x: item.cohort_name,
        y: getPercentage(item.count, total),
        description: {
          count: item.count,
          color: COHORT_COLOR_MAPPING_CONSTANT[item.cohort_name],
          tooltip: {
            accuracy: item.cohort_name
          }
        }
      }));

      const series = [
        {
          name: 'cohort',
          // type: 'bar',
          data: dataList
        }
      ];
      tempChartData.series = series;
      setBarChartData(tempChartData);
    }

    return () => {
      setBarChartData({});
    };
  }, [cohort, isCohortLoading]);

  const createURL = data => {
    const parsedParams = getParamsObjFromEncodedString(location.search);

    Object.entries(data).forEach(([key, value]) => {
      value ?? delete data[key];
    });

    parsedParams.model_selection = modelSelection;

    parsedParams.ml_model_id__in = mlModelId;

    const params = queryString.stringify({
      contextual_filters: encodeURL(
        { ...parsedParams, ...data },
        { arrayFormat: 'comma' }
      )
    });

    return `/${subscriptionId}/${packId}/annotation/review?${params}`;
  };

  const totalWafers = (cohort || []).reduce(
    (prev, curr) => prev + curr.count || 0,
    0
  );

  return (
    <div className={classes.root}>
      <div className={classes.leftSide}>
        <BarChart data={barChartData} />
        <ChartLegends
          data={CHART_LEGENDS}
          title='Wafers with Accuracy'
          totalHeader={`Total Wafers: ${totalWafers}`}
        />
      </div>
      <div className={classes.rightSide}>
        <ScrollingPaginatedTable
          columns={columns(createURL)}
          asyncFn={getOnDemandWaferLevelDistributionAccuracy}
          asyncFnParams={{
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
          }}
          fnKey='Wafer'
          height={400}
        />
      </div>
    </div>
  );
};
