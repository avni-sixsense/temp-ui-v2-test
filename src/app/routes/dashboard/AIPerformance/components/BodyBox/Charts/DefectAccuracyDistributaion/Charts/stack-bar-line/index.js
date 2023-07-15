import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import EmptyState from 'app/components/EmptyState';
import React from 'react';
import Charts from 'react-apexcharts';

const StackBarLineChart = ({ data }) => {
  const chartData = data?.series?.[0]?.data || [];
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
        columnWidth:
          chartData.length < 3 ? '10%' : chartData.length < 5 ? '20%' : '40%',
        dataLabels: {
          position: 'top' // top, center, bottom
        }
      }
    },
    xaxis: {
      // type: 'datetime',
      // categories: [
      // 	'01/01/2011 GMT',
      // 	'01/02/2011 GMT',
      // 	'01/03/2011 GMT',
      // 	'01/04/2011 GMT',
      // 	'01/05/2011 GMT',
      // 	'01/06/2011 GMT',
      // ],
      tooltip: {
        enabled: false
      }
    },
    yaxis: [
      {
        title: {
          text: ''
        },
        seriesName: 'Accuracy %',
        max: 100,
        tickAmount: 5,
        labels: {
          formatter(val) {
            return `${parseInt(val, 10) ? `${parseInt(val, 10)}%` : ''}`;
          }
        }
      },
      {
        opposite: true,
        title: {
          text: 'No. of images Audited'
        },
        seriesName: 'No. of images Audited',
        labels: {
          formatter: val => {
            return val.toFixed(0);
          }
        }
      }
    ],
    legend: {
      show: false,
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
      opacity: 1,
      colors: [
        ({ value }) => {
          if (value > 90) {
            return '#6FCF97';
          }
          if (value >= 80) {
            return '#FDE68A';
          }
          if (value < 80) {
            return '#FB7185';
          }
        }
      ]
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1],
      formatter: val => {
        return val;
      },
      offsetY: -10,
      style: {
        fontSize: '10px',
        fontWeight: 'bold',
        colors: ['#000000']
      },
      background: {
        enabled: false
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
    },
    stroke: {
      width: 2,
      curve: 'smooth',
      colors: [
        ({ value }) => {
          if (value > 90) {
            return '#6FCF97';
          }
          if (value >= 80) {
            return '#FDE68A';
          }
          if (value < 80) {
            return '#FB7185';
          }
        }
      ]
    },
    tooltip: {
      enabled: false,
      x: {
        show: false
      }
    },
    markers: {
      size: 5,
      hover: {
        sizeOffset: 6
      }
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0
        }
      },
      hover: {
        filter: {
          type: 'lighten',
          value: 0.15
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0
        }
      }
    }
  };

  return (
    <div className='chart'>
      {!(data?.series || []).length ? (
        <EmptyState />
      ) : (
        <Charts
          options={options}
          series={data?.series || []}
          type='line'
          height={350}
          width={
            chartData.length * 100 < window.innerWidth
              ? '100%'
              : chartData.length * 100
          }
        />
      )}
    </div>
  );
};

export default StackBarLineChart;
