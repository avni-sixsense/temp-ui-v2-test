import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SummaryBox from 'app/routes/dashboard/components/DataSummary/SummaryBox';
import get from 'lodash/get';
import React from 'react';

const useStyle = makeStyles(() => ({
  heading: {
    borderBottom: '0.5px solid rgba(208,208,208,0.5)'
  },
  dataBox: {
    backgroundColor: '#FFFFFF'
  }
}));

const DataSummary = ({ data }) => {
  const classes = useStyle();

  return (
    <Box my={2}>
      <Box className={classes.heading} pb={1} mb={3.75}>
        <Typography variant='h2'>Data Summary</Typography>
      </Box>
      <Box display='flex' className={`${classes.dataBox}`}>
        <SummaryBox
          title='Total number of images'
          value={get(data, 'images_count', undefined)}
        />
        {/* <SummaryBox title="Total number of defect categories" value={get(data, 'defects_count', undefined)} /> */}
      </Box>
    </Box>
  );
};

export default DataSummary;
