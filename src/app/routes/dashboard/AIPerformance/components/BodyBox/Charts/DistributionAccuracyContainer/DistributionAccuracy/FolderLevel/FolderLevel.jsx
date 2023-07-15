import ScrollingPaginatedTable from 'app/components/ScrollingPaginatedTable';
import classes from '../DistributionAccuracy.module.scss';
import BarChart from '../Charts/bar-chart';
import { useEffect, useState } from 'react';
import useApi from 'app/hooks/useApi';
import { ChartLegends } from '../Charts/Legends';
import {
  getFolderLevelDistributionAccuracy,
  getFolderLevelDistributionAccuracyCohort
} from 'app/api/AiPerformance/RawConfusionMatrics';
import {
  COHORT_COLOR_MAPPING_CONSTANT,
  NumberFormater,
  encodeURL,
  formatPercentageValue,
  getAutoClassificationAccuracyBackgroudColor,
  getParamsObjFromEncodedString,
  getPercentage
} from 'app/utils/helpers';
import queryString from 'query-string';
import { useLocation, useParams } from 'react-router-dom';
import { ClickableTableCell } from 'app/components/VirtualTable/ClickableTableCell';
import { FILTER_KEYS } from 'app/utils/constants';
import { Box, Tooltip } from '@material-ui/core';

const CHART_LEGENDS = [
  {
    name: 'Auto-classification >=93%, Accuracy >=90%',
    color: '#6FCF97'
  },
  {
    name: 'Auto-classification >=93%, Accuracy <90%',
    color: '#F2C94C'
  },
  {
    name: 'Auto-classification <93%, Accuracy >=90%',
    color: '#E8AD6A'
  },
  {
    name: 'Auto-classification<93%, Accuracy <90%',
    color: '#FB7185'
  },
  {
    name: 'No Images with feedback',
    color: 'rgba(251, 113, 133, 0.4)'
  }
];

const columns = createURL => [
  {
    header: 'Name',
    accessorKey: 'folder_name',
    cell: ({ row: { original } }) => (
      <Box display='flex' alignItems='center'>
        <Box width='11px' pr='12px'>
          <Box
            style={{
              width: '9px',
              height: '10px',
              backgroundColor: getAutoClassificationAccuracyBackgroudColor(
                original.auto_classification_percentage,
                original.accuracy_percentage
              ),
              marginRight: '6px'
            }}
          />
        </Box>
        <Tooltip title={original.folder_name}>
          <div>{original.folder_name}</div>
        </Tooltip>
      </Box>
    )
  },
  {
    header: 'Auto%',
    accessorFn: row => formatPercentageValue(row.auto_classification_percentage)
  },
  {
    header: 'Accuracy%',
    accessorFn: row => formatPercentageValue(row.accuracy_percentage)
  },
  {
    header: 'Total',
    accessorKey: 'total_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          upload_session_id__in: original.folder_id,
          is_inferenced: true
        })}
      />
    )
  },
  {
    header: 'Auto',
    accessorKey: 'auto_classified_fileset_count'
  },
  {
    header: 'Manual',
    accessorKey: 'manual_classified_fileset_count'
  },
  {
    header: 'Audited',
    accessorKey: 'audited_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          upload_session_id__in: original.folder_id,
          is_audited: true
        })}
      />
    )
  },
  {
    header: 'Correct',
    accessorKey: 'correct_classified_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          upload_session_id__in: original.folder_id,
          is_accurate: true
        })}
      />
    )
  },
  {
    header: 'Incorrect',
    accessorKey: 'incorrect_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          upload_session_id__in: original.folder_id,
          is_accurate: false
        })}
      />
    )
  }
];

export const FolderLevel = ({ mlModelId }) => {
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
    getFolderLevelDistributionAccuracyCohort,
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
      accuracy_cohorts: '0,90,100',
      auto_classification_cohorts: '0,93,100'
    }
  );

  useEffect(() => {
    if (cohort && !isCohortLoading) {
      const tempChartData = {};
      const total = cohort.reduce((prev, curr) => prev + curr.count || 0, 0);

      const dataList = cohort.map(item => ({
        x: item.cohort_name,
        y: getPercentage(item.count, total) || 0,
        description: {
          count: item.count,
          color: COHORT_COLOR_MAPPING_CONSTANT[item.cohort_name],
          tooltip: {
            'Auto-Classification': item.cohort_name,
            Accuracy: item.cohort_name
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
  }, [cohort, isCohortLoading]);

  const createURL = data => {
    const parsedParams = getParamsObjFromEncodedString(location.search);

    Object.entries(data).forEach(([key, value]) => {
      value ?? delete data[key];
    });

    parsedParams.model_selection = 'latest';
    parsedParams.ml_model_id__in = mlModelId;

    const params = queryString.stringify({
      contextual_filters: encodeURL(
        { ...parsedParams, ...data },
        { arrayFormat: 'comma' }
      )
    });

    return `/${subscriptionId}/${packId}/annotation/review?${params}`;
  };

  const totalFolders = (cohort || []).reduce(
    (prev, curr) => prev + curr.count || 0,
    0
  );

  return (
    <div className={classes.root}>
      <div className={classes.leftSide}>
        <BarChart data={barChartData} />
        <ChartLegends
          data={CHART_LEGENDS}
          title='Folders with'
          totalHeader={`Total Folders: ${totalFolders}`}
        />
      </div>
      <div className={classes.rightSide}>
        <ScrollingPaginatedTable
          columns={columns(createURL)}
          asyncFn={getFolderLevelDistributionAccuracy}
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
          fnKey='Folder'
          height={400}
        />
      </div>
    </div>
  );
};
