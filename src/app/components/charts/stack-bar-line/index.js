import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Charts from 'react-apexcharts';

const useStyles = makeStyles(theme => ({}));

const StackBarLineChart = ({ data }) => {
  const classes = useStyles();
  // const series = [
  // 	{
  // 		name: 'Website Blog',
  // 		type: 'bar',
  // 		data: [
  // 			{ x: '01 Jan 2001', y: 400 },
  // 			{ x: '02 Jan 2001', y: 505 },
  // 			{ x: '03 Jan 2001', y: 414 },
  // 			{ x: '04 Jan 2001', y: 671 },
  // 			{ x: '05 Jan 2001', y: 227 },
  // 			{ x: '06 Jan 2001', y: 413 },
  // 			{ x: '07 Jan 2001', y: 201 },
  // 			{ x: '08 Jan 2001', y: 352 },
  // 			{ x: '09 Jan 2001', y: 752 },
  // 			{ x: '10 Jan 2001', y: 320 },
  // 			{ x: '11 Jan 2001', y: 257 },
  // 			{ x: '12 Jan 2001', y: 160 },
  // 		],
  // 	},
  // 	{
  // 		name: 'Website Blog 2',
  // 		type: 'bar',
  // 		data: [
  // 			{ x: '01 Jan 2001', y: 200 },
  // 			{ x: '02 Jan 2001', y: 55 },
  // 			{ x: '03 Jan 2001', y: 44 },
  // 			{ x: '04 Jan 2001', y: 61 },
  // 			{ x: '05 Jan 2001', y: 27 },
  // 			{ x: '06 Jan 2001', y: 43 },
  // 			{ x: '07 Jan 2001', y: 21 },
  // 			{ x: '08 Jan 2001', y: 32 },
  // 			{ x: '09 Jan 2001', y: 72 },
  // 			{ x: '10 Jan 2001', y: 30 },
  // 			{ x: '11 Jan 2001', y: 27 },
  // 			{ x: '12 Jan 2001', y: 42 },
  // 		],
  // 	},
  // 	{
  // 		name: 'Social Media',
  // 		type: 'line',
  // 		data: [
  // 			{ x: '01 Jan 2001', y: 90 },
  // 			{ x: '02 Jan 2001', y: 92 },
  // 			{ x: '03 Jan 2001', y: 88 },
  // 			{ x: '04 Jan 2001', y: 97 },
  // 			{ x: '05 Jan 2001', y: 97 },
  // 			{ x: '06 Jan 2001', y: 96 },
  // 			{ x: '07 Jan 2001', y: 85 },
  // 			{ x: '08 Jan 2001', y: 70 },
  // 			{ x: '09 Jan 2001', y: 75 },
  // 			{ x: '10 Jan 2001', y: 97 },
  // 			{ x: '11 Jan 2001', y: 91 },
  // 			{ x: '12 Jan 2001', y: 98 },
  // 		],
  // 	},
  // ]

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      events: {
        click: (event, chartContext, config) => {
          // console.log({ event, chartContext, config })
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          position: 'center' // top, center, bottom
        }
      }
    },
    xaxis: {
      type: 'datetime'
      // categories: [
      // 	'01/01/2011 GMT',
      // 	'01/02/2011 GMT',
      // 	'01/03/2011 GMT',
      // 	'01/04/2011 GMT',
      // 	'01/05/2011 GMT',
      // 	'01/06/2011 GMT',
      // ],
    },
    yaxis: [
      {
        title: {
          text: 'No. of Lots '
        },
        seriesName: 'Auto-Classified'
      },
      {
        title: {
          text: ''
        },
        seriesName: 'Auto-Classified',
        show: false
      },
      {
        opposite: true,
        title: {
          text: ''
        },
        seriesName: 'Percentage'
      }
    ],
    legend: {
      position: 'bottom',
      horizontalAlign: 'left',
      offsetY: 5,

      markers: {
        width: '12px',
        height: '12px',
        radius: 0
      },
      onItemClick: {
        toggleDataSeries: false
      }
    },
    fill: {
      opacity: 1
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, data) {
        const { seriesIndex, w } = data;
        if (w.config.series[seriesIndex]?.type === 'bar') {
          return val + '%';
        }
        return '';
      },
      // offsetY: -5,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      }
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
      <Charts
        options={options}
        series={data?.series || []}
        type='line'
        height={350}
      />
    </div>
  );
};

export default StackBarLineChart;
