import { makeStyles } from '@material-ui/core';
import { stringToColor } from 'app/utils/helpers';
import React, { useEffect, useState } from 'react';
import {
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis
} from 'recharts';

const useStyle = makeStyles(() => ({
  lotChart: {
    backgroundColor: '#FFFFFF'
  },

  axisLabel: {
    fontSize: '12px',
    lineHeight: '16px',
    color: 'rgba(2, 67, 93, 0.7)'
  },
  toolTip: {
    margin: 0,
    padding: '0 10px',
    background: 'rgb(255, 255, 255)',
    border: '1px solid rgb(204, 204, 204)',
    whiteSpace: 'nowrap'
  }
}));

const CustomToolTip = props => {
  const classes = useStyle();
  const { active, chart } = props;
  if (active) {
    const { payload } = props;
    if (chart === 'yieldLoss') {
      return (
        <div className={classes.toolTip}>
          <p className='label'>{`date : ${payload[0].value}`}</p>
          <p className='label'>{`machine_no : ${payload[0].payload.machine_no}`}</p>
          <p className='label'>{`lot_id : ${payload[0].payload.lot_id}`}</p>
          <p className='label'>{`percentage : ${payload[0].payload.percentage}%`}</p>
          <p className='label'>{`Total inspected units : ${payload[0].payload.total_unit_count}`}</p>
          <p className='label'>{`Units rejected by AI : ${payload[0].payload.ai_reject_count}`}</p>
        </div>
      );
    }
    return (
      <div className={classes.toolTip}>
        <p className='label'>{`date : ${payload[0].value}`}</p>
        <p className='label'>{`machine_no : ${payload[0].payload.machine_no}`}</p>
        <p className='label'>{`lot_id : ${payload[0].payload.lot_id}`}</p>
        <p className='label'>{`percentage : ${payload[0].payload.percentage}%`}</p>
        <p className='label'>{`Total inspected units : ${payload[0].payload.total_unit_count}`}</p>
        <p className='label'>{`Units not rejected by AI : ${payload[0].payload.over_reject_count}`}</p>
      </div>
    );
  }

  return null;
};

const CustomizedAxisTick = props => {
  const { x, y, payload } = props;
  const { value } = payload;
  const s = value.split(':');

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dy={16}
        textAnchor='end'
        fill='#6A6A6A'
        fontSize='12px'
        fontFamily='Roboto'
        transform='rotate(-35)'
      >
        {s?.[0]}
      </text>
    </g>
  );
};

const ScatterPlot = React.memo(({ data, handleClick = {}, chart = '' }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const map = {};
    const ordered = [];
    Object.entries(data)
      .sort()
      .forEach(([key, value]) => {
        value.forEach(item => {
          const mapKey = `${key}_${item.percentage}`;
          const zValue = map[mapKey] || 100;
          map[mapKey] = map?.mapKey ? map[mapKey] : zValue - 10;
          ordered.push({ date: key, ...item, z: zValue });
        });
      });
    setChartData(ordered);
  }, [data]);

  return (
    <ResponsiveContainer width='100%' height={400}>
      <ScatterChart margin={{ top: 30, right: 25, bottom: 50 }}>
        <XAxis
          interval={0}
          tickLine={false}
          tick={<CustomizedAxisTick />}
          dataKey='date'
          allowDuplicatedCategory={false}
        />
        <YAxis
          // domain={['dataMin', 'dataMax']}
          tickLine={false}
          dataKey='percentage'
        />
        <ZAxis dataKey='z' range={[75, 150]} />
        <Tooltip content={<CustomToolTip chart={chart} />} />
        <Scatter
          cursor='pointer'
          data={chartData}
          onClick={handleClick}
          strokeWidth={0.5}
          stroke='#000'
        >
          {chartData.map((cell, index) => (
            <Cell
              key={index}
              fill={stringToColor(cell.machine_no)}
              opacity={0.5}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
});

export default ScatterPlot;
