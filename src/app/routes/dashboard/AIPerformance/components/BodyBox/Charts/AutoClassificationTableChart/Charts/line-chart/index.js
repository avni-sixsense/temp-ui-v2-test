import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Charts from 'react-apexcharts';
import moment from 'moment/moment';

const LineChart = ({ data, unit }) => {
  const chartData = data[0]?.data || [];
  const options = {
    chart: {
      height: 330,
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    legend: {
      show: false
    },
    markers: {
      size: 5,
      hover: {
        sizeOffset: 6
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      custom({ seriesIndex, dataPointIndex, w }) {
        const desc =
          w.config.series[seriesIndex].data[dataPointIndex].description;
        const { name } = w.config.series[seriesIndex];
        return `<div class="tooltip_container"><div class='tooltip_header'> ${name} | ${
          desc.date
        } </div>${Object.keys(desc).map(x => {
          if (x === 'date') {
            return '';
          }
          return `<div class='tooltip_data_container'><span class='tooltip_key'>${x}</span> <span class='tooltip_value'>${desc[x]}</span></div>`;
        })}</div>`.replaceAll(',', '');
      },
      intersect: true,
      shared: false,
      followCursor: false
    },
    fill: {
      color: 'transparent'
    },
    xaxis: {
      labels: {
        formatter(val) {
          return moment(val).format('DD MMM YY');
        }
      },
      // type: 'datetime',
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      title: {
        text:
          unit === 'wafer'
            ? 'Auto-classified wafers%'
            : 'Auto-classified images%',
        style: {
          color: '#5E7BAA',
          fontSize: '0.75rem',
          fontWeight: 400
        }
      },
      max: 100,
      tickAmount: 5,
      labels: {
        formatter(val) {
          return `${parseInt(val, 10) || ''}%`;
        }
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
      {data.length ? (
        <Charts
          options={options}
          series={data}
          type='line'
          height={300}
          width={
            chartData.length * 75 < window.innerWidth
              ? '100%'
              : chartData.length * 75
          }
        />
      ) : (
        <Box display='flex' alignItems='center' justifyContent='center'>
          <Typography>Please Select Usecase.</Typography>
        </Box>
      )}
    </div>
  );
};

export default LineChart;
