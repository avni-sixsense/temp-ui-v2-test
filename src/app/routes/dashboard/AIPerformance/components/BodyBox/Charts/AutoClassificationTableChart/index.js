import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import EmptyState from 'app/components/EmptyState';
import {
  encodeURL,
  formatPercentageValue,
  getAutoClassificationPercentage,
  getParamsObjFromEncodedString
} from 'app/utils/helpers';
import dayjs from 'dayjs';
import keyBy from 'lodash/keyBy';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { AI_PERFORMANCE_ROUTES } from 'store/aiPerformance/constants';
import { selectIsFilterLoading } from 'store/filter/selector';

import CustomTable from '../../components/Table';
import LineChart from './Charts/line-chart';

const useStyles = makeStyles(theme => ({
  rightTitle: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[10]
  },
  leftContainer: {
    borderRight: `1px solid ${theme.colors.grey[4]}`,
    minHeight: '350px',
    maxHeight: '450px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 0px white',
      borderRadius: '5px'
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: ' #dfdcdc',
      borderRadius: '10px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#cecece'
    }
  },
  modeContainer: {
    backgroundColor: theme.colors.grey[1],
    border: `1px solid ${theme.colors.grey[5]}`,
    padding: theme.spacing(0.25, 0.25, 0.25, 1),
    borderRadius: '4px',
    fontSize: '12px'
  },
  modeTitle: {
    fontWeight: 500,
    color: theme.colors.grey[12]
  },
  selectedMode: {
    padding: theme.spacing(0.125, 0.5, 0.375, 0.5),
    backgroundColor: theme.colors.blue[600],
    borderRadius: '4px',
    '& p': {
      fontWeight: 600,
      color: `${theme.colors.grey[0]} !important`
    },
    cursor: 'pointer'
  },
  normalMode: {
    padding: theme.spacing(0.125, 0.5, 0.375, 0.5),
    backgroundColor: theme.colors.grey[0],
    borderRadius: '4px',
    border: `1px solid ${theme.colors.grey[4]}`,
    '& p': {
      fontWeight: 600,
      color: `${theme.colors.grey[19]} !important`
    },
    cursor: 'pointer'
  },
  pointerCursor: {
    cursor: 'pointer'
  },
  chartContainer: {
    overflowX: 'auto'
  }
}));

const AutoClassificationTableChart = ({ tableFilter }) => {
  const classes = useStyles();

  const navigate = useNavigate();
  const location = useLocation();

  const { subscriptionId, packId, mode, unit } = useParams();

  const [groupBy, setGroupBy] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [useCaseDict, setUseCaseDict] = useState({});
  const [timeseries, setTimeSeries] = useState([]);
  const [chartData, setChartData] = useState([]);

  const isFilterLoading = useSelector(selectIsFilterLoading);

  const handleBoxClick = row => {
    setTableData(
      tableData.map(x => {
        if (x.use_case_id === row.use_case_id) {
          return { ...x, isSelected: !x.isSelected };
        }
        return x;
      })
    );
    setUseCaseDict({
      ...useCaseDict,
      [row.use_case_id]: {
        ...useCaseDict[row.use_case_id],
        isSelected: !row.isSelected
      }
    });
  };

  const handleNavigation = data => {
    if (unit === AI_PERFORMANCE_ROUTES.UNIT_WAFER.path) {
      const finalParamObj = getParamsObjFromEncodedString(`${location.search}`);

      const paramsObj = {};

      if (data?.status__in) {
        finalParamObj.status__in = data?.status__in;
      }

      if (finalParamObj.use_case_id__in) {
        paramsObj.use_case_id__in = finalParamObj?.use_case_id__in;
        delete finalParamObj.use_case_id__in;
      }

      if (finalParamObj.wafer_id__in) {
        paramsObj.wafer_id__in = finalParamObj?.wafer_id__in;
        delete finalParamObj.wafer_id__in;
      }

      if (data?.use_case_id__in) {
        paramsObj.use_case_id__in = data?.use_case_id__in;
      }

      if (data?.wafer_id__in) {
        paramsObj.wafer_id__in = data?.wafer_id__in;
      }

      const params = queryString.stringify({
        contextual_filters: encodeURL(finalParamObj),
        other_filters: encodeURL(paramsObj)
      });

      navigate(`/${subscriptionId}/${packId}/dashboard/wafer-book?${params}`);
    }
  };

  const autoClassifictionUseCaseColumns = [
    {
      accessor: 'use_case_name',
      Header: 'Usecase',
      Cell: ({ row: { original } }) => {
        return (
          <Box display='flex' alignItems='baseline' textAlign='left'>
            <Box width='11px' pr='12px'>
              <Box
                onClick={() => handleBoxClick(original)}
                width='9px'
                height='10px'
                style={
                  !original.isSelected
                    ? {
                        width: '9px',
                        height: '10px',
                        border: `1px solid ${original.color}`,
                        marginRight: '2px',
                        cursor: 'pointer'
                      }
                    : {
                        width: '9px',
                        height: '10px',
                        backgroundColor: original.color,
                        marginRight: '2px',
                        cursor: 'pointer'
                      }
                }
              />
            </Box>
            <Tooltip title={original.use_case_name}>
              <Typography
                style={{
                  width: '140px',
                  wordBreak: 'break-word'
                }}
              >
                {original.use_case_name}
              </Typography>
            </Tooltip>
          </Box>
        );
      }
    },
    {
      accessor: 'auto_classified_percentage',
      Header: 'Auto%',
      Cell: ({ row: { original } }) => (
        <Box
        // onClick={() => handleNavigation(row, true)} className={classes.pointerCursor}
        >
          {Math.floor(getAutoClassificationPercentage(original)) || 0}%
        </Box>
      )
    },
    {
      accessor: 'total',
      Header: 'Total',
      Cell: ({ row: { original } }) => (
        <Box
          onClick={() =>
            handleNavigation({
              use_case_id__in: original.use_case_id,
              is_live: true
            })
          }
        >
          {original.total}
        </Box>
      )
    },
    {
      accessor: 'auto_classified',
      Header: 'Auto',
      Cell: ({ row: { original } }) => (
        <Box
          onClick={() =>
            handleNavigation({
              use_case_id__in: original.use_case_id,
              is_confident_defect: true,
              model_selection: 'live'
            })
          }
        >
          {original.auto_classified}
        </Box>
      )
    },
    {
      accessor: 'manual_all',
      Header: 'Manual',
      Cell: ({ row: { original } }) => (
        <Box
          onClick={() =>
            handleNavigation({
              use_case_id__in: original.use_case_id,
              is_confident_defect: false,
              model_selection: 'live'
            })
          }
        >
          {original.manual_classified}
        </Box>
      )
    }
  ];

  useEffect(() => {
    const parsedParams = getParamsObjFromEncodedString(location.search);
    setGroupBy(parsedParams?.time_format || 'daily');
  }, [location.search]);

  const {
    data: useCaseAutomation = [],
    isFetching: isUseCaseAutomationLoading,
    isError
  } = useQuery(
    ['useCaseAutomation', location.search],
    context => api.getUseCaseAutomation(...context.queryKey),
    { enabled: !isFilterLoading, refetchInterval: false }
  );

  useEffect(() => {
    if (useCaseAutomation && !isUseCaseAutomationLoading && !isError) {
      setTableData(
        useCaseAutomation.map((x, index) => {
          return {
            ...x,
            // eslint-disable-next-line no-bitwise
            color: `#${((Math.random() * 0xffffff) << 0)
              .toString(16)
              .padStart(6, '0')}`,
            isSelected: index < 4
          };
        })
      );
    }
  }, [useCaseAutomation]);

  useEffect(() => {
    setUseCaseDict(keyBy(tableData, 'use_case_id'));
    if (tableFilter === '90% +') {
      setFilteredData(
        tableData.filter(x => getAutoClassificationPercentage(x) >= 90)
      );
    }
    if (tableFilter === '80%-90%') {
      setFilteredData(
        tableData.filter(
          x =>
            getAutoClassificationPercentage(x) >= 80 &&
            getAutoClassificationPercentage(x) < 90
        )
      );
    }
    if (tableFilter === '< 80%') {
      setFilteredData(
        tableData.filter(x => getAutoClassificationPercentage(x) < 80)
      );
    }
  }, [tableData]);

  useEffect(() => {
    if (tableFilter === '90% +') {
      setFilteredData(
        tableData.filter(x => getAutoClassificationPercentage(x) >= 90)
      );
    }
    if (tableFilter === '80%-90%') {
      setFilteredData(
        tableData.filter(
          x =>
            getAutoClassificationPercentage(x) >= 80 &&
            getAutoClassificationPercentage(x) < 90
        )
      );
    }
    if (tableFilter === '< 80%') {
      setFilteredData(
        tableData.filter(x => getAutoClassificationPercentage(x) < 80)
      );
    }
  }, [tableFilter]);

  const {
    data: useCaseAutomationTimeSeries = [],
    isFetching: isUseCaseAutomationTimeSeriesLoading
  } = useQuery(
    ['useCaseAutomationTimeSeries', groupBy, location.search],
    context => api.getUseCaseAutomationTimeSeries(...context.queryKey),
    {
      enabled: !!(mode && unit && groupBy) && !isFilterLoading,
      refetchInterval: false
    }
  );

  const getDateGroupWise = date => {
    if (groupBy === 'daily') {
      return dayjs(date).format('DD MMM');
    }
    if (groupBy === 'weekly') {
      return `${dayjs(date).format('DD MMM')} - ${dayjs(date)
        .add(6, 'day')
        .format('DD MMM')}`;
    }
    if (groupBy === 'monthly') {
      return `${dayjs(date).format('DD MMM')} - ${dayjs(date)
        .add(1, 'month')
        .format('DD MMM')}`;
    }
  };

  const getAllDates = data => {
    return [...new Set(data.map(item => item.effective_date))].sort();
  };

  useEffect(() => {
    if (useCaseAutomationTimeSeries && !isUseCaseAutomationTimeSeriesLoading) {
      const tempSeries = [];
      const commonXAxis = getAllDates(
        useCaseAutomationTimeSeries.map(item => item.time_series_data).flat()
      );
      useCaseAutomationTimeSeries.forEach(x => {
        const timeseriesKeyByDate = keyBy(x.time_series_data, 'effective_date');
        tempSeries.push({
          name: useCaseDict[x.use_case_id]?.use_case_name || '',
          useCaseId: x.use_case_id,
          color: useCaseDict[x.use_case_id]?.color || '#FF0000',
          data: commonXAxis.map(xDate => {
            if (timeseriesKeyByDate[xDate]) {
              return {
                x: dayjs(xDate, 'YYYY-MM-DD').toDate(),
                y: getAutoClassificationPercentage(timeseriesKeyByDate[xDate]),
                description: {
                  date: getDateGroupWise(xDate),
                  'Auto-classification': formatPercentageValue(
                    getAutoClassificationPercentage(timeseriesKeyByDate[xDate])
                  ),
                  Total: timeseriesKeyByDate[xDate].total,
                  'Auto-classified': timeseriesKeyByDate[xDate].auto_classified,
                  Manual: timeseriesKeyByDate[xDate].manual_classified
                }
              };
            }
            return {
              x: dayjs(xDate, 'YYYY-MM-DD').toDate(),
              y: 0,
              description: {
                date: getDateGroupWise(xDate),
                'Auto-classification': 'N/A',
                Total: 'N/A',
                'Auto-classified': 'N/A',
                Manual: 'N/A'
              }
            };
          })
        });
      });
      setTimeSeries(tempSeries);
    }
  }, [useCaseAutomationTimeSeries, useCaseDict]);

  useEffect(() => {
    if (tableFilter === '90% +') {
      setChartData(
        timeseries.filter(
          x =>
            useCaseDict[x.useCaseId]?.isSelected &&
            getAutoClassificationPercentage(useCaseDict[x.useCaseId]) >= 90
        )
      );
    }
    if (tableFilter === '80%-90%') {
      setChartData(
        timeseries.filter(
          x =>
            useCaseDict[x.useCaseId]?.isSelected &&
            getAutoClassificationPercentage(useCaseDict[x.useCaseId]) >= 80 &&
            getAutoClassificationPercentage(useCaseDict[x.useCaseId]) < 90
        )
      );
    }
    if (tableFilter === '< 80%') {
      setChartData(
        timeseries.filter(
          x =>
            useCaseDict[x.useCaseId]?.isSelected &&
            getAutoClassificationPercentage(useCaseDict[x.useCaseId]) < 80
        )
      );
    }
  }, [timeseries, tableFilter]);

  return (
    <Box display='flex'>
      <Box className={classes.leftContainer} flex={3.5} pt={1.75} px={1.75}>
        <Typography className={classes.rightTitle}>
          Use case wise auto-classification details
        </Typography>
        {isUseCaseAutomationLoading ? (
          <CircularProgress />
        ) : isError ? (
          <EmptyState isTable />
        ) : (
          <CustomTable
            data={filteredData}
            columns={autoClassifictionUseCaseColumns}
            scrollableHeight={350}
            // total={filteredData.length}
          />
        )}
      </Box>
      <Box className={classes.chartContainer} flex={7} p={1.75}>
        <Typography className={classes.rightTitle}>
          Use case wise auto-classification Time-trend
        </Typography>
        {isUseCaseAutomationTimeSeriesLoading ? (
          <CircularProgress />
        ) : (
          <LineChart unit={unit} data={chartData} />
        )}
        <Box display='flex'>
          <Box
            className={classes.modeContainer}
            display='flex'
            alignItems='center'
            ml={1.5}
          >
            <Typography className={classes.modeTitle}>Group By:</Typography>
            <Box
              onClick={() => setGroupBy('daily')}
              ml={0.75}
              className={
                groupBy === 'daily' ? classes.selectedMode : classes.normalMode
              }
            >
              <Typography>Day</Typography>
            </Box>
            <Box
              onClick={() => setGroupBy('weekly')}
              ml={0.75}
              className={
                groupBy === 'weekly' ? classes.selectedMode : classes.normalMode
              }
            >
              <Typography>Week</Typography>
            </Box>
            <Box
              onClick={() => setGroupBy('monthly')}
              ml={0.75}
              className={
                groupBy === 'monthly'
                  ? classes.selectedMode
                  : classes.normalMode
              }
            >
              <Typography>Month</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AutoClassificationTableChart;
