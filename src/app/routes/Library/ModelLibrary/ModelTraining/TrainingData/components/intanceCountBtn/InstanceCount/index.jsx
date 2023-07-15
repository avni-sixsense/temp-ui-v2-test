import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectDefectsInstancesCount,
  selectFileSetCount
} from 'store/modelTraining/selector';

import classes from './InstanceCount.module.scss';

const mapInstanceCountToState = createStructuredSelector({
  defectsInstancesCount: selectDefectsInstancesCount,
  fileSetDataCount: selectFileSetCount
});

const DEFECT_TRAINING_DATA =
  'Defect instances show count of all the defect labels present on the images.';

const tooltipStyles = makeStyles(theme => ({
  arrow: {
    color: theme.colors.grey[23]
  },
  tooltip: {
    backgroundColor: theme.colors.grey[23],
    fontSize: '0.75rem'
  }
}));

const InstanceCount = () => {
  const { defectsInstancesCount, fileSetDataCount } = useSelector(
    mapInstanceCountToState
  );

  return (
    <Typography className={classes.imageCount}>
      {fileSetDataCount} Images | {defectsInstancesCount} Defect Instances{' '}
      <Tooltip
        placement='right-end'
        classes={tooltipStyles}
        title={DEFECT_TRAINING_DATA}
        arrow
      >
        <InfoOutlinedIcon fill='#5E7BAA' fontSize='small' />
      </Tooltip>
    </Typography>
  );
};

export default InstanceCount;
