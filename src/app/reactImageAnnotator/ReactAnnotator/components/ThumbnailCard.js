import React from 'react';
import { Card } from 'reactstrap';
import { makeStyles } from '@material-ui/core';
import useNativeLazyLoading from '@charlietango/use-native-lazy-loading';
import { useInView } from 'react-intersection-observer';

const useStyle = makeStyles(theme => ({
  active: {
    border: '5px solid skyblue'
  },
  root: {
    width: '89px',
    height: '89px'
    // overflow: 'hidden',
  }
}));

const ThumbnailCard = ({ img, index, onClick, active }) => {
  const classes = useStyle();
  const supportsLazyLoading = useNativeLazyLoading();
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '0px 0px'
  });
  return (
    <div ref={!supportsLazyLoading ? ref : undefined}>
      <Card
        //ref={!supportsLazyLoading ? ref : undefined}
        onClick={() => onClick(index)}
        className={`my-2 ${active ? classes.active : null}`}
      >
        {inView || supportsLazyLoading ? (
          <img
            src={img}
            className={classes.root}
            loading='lazy'
            alt='thumbnail'
          />
        ) : null}

        <div
          style={{
            position: 'absolute',
            bottom: '3%',
            left: '3%',
            fontSize: '13px',
            fontWeight: 500
          }}
        >
          <span style={{ color: '#FFFFFF' }}>{index}</span>
        </div>
      </Card>
    </div>
  );
};
export default ThumbnailCard;
