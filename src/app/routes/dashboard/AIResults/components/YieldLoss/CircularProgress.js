import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import ReactTooltip from 'react-tooltip';

const useStyle = makeStyles(() => ({
  root: {
    textAlign: 'center'
  },
  toolTipText: {
    color: '#fff'
  }
}));

export default function CircularProgressWithLabel({
  label,
  value,
  bg,
  color,
  unitsTooltipText = '',
  chartTitle = '',
  tooltipKey
}) {
  const classes = useStyle();

  return (
    <Box className={classes.root} mr={8}>
      {chartTitle !== '' && (
        <Box my={2}>
          <Typography variant='h2'>{chartTitle}</Typography>
        </Box>
      )}
      <Box
        data-tip='React-tooltip'
        position='relative'
        display='inline-flex'
        data-for={label + tooltipKey}
      >
        <CircularProgress
          variant='static'
          value={value?.percentage}
          size={98}
          style={{ background: bg, borderRadius: '50%', color }}
        />

        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position='absolute'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Typography
            variant='h1'
            component='div'
            color='primary'
          >{`${value?.percentage}%`}</Typography>
        </Box>
      </Box>
      {/* <ReactTooltip
				title={`Over Reject Count: ${value?.over_reject_count} Total Unit Count: ${value?.total_unit_count}`}
				placement="bottom-start"
			> */}
      <Typography variant='h2'>{label}</Typography>
      {/* </ReactTooltip> */}
      <ReactTooltip
        place='bottom'
        type='dark'
        effect='solid'
        id={label + tooltipKey}
      >
        <Typography className={classes.toolTipText}>{`${unitsTooltipText}: ${
          value?.over_reject_count >= 0
            ? value?.over_reject_count
            : value?.ai_reject_count
        }`}</Typography>
        <Typography
          className={classes.toolTipText}
        >{`Total inspected units: ${value?.total_unit_count}`}</Typography>
      </ReactTooltip>
    </Box>
  );
}
