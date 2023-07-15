import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonButton from 'app/components/CommonButton';
import { getTimeFormat } from 'app/utils/helpers';
import get from 'lodash/get';
// import queryString from 'query-string'
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

// import { useNavigate } from 'react-router-dom'
import DataSummary from '../components/DataSummary';
import HeatMap from './components/HeatMap';
import LotChart from './components/LotChart';
import OverkillTrendChart from './components/OverkillTrend';
// import RejectChart from './components/RejectChart'
import YieldLoss from './components/YieldLoss';

const AIResults = ({ summary, subscriptionId, selectedDefects }) => {
  const [showHeatMap, setShowHeatMap] = useState(false);
  // const dispatch = useDispatch()
  // const navigate = useNavigate()

  const paramsString = useSelector(({ filters }) => filters.paramsString);
  const date = useSelector(({ filters }) => filters.date);
  const timeFormat = getTimeFormat(date.start, date.end);

  const {
    data,
    isLoading: applicationLoading,
    isError: applicationError
  } = useQuery(
    [
      'appilcationCharts',
      subscriptionId,
      paramsString,
      timeFormat,
      selectedDefects
    ],
    context => api.applicationCharts(...context.queryKey),
    {
      enabled: !!(subscriptionId && paramsString),
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  );

  const {
    data: overkillTrend,
    isLoading: overkillLoading,
    isError: overkillError
  } = useQuery(
    ['trendChart', subscriptionId, paramsString, timeFormat, selectedDefects],
    context => api.overkillTrend(...context.queryKey),
    {
      enabled: !!(subscriptionId && paramsString),
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  );

  const {
    data: heatMap,
    isLoading: heatMapLoading,
    isError: heatMapError
  } = useQuery(
    ['getImage', subscriptionId, paramsString],
    context => api.getDefectImage(...context.queryKey),
    {
      enabled: showHeatMap,
      retry: 0,
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  );

  useEffect(() => {
    setShowHeatMap(false);
  }, [paramsString]);

  // useEffect(() => {
  // 	return () => {
  // 		const params = queryString.parse(location.search, { arrayFormat: 'comma', parseNumbers: true })
  // 		delete params[modelKey]
  // 		const newParams = queryString.stringify(params, { arrayFormat: 'comma' })
  // 		setSearchParams({
  // 			search: newParams,
  // 		})
  // 		dispatch({ type: 'REMOVE_MODEL_FILTER' })
  // 	}
  // }, [dispatch, history, modelKey])

  const handleShowHeatMap = () => {
    setShowHeatMap(true);
  };

  const handleDownloadHeatmap = () => {
    api
      .getDefectImage('', subscriptionId, paramsString)
      .then(res => {
        const link = document.createElement('a');
        link.href = res?.data?.pre_signed_url;
        link.setAttribute('download', 'heatmap.jpg');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const lotData = get(data, 'data.defect_v_count', []);

  return (
    <>
      <DataSummary
        data={get(summary, 'data.data_summary', {})}
        selectedDefects={selectedDefects}
      />
      <Box my={4}>
        <Box display='flex' mb={1}>
          <Typography variant='h1' gutterBottom>
            Application Charts
          </Typography>
        </Box>
        <Paper elevation={0}>
          <Box p={3} mb={2}>
            <YieldLoss
              data={get(data, 'data.yield_loss', {})}
              isError={applicationError}
              isLoading={applicationLoading}
              scatterPlotData={get(data, 'data.yield_loss_scatter_plot', {})}
              linePlotData={get(
                data,
                'data.yield_loss_trend_grouped_by_defect',
                {}
              )}
              subscriptionId={subscriptionId}
            />
          </Box>
        </Paper>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={0}>
              <OverkillTrendChart
                data={get(overkillTrend, 'data.overkill_scatter', {})}
                linePlotData={get(overkillTrend, 'data.overkill_trend', {})}
                isLoading={overkillLoading}
                isError={overkillError}
                subscriptionId={subscriptionId}
                machineWiseData={get(
                  overkillTrend,
                  'data.machine_wise_overkill_rate',
                  {}
                )}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={0}>
              <LotChart
                data={lotData}
                isLoading={applicationLoading}
                isError={applicationError}
                subscriptionId={subscriptionId}
              />
            </Paper>
          </Grid>
          {/* {data && data.data
						? Object.entries(data.data).map(([key, value]) => {
								if (
									key.toLowerCase().includes('yield') ||
									key.toLocaleLowerCase().includes('defect_v_count')
								) {
									return ''
								}
								return (
									<Grid item xs={6} key={key}>
										<Paper elevation={0}>
											<RejectChart
												name={key}
												data={value}
												isLoading={applicationLoading}
												isError={applicationError}
												subscriptionId={subscriptionId}
											/>
										</Paper>
									</Grid>
								)
						  })
						: ''} */}
          <Grid item xs={6}>
            {showHeatMap ? (
              <Paper elevation={0}>
                <HeatMap
                  data={heatMap}
                  isLoading={heatMapLoading}
                  isError={heatMapError}
                />
              </Paper>
            ) : (
              <>
                <CommonButton
                  toolTip
                  toolTipMsg='Please filter no more than 2000 images before generating the heatmap'
                  text='Load HeatMap'
                  onClick={handleShowHeatMap}
                />
              </>
            )}
            <CommonButton
              toolTip
              toolTipMsg='Please filter no more than 2000 images before generating the heatmap'
              wrapperClass='mx-2 my-2'
              text='Download HeatMap'
              onClick={handleDownloadHeatmap}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AIResults;
