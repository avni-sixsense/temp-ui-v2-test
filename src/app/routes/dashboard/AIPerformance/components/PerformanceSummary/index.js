import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import SummaryBox from './SummaryBox';

const useStyle = makeStyles(() => ({
  heading: {
    borderBottom: '0.5px solid rgba(208,208,208,0.5)'
  },
  dataBox: {
    backgroundColor: '#FFFFFF'
  }
}));

const PerformanceSummary = ({ data, showTitle = true, keys = [], title }) => {
  const classes = useStyle();

  return (
    <Box my={2}>
      {showTitle && (
        <Box className={classes.heading} pb={1} mb={3.75}>
          <Typography variant='h2'>{title || 'Performance Summary'}</Typography>
        </Box>
      )}
      <Box display='flex' className={`${classes.dataBox}`}>
        {/* <SummaryBox title="Detection Accuracy" value={data?.detection_accuracy} />
				<SummaryBox title="Classification Accuracy" value={data?.high_confidence_classifcation_accuracy} />
				<SummaryBox title="Overall Accuracy" value={data?.overall_accuracy} /> */}
        {keys.map(key => {
          return (
            <SummaryBox
              title={key.title}
              value={data?.[key.key]}
              key={key.key}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default PerformanceSummary;
