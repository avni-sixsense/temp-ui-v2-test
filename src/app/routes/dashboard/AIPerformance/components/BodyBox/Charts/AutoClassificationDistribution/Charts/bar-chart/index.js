import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Charts from 'react-apexcharts';

const BarChart = ({ data = {}, unit }) => {
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
      // events: {
      // 	dataPointSelection: (event, chartContext, config) => {
      // 		const { dataPointIndex, seriesIndex, w } = config
      // 		const { series } = w.config
      // 		onClick({
      // 			is_confident_defect: seriesIndex === 0,
      // 			use_case_ids_in: series[seriesIndex].data[dataPointIndex].description?.use_case_id__in || [],
      // 		})
      // 	},
      // },
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
        const { count } =
          w.config.series[seriesIndex].data[dataPointIndex].description;
        return count;
      },
      style: {
        fontSize: '12px',
        // colors: ['#E8F2FE', '#3E5680', '#3E5680', '#3E5680'],
        colors: [
          function ({ dataPointIndex }) {
            if (dataPointIndex === 0) {
              // return '#E8F2FE'
              return '#3E5680';
            }
            if (dataPointIndex === 1) {
              return '#3E5680';
            }
            if (dataPointIndex === 2) {
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
    tooltip: {
      custom({ dataPointIndex }) {
        if (dataPointIndex === 0) {
          return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='greenBox'></div> <div>Use cases with auto-classified ${
            unit === 'wafer' ? 'wafers' : 'images'
          }: 90%+</div></div></div>`.replaceAll(',', '');
        }
        if (dataPointIndex === 1) {
          return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='yellowBox'></div> <div>Use cases with auto-classified ${
            unit === 'wafer' ? 'wafers' : 'images'
          }: 80%- 90%</div></div></div>`.replaceAll(',', '');
        }
        if (dataPointIndex === 2) {
          return `<div class="tooltip_container"><div class='cohort_tooltip'> <div class='redBox'></div> <div>Use cases with auto-classified ${
            unit === 'wafer' ? 'wafers' : 'images'
          }: <80%</div></div></div>`.replaceAll(',', '');
        }
      },
      intersect: false,
      shared: false,
      followCursor: false
    },
    fill: {
      colors: [
        function ({ dataPointIndex }) {
          if (dataPointIndex === 0) {
            return '#6FCF97';
          }
          if (dataPointIndex === 1) {
            return '#FDE68A';
          }
          if (dataPointIndex === 2) {
            return '#EB5757';
          }
        }
      ]
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
          height={260}
        />
      )}
    </div>
  );
};

export default BarChart;
