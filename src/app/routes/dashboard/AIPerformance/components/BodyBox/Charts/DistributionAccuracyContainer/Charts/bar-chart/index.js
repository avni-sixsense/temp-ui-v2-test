import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Charts from 'react-apexcharts';

const BarChart = ({ data = {}, isUAT }) => {
  const options = {
    chart: {
      height: 250,
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
        columnWidth: '34px',
        dataLabels: {
          position: 'center' // top, center, bottom
        }
      }
    },
    colors: ['#00E396'],
    dataLabels: {
      enabled: true,
      formatter(_val, opts) {
        const { w, dataPointIndex, seriesIndex } = opts;
        const { total } =
          w.config.series[seriesIndex].data[dataPointIndex].description;
        return total;
      },
      style: {
        fontSize: '12px',
        // colors: ['#E8F2FE', '#3E5680', '#3E5680', '#3E5680'],
        colors: [
          function ({ dataPointIndex }) {
            if (dataPointIndex === 0) {
              return '#3E5680';
            }
            if (dataPointIndex === 1) {
              return '#3E5680';
            }
            if (dataPointIndex === 2) {
              return '#3E5680';
            }
            if (dataPointIndex === 3) {
              return '#3E5680';
            }
            if (dataPointIndex === 4) {
              return '#3E5680';
            }
          }
        ]
      }
    },
    xaxis: {
      // type: 'datetime',
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
      show: false,
      min: 0,
      max: 100
    },
    legend: {
      show: false
    },
    fill: {
      colors: [
        function ({ dataPointIndex }) {
          if (isUAT) {
            if (dataPointIndex === 0) {
              return '#6FCF97';
            }
            if (dataPointIndex === 1) {
              return '#FDE68A';
            }
            if (dataPointIndex === 2) {
              return 'rgba(217, 119, 6, 0.6)';
            }
            if (dataPointIndex === 3) {
              return '#FB7185';
            }
            if (dataPointIndex === 4) {
              return 'rgba(251, 113, 133, 0.4)';
            }
          } else {
            if (dataPointIndex === 0) {
              return '#6FCF97';
            }
            if (dataPointIndex === 1) {
              return '#FDE68A';
            }
            if (dataPointIndex === 2) {
              return '#FB7185';
            }
            if (dataPointIndex === 3) {
              return 'rgba(251, 113, 133, 0.4)';
            }
          }
        }
      ]
    },
    tooltip: {
      custom({ dataPointIndex }) {
        if (isUAT) {
          if (dataPointIndex === 0) {
            return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='greenBox'></div> <div>Auto-classification >=93%, Accuracy >=90%</div></div></div>`.replaceAll(
              ',',
              ''
            );
          }
          if (dataPointIndex === 1) {
            return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='yellowBox'></div> <div>Auto-classification >=93%, Accuracy <90%</div></div></div>`.replaceAll(
              ',',
              ''
            );
          }
          if (dataPointIndex === 2) {
            return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='brownBox'></div> <div>Auto-classification <93%, Accuracy >=90%</div></div></div>`.replaceAll(
              ',',
              ''
            );
          }
          if (dataPointIndex === 3) {
            return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='redBox'></div> <div>Auto-classification <93%, Accuracy <90%</div></div></div>`.replaceAll(
              ',',
              ''
            );
          }
          if (dataPointIndex === 4) {
            return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='pinkBox'></div> <div>No images with feedback</div></div></div>`.replaceAll(
              ',',
              ''
            );
          }
        } else {
          if (dataPointIndex === 0) {
            return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='greenBox'></div> <div>Accuracy >= 90%</div></div></div>`.replaceAll(
              ',',
              ''
            );
          }
          if (dataPointIndex === 1) {
            return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='yellowBox'></div> <div>Accuracy 80% - 90%</div></div></div>`.replaceAll(
              ',',
              ''
            );
          }
          if (dataPointIndex === 2) {
            return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='redBox'></div> <div>Accuracy < 80%</div></div></div>`.replaceAll(
              ',',
              ''
            );
          }
          if (dataPointIndex === 3) {
            return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='pinkBox'></div> <div>No images with feedback</div></div></div>`.replaceAll(
              ',',
              ''
            );
          }
        }
      },
      intersect: false,
      shared: false,
      followCursor: false
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
      {!data?.series ? (
        <Box display='flex' alignItems='center'>
          <Typography>There are no records to display</Typography>
        </Box>
      ) : (
        <Charts
          options={options}
          series={data?.series || []}
          type='bar'
          height={250}
        />
      )}
    </div>
  );
};

export default BarChart;
