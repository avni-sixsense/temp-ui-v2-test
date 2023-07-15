import React from 'react';

import classes from './chartContainer.module.scss';
import LineChart from './line-chart';

const ChartContainer = ({ title, data }) => {
  return (
    <div className={classes.chartContainer}>
      <div className={classes.header}>{title}</div>
      <div className={classes.chart}>
        <LineChart data={data} />
      </div>
    </div>
  );
};

export default ChartContainer;
