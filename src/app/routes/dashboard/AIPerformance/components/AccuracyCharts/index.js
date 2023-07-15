import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CustomSwitch from 'app/components/CustomSwitch';
import get from 'lodash/get';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import LineChart from './LineChart';

const useStyle = makeStyles(theme => ({
  charts: {
    flexGrow: 1,
    overflow: 'hidden',
    marginTop: theme.spacing(2)
  },
  heading: {
    borderBottom: '0.5px solid rgba(208,208,208,0.5)'
  }
}));

const AccuracyCharts = ({ data, isLoading, isError, model }) => {
  const defectsLoading = useSelector(({ common }) => common.defectsLoading);
  const modelsLoading = useSelector(({ common }) => common.modelsLoading);

  const stateLoading = defectsLoading || modelsLoading;

  const classes = useStyle();
  const [displayMatrix, setDisplayMatrix] = useState(true);

  const handleMatrixDisplay = () => {
    setDisplayMatrix(!displayMatrix);
  };

  return (
    <Box mt={4}>
      <Box
        mt={1}
        display='flex'
        pb={2}
        justifyContent='space-between'
        alignItems='center'
        className={`${classes.heading}`}
      >
        <Typography variant='h2'>Charts</Typography>
        <CustomSwitch
          checked={displayMatrix}
          handleChecked={handleMatrixDisplay}
        />
      </Box>
      {displayMatrix && (
        <Grid container spacing={2}>
          {model?.type !== 'CLASSIFICATION' ? (
            <Grid item xs={6}>
              <Paper elevation={0}>
                <LineChart
                  name='Detection Accuracy chart'
                  data={get(data, 'detection_accuracy', {})}
                  isLoading={isLoading || stateLoading}
                  isError={isError}
                />
              </Paper>
            </Grid>
          ) : null}
          {model?.type === 'CLASSIFICATION_AND_DETECTION' ? (
            <Grid item xs={6}>
              <Paper elevation={0}>
                <LineChart
                  name='Classification Accuracy chart'
                  data={get(data, 'classification_accuracy', {})}
                  isLoading={isLoading || stateLoading}
                  isError={isError}
                />
              </Paper>
            </Grid>
          ) : null}
          <Grid item xs={6}>
            <Paper elevation={0}>
              <LineChart
                name='Overall Accuracy chart'
                data={get(data, 'overall_accuracy', {})}
                isLoading={isLoading || stateLoading}
                isError={isError}
              />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AccuracyCharts;
