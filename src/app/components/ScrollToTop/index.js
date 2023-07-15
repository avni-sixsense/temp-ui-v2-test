import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import React, { useCallback, useEffect, useState } from 'react';

const useStyles = makeStyles(() => ({
  scroll: {
    position: 'fixed',
    bottom: 10,
    right: 10,
    backgroundColor: '#F56C6C',
    '&:hover': {
      backgroundColor: '#E14242'
    }
  },
  icon: {
    color: 'white'
  }
}));

const ScrollToTop = () => {
  const classes = useStyles();

  const [showScroll, setShowScroll] = useState(false);

  const setScroll = useCallback(() => {
    if (!showScroll && window.pageYOffset > 200) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 200) {
      setShowScroll(false);
    }
  }, [showScroll]);

  useEffect(() => {
    window.addEventListener('scroll', setScroll);

    return () => {
      window.removeEventListener('scroll', setScroll);
    };
  }, [setScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showScroll) {
    return '';
  }

  return (
    <IconButton className={classes.scroll} onClick={scrollTop} size='small'>
      <ArrowUpwardIcon className={classes.icon} />
    </IconButton>
  );
};

export default ScrollToTop;
