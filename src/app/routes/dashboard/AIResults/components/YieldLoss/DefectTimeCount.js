import { makeStyles } from '@material-ui/core';
import { stringToColor } from 'app/utils/helpers';
import omit from 'lodash/omit';
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

const CustomizedDot = props => {
  const { cx, cy, dataKey, payload } = props;
  const defectName = dataKey.split('.')[0];
  const defect = payload[defectName];
  return (
    <circle
      cx={cx}
      cy={cy - defect?.cy + 10}
      strokeWidth={0.5}
      ill={stringToColor(defectName)}
      stroke='#000000'
      opacity={0.5}
      r={defect?.cy + 2}
      fill={stringToColor(defectName)}
    />
  );
};

const CustomizedActiveDot = props => {
  const { cx, cy, dataKey, payload, onMouseOver, onClick, index } = props;

  const defectName = dataKey.split('.')[0];
  const defect = payload[defectName];
  return (
    <circle
      cx={cx}
      cy={cy - (defect?.cy || 3) + 10}
      strokeWidth={0.5}
      r={index === defectName ? 7 : (defect?.cy || 3) + 2}
      fill={stringToColor(defectName)}
      stroke='#000000'
      opacity={0.5}
      onMouseOver={() => onMouseOver(defectName)}
      onClick={() => onClick(defect, defectName)}
    />
  );
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

const CustomToolTip = ({ active, index, payload }) => {
  const classes = useStyle();
  if (active && index) {
    const selected = payload.find(
      item => item.dataKey === `${index}.percentage`
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
        <p className='label'>{`date : ${selected.payload.date}`}</p>
        <p className='label'>{`defect : ${name}`}</p>
        <p className='label'>{`Total inspected units : ${actualPayload.total_unit_count}`}</p>
        <p className='label'>{`Units rejected by AI : ${actualPayload.ai_reject_count}`}</p>
        <p className='label'>{`percentage : ${actualPayload.percentage}%`}</p>
      </div>
    );
  }
  return null;
};

const DefectTimeCountPlot = React.memo(({ data, handleClick }) => {
  const [chartData, setChartData] = useState([]);
  const [defects, setDefects] = useState([]);
  const [index, setIndex] = useState('');

  const classes = useStyle();

  useEffect(() => {
    const d = [];
    const date = {};
    const map = {};
    Object.entries(data).forEach(([id, value]) => {
      const cloned = omit(value, ['name']);
      const { name } = value;
      if (!d.includes(name)) {
        d.push(name);
      }
      Object.entries(cloned).forEach(([key, result]) => {
        const dateStart = key;
        const mapKey = `${dateStart}_${result.percentage}`;
        if (!date[dateStart]) {
          date[dateStart] = {};
        }
        if (map?.[mapKey]?.percentage === result.percentage) {
          map[mapKey] = {
            ...map[mapKey],
            cy: map[mapKey]?.cy - 2
          };
        } else {
          map[mapKey] = {
            cy: 5,
            percentage: result.percentage
          };
        }
        date[dateStart][name] = { ...result, id, cy: map[mapKey]?.cy };
      });
    });
    const newData = Object.entries(date).map(([key, value]) => ({
      ...value,
      date: key
    }));
    const sorted = newData.sort((a, b) => {
      const dateA = new Date(a.date.split(' ')[0]);
      const dateB = new Date(b.date.split(' ')[0]);
      return dateA - dateB;
    });
    setChartData(sorted);
    setDefects(d);
  }, [data]);

  const showToolTip = useCallback(newIndex => {
    setIndex(newIndex);
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
          tick={<CustomizedAxisTick />}
          dataKey='date'
          allowDuplicatedCategory={false}
          padding={{ left: 15 }}
        />
        <YAxis tickLine={false} />
        <Tooltip content={<CustomToolTip index={index} />} />
        {defects.map(defect => (
          <Line
            isAnimationActive={false}
            connectNulls
            dataKey={`${defect}.percentage`}
            dot={<CustomizedDot />}
            key={defect}
            activeDot={
              <CustomizedActiveDot
                onMouseOver={showToolTip}
                onClick={handleClick}
                index={index}
              />
            }
            stroke={stringToColor(defect)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
});

export default DefectTimeCountPlot;
