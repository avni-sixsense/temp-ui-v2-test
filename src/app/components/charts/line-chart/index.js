import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Charts from 'react-apexcharts';

const useStyles = makeStyles(theme => ({}));

const LineChart = () => {
  const classes = useStyles();
  const series = [
    {
      name: 'Automation Percentage',
      data: [
        { x: '01 Jan 2001', y: 90 },
        { x: '02 Jan 2001', y: 92 },
        { x: '03 Jan 2001', y: 88 },
        { x: '04 Jan 2001', y: 97 },
        { x: '05 Jan 2001', y: 97 },
        { x: '06 Jan 2001', y: 96 },
        { x: '07 Jan 2001', y: 85 },
        { x: '08 Jan 2001', y: 70 },
        { x: '09 Jan 2001', y: 75 },
        { x: '10 Jan 2001', y: 97 },
        { x: '11 Jan 2001', y: 91 },
        { x: '12 Jan 2001', y: 98 }
      ]
    },
    {
      name: 'Page Views',
      data: [
        { x: '1 Jan', y: 35 },
        { x: '2 Jan', y: 41 },
        { x: '3 Jan', y: 62 },
        { x: '4 Jan', y: 42 },
        { x: '5 Jan', y: 13 },
        { x: '6 Jan', y: 18 },
        { x: '7 Jan', y: 29 },
        { x: '8 Jan', y: 37 },
        { x: '9 Jan', y: 36 },
        { x: '10 Jan', y: 51 },
        { x: '11 Jan', y: 32 },
        { x: '12 Jan', y: 35 }
      ]
    },
    {
      name: 'Total Visits',
      data: [
        { x: '1 Jan', y: 87 },
        { x: '2 Jan', y: 57 },
        { x: '3 Jan', y: 74 },
        { x: '4 Jan', y: 99 },
        { x: '5 Jan', y: 75 },
        { x: '6 Jan', y: 38 },
        { x: '7 Jan', y: 62 },
        { x: '8 Jan', y: 47 },
        { x: '9 Jan', y: 82 },
        { x: '10 Jan', y: 56 },
        { x: '11 Jan', y: 45 },
        { x: '12 Jan', y: 47 }
      ]
    }
  ];

  const options = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    // dataLabels: {
    // 	enabled: false,
    // },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    legend: {
      show: false,
      tooltipHoverFormatter: function (val, opts) {
        return (
          val +
          ' - ' +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          ''
        );
      }
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6
      }
    },
    dataLabels: {
      enabled: false,
      // formatter: function (val, data) {
      // 	console.log({ data })
      // 	const { seriesIndex, w } = data
      // 	if (w.config.series[seriesIndex]?.type === 'bar') {
      // 		return val + 'Fenil nilotpal%'
      // 	}
      // 	return ''
      // },
      offsetY: -5,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      }
    },
    tooltip: {
      shared: false
    },
    fill: {
      color: 'transparent'
    },
    grid: {
      borderColor: '#f1f1f1',
      show: false,
      yaxis: {
        lines: {
          show: false
        }
      }
    }
  };

  return (
    <div className='chart'>
      <Charts options={options} series={series} type='line' height={350} />
    </div>
  );
};

export default LineChart;
