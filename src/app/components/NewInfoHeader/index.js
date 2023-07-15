import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import { NumberFormater } from 'app/utils/helpers';
import { get } from 'lodash';
import React from 'react';
import { useQuery } from 'react-query';
// import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CommonButton from '../ReviewButton';
// import UnderlineModeSelector from '../UnderlineModeSelector'

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: theme.colors.grey[19]
  },
  metaInfo: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[14],
    paddingBottom: theme.spacing(0.5)
  },
  btn: {
    paddingRight: theme.spacing(1.5)
  }
  // box: {
  // 	backgroundColor: '#FFF0F0',
  // 	marginLeft: 20,
  // 	height: '80px',
  // 	width: '96px',
  // 	display: 'flex',
  // 	justifyContent: 'center',
  // 	alignItems: 'center',
  // },
  // btn: {
  // 	marginLeft: '20px',
  // },
}));

const InfoHeader = ({ title, buttonGrp, stats = [], onChange }) => {
  const classes = useStyles();
  // const location = useLocation();
  // const { infoMode, infoModes } = useSelector(({ allUploads }) => allUploads);

  const { subscriptionId } = useParams();

  const { data } = useQuery(
    ['subscription', subscriptionId],
    context => api.getSubscription(...context.queryKey.slice(1)),
    { enabled: !!subscriptionId }
  );

  return (
    <Box>
      <Grid container spacing={2} justify='space-between'>
        <Grid item>
          <Grid container spacing={2} alignItems='flex-end'>
            <Grid item>
              <Typography className={classes.title}>{title}</Typography>
            </Grid>
            {/* {location.pathname.includes('/library/data') && (
              <Grid item>
                <UnderlineModeSelector
                  onChange={onChange}
                  modes={infoModes}
                  active={infoMode}
                  blueLightTheme
                />
              </Grid>
            )} */}
            {/* {!location.pathname.includes('/library/data') && ( */}
            <Grid item>
              {data && Object.keys(data).length > 0 && (
                <Typography className={classes.metaInfo}>
                  {stats
                    .map(stat => {
                      return `${NumberFormater(
                        get(data, stat.key, stat?.count)
                      )} ${stat.name}`;
                    })
                    .join(' | ')}
                </Typography>
              )}
            </Grid>
            {/* )} */}
          </Grid>
        </Grid>
        <Grid item xs='auto'>
          <Grid container spacing={2} justify='space-between'>
            {buttonGrp.map((btn, index) => (
              <Grid item key={index}>
                <CommonButton
                  id={`lib_header_btn_${btn.text.split(' ').join('_')}`}
                  text={btn.text}
                  size='l'
                  icon={btn.icon}
                  // wrapperClass={classes.btn}
                  disabled={btn.disabled}
                  onClick={btn.callback}
                  variant={btn.variant}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        {/* <Grid item container xs={12} justifyContent="flex-end">
					{stats.map((stat) => (
						<Grid key={stat.key} item container direction="column" className={classes.box}>
							<Typography
								id={`lib_header_box_${stat.name.split(' ').join('_')}`}
								align="center"
								variant="h1"
								gutterBottom
							>
								{get(data, stat.key, stat?.count)}
							</Typography>
							<Typography align="center" variant="h3">
								{stat.name}
							</Typography>
						</Grid>
					))}
				</Grid> */}
      </Grid>
    </Box>
  );
};

export default InfoHeader;
