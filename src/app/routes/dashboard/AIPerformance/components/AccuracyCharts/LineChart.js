import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ChartContianer from 'app/components/Chart';
import { sortBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// import ChartSummary from './ChartSummary'

const useStyle = makeStyles(() => ({
  RejectChart: {
    backgroundColor: '#FFFFFF'
  },
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

// const colors = {
// 	'KLA-108': '#44D2FF',
// 	NA: '#FF7878',
// }

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

const RejectChart = ({ name, data, isLoading, isError }) => {
  const classes = useStyle();

  const [chartData, setChartData] = useState([
    {
      name: '',
      value: ''
    }
  ]);

  useEffect(() => {
    const ordered = [];
    Object.entries(data).forEach(([key, value]) => {
      ordered.push({ name: key, value: value === 'N/A' ? undefined : value });
    });
    setChartData(
      sortBy(ordered, [
        o => {
          const date = new Date(o.name.split(':')[0].trim());
          return date;
        }
      ])
    );
  }, [data]);

  const getContent = () => {
    if (isLoading) {
      return (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight={300}
        >
          <CircularProgress disableShrink />
        </Box>
      );
    }
    if (isError) {
      return (
        <Box p={5} minHeight={300}>
          <Typography variant='h2'>Something went wrong</Typography>
        </Box>
      );
    }
    return (
      <ChartContianer labelX='Date' labelY='Values'>
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
              axisLine={{ size: 10 }}
              dataKey='name'
            />
            <YAxis domain={[0, 100]} tickLine={false} />
            <Tooltip />
            <Line
              type='linear'
              strokeWidth={2}
              dataKey='value'
              dot={{ stroke: '#44D2FF', fill: '#44D2FF', strokeWidth: 0.5 }}
              activeDot={{
                stroke: '#44D2FF',
                fill: '#44D2FF',
                strokeWidth: 0.5
              }}
              stroke='#44D2FF'
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContianer>
    );
  };

  return (
    <Box p={3}>
      <Box mb={1}>
        <Typography variant='h3'>{name}</Typography>
      </Box>
      <Divider className={classes.divider} />
      {getContent()}
      {/* <ChartSummary /> */}
    </Box>
  );
};

export default RejectChart;
