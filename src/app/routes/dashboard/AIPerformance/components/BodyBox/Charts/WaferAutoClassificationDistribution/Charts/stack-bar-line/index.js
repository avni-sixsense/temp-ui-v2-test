import EmptyState from 'app/components/EmptyState';
import { useLayoutEffect } from 'react';
import Charts from 'react-apexcharts';

import './StackBarLine.scss';

const StackBarLineChart = ({
  data,
  unit,
  onClick,
  chartMeta,
  maxBarHeightInPoints
}) => {
  const { width, verticalLabel, hideLabels, barWidth } = chartMeta;

  useLayoutEffect(() => {
    let style = document.createElement('style');
    style.innerHTML = `
    .apexcharts-series[seriesName="Percentage"] {
      transform: translate(0px, -80px)!important;;
    }
    .apexcharts-datalabels[data\\:realIndex="2"]{
      transform: translate(0px, -95px)!important;
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
      toolbar: { show: false },
      zoom: { enabled: false },
      events: {
        // dataPointSelection: (event, chartContext, config) => {
        // 	const { dataPointIndex, seriesIndex, w } = config
        // 	const { series } = w.config
        // 	onClick({
        // 		date: series[seriesIndex].data[dataPointIndex].x,
        // 		is_confident_defect: seriesIndex !== 1,
        // 	})
        // },
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
        // columnWidth: barWidth || undefined,
        borderRadius: 0,
        dataLabels: {
          position: 'bottom',
          orientation: verticalLabel ? 'vertical' : 'horizontal'
        }
      }
    },
    xaxis: {
      labels: {
        rotateAlways: barWidth < 70
      },
      tooltip: { enabled: false }
    },
    yaxis: [
      {
        seriesName: 'Auto-Classified',
        title: {
          text: unit === 'wafer' ? 'No. of Wafers' : 'No. of Images',
          style: {
            color: '#5E7BAA',
            fontSize: '0.75rem',
            fontWeight: 400
          }
        },
        max: maxBarHeightInPoints || undefined,
        tickAmount: 5,
        labels: {
          formatter: val => {
            return val?.toFixed(0) ?? 0;
          }
        }
      },
      {
        seriesName: 'Auto-Classified',
        title: { text: '' },
        show: false,
        max: maxBarHeightInPoints || undefined,
        tickAmount: 5
      },
      {
        seriesName: 'Percentage',
        opposite: true,
        show: false,
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
        min: -300
      }
    ],
    legend: {
      show: false,
      position: 'bottom',
      horizontalAlign: 'left',
      offsetY: 5,
      markers: {
        width: 12,
        height: 12,
        radius: 0
      },
      onItemClick: { toggleDataSeries: true },
      onItemHover: { highlightDataSeries: false }
    },
    fill: {
      opacity: 1
    },
    dataLabels: {
      enabled: !hideLabels,
      enabledOnSeries: [0, 1, 2],
      // offsetY: verticalLabel ? 0 : -10,
      formatter: (val, data) => {
        const { w, seriesIndex } = data;
        const { name } = w.config.series[seriesIndex];

        if (name === 'Percentage') return `${val}%`;

        return `${val}`;
      },
      style: {
        fontSize: '12px',
        colors: [
          ({ seriesIndex, w }) => {
            const { name, type } = w.config.series[seriesIndex];
            if (name === 'Auto-Classified') return '#F0F7FF';
            if (name === 'Manually') return '#2563EB';
            if (name === 'Percentage' && type === 'line') return '#5E7BAA';
            if (name === 'Percentage' && type === 'bar') return '#059669';
          }
        ]
      },
      background: { enabled: false }
    },
    grid: {
      borderColor: '#f1f1f1',
      show: false,
      yaxis: { lines: { show: false } }
    },
    stroke: {
      width: 2,
      curve: 'straight'
    },
    tooltip: {
      custom({ seriesIndex, dataPointIndex, w }) {
        const desc =
          w.config.series[seriesIndex].data[dataPointIndex].description;

        return `<div class="tooltip_container"><div class='tooltip_header'> Date - ${
          desc.date
        } </div>${Object.keys(desc).map(x => {
          if (x === 'date') return '';
          return `<div class='tooltip_data_container'><span class='tooltip_key'>${x}</span> <span class='tooltip_value'>${desc[x]}</span></div>`;
        })}</div>`.replaceAll(',', '');
      },
      intersect: true,
      shared: false,
      followCursor: false
    },
    markers: {
      size: 5,
      hover: { sizeOffset: 6 }
    },
    states: {
      normal: {
        filter: { type: 'none', value: 0 }
      },
      hover: {
        filter: { type: 'lighten', value: 0.15 }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: { type: 'none', value: 0 }
      }
    }
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      {!(data?.series || []).length ? (
        <EmptyState />
      ) : (
        <Charts
          key={verticalLabel}
          options={options}
          series={data?.series || []}
          type='line'
          height={300}
          width={width}
        />
      )}
    </div>
  );
};

export default StackBarLineChart;
