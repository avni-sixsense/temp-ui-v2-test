import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import get from 'lodash/get';
import React from 'react';
// import ChartSummary from './ChartSummary'

const useStyle = makeStyles(() => ({
  imageGraph: {
    display: 'flex',
    width: '100%'
  },
  yAxis: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '8px'
  },
  xAxis: {
    paddingTop: '3%',
    paddingLeft: '30%'
  },
  defectsMargin: {
    display: 'flex',
    marginLeft: '20%',
    marginTop: '5%'
  },
  colorBox: {
    width: '15px',
    height: '15px',
    marginRight: '5%'
  },
  defectRange: {
    fontSize: '12px',
    lineHeight: '20px'
  },
  yAxisLabel: {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)'
  }
}));

const HeatMap = ({ data, isLoading, isError }) => {
  const classes = useStyle();
  const url = get(data, 'data.pre_signed_url', null);

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
          <Typography variant='h2'>
            Please select a few lots and try again
          </Typography>
        </Box>
      );
    }
    return (
      <Box px={1} py={2}>
        <div className={classes.imageGraph}>
          {/* <div className={classes.yAxis}>
						<Typography className={classes.yAxisLabel}>Count</Typography>
					</div> */}
          <Box>
            {url ? (
              <img
                src={url}
                alt=''
                style={{
                  maxWidth: '100%'
                }}
              />
            ) : (
              <Typography variant='body2'>
                There's no data available in the selected filters to generate
                heatmap
              </Typography>
            )}
          </Box>
          <div>
            <div className={classes.defectsMargin}>
              <div
                style={{ border: '2px solid rgb(255,255,0)' }}
                className={classes.colorBox}
              />
              <Typography className={classes.defectRange}>
                Less than 30%
              </Typography>
            </div>
            <div className={classes.defectsMargin}>
              <div
                style={{ border: '2px solid rgb(255,140,0)' }}
                className={classes.colorBox}
              />
              <Typography className={classes.defectRange}>
                In between 30 to 70%
              </Typography>
            </div>
            <div className={classes.defectsMargin}>
              <div
                style={{ border: '2px solid rgb(255,0,0)' }}
                className={classes.colorBox}
              />
              <Typography className={classes.defectRange}>
                Greater than 70%
              </Typography>
            </div>
          </div>
        </div>
        {/* <div className={classes.xAxis}>
					<Typography>Defect</Typography>
				</div> */}
      </Box>
    );
  };

  return (
    <Box p={3}>
      <Box mb={1}>
        <Typography variant='h1'>Heatmap</Typography>
      </Box>
      <Divider className={classes.divider} />
      {getContent()}
      {/* <ChartSummary /> */}
    </Box>
  );
};

export default HeatMap;
