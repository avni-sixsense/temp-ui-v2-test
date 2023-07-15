import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import Charts from 'react-apexcharts';

const useStyles = makeStyles(theme => ({}));

const BarChart = ({ data = {} }) => {
  const classes = useStyles();
  const [series, setSeries] = useState([]);
  const [options] = useState({
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    grid: {
      show: true,
      borderColor: '#E8F2FE',
      strokeDashArray: 0,
      position: 'back',
      yaxis: {
        lines: {
          show: true
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
    colors: ['#3B82F6', 'rgba(59, 130, 246, 0.4)', '#2F67C2'],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '10x'
      }
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 1,
      dashArray: [0, 0, 8]
    },
    xaxis: {
      type: 'datetime',
      // categories: [],
      tooltip: {
        enabled: false
      },
      labels: {
        format: 'dd MMM',
        style: {
          colors: '#5E7BAA',
          fontSize: '9px',
          fontWeight: 500
        }
      },
      axisBorder: {
        show: true,
        color: '#E8F2FE',
        height: 1,
        width: '100%',
        offsetX: 0,
        offsetY: 0
      }
    },
    yaxis: {
      max: 100,
      tickAmount: 5,
      labels: {
        style: {
          colors: '#5E7BAA',
          fontSize: '9px',
          fontWeight: 500
        }
      }
    },
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
    tooltip: {
      custom({ series, seriesIndex, dataPointIndex, w }) {
        const desc =
          w.config.series[seriesIndex].data[dataPointIndex].description;
        return `<div class="tooltip_container">${Object.keys(desc).map(x => {
          return `<div class='tooltip_data_container'><span class='tooltip_key'>${x}</span> <span class='tooltip_value'>${desc[x]}</span></div>`;
        })}</div>`.replaceAll(',', '');
      },
      intersect: false,
      shared: true,
      followCursor: false
    }
  });

  useEffect(() => {
    if (Object.keys(data).length) {
      setSeries(data.series);
    }
  }, [data]);

  if (!data.series || !data.series.length) {
    return (
      <Box display='flex' alignItems='center' justifyContent='center'>
        <Typography>There are no records to display</Typography>
      </Box>
    );
  }

  return (
    <div className='chart'>
      {series.length && (
        <Charts options={options} series={series} type='line' height={350} />
      )}
    </div>
  );
};

export default BarChart;
