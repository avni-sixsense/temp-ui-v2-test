import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import get from 'lodash/get';
import React from 'react';
import { useLocation } from 'react-router-dom';

import SummaryBox from './SummaryBox';

const useStyle = makeStyles(() => ({
  heading: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '23px',

    color: '#02435D'
  },
  subTitle: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    opacity: 0.7,
    color: '#02435D'
  },
  dataBox: {
    backgroundColor: '#FFFFFF'
  }
}));

const DataSummary = ({ data, selectedDefects }) => {
  const classes = useStyle();
  const { pathname } = useLocation();
  const aiResultScreen = pathname.includes('ai-results');

  return (
    <Box>
      <Box mb={3}>
        <Box className={classes.heading}>
          <Typography variant='h1'>Data Summary</Typography>
        </Box>
      </Box>
      <Box display='flex' p={3.75} className={`${classes.dataBox}`}>
        <SummaryBox
          title='Total number of images'
          value={get(data, 'images_count', undefined)}
        />
        {/* <SummaryBox title="Total number of defect categories" value={get(data, 'defects_count', undefined)} /> */}

        {aiResultScreen &&
        Array.isArray(selectedDefects) &&
        selectedDefects.length ? (
          <SummaryBox
            title='Overkill category'
            value={`${selectedDefects.map(defect => defect.name).join(', ')}`}
          />
        ) : (
          <SummaryBox title='Overkill category' value='Non visible defects' />
        )}
      </Box>
    </Box>
  );
};

export default DataSummary;
