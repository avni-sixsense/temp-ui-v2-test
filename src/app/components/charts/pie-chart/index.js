import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Charts from 'react-apexcharts';

const useStyles = makeStyles(theme => ({}));

const PieChart = () => {
  const classes = useStyles();
  const series = [44, 55, 41, 17, 15];

  const options = {
    chart: {
      type: 'donut'
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  return (
    <div className='chart'>
      <Charts options={options} series={series} type='donut' height={350} />
    </div>
  );
};

export default PieChart;
