import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import SummaryBox from '../PerformanceSummary/SummaryBox';

const useStyle = makeStyles(() => ({
  heading: {
    borderBottom: '0.5px solid rgba(208,208,208,0.5)'
  },
  summaryBox: {
    background: '#FFF0F0'
  },
  dataBox: {
    backgroundColor: '#FFFFFF'
  }
}));

const Metrics = ({ model, data }) => {
  const classes = useStyle();
  return (
    <Box mt={3}>
      <Box my={3} pb={2} className={`${classes.heading}`}>
        <Typography variant='h2'>Performance Metrics</Typography>
      </Box>
      {model ? (
        <Box
          my={3}
          mx={0}
          display='flex'
          flex='flex-wrap'
          className={`${classes.dataBox} `}
        >
          {model?.type !== 'CLASSIFICATION' ? (
            <SummaryBox
              title='Detection Accuracy'
              value={data?.detection_accuracy}
            />
          ) : (
            ''
          )}
          {model?.type !== 'DETECTION' ? (
            <SummaryBox
              title='Classification Accuracy'
              value={data?.high_confidence_classifcation_accuracy}
            />
          ) : (
            ''
          )}
          <SummaryBox title='Overall Accuracy' value={data?.overall_accuracy} />
        </Box>
      ) : (
        ''
      )}
    </Box>
  );
};

export default Metrics;
