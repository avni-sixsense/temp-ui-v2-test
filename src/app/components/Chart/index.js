import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import XArrow from 'assests/images/arrow_long_right.svg';
import YArrow from 'assests/images/arrow_long_up.svg';
import React from 'react';

const useStyle = makeStyles(theme => ({
  labelYAlign: {
    transform: 'rotate(180deg)',
    marginTop: theme.spacing(1),
    lineHeight: 0.7,
    writingMode: 'vertical-lr'
  },
  arrowX: {
    marginLeft: theme.spacing(1)
  }
}));

const ChartContianer = ({ chartTitle = '', children, labelX, labelY }) => {
  const classes = useStyle();
  return (
    <Box my={4} width='100%'>
      {chartTitle !== '' && (
        <Box>
          <Typography variant='h2'>{chartTitle}</Typography>
        </Box>
      )}
      <Box width='100%' display='flex'>
        <Box pt={4} textAlign='center' width='1%'>
          <img src={YArrow} alt='' />
          <Typography variant='body1' className={classes.labelYAlign}>
            {labelY}
          </Typography>
        </Box>
        <Box width='99%'>
          <Box>{children}</Box>
          <Box justifyContent='flex-end' display='flex' mr={3}>
            <Typography variant='body1'>{labelX}</Typography>
            <img src={XArrow} alt='' className={classes.arrowX} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChartContianer;
