import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';

const AntSwitch = withStyles(theme => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    marginRight: theme.spacing(1),

    '& .Mui-disabled': { opacity: 0.5, pointerEvents: 'none' },
    '& .Mui-disabled + span': {
      opacity: '0.5 !important',
      pointerEvents: 'none'
    }
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.colors.green[500],
        borderColor: theme.palette.common.white
      }
    }
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none'
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white
  },
  checked: {}
}))(Switch);

const CustomSwitch = ({
  checked,
  handleChecked,
  label = true,
  disabled = false
}) => {
  return (
    <Box display='flex' alignItems='center'>
      <AntSwitch
        disabled={disabled}
        checked={checked}
        onChange={() => handleChecked(!checked)}
        name='switch'
      />
      {label && <Typography>{checked ? 'Hide' : 'Show'}</Typography>}
    </Box>
  );
};

export default CustomSwitch;

CustomSwitch.defaultValue = {
  label: true
};

CustomSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  handleChecked: PropTypes.func.isRequired
};
