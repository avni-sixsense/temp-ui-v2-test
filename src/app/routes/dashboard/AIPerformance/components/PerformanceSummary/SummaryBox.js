/* eslint-disable no-restricted-globals */
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyle = makeStyles(() => ({
  root: {
    display: 'flex',
    height: '95px',
    width: '192px',
    borderRadius: '3px',
    boxShadow: '2px 5px 20px rgba(28, 167, 229, 0.143029)',
    marginRight: '32px'
  },
  dataBox: {
    color: '#02435D'
  },
  borderBox: {
    height: '100%',
    borderRadius: '8px',
    background: 'linear-gradient(159.06deg, #1CA7E5 8.02%, #65D7C8 145.66%)',
    width: '1.64px'
  },
  heading: {
    height: '35px'
  },
  subTitle: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '26px',
    lineHeight: '33px',
    color: 'skyblue',
    display: 'flex'
  },
  prefix: {
    color: '#02435D',
    fontSize: '16px',
    lineHeight: '33px',
    textAlign: 'center'
  }
}));

const SummaryBox = ({ title, value }) => {
  const classes = useStyle();
  const parsedValue = parseFloat(value).toFixed(2);
  return (
    <div className={classes.root}>
      <div className={classes.borderBox} />
      <Box p={1} mr={1} my={1} className={`${classes.dataBox}`}>
        <div className={`${classes.heading}`}>
          <Typography variant='h5'>{title}</Typography>
        </div>
        {!isNaN(parsedValue) ? (
          <div className={`${classes.subTitle}`}>
            {parsedValue}
            <span className={classes.prefix}>&nbsp;%</span>
          </div>
        ) : (
          <div className={`${classes.subTitle}`}>
            <span className={classes.prefix}>N/A</span>
          </div>
        )}
      </Box>
    </div>
  );
};

export default SummaryBox;
