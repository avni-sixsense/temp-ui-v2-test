import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ChartContianer from 'app/components/Chart';
import ScatterPlot from 'app/components/ScatterPlot';
import { adjust, stringToColor } from 'app/utils/helpers';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
// import ChartSummary from './ChartSummary'
import { setUploadSession } from 'store/reviewData/actions';

import CircularProgressWithLabel from '../YieldLoss/CircularProgress';
import OverkillTrendLinePlot from './OverkillTrendLinePlot';

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

const OverkillTrendChart = ({
  data,
  isLoading,
  isError,
  machineWiseData,
  linePlotData
}) => {
  const classes = useStyle();

  const [chartData, setChartData] = useState([]);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionId, packId } = useParams();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const ordered = [];
    Object.entries(data)
      .sort()
      .forEach(([key, value]) => {
        value.forEach(item => {
          ordered.push({ date: key, ...item });
        });
      });
    setChartData(ordered);
  }, [data]);

  const handleClick = useCallback(
    props => {
      const existingParams = queryString.parse(location.search, {
        arrayFormat: 'comma',
        parseNumbers: true
      });
      const params = queryString.stringify(
        {
          meta_info__lot_id__in: props.lot_id,
          ...existingParams
        },
        {
          arrayFormat: 'comma'
        }
      );
      // dispatch(setUploadSession(params))
      // sessionStorage.setItem('previousUrl', `${location.pathname}${location.search}`)
      setSearchParams(params);
    },
    [location.search]
  );

  const handleLineClick = () => {
    const existingParams = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    const params = queryString.stringify(
      {
        priority: true,
        ai_predicted_label__in: 'NVD',
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
        <Box p={5} minHeight={300}>
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
      <>
        <Box my={2}>
          <Typography variant='h2'>% over reject per machine</Typography>
        </Box>
        <Box display='flex' mt={2}>
          {Object.entries(machineWiseData).length ? (
            Object.entries(machineWiseData).map(([key, value], index) => (
              <CircularProgressWithLabel
                label={key}
                value={value}
                bg={adjust(stringToColor(key), 100)}
                color={stringToColor(key)}
                key={index}
                unitsTooltipText='Units not rejected by AI'
                chartTitle=''
                tooltipKey='overkill'
              />
            ))
          ) : (
            <Typography variant='h2'>
              There's no data for the selected filters
            </Typography>
          )}
        </Box>
        <ChartContianer
          chartTitle='Lot level over reject'
          labelX='Date'
          labelY='% over reject'
        >
          <ScatterPlot data={data} handleClick={handleClick} />
        </ChartContianer>
        <ChartContianer
          chartTitle='Over reject trend (machine wise)'
          labelX='Date'
          labelY='% over reject'
        >
          <OverkillTrendLinePlot
            data={linePlotData}
            handleClick={handleLineClick}
          />
        </ChartContianer>
      </>
    );
  };

  return (
    <Box p={3} style={{ width: '100%' }}>
      <Box mb={1}>
        <Typography variant='h1'>Overkill Trend</Typography>
      </Box>
      <Divider className={classes.divider} />
      {getContent()}
      {/* <ChartSummary /> */}
    </Box>
  );
};

export default OverkillTrendChart;
