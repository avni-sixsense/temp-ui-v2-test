import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
  activeContainer: {
    backgroundColor: theme.colors.blue[600],
    borderRadius: '4px',
    cursor: 'pointer'
  },
  activeLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.colors.grey[0]
  },
  container: {
    backgroundColor: theme.colors.grey[0],
    border: `1px solid ${theme.colors.grey[4]}`,
    borderRadius: '4px',
    boxShadow: theme.colors.shadow.sm,
    cursor: 'pointer'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.colors.grey[19]
  }
}));

const ModeSelector = ({ modes = [], selectedMode, onChange }) => {
  const classes = useStyles();
  return (
    <Box display='flex' alignItems='center'>
      {modes.map((label, index) => (
        <Box
          pt={0.125}
          px={0.5}
          pb={0.375}
          mr={1}
          key={index}
          onClick={() => onChange(label)}
          className={clsx({
            [classes.activeContainer]: selectedMode === label,
            [classes.container]: selectedMode !== label
          })}
        >
          <Typography
            className={clsx({
              [classes.activeLabel]: selectedMode === label,
              [classes.label]: selectedMode !== label
            })}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ModeSelector;
