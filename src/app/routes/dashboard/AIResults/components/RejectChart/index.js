import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ChartContianer from 'app/components/Chart';
import { stringToColor } from 'app/utils/helpers';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { setUploadSession } from 'store/reviewData/actions';
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

const RejectChart = React.memo(({ name, data, isLoading, isError }) => {
  const classes = useStyle();

  const [chartData, setChartData] = useState([]);

  const [keys, setKeys] = useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionId, packId } = useParams();

  useEffect(() => {
    const temp = [];
    const k = [];
    const keysTemp = [];
    Object.entries(data)
      .sort()
      .forEach(([key, value]) => {
        const entry = {};
        value.forEach(record => {
          entry.date = key;
          const t = record.machine ? record.machine : 'NA';
          entry[t] = record.percentage;
          if (!keysTemp.includes(t)) {
            keysTemp.push(t);
            k.push({
              key: t,
              color: stringToColor(t)
            });
          }
        });
        temp.push(entry);
      });
    setKeys(k);
    setChartData(temp);
  }, [data]);

  const getName = name => {
    const s = name.split('_');
    const t = s.join(' ');
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  const handleClick = props => {
    const date = props.payload.date.split(':');
    const existingParams = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    delete existingParams?.page;
    const params = queryString.stringify(
      {
        priority: true,
        date__gte: date[0].trim(),
        date__lte: date[1].trim(),
        meta_info__MachineNo__in: props.dataKey === 'NA' ? null : props.dataKey,
        ...existingParams
      },
      {
        arrayFormat: 'comma'
      }
    );
    dispatch(setUploadSession(params));

    navigate(`/${subscriptionId}/${packId}/annotation/review?${params}`, {
      state: {
        path: location.pathname,
        params: location.search
      }
    });
  };

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
        <Box pt={5} minHeight={300}>
          <Typography variant='h2'>Something went wrong</Typography>
        </Box>
      );
    }
    return (
      <ChartContianer labelX='Date' labelY='Percantage'>
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
            />
            <YAxis tickLine={false} />
            <Tooltip />
            {keys.map((key, index) => (
              <Line
                type='linear'
                connectNulls
                strokeWidth={2}
                dataKey={key.key}
                key={index}
                dot={false}
                stroke={key.color}
                activeDot={{ onClick: handleClick }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContianer>
    );
  };

  return (
    <Box p={3}>
      <Box mb={1}>
        <Typography variant='h1'>{getName(name)}</Typography>
      </Box>
      <Divider className={classes.divider} />
      {getContent()}
      {/* <ChartSummary /> */}
    </Box>
  );
});
export default RejectChart;
