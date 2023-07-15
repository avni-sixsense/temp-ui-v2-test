import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ChartContianer from 'app/components/Chart';
import { stringToColor } from 'app/utils/helpers';
import difference from 'lodash/difference';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { setUploadSession } from 'store/reviewData/actions';
// import ChartSummary from './ChartSummary'

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
    padding: '1% 5%',
    backgroundColor: '#fff',
    width: '130%',
    borderRadius: '8px'
  },
  bar: {
    // backgroundColor: 'yellow',
    '& path:hover': {
      fill: '#DCF3FC'
    }
  }
}));

const CustomizedAxisTick = props => {
  const { x, y, payload } = props;
  if (!payload.value) {
    return <g transform={`translate(${x},${y})`} />;
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor='end'
        fill='#6A6A6A'
        fontSize='12px'
        fontFamily='Roboto'
        transform='rotate(-35)'
      >
        {payload.value}
      </text>
    </g>
  );
};

const LotChart = ({ data, isLoading, isError }) => {
  const classes = useStyle();

  const [chartData, setChartData] = useState([]);
  const [keys, setKeys] = useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionId, packId } = useParams();

  useEffect(() => {
    const keys = [];
    const temp = [];
    data.forEach(item => {
      const entry = {};
      entry.defect = item.name;
      entry.id = item.id;
      item.count_grouped_by_machine.forEach(subItem => {
        const name = subItem.machine ? subItem.machine : 'NA';
        if (!keys.includes(name)) {
          keys.push(name);
        }
        entry[name] = subItem.count;
      });
      temp.push(entry);
    });
    const newData = [];
    temp.forEach(item => {
      const k = Object.keys(item);
      const diff = difference(keys, k);
      if (diff.length) {
        const newItem = { ...item };
        diff.forEach(value => {
          newItem[value] = 0;
        });
        newData.push(newItem);
      } else {
        newData.push(item);
      }
    });
    setKeys(keys);
    setChartData(reverse(sortBy(newData, keys)));
  }, [data]);

  const handleClick = (props, machineName) => {
    const existingParams = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });

    delete existingParams?.page;

    const params = queryString.stringify(
      {
        priority: true,
        ai_predicted_label__in: props.id,
        meta_info__MachineNo__in: machineName === 'NA' ? null : machineName,
        ...existingParams
      },
      { arrayFormat: 'comma' }
    );

    dispatch(setUploadSession(params));

    navigate(`/${subscriptionId}/${packId}/annotation/review?${params}`, {
      state: {
        path: location.pathname,
        params: location.search
      }
    });
  };

  const CustomToolTip = ({ active, payload }) => {
    const classes = useStyle();
    if (active) {
      return (
        <div className={classes.toolTip}>
          {payload.map(field => (
            <p
              style={{ color: field?.color }}
              className='label'
            >{`${field?.dataKey} : ${field?.value}`}</p>
          ))}
        </div>
      );
    }
    return null;
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
    if (!chartData.length) {
      return (
        <Box pt={5} minHeight={300}>
          <Typography variant='h2'>
            There's no data for the selected filters
          </Typography>
        </Box>
      );
    }
    return (
      <ChartContianer labelX='Defect' labelY='Count'>
        <ResponsiveContainer width='100%' height={400}>
          <BarChart
            className={classes.axisLabel}
            data={chartData}
            margin={{ top: 30, right: 25, bottom: 50 }}
          >
            <XAxis
              interval={0}
              tickLine={false}
              tick={<CustomizedAxisTick />}
              minTickGap={20}
              dataKey='defect'
            />
            <YAxis
              allowDecimals={false}
              // domain={['dataMin', 'dataMax']}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={<CustomToolTip />}
            />
            {keys.map((key, index) => (
              <Bar
                className={classes.bar}
                dataKey={key}
                key={index}
                barSize={20}
                fill={stringToColor(key)}
                radius={[5, 5, 0, 0]}
                onClick={props => handleClick(props, key)}
              >
                <LabelList dataKey='machine_name' position='top' angle={-90} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContianer>
    );
  };

  return (
    <Box p={3} style={{ width: '100%' }}>
      <Box mb={1}>
        <Typography variant='h1'>Defect Count Pareto</Typography>
      </Box>
      <Divider className={classes.divider} />
      {getContent()}
      {/* <ChartSummary /> */}
    </Box>
  );
};

export default LotChart;
