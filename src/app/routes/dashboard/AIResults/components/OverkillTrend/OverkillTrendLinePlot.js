import { makeStyles } from '@material-ui/core';
import { stringToColor } from 'app/utils/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const useStyle = makeStyles(() => ({
  heading: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#02435D'
  },
  devider: {
    opacity: 0.5,
    border: '1px solid #D0D0D0'
  },
  axisLabel: {
    fontSize: '12px',
    lineHeight: '16px',
    color: 'rgba(2, 67, 93, 0.7)'
  }
}));

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

const CustomToolTip = ({ active, selectedKey, payload }) => {
  const classes = useStyle();
  if (active && selectedKey.length) {
    const selected = payload.find(
      item => item.dataKey === `${selectedKey}.percentage`
    );
    if (!selected) {
      return null;
    }
    const name = selected?.name?.split('.')[0];
    if (!name) {
      return null;
    }
    const actualPayload = selected.payload[name];
    return (
      <div className={classes.toolTip}>
        <p className='label'>{`date : ${selected.payload.date_range}`}</p>
        <p className='label'>{`machine_no : ${name}`}</p>
        <p className='label'>{`percentage : ${actualPayload.percentage}%`}</p>
        <p className='label'>{`Total inspected units : ${actualPayload.total_unit_count}`}</p>
        <p className='label'>{`Units not rejected by AI : ${actualPayload.over_reject_count}`}</p>
      </div>
    );
  }
  return null;
};

const OverkillTrendLinePlot = React.memo(({ data, handleClick }) => {
  const [selectedKey, setSelectedKey] = useState('');
  const [keys, setKeys] = useState([]);
  const [chartData, setChartData] = useState([]);
  const classes = useStyle();

  useEffect(() => {
    const tempKeys = [];
    const machines = [];
    const sorted = data.sort((a, b) => {
      const dateA = new Date(a.date_range.split(' ')[0]);
      const dateB = new Date(b.date_range.split(' ')[0]);
      return dateA - dateB;
    });
    sorted.forEach(item => {
      Object.keys(item).forEach(key => {
        if (!tempKeys.includes(key)) {
          machines.push({ key, color: stringToColor(key) });
          tempKeys.push(key);
        }
      });
    });
    setChartData(sorted);
    setKeys(machines);
  }, [data]);

  const showToolTip = useCallback(key => {
    setSelectedKey(key);
  }, []);

  return (
    <ResponsiveContainer width='100%' height={400}>
      <LineChart
        className={classes.axisLabel}
        data={chartData}
        margin={{ top: 30, right: 25, bottom: 50 }}
      >
        <XAxis
          interval={0}
          tickLine={false}
          ticks={chartData.map(item => item.date_range)}
          tick={<CustomizedAxisTick />}
          dataKey='date_range'
          allowDuplicatedCategory={false}
          padding={{ left: 15 }}
        />
        <YAxis tickLine={false} />
        <Tooltip content={<CustomToolTip selectedKey={selectedKey} />} />
        {keys.map((key, index) => (
          <Line
            isAnimationActive={false}
            type='linear'
            connectNulls
            strokeWidth={2}
            dataKey={`${key.key}.percentage`}
            key={index}
            dot
            stroke={key.color}
            activeDot={{
              onMouseOver: () => showToolTip(key.key),
              onClick: handleClick,
              r: key.key === selectedKey ? index + 2 : index + 1
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
});

export default OverkillTrendLinePlot;
