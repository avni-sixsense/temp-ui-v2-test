import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ChartContianer from 'app/components/Chart';
import ScatterPlot from 'app/components/ScatterPlot';
import { adjust, stringToColor } from 'app/utils/helpers';
import queryString from 'query-string';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import { setUploadSession } from 'store/reviewData/actions';

// import ChartSummary from './ChartSummary'
import CircularProgressWithLabel from './CircularProgress';
import DefectTimeCountPlot from './DefectTimeCount';

const useStyle = makeStyles(theme => ({
  divider: {
    margin: `${theme.spacing(1)}px 0px`
  },
  CircularProgress: {
    border: '5px solid #44D2FF',
    backgroundColor: '#E9FAFF'
  },
  progress0: {
    background: '#E9FAFF',
    border: '#C1F0FF'
  }
}));

const YieldLoss = ({
  data,
  isError,
  isLoading,
  scatterPlotData,
  linePlotData
}) => {
  const classes = useStyle();

  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionId, packId } = useParams();
  const [, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
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

  const handleLineClick = (value, defect) => {
    const existingParams = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    delete existingParams?.page;
    const params = queryString.stringify(
      {
        priority: true,
        ai_predicted_label__in: value.id,
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
    if (!Object.keys(data).length) {
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
          <Typography variant='h2'>% yield loss per machine</Typography>
        </Box>
        <Box display='flex'>
          {Object.entries(data).length ? (
            Object.entries(data).map(([key, value], index) => (
              <CircularProgressWithLabel
                label={key}
                value={value}
                bg={adjust(stringToColor(key), 100)}
                color={stringToColor(key)}
                key={index}
                unitsTooltipText='Units rejected by AI'
                chartTitle=''
                tooltipKey='yieldLoss'
              />
            ))
          ) : (
            <Typography variant='h2'>
              There's no data for the selected filters
            </Typography>
          )}
        </Box>
        <ChartContianer
          chartTitle='Lot level (machine wise) yield loss'
          labelX='Date'
          labelY='% Yield Loss'
        >
          <ScatterPlot
            data={scatterPlotData}
            handleClick={handleClick}
            chart='yieldLoss'
          />
        </ChartContianer>
        <ChartContianer
          chartTitle='Defect wise yield loss breakdown'
          labelX='Date'
          labelY='% Yield Loss'
        >
          <DefectTimeCountPlot
            data={linePlotData}
            handleClick={handleLineClick}
          />
        </ChartContianer>
      </>
    );
  };

  return (
    <Box p={1} style={{ width: '100%' }}>
      <Box mb={1}>
        <Typography variant='h1'>AI Yield Loss</Typography>
      </Box>
      <Divider className={classes.divider} />
      {getContent()}
      {/* <ChartSummary /> */}
    </Box>
  );
};

export default YieldLoss;
