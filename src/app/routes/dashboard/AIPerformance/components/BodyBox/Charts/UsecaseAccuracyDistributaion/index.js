import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import {
  encodeURL,
  getParamsObjFromEncodedString,
  getStackBarChartMeta
} from 'app/utils/helpers';
import queryString from 'query-string';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { selectIsFilterLoading } from 'store/filter/selector';

import BarChart from './Charts/bar-chart';
import StackBarLineChart from './Charts/stack-bar-line';
import {
  AI_PERFORMANCE_ROUTES,
  UNIT_IMAGES
} from 'store/aiPerformance/constants';
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
  pinkBox: {
    width: '8px',
    height: '8px',
    backgroundColor: 'rgba(251, 113, 133, 0.4)'
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
  pinkBorderBox: {
    width: '8px',
    height: '8px',
    border: '1px solid rgba(251, 113, 133, 0.4)'
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
  }
}));

const getAuditCount = (unit, data) =>
  unit === AI_PERFORMANCE_ROUTES.UNIT_IMAGES.path
    ? data.total_audited_file_set_count
    : data.audited_wafer_count;

const UsecaseAccuracyDistribution = () => {
  const classes = useStyles();
  const stackBarContainerRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { subscriptionId, packId, mode, unit } = useParams();

  const { activeUsecaseCount } = useSelector(
    ({ aiPerformance }) => aiPerformance
  );
  const isFilterLoading = useSelector(selectIsFilterLoading);

  const [barChartData, setBarChartData] = useState({});
  const [stackBarData, setStackBarData] = useState({});
  const [total, setTotal] = useState(0);
  const [selectedLegend, setSelectedLegend] = useState([
    '90%+',
    '80%-90%',
    '<80%',
    'none'
  ]);
  const [minMaxBarValue, setMinMaxBarValue] = useState({ min: 0, max: 0 });
  const [chartMeta, setChartMeta] = useState({
    width: '100%',
    verticalLabel: false,
    hideLabels: true
  });

  const data = [
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
    },
    {
      value: 'none',
      label: 'No images with feedback',
      classes: [classes.pinkBox, classes.pinkBorderBox]
    }
  ];

  const reCalculateStackBar = () => {
    const { series } = stackBarData;
    const [firstData] = series;
    const { data = [] } = firstData;

    const { width, verticalLabel, hideLabels } = getStackBarChartMeta(
      stackBarContainerRef,
      data.length
    );

    if (!width) return;

    setChartMeta({ width, verticalLabel, hideLabels });
  };

  const shouldDataAddToChart = value => {
    if (selectedLegend.length === 4) {
      return true;
    }
    if (value === null && selectedLegend.includes('none')) {
      return true;
    }
    if (value !== null && value >= 90 && selectedLegend.includes('90%+')) {
      return true;
    }
    if (
      value !== null &&
      value >= 80 &&
      value < 90 &&
      selectedLegend.includes('80%-90%')
    ) {
      return true;
    }
    if (value !== null && value < 80 && selectedLegend.includes('<80%')) {
      return true;
    }
    return false;
  };

  // const handleLegendClick = value => {
  //   // if (Array.isArray(value)) {
  //   // 	setSelectedLegend(value)
  //   // } else {
  //   // 	setSelectedLegend([value])
  //   // }
  //   if (Array.isArray(value)) {
  //     setSelectedLegend(value);
  //   } else if (selectedLegend.includes(value)) {
  //     setSelectedLegend(selectedLegend.filter(x => x !== value));
  //   } else {
  //     setSelectedLegend([...selectedLegend, value]);
  //   }
  // };

  // const handleTotalClick = (value) => {
  // 	setSelectedLegend(value)
  // }

  const {
    data: useCaseAccuracyTimeSeries,
    isFetching: useCaseAccuracyTimeSeriesLoading
  } = useQuery(
    ['useCaseAccuracyTimeSeries', location.search],
    context => api.useCaseAccuracyTimeSeries(...context.queryKey),
    { enabled: !isFilterLoading, refetchInterval: false }
  );

  const setCohortData = data => {
    const cohortData = {
      '90-100': { total: 0, usecase_id: [] },
      '80-90': { total: 0, usecase_id: [] },
      '0-80': { total: 0, usecase_id: [] },
      'N/A': { total: 0, usecase_id: [] }
    };
    data.forEach(item => {
      if (item.accuracy_percentage === null)
        cohortData['N/A'] = {
          total: cohortData['N/A'].total + 1,
          usecase_id: [...cohortData['N/A'].usecase_id, item.use_case_id]
        };
      if (item.accuracy_percentage < 80)
        cohortData['0-80'] = {
          total: cohortData['0-80'].total + 1,
          usecase_id: [...cohortData['0-80'].usecase_id, item.use_case_id]
        };
      if (item.accuracy_percentage > 80 && item.accuracy_percentage < 90)
        cohortData['80-90'] = {
          total: cohortData['80-90'].total + 1,
          usecase_id: [...cohortData['80-90'].usecase_id, item.use_case_id]
        };
      if (item.accuracy_percentage >= 90)
        cohortData['90-100'] = {
          total: cohortData['90-100'].total + 1,
          usecase_id: [...cohortData['90-100'].usecase_id, item.use_case_id]
        };
    });

    const cohortDataList = [];
    const tempCohortChartData = {};
    const tempTotal = [];
    Object.keys(cohortData).forEach(key => {
      const percent = (cohortData[key].total / data.length) * 100;
      cohortDataList.push({
        x: key,
        y: percent,
        description: { ...cohortData[key], percent }
      });
      if (
        parseInt(cohortData[key].total, 10) ||
        parseInt(cohortData[key].total, 10) === 0
      ) {
        tempTotal.push(cohortData[key].total);
      }
    });
    setTotal(tempTotal.reduce((a, b) => a + b, 0));
    const cohortSeries = [
      {
        name: 'cohort',
        // type: 'bar',
        data: cohortDataList
      }
    ];
    tempCohortChartData.series = cohortSeries;
    setBarChartData(tempCohortChartData);
  };

  useEffect(() => {
    if (useCaseAccuracyTimeSeries) {
      let maxBarValue = 0;
      const tempChartData = {};
      const dataList = [];
      const dataList2 = [];
      useCaseAccuracyTimeSeries.forEach(data => {
        // listOfDates.push(data.effective_date)
        maxBarValue = Math.max(maxBarValue, getAuditCount(unit, data));
        if (shouldDataAddToChart(data.accuracy_percent)) {
          if (data.accuracy_percent === null) {
            dataList.push({
              y: 100,
              x: data.use_case_name,
              isNullPercentage: true,
              description: data
            });
          } else {
            dataList.push({
              y: data.accuracy_percentage,
              x: data.use_case_name,
              description: data
            });
          }
          dataList2.push({
            y: getAuditCount(unit, data),
            x: data.use_case_name,
            description: data
          });
        }
      });
      const series = [
        {
          name: 'accuracy',
          type: 'bar',
          data: dataList
        },
        {
          name: 'no_of_lot_audited',
          type: 'line',
          color: '#27AE60',
          data: dataList2
        }
      ];
      tempChartData.series = series;
      if (useCaseAccuracyTimeSeries.length) {
        setStackBarData(tempChartData);
        setMinMaxBarValue({ max: maxBarValue, min: 0 - maxBarValue * 5 });
      } else {
        setStackBarData({ series: [] });
        setMinMaxBarValue({ min: 0, max: 0 });
      }
      setCohortData(useCaseAccuracyTimeSeries);
    }
  }, [useCaseAccuracyTimeSeries, selectedLegend, unit]);

  useLayoutEffect(() => {
    if (
      stackBarContainerRef.current &&
      stackBarData.series &&
      stackBarData.series.length
    ) {
      stackBarContainerRef.current.onresize = reCalculateStackBar;
      reCalculateStackBar();
    }
  }, [stackBarContainerRef, stackBarData, total]);

  const handleChartClick = useCaseId => {
    // const filterSession = JSON.parse(sessionStorage.getItem(FilterKey) || {})
    // if (unit === 'file') {
    // 	let parsedParams = queryString.parse(location.search, { arrayFormat: 'comma', parseNumbers: true })
    // 	const contextualFilters = decodeURL(parsedParams.contextual_filters)
    // 	const otherFilters = decodeURL(parsedParams.other_filters)
    // 	sessionStorage.setItem(
    // 		FilterKey,
    // 		JSON.stringify({
    // 			...filterSession,
    // 			[ReviewScreen]: {
    // 				contextual_filters: {
    // 					...contextualFilters,
    // 					...otherFilters,
    // 					...data,
    // 					ml_model_status__in: 'deployed_in_prod',
    // 				},
    // 				other_filters: {},
    // 				key: ReviewScreen,
    // 			},
    // 		})
    // 	)

    // 	const params = queryString.stringify({
    // 		contextual_filters: encodeURL(
    // 			{
    // 				...contextualFilters,
    // 				...otherFilters,
    // 				...data,
    // 				ml_model_status__in: 'deployed_in_prod',
    // 			},
    // 			{
    // 				arrayFormat: 'comma',
    // 			}
    // 		),
    // 		other_filters: encodeURL({}),
    // 		screen_key: ReviewScreen,
    // 	})
    // 	sessionStorage.setItem('previousUrl', `${location.pathname}${location.search}`)
    // 	navigate({
    // 		pathname: `/${subscriptionId}/annotation/review`,
    // 		search: params,
    // 	})
    // }
    if (useCaseId) {
      // dispatch(setDrawerUsecase(useCaseId))
      // dispatch(setDrawerState(true))

      const finalParamObj = getParamsObjFromEncodedString(`${location.search}`);

      const paramsObj = {};

      if (finalParamObj.use_case_id__in) {
        paramsObj.use_case_id__in = finalParamObj.use_case_id__in;
        delete finalParamObj.use_case_id__in;
      }

      if (finalParamObj.wafer_id__in) {
        paramsObj.wafer_id__in = finalParamObj.wafer_id__in;
        delete finalParamObj.wafer_id__in;
      }

      if (useCaseId) {
        paramsObj.use_case_id__in = useCaseId;
      }

      const params = queryString.stringify({
        contextual_filters: encodeURL(finalParamObj),
        other_filters: encodeURL(paramsObj)
      });

      navigate(`/${subscriptionId}/${packId}/dashboard/wafer-book?${params}`);
    }
  };

  return (
    <Box display='flex'>
      <Box className={classes.leftContainer} flex={1} pt={1.75} px={1.75}>
        <Typography className={classes.leftTitle}>
          Distribution of use cases based on accuracy
        </Typography>
        {useCaseAccuracyTimeSeriesLoading ? (
          <CircularProgress />
        ) : (
          <BarChart data={barChartData} />
        )}
        {!useCaseAccuracyTimeSeriesLoading && (
          <Box pb={1.5}>
            <ClickableBoxGroup
              liveUsecaseCount={activeUsecaseCount}
              // onClick={handleLegendClick}
              title='Total Usecase'
              value={total}
              subtitle='Use cases with accuracy '
              data={data}
              active={selectedLegend}
            />
          </Box>
        )}
      </Box>
      <Box flex={4} p={1.75} className={classes.chartContainer}>
        <Typography className={classes.leftTitle}>{` ${
          selectedLegend.length === 4
            ? 'All use cases'
            : `Use cases with accuracy ${selectedLegend
                .join(', ')
                .replace('none', 'No Image with feedback')}`
        }`}</Typography>
        {useCaseAccuracyTimeSeriesLoading ? (
          <CircularProgress />
        ) : (
          <StackBarLineChart
            onClick={handleChartClick}
            data={stackBarData}
            unit={unit}
            chartMeta={chartMeta}
            minMaxBarValue={minMaxBarValue}
          />
        )}
      </Box>
    </Box>
  );
};

export default UsecaseAccuracyDistribution;
