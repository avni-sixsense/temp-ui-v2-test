import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyle = makeStyles(() => ({
  dataBox: {
    backgroundColor: '#FFF0F0'
  }
}));

const SummaryBox = ({ title, value }) => {
  const classes = useStyle();
  return (
    <Box mr={1} p={3} className={`${classes.dataBox}`}>
      <Box mb={3}>
        <Typography variant='h5'>{title}</Typography>
      </Box>
      {value !== undefined ? (
        <Box mt={3}>
          <Typography variant='h3'>{value}</Typography>
        </Box>
      ) : (
        ''
      )}
    </Box>
  );
};

export default SummaryBox;
