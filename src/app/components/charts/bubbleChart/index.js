import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Charts from 'react-apexcharts';

const useStyles = makeStyles(theme => ({}));

const BarChart = () => {
  const classes = useStyles();
  const series = [
    {
      name: 'Bubble1',
      data: [
        [10, 4, 45],
        [20, 8, 50],
        [30, 2, 30],
        [40, 3, 20],
        [50, 8, 10]
      ]
    },
    {
      name: 'Bubble2',
      data: [
        [18, 14, 45],
        [28, 45, 58],
        [38, 20, 38],
        [48, 9, 28],
        [58, 15, 18]
      ]
    },
    {
      name: 'Bubble3',
      data: [
        [14, 4, 45],
        [24, 8, 54],
        [34, 2, 34],
        [44, 3, 24],
        [54, 8, 14]
      ]
    },
    {
      name: 'Bubble4',
      data: [
        [11, 4, 45],
        [21, 8, 51],
        [31, 2, 31],
        [41, 3, 21],
        [51, 8, 11]
      ]
    }
  ];

  const options = {
    chart: {
      height: 350,
      type: 'bubble'
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 0.8
    },
    xaxis: {
      tickAmount: 12,
      type: 'category'
    },
    yaxis: {
      max: 70
    }
  };

  return (
    <div className='chart'>
      <Charts options={options} series={series} type='bubble' height={350} />
    </div>
  );
};

export default BarChart;
