import { memo } from 'react';

import EmptyState from 'app/components/EmptyState';
import Charts from 'react-apexcharts';

import { GRAPH_LEGENDS } from '../GraphSection';

import classes from './LineChart.module.scss';

const LineChart = memo(({ data, colors, thresholdValue }) => {
  const options = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors,
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    legend: {
      show: false
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: function (val) {
              const { label, subLabel } = GRAPH_LEGENDS[0];
              return label + ` (${subLabel})`;
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              const { label, subLabel } = GRAPH_LEGENDS[1];
              return label + ` (${subLabel})`;
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              const { label, subLabel } = GRAPH_LEGENDS[2];
              return label + ` (${subLabel})`;
            }
          }
        }
      ]
    },

    xaxis: {
      labels: {
        formatter(val) {
          return `${parseInt(val, 10)}%`;
        }
      },
      min: 1,
      max: 100,
      tickAmount: 10
    },
    yaxis: {
      max: 100,
      min: 0,
      tickAmount: 5,
      labels: {
        formatter(val) {
          return `${parseInt(val, 10) || '0'}%`;
        }
      }
    },
    grid: {
      borderColor: '#E8F2FE',
      show: true,
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    annotations: {
      xaxis: [
        {
          x: thresholdValue,
          x2: parseInt(thresholdValue) + 0.2,
          fillColor: '#A78BFA',
          opacity: 1,
          label: {
            borderColor: '#fff',
            position: 'top',
            orientation: 'vertical',
            offsetX: 20,
            offsetY: 75,
            style: {
              color: '#82A0CE',
              background: '#F0F7FF'
            },
            text: 'Similarity threshold'
          }
        }
      ]
    }
  };

  return (
    <div className={classes.chart}>
      {data.length ? (
        <>
          <Charts
            options={options}
            series={data}
            type='line'
            height={345}
            width='100%'
          />

          <div className={classes.yaxis}>Similarity Threshold ---></div>
        </>
      ) : (
        <EmptyState subTitle='Please update filters' />
      )}
    </div>
  );
});

export { LineChart };
