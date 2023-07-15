import EmptyState from 'app/components/EmptyState';
import React from 'react';
import Charts from 'react-apexcharts';

const LineChart = ({ data }) => {
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
      show: true,
      position: 'bottom',
      horizontalAlign: 'left',
      markers: {
        width: 8,
        height: 8,
        radius: 0,
        offsetX: 0,
        offsetY: 0
      }
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
      tickAmount: 10,
      tooltip: {
        enabled: false
      },
      title: {
        text: 'No. of iterations'
      }
    },
    yaxis: {
      title: {
        text: '',
        style: {
          color: '#5E7BAA',
          fontSize: '0.75rem',
          fontWeight: 400
        }
      },
      tickAmount: 5
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
        <Charts options={options} series={data} type='line' height={300} />
      ) : (
        <EmptyState subTitle='Insufficient data points to plot chart' />
      )}
    </div>
  );
};

export default LineChart;
