import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';

import BarChart from './Charts/bar-chart';
import StackBarLineChart from './Charts/stack-bar-line';
import ClickableBoxGroup from '../DistributionAccuracyContainer/components/ClickableBoxGroup';

const useStyles = makeStyles(theme => ({
  leftTitle: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[15]
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
    fontWeight: 400,
    color: theme.colors.grey[12]
  }
}));

const DefectAccuracyDistributaion = ({ unit, usecase, mode }) => {
  const classes = useStyles();
  const location = useLocation();

  const [barChartData, setBarChartData] = useState({});
  const [stackBarData, setStackBarData] = useState({});
  const [total, setTotal] = useState(0);
  const [selectedLegend, setSelectedLegend] = useState([
    '90%+',
    '80%-90%',
    '<80%'
  ]);
  const data = [
    {
      value: '90%+',
      label: 'Correctly classified: 90%+',
      classes: [classes.greenBox, classes.greenBorderBox]
    },
    {
      value: '80%-90%',
      label: 'Correctly classified: 80%- 90%',
      classes: [classes.yellowBox, classes.yellowBorderBox]
    },
    {
      value: '<80%',
      label: 'Correctly classified:<80%',
      classes: [classes.redBox, classes.redBorderBox]
    }
  ];
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
    if (Array.isArray(value)) {
      setSelectedLegend(value);
    } else {
      setSelectedLegend([value]);
    }
  };

  const { data: cohort, isLoading: isCohortLoading } = useQuery(
    ['defectAccuracyCohort', location.search, unit, usecase.id],
    context => api.defectAccuracyCohort(...context.queryKey)
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
    data: defectAccuracyTimeSeries = [],
    isLoading: defectAccuracyTimeSeriesLoading
  } = useQuery(
    ['defectAccuracyTimeSeries', location.search, unit, usecase.id],
    context => api.defectAccuracyTimeSeries(...context.queryKey)
  );

  useEffect(() => {
    if (defectAccuracyTimeSeries && !defectAccuracyTimeSeriesLoading) {
      const tempChartData = {};
      const dataList = [];
      const dataList2 = [];
      defectAccuracyTimeSeries.forEach(data => {
        // listOfDates.push(data.effective_date)
        if (shouldDataAddToChart(data.accuracy_percentage)) {
          dataList.push({
            y: data.accuracy_percentage,
            x: data.gt_defect_name,
            description: data
          });
          dataList2.push({
            y: data.total_gt_defects,
            x: data.gt_defect_name,
            description: data
          });
        }
      });
      const series = [
        {
          name: 'Accuracy %',
          type: 'bar',
          data: dataList
        },
        {
          name: 'No. of images Audited',
          type: 'line',
          color: '#27AE60',
          data: dataList2
        }
      ];
      tempChartData.series = series;
      if (defectAccuracyTimeSeries.length) {
        setStackBarData(tempChartData);
      } else {
        setStackBarData({ series: [] });
      }
    }
  }, [defectAccuracyTimeSeries, selectedLegend]);

  return (
    <Box display='flex'>
      <Box className={classes.leftContainer} flex={1} pt={1.75} px={1.75}>
        {/* <Typography className={classes.leftTitle}>Layerwise Automation distribution</Typography> */}
        {isCohortLoading ? (
          <CircularProgress />
        ) : (
          <BarChart data={barChartData} />
        )}
        {!isCohortLoading && (
          <Box>
            <ClickableBoxGroup
              onClick={handleLegendClick}
              title='Total Defects'
              value={total}
              data={data}
              active={selectedLegend}
            />
          </Box>
        )}
      </Box>
      <Box flex={4} p={1.75} className={classes.chartContainer}>
        <Typography className={classes.leftTitle}>{`Defects: Accuracy ${
          selectedLegend.length === 3 ? '- All' : selectedLegend.join(', ')
        }`}</Typography>
        {defectAccuracyTimeSeriesLoading ? (
          <CircularProgress />
        ) : (
          <StackBarLineChart data={stackBarData} />
        )}
      </Box>
    </Box>
  );
};

export default DefectAccuracyDistributaion;
