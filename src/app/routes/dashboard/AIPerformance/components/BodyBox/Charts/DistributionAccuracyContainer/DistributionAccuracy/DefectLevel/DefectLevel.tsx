import { createStructuredSelector } from 'reselect';
import classes from '../DistributionAccuracy.module.scss';
import { selectDefectBasedDistribution } from 'store/aiPerformance/selectors';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import VirtualTable from 'app/components/VirtualTable';
import {
  COHORT_COLOR_MAPPING_CONSTANT,
  encodeURL,
  getOccurrences,
  getParamsObjFromEncodedString
} from 'app/utils/helpers';
import BarChart from '../Charts/bar-chart';
import { ChartLegends } from '../Charts/Legends';
import { useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { ColumnDef } from '@tanstack/react-table';

type DataList = {
  x: string | number;
  y: number;
  description: {
    count?: number;
    tooltip?: { [x: string]: string | number };
    color?: string;
  };
};

type SeriesType = {
  name: string;
  type?: string;
  data: DataList[];
};

type BarChartData = {
  series: SeriesType[];
};

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

const mapDefectLevelToState = createStructuredSelector({
  defectBasedDistribution: selectDefectBasedDistribution
});

type CreateURLFunc = (data: ObjectType) => string;

type Columns<T> = (param: CreateURLFunc) => ColumnDef<T>[];

type DefectLevelProps<T> = {
  mlModelId: number;
  modelSelection: 'live' | 'latest';
  columns: Columns<T>;
};

export const DefectLevel = <T,>({
  mlModelId,
  modelSelection,
  columns
}: DefectLevelProps<T>) => {
  const location = useLocation();
  const { packId, subscriptionId } = useParams();
  const [barChartData, setBarChartData] = useState({});
  const { defectBasedDistribution } = useSelector(mapDefectLevelToState);
  const { isLoading, data } = defectBasedDistribution;

  useEffect(() => {
    if (!isLoading) {
      const total = data.length;
      const tempChartData: BarChartData = { series: [] };
      const cohortData: Record<string, { color: string; count: number }> = {
        '90-100': {
          count: getOccurrences(
            data,
            (data: any) => data.recall_percentage >= 90
          ),
          color: COHORT_COLOR_MAPPING_CONSTANT['90-100']
        },
        '80-90': {
          count: getOccurrences(
            data,
            (data: any) =>
              data.recall_percentage >= 80 && data.recall_percentage < 90
          ),
          color: COHORT_COLOR_MAPPING_CONSTANT['80-90']
        },
        '0-80': {
          count: getOccurrences(
            data,
            (data: any) => data.recall_percentage < 80
          ),
          color: COHORT_COLOR_MAPPING_CONSTANT['0-80']
        }
      };

      const dataList = Object.keys(cohortData).map(item => ({
        x: item,
        y: (cohortData[item].count * 100) / total,
        description: {
          count: cohortData[item].count,
          color: cohortData[item].color,
          tooltip: {
            Recall: item
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
  }, [isLoading, data]);

  const createURL = (data: ObjectType) => {
    const parsedParams = getParamsObjFromEncodedString(location.search);

    Object.entries(data).forEach(([key, value]) => {
      value ?? delete data[key];
    });

    parsedParams.model_selection = modelSelection;

    parsedParams.ml_model_id__in = mlModelId;

    const params = queryString.stringify(
      {
        contextual_filters: encodeURL({ ...parsedParams, ...data })
      },
      { arrayFormat: 'comma' }
    );

    return `/${subscriptionId}/${packId}/annotation/review?${params}`;
  };

  const totalDefects = data.length;

  return (
    <div className={classes.root}>
      <div className={classes.leftSide}>
        <BarChart data={barChartData} />
        <ChartLegends
          data={CHART_LEGENDS}
          title='Defects with Recall'
          totalHeader={`Total Defects: ${totalDefects}`}
        />
      </div>
      <div className={classes.rightSide}>
        <VirtualTable
          data={data}
          isLoading={isLoading}
          columns={columns(createURL)}
          height={400}
        />
      </div>
    </div>
  );
};
