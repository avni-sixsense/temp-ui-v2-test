import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Show from 'app/hoc/Show';
import React from 'react';

import ClickableBox from './ClickableBox';

const useStyles = makeStyles(theme => ({
  legendContainer: {
    cursor: clickable => (clickable ? 'pointer' : 'default')
  },
  totalText: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[13]
  },
  legendTitle: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[13]
  }
}));

const ClickableBoxGroup = ({
  onClick,
  value = '',
  subtitle = '',
  title = '',
  data,
  active,
  liveUsecaseCount,
  textGroupContainer
}) => {
  const isInteractive = typeof onClick === 'function';
  const classes = useStyles(isInteractive);
  return (
    <>
      <Show when={title || liveUsecaseCount}>
        <Box
          className={classes.legendContainer}
          onClick={isInteractive ? () => onClick(data.map(x => x.value)) : null}
          display='flex'
          flexDirection='column'
          mb={1.5}
        >
          {title && (
            <Typography
              className={classes.totalText}
            >{`${title}: ${value}`}</Typography>
          )}
          {liveUsecaseCount && (
            <Typography
              className={classes.totalText}
            >{`Total Live Usecases: ${liveUsecaseCount}`}</Typography>
          )}
        </Box>
      </Show>
      <Show when={subtitle}>
        <Box mb={1.25}>
          <Typography className={classes.legendTitle}>{subtitle}</Typography>
        </Box>
      </Show>
      <Box display='flex' alignItems='center' flexWrap='wrap'>
        {data.map((x, index) => (
          <ClickableBox
            key={index}
            label={x.label}
            onClick={isInteractive ? () => onClick(x.value) : null}
            subLabel={x.subLabel}
            active={active.includes(x.value)}
            classes={x.classes}
            textGroupContainer={textGroupContainer}
          />
        ))}
      </Box>
    </>
  );
};

export default ClickableBoxGroup;
