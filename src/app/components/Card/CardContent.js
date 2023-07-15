import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import icon1 from 'assests/images/icons/icon1.png';
import icon2 from 'assests/images/icons/icon2.png';
import icon3 from 'assests/images/icons/icon3.png';
import icon4 from 'assests/images/icons/icon4.png';
import PropTypes from 'prop-types';
import React from 'react';

const useStyle = makeStyles(theme => ({
  cardImg: {
    width: '132px',
    height: '132px'
  },
  menuItem: {
    ...theme.typeFace.cabin875,
    display: 'flex',
    margin: theme.spacing(1, 0),
    alignItems: 'center'
  },
  menu: {
    margin: '7% 0'
  },
  menuItemImg: {
    margin: 'auto 4%',
    width: 23,
    height: 23
  }
}));

const CardContent = ({ data }) => {
  const classes = useStyle();
  return (
    <>
      {/* <div className={classes.cardImg} /> */}
      <div className={classes.menu}>
        <Typography className={classes.menuItem}>
          <img alt='' src={icon1} className={classes.menuItemImg} />
          {data ? data.name : 'Comming Soon Model Name'}
        </Typography>

        {/* <Typography className={classes.menuItem}>
					<img
						alt=""
						src={datatypeImg}
						className={classes.menuItemImg}
					/>
					Data type Here
				</Typography> */}
        <Typography className={classes.menuItem}>
          <img alt='' src={icon2} className={classes.menuItemImg} />
          {data?.image_type}
        </Typography>
        <Typography className={classes.menuItem}>
          <img alt='' src={icon3} className={classes.menuItemImg} />
          {data?.manufacturing}
        </Typography>
        <Typography className={classes.menuItem}>
          <img alt='' src={icon4} className={classes.menuItemImg} />
          {data?.process}
        </Typography>
      </div>
    </>
  );
};

export default CardContent;

CardContent.propTypes = {
  data: PropTypes.object.isRequired
};
