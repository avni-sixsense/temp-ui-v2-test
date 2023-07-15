import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import {
  decodeURL,
  encodeURL,
  getDateValue,
  getParamsObjFromEncodedString,
  getStackBarChartMeta,
  getTenthFactor
} from 'app/utils/helpers';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { selectIsFilterLoading } from 'store/filter/selector';

import BarChart from './Charts/bar-chart';
import StackBarLineChart from './Charts/stack-bar-line';
import ClickableBoxGroup from '../DistributionAccuracyContainer/components/ClickableBoxGroup';

const useStyles = makeStyles(theme => ({
  leftTitle: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[10]
  },
  rightTitle: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[10]
  },
  leftContainer: {
    borderRight: `1px solid ${theme.colors.grey[4]}`
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
  greenBox: {
    width: '8px',
    height: '8px',
    backgroundColor: '#6FCF97'
  },
  yellowBox: {
    width: '8px',
    height: '8px',
    backgroundColor: '#F2C94C'
  },
  redBox: {
    width: '8px',
    height: '8px',
    backgroundColor: '#EB5757'
  },
  greenBorderBox: {
    width: '8px',
    height: '8px',
    border: '1px solid #6FCF97'
  },
  yellowBorderBox: {
    width: '8px',
    height: '8px',
    border: '1px solid #F2C94C'
  },
  redBorderBox: {
    width: '8px',
    height: '8px',
    border: '1px solid #EB5757'
  },
  legendContainer: {
    cursor: 'pointer'
  },
  chartContainer: {
    overflowX: 'auto'
  },
  totalText: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[13]
  },
  legendTitle: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[13]
  },
  blueBox: {
    width: '8px',
    height: '8px',
    backgroundColor: '#3B82F6'
  },
  blueBorderBox: {
    width: '8px',
    height: '8px',
    border: '1px solid #3B82F6'
  },
  lightBlueBox: {
    width: '8px',
    height: '8px',
    backgroundColor: 'rgba(59, 130, 246, 0.4)'
  },
  lightBlueBorderBox: {
    width: '8px',
    height: '8px',
    border: '1px solid rgba(59, 130, 246, 0.4)'
  }
}));

const AUTO_CLASSIFIED = 'Auto-Classified';
const MANUALLY = 'Manually';
const PERCENTAGE = 'Percentage';

const WaferAutoClassificationDistribution = () => {
  const classes = useStyles();

  const location = useLocation();
  const navigate = useNavigate();

  const stackBarContainerRef = useRef(null);

  const { activeUsecaseCount } = useSelector(
    ({ aiPerformance }) => aiPerformance
  );
  const isFilterLoading = useSelector(selectIsFilterLoading);

  const { subscriptionId, packId, unit } = useParams();

  const [groupBy, setGroupBy] = useState('');
  const [barChartData, setBarChartData] = useState({});
  const [stackBarData, setStackBarData] = useState({});
  const [maxBarHeightInPoints, setMaxBarHeightInPoints] = useState(null);
  const [total, setTotal] = useState(0);
  const [chartMeta, setChartMeta] = useState({
    width: '100%',
    verticalLabel: false,
    hideLabels: true
  });
  const [selectedGraphLegends, setSelectedGraphLegends] = useState([
    AUTO_CLASSIFIED,
    MANUALLY,
    PERCENTAGE
  ]);
  const [selectedLegend, setSelectedLegend] = useState([
    '90%+',
    '80%-90%',
    '<80%'
  ]);

  const useCasedata = [
    {
      value: '90%+',
      label: '>=90%',
      classes: [classes.greenBox, classes.greenBorderBox]
    },
    {
      value: '80%-90%',
      label: '>=80% & <90%',
      classes: [classes.yellowBox, classes.yellowBorderBox]
    },
    {
      value: '<80%',
      label: '<80%',
      classes: [classes.redBox, classes.redBorderBox]
    }
  ];

  const GRAPH_LEGENDS = [
    {
      value: AUTO_CLASSIFIED,
      label: AUTO_CLASSIFIED,
      classes: [classes.blueBox, classes.blueBorderBox]
    },
    {
      value: MANUALLY,
      label: MANUALLY,
      classes: [classes.lightBlueBox, classes.lightBlueBorderBox]
    },
    {
      value: PERCENTAGE,
      label: PERCENTAGE,
      classes: [classes.greenBox, classes.greenBorderBox]
    }
  ];

  const reCalculateStackBar = () => {
    const { series } = stackBarData;
    const [firstData] = series;
    const { data = [] } = firstData;

    const { width, verticalLabel, hideLabels, barWidth } = getStackBarChartMeta(
      stackBarContainerRef,
      data.length
    );

    if (!width) return;

    setChartMeta({ width, verticalLabel, hideLabels, barWidth });
  };

  const shouldDataAddToChart = value => {
    if (selectedLegend.length === 3) {
      return true;
    }

    if (value >= 90 && selectedLegend.includes('90%+')) {
      return true;
    }

    if (value >= 80 && value < 90 && selectedLegend.includes('80%-90%')) {
      return true;
    }

    if (value < 80 && selectedLegend.includes('<80%')) {
      return true;
    }

    return false;
  };

  const handleLegendClick = value => {
    // if (Array.isArray(value)) {
    // 	setSelectedLegend(value)
    // } else {
    // 	setSelectedLegend([value])
    // }
    if (Array.isArray(value)) {
      setSelectedLegend(value);
    } else if (selectedLegend.includes(value)) {
      setSelectedLegend(selectedLegend.filter(x => x !== value));
    } else {
      setSelectedLegend([...selectedLegend, value]);
    }
  };

  const handleGraphLegendClick = value => {
    if (Array.isArray(value)) {
      setSelectedGraphLegends(value);
    } else if (selectedGraphLegends.includes(value)) {
      setSelectedGraphLegends(selectedGraphLegends.filter(x => x !== value));
    } else {
      setSelectedGraphLegends([...selectedGraphLegends, value]);
    }
  };

  // const handleTotalClick = (value) => {
  // 	setSelectedLegend(value)
  // }

  useEffect(() => {
    const parsedParams = getParamsObjFromEncodedString(location.search);
    setGroupBy(parsedParams?.time_format || 'daily');
  }, [location.search]);

  const { data: cohort, isFetching: isCohortLoading } = useQuery(
    ['autoClassificationCohort', location.search],
    context => api.waferAutoClassificationCohort(...context.queryKey),
    { enabled: !isFilterLoading, refetchInterval: false }
  );

  useEffect(() => {
    if (cohort) {
      const dataList = [];
      const tempChartData = {};
      const tempTotal = [];
      Object.keys(cohort).forEach(key => {
        dataList.push({
          x: key,
          y: cohort[key]?.percentage,
          description: cohort[key]
        });
        if (
          parseInt(cohort[key]?.total, 10) ||
          parseInt(cohort[key]?.total, 10) === 0
        ) {
          tempTotal.push(cohort[key]?.total);
        }
      });
      setTotal(tempTotal.reduce((a, b) => a + b, 0));
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
  }, [cohort]);

  const {
    data: autoClassificationTimeSeries,
    isFetching: autoClassificationTimeSeriesLoading
  } = useQuery(
    ['autoClassificationTimeSeries', location.search, groupBy],
    context => api.waferGetautoClassificationTimeSeries(...context.queryKey),
    { enabled: !isFilterLoading, refetchInterval: false }
  );

  useEffect(() => {
    if (autoClassificationTimeSeries) {
      let maxBarValue = 0;
      const tempChartData = {};
      const dataList = [];
      const dataList2 = [];
      const dataList3 = [];
      autoClassificationTimeSeries.forEach(data => {
        // listOfDates.push(getDateValue(data.effective_date, 'DD-MMM-YY'))
        if (shouldDataAddToChart(data.auto_classified_percentage)) {
          maxBarValue = Math.max(
            maxBarValue,
            data.auto_classified + data.manual_all
          );
          dataList.push({
            y: data.auto_classified,
            x: getDateValue(data.effective_date, groupBy),
            description: {
              date: getDateValue(data.effective_date, groupBy),
              'Auto-classified%': `${data.auto_classified_percentage}%`,
              'Auto-classified': data.auto_classified,
              Manual: data.manual_all,
              Total: data.total
            }
          });
          dataList2.push({
            y: data.manual_all,
            x: getDateValue(data.effective_date, groupBy),
            description: {
              date: getDateValue(data.effective_date, groupBy),
              'Auto-classified%': `${data.auto_classified_percentage}%`,
              'Auto-classified': data.auto_classified,
              Manual: data.manual_all,
              Total: data.total
            }
          });
          dataList3.push({
            y: data.auto_classified_percentage,
            x: getDateValue(data.effective_date, groupBy),
            description: {
              date: getDateValue(data.effective_date, groupBy),
              'Auto-classified%': `${data.auto_classified_percentage}%`,
              'Auto-classified': data.auto_classified,
              Manual: data.manual_all,
              Total: data.total
            }
          });
        }
      });

      const seriesObj = [
        {
          name: AUTO_CLASSIFIED,
          type: 'bar',
          color: '#3B82F6',
          data: selectedGraphLegends.includes(AUTO_CLASSIFIED) ? dataList : []
        },
        {
          name: MANUALLY,
          type: 'bar',
          color: 'rgba(59, 130, 246, 0.4)',
          data: selectedGraphLegends.includes(MANUALLY) ? dataList2 : []
        },
        {
          name: PERCENTAGE,
          type: selectedGraphLegends.includes(PERCENTAGE) ? 'line' : 'bar',
          color: selectedGraphLegends.includes(PERCENTAGE)
            ? '#27AE60'
            : '#FFFFFF',
          data: dataList3
        }
      ];

      tempChartData.series = seriesObj;

      if (autoClassificationTimeSeries.length) {
        const stackBarMaxValue = getTenthFactor(maxBarValue);
        setStackBarData(tempChartData);
        setMaxBarHeightInPoints(stackBarMaxValue);
      } else {
        setStackBarData({ series: [] });
        setMaxBarHeightInPoints(null);
      }
    }
  }, [autoClassificationTimeSeries, selectedLegend, selectedGraphLegends]);

  useLayoutEffect(() => {
    if (
      stackBarContainerRef.current &&
      stackBarData.series &&
      stackBarData.series.length
    ) {
      stackBarContainerRef.current.onresize = reCalculateStackBar;
      reCalculateStackBar();
    }
  }, [stackBarContainerRef, stackBarData]);

  const handleChartClick = (data = {}) => {
    if (unit === 'file') {
      const parsedParams = queryString.parse(location.search, {
        arrayFormat: 'comma',
        parseNumbers: true
      });

      if (data?.date) {
        parsedParams.date__gte = dayjs(parsedParams.date, 'YYYY-MM-DD')
          .subtract(
            1,
            groupBy === 'daily'
              ? 'day'
              : groupBy === 'monthly'
              ? 'month'
              : 'week'
          )
          .format('YYYY-MM-DD-HH-mm-ss');
        parsedParams.date__lte = dayjs(parsedParams.date, 'YYYY-MM-DD').format(
          'YYYY-MM-DD-HH-mm-ss'
        );

        parsedParams.time_format = groupBy;
        delete parsedParams.date;
      }

      const contextualFilters = decodeURL(parsedParams.contextual_filters);
      const otherFilters = decodeURL(parsedParams.other_filters);

      const params = queryString.stringify({
        contextual_filters: encodeURL(
          {
            ...contextualFilters,
            ...otherFilters,
            ...data,
            is_live: true
          },
          { arrayFormat: 'comma' }
        )
      });

      navigate(`/${subscriptionId}/${packId}/annotation/review?${params}`);
    }
  };

  return (
    <Box display='flex'>
      <Box className={classes.leftContainer} flex={1} pt={1.75} px={1.75}>
        <Typography className={classes.leftTitle}>
          Distribution of use cases based on auto-classification%
        </Typography>

        {isCohortLoading ? (
          <CircularProgress />
        ) : (
          <BarChart unit={unit} data={barChartData} />
        )}

        {!isCohortLoading && (
          <Box pb={1.5}>
            <ClickableBoxGroup
              liveUsecaseCount={activeUsecaseCount}
              onClick={handleLegendClick}
              title='Total Usecases'
              value={total}
              subtitle={`Use cases with auto-classified ${
                unit === 'wafer' ? 'wafers' : 'images'
              }%`}
              data={useCasedata}
              active={selectedLegend}
            />
          </Box>
        )}
      </Box>

      <Box
        flex={4}
        p={1.75}
        ref={stackBarContainerRef}
        className={classes.chartContainer}
      >
        <Typography className={classes.rightTitle}>{` ${
          selectedLegend.length === 3
            ? 'Auto-classification Trend'
            : `Use cases with auto-classified ${
                unit === 'wafer' ? 'wafers' : 'images'
              } ${selectedLegend.join(', ')}`
        }`}</Typography>

        {autoClassificationTimeSeriesLoading ? (
          <CircularProgress />
        ) : (
          <StackBarLineChart
            unit={unit}
            data={stackBarData}
            onClick={handleChartClick}
            chartMeta={chartMeta}
            maxBarHeightInPoints={maxBarHeightInPoints}
          />
        )}

        <Box pb={1.5}>
          <ClickableBoxGroup
            onClick={handleGraphLegendClick}
            data={GRAPH_LEGENDS}
            active={selectedGraphLegends}
          />
        </Box>

        <Box mt={1} display='flex'>
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

export default WaferAutoClassificationDistribution;
