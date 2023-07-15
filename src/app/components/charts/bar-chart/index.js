import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Charts from 'react-apexcharts';

const useStyles = makeStyles(theme => ({}));

const BarChart = () => {
  const classes = useStyles();
  const series = [
    {
      name: 'Actual',
      data: [
        {
          x: '2011',
          y: 78
        },
        {
          x: '2012',
          y: 6
        },
        {
          x: '2013',
          y: 7
        },
        {
          x: '2014',
          y: 7
        }
      ]
    }
  ];

  const options = {
    chart: {
      height: 350,
      type: 'bar',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    grid: {
      show: false
    },
    plotOptions: {
      bar: {
        columnWidth: '34px'
      }
    },
    colors: ['#00E396'],
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        // colors: ['#E8F2FE', '#3E5680', '#3E5680', '#3E5680'],
        colors: [
          function ({ dataPointIndex }) {
            if (dataPointIndex === 0) {
              return '#E8F2FE';
            } else if (dataPointIndex === 1) {
              return '#3E5680';
            } else if (dataPointIndex === 2) {
              return '#3E5680';
            } else if (dataPointIndex === 3) {
              return '#3E5680';
            }
          }
        ]
      }
    },
    xaxis: {
      type: 'datetime',
      // categories: [],
      tooltip: {
        enabled: false
      },
      labels: {
        show: false
      },
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: true,
        color: '#A8C3E8',
        height: 1,
        width: '100%',
        offsetX: 0,
        offsetY: 0
      }
    },
    yaxis: {
      show: false
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: [
        'Auto-classification >90%, Accuracy >90%',
        'Auto-classification >90%, Accuracy <90%',
        'Auto-classification <90%, Accuracy >90%',
        'Auto-classification <90%, Accuracy <90%'
      ],
      markers: {
        width: '12px',
        height: '12px',
        fillColors: ['#6FCF97', '#FDE68A', '#E8AD6A', '#FB7185']
      },
      horizontalAlign: 'left',
      offsetY: 5,
      onItemClick: {
        toggleDataSeries: false
      },
      fontSize: '12px',
      labels: {
        colors: '#5E7BAA'
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: false
      }
    },
    fill: {
      colors: [
        function ({ dataPointIndex }) {
          if (dataPointIndex === 0) {
            return '#6FCF97';
          } else if (dataPointIndex === 1) {
            return '#FDE68A';
          } else if (dataPointIndex === 2) {
            return '#E8AD6A';
          } else if (dataPointIndex === 3) {
            return '#FB7185';
          }
        }
      ]
    }
  };
  return (
    <div className='chart'>
      <Charts options={options} series={series} type='bar' height={350} />
    </div>
  );
};

export default BarChart;
