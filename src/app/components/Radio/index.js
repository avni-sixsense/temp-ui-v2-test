import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow:
      'inset 0 0 0 1px rgba(2, 67, 93, 0.2), inset 0 -1px 0 rgba(2, 67, 93, 0.1)',
    backgroundColor: '#fff',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5'
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    backgroundColor: '#fff',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    boxShadow: 'inset 0 0 0 1px #02435D, inset 0 -1px 0 #02435D',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#02435D,#02435D, 28%,transparent 32%)',
      content: '""'
    }
  }
});

const CustomizedRadio = props => {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color='default'
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
};

export default CustomizedRadio;
