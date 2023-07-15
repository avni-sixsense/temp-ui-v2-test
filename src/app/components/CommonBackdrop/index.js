import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { memo } from 'react';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: 10000,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backdropText: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#FFFFFF',
    paddingTop: theme.spacing(2)
  }
}));

const CommonBackdrop = ({ open, invisible = false, text }) => {
  const classes = useStyles();

  return (
    <Backdrop invisible={invisible} open={open} className={classes.backdrop}>
      <CircularProgress />
      {text && <Typography className={classes.backdropText}>{text}</Typography>}
    </Backdrop>
  );
};

export default memo(
  CommonBackdrop,
  (prevProps, nextProps) => prevProps.open === nextProps.open
);
