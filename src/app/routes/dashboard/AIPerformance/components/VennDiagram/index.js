import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CustomSwitch from 'app/components/CustomSwitch';
import get from 'lodash/get';
import React, { useState } from 'react';

import PerformanceSummary from '../PerformanceSummary';

const useStyles = makeStyles({
  header: {
    marginLeft: '-50px'
  },
  chart: {
    height: '230px',
    display: 'flex',
    alignItems: 'center',
    '& .venn': {
      float: 'left',
      width: '200px',
      height: '200px',
      borderRadius: '100px',
      textAlign: 'center',
      verticalAlign: 'middle',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  three: {
    marginLeft: '-50px',
    width: '50px',
    textAlign: 'center',
    color: 'black'
  },
  one: { backgroundColor: 'rgba(68, 210, 255, 0.3)' },
  two: {
    backgroundColor: 'rgba(255, 120, 120, 0.3)',
    marginLeft: '-50px'
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '0.5px solid rgba(208,208,208,0.5)'
  }
});

const performanceSummaryKeys = [
  {
    title: 'Regions Identified',
    key: 'percentage_regions_identified'
  },
  {
    title: 'Regions Missed',
    key: 'percentage_regions_missed'
  },
  {
    title: 'Regions Extra',
    key: 'percentage_regions_extra'
  }
];

const VennDiagram = ({ data, summary }) => {
  const classes = useStyles();

  const [show, setShow] = useState(true);

  const ai = get(data, 'ai_count', '');
  const gt = get(data, 'gt_count', '');
  const correct = get(data, 'correct_count', '');

  return (
    <Box my={5}>
      <Box className={classes.title} mb={2}>
        <Typography variant='h2'>Detection Metrics</Typography>
        <CustomSwitch checked={show} handleChecked={setShow} />
      </Box>
      <Collapse in={show}>
        <PerformanceSummary
          data={summary}
          showTitle={false}
          keys={performanceSummaryKeys}
        />
        <Box mt={4} display='flex'>
          <Box width={200} textAlign='center'>
            <Typography variant='h3'>AI Predicted</Typography>
          </Box>
          <Box width={200} className={classes.header} textAlign='center'>
            <Typography variant='h3'>Label</Typography>
          </Box>
        </Box>
        <Box className={classes.chart}>
          <div className={`${classes.one} venn`}>
            {ai ? Math.abs(correct - ai) : ''}
          </div>
          <div className={classes.three}>{correct}</div>
          <div className={`${classes.two} venn`}>
            {gt ? Math.abs(correct - gt) : ''}
          </div>
        </Box>
      </Collapse>
    </Box>
  );
};
export default VennDiagram;
