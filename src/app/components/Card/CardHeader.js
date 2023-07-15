import { makeStyles } from '@material-ui/core/styles';
import Lock from 'assests/images/lock.svg';
import PropTypes from 'prop-types';
import React from 'react';

const useStyle = makeStyles(() => ({
  cardLock: {
    // ...theme.typeFace.cabin75,
    // background: `url(${cardLockBg})`,
    // backgroundRepeat: 'no-repeat',
    // margin: '-5px',
    // width: '77px',
    // borderRadius: '8px 0',
    // color: 'white',
    // lineHeight: '1.33rem',
    // display: 'flex',
    // padding: '0 3%',
    // zIndex: '888',
  },
  lockImg: {
    marginRight: '3px'
  },
  imgContainer: {
    marginTop: '15px',
    marginBottom: '10px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 30px'
  },
  img: {
    borderRadius: '10px',
    height: '150px',
    maxWidth: '100%'
  }
}));

const CardHeader = ({ locked, url }) => {
  const classes = useStyle();
  return (
    <>
      {locked && (
        <div className={classes.cardLock}>
          <img className={classes.lockImg} src={Lock} alt='' />
          Locked
        </div>
      )}
      <div className={classes.imgContainer}>
        <img src={url} className={classes.img} alt='' />
      </div>
    </>
  );
};

export default CardHeader;

CardHeader.propTypes = {
  locked: PropTypes.bool.isRequired
};
