import EmptyState from 'app/components/EmptyState';
import { abbrNum } from 'app/utils/helpers';
import { useLayoutEffect } from 'react';
import Charts from 'react-apexcharts';

const StackBarLineChart = ({
  data,
  onClick,
  unit,
  chartMeta,
  minMaxBarValue = {}
}) => {
  const { width } = chartMeta;
  const { min, max } = minMaxBarValue;

  useLayoutEffect(() => {
    let style = document.createElement('style');
    style.innerHTML = `
    .apexcharts-series[seriesName="no_of_lot_audited"] {
      transform: translate(0px, -80px)!important;;
    }
    .apexcharts-datalabels[data\\:realIndex="1"]{
      transform: translate(0px, -85px)!important;
    }
    .apexcharts-svg{
      overflow: visible;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);

    return () => {
      document.getElementsByTagName('head')[0].removeChild(style);
    };
  }, []);

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
        dataPointSelection: (event, chartContext, config) => {
          const { dataPointIndex, seriesIndex, w } = config;
          const { series } = w.config;
          onClick(
            series[seriesIndex]?.data[dataPointIndex]?.description?.use_case_id
          );
          // if (
          // 	series[seriesIndex]?.type === 'bar' &&
          // 	series[seriesIndex]?.data[dataPointIndex]?.isNullPercentage
          // ) {
          // 	// {
          // 	// 	use_case_id__in: series[seriesIndex].data[dataPointIndex].description.use_case_id,
          // 	// 	is_accurate: true,
          // 	// }
          // 	onClick()
          // }
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
        borderRadiusApplication: 'end',
        // columnWidth:
        //   chartData.length < 3 ? '10%' : chartData.length < 5 ? '20%' : '40%',
        dataLabels: {
          position: 'top'
        }
      }
    },
    xaxis: {
      labels: {
        trim: true,
        rotateAlways: true,
        formatter: function (value = '') {
          return value;
        }
      },
      tooltip: {
        enabled: false
      }
    },
    yaxis: [
      {
        title: {
          text: 'Accuracy %',
          style: {
            color: '#5E7BAA',
            fontSize: '0.75rem',
            fontWeight: 400
          }
        },
        seriesName: 'accuracy',
        max: 100,
        tickAmount: 5,
        labels: {
          formatter(val) {
            return `${parseInt(val, 10) || ''}%`;
          }
        }
      },
      {
        opposite: true,
        show: false,
        title: {
          text:
            unit === 'wafer'
              ? 'No. of wafers audited'
              : 'No. of images audited',
          style: {
            color: '#5E7BAA',
            fontSize: '0.75rem',
            fontWeight: 400
          }
        },
        seriesName: 'no_of_lot_audited',
        labels: {
          formatter: val => {
            return val.toFixed(0);
          }
        },
        min,
        max
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
    markers: {
      size: 5,
      hover: {
        sizeOffset: 0
      }
    },
    fill: {
      opacity: 1,
      colors: [
        function ({ value, seriesIndex, w, dataPointIndex }) {
          if (
            value === 100 &&
            w.config.series[seriesIndex].data[dataPointIndex]?.isNullPercentage
          ) {
            return 'rgba(251, 113, 133, 0.3)';
          }
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
      offsetY: -10,
      formatter(val, data) {
        const { w, seriesIndex, dataPointIndex } = data;
        const { type } = w.config.series[seriesIndex];
        if (
          val === 100 &&
          w.config.series[seriesIndex].data[dataPointIndex]?.isNullPercentage
        ) {
          return '';
        }
        if (type === 'bar') {
          return `${val}%`;
        }
        return abbrNum(val, 2);
      },
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
      curve: 'straight',
      colors: [
        function ({ value, seriesIndex, w, ...rest }) {
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
      enabledOnSeries: [0],
      custom: ({ w, seriesIndex, dataPointIndex }) => {
        // if (w.config.series[seriesIndex].data[dataPointIndex]?.isNullPercentage) {
        return `<div class="tooltip_container"><div class='cohort_tooltip'> <div>Click on bar to audit wafer</div></div></div>`.replaceAll(
          ',',
          ''
        );
        // }
        // return ''
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
    <div className='chart' style={{ paddingTop: '80px' }}>
      {!(data?.series || []).length ? (
        <EmptyState />
      ) : (
        <Charts
          options={options}
          series={data?.series || []}
          type='line'
          height={350}
          width={width}
        />
      )}
    </div>
  );
};

export default StackBarLineChart;
