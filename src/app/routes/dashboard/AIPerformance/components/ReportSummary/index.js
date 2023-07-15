import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import get from 'lodash/get';
import React from 'react';

const useStyle = makeStyles(() => ({
  heading: {
    borderBottom: '0.5px solid rgba(208,208,208,0.5)'
  },
  summaryBox: {
    background: '#FFF0F0'
  }
}));

const ReportSummary = ({ model, metrics }) => {
  const classes = useStyle();
  return (
    <Box pb={2}>
      <Box my={2} pb={2} className={`${classes.heading}`}>
        <Typography variant='h2'>Report Summary</Typography>
      </Box>
      {model ? (
        <Box display='flex'>
          <Box
            p={2}
            pr={3}
            mr={2}
            className={`${classes.summaryBox} text-primary`}
          >
            <div>
              <Typography variant='h5'>Model</Typography>
            </div>
            <Box mt={1}>
              <Typography variant='h3'>{model.name}</Typography>
            </Box>
          </Box>
          <Box p={2} mr={2} className={`${classes.summaryBox} text-primary`}>
            <div>
              <Typography variant='h5'>No of Records with feedback</Typography>
            </div>
            <Box mt={1}>
              <Typography variant='h3'>
                {get(metrics, 'data.data_summary.images_count', '')}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        ''
      )}
    </Box>
  );
};

export default ReportSummary;
