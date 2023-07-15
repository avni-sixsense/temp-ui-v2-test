import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EmptyBox from 'assests/images/empty_box.svg';
import React from 'react';

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  subHeader: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  }
}));

const EmptyState = ({ isTable, title = '', subTitle = '' }) => {
  const classes = useStyles();

  return (
    <Box
      height='300px'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <Box mb={1.5}>
        <img src={EmptyBox} alt='emptyBox' />
      </Box>
      <Box mb={0.5}>
        <Typography className={classes.header}>{title || 'No Data'}</Typography>
      </Box>
      <Box>
        <Typography className={classes.subHeader}>
          {subTitle ||
            `No data is avaialable based on selected filters to ${
              isTable ? 'show table' : 'plot chart'
            }`}
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyState;
