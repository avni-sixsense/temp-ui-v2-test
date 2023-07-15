import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import Show from 'app/hoc/Show';
import { NumberFormater } from 'app/utils/helpers';
import get from 'lodash/get';
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import CommonButton from '../CommonButton';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3.75),
    border: '1px solid #E8EDF1'
  },
  spacing: {
    marginRight: theme.spacing(1)
  },
  box: {
    backgroundColor: '#FFF0F0',
    marginLeft: 20,
    height: '80px',
    width: '96px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    marginLeft: '20px'
  }
}));

const InfoHeader = ({ title, buttonGrp, stats = [] }) => {
  const classes = useStyles();

  const { subscriptionId } = useParams();

  const { data } = useQuery(
    ['subscription', subscriptionId],
    context => api.getSubscription(...context.queryKey.slice(1)),
    { enabled: !!subscriptionId }
  );

  return (
    <Paper elevation={0} className={classes.root}>
      <Grid container spacing={2} justifyContent='space-between'>
        <Grid item xs={3}>
          <Typography variant='h1'>{title}</Typography>
        </Grid>
        <Grid item xs='auto'>
          {buttonGrp.map((btn, index) => (
            <Show when={btn.show ?? true} key={index}>
              <CommonButton
                id={`lib_header_btn_${btn.text.split(' ').join('_')}`}
                text={btn.text}
                wrapperClass={classes.btn}
                disabled={btn.disabled}
                onClick={btn.callback}
                key={index}
              />
            </Show>
          ))}
        </Grid>
        <Grid item container xs={12} justifyContent='flex-end'>
          {stats.map(stat => (
            <Grid
              key={stat.key}
              item
              container
              direction='column'
              className={classes.box}
            >
              <Typography
                id={`lib_header_box_${stat.name.split(' ').join('_')}`}
                align='center'
                variant='h1'
                gutterBottom
              >
                {NumberFormater(get(data, stat.key, stat?.count))}
              </Typography>
              <Typography align='center' variant='h3'>
                {stat.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InfoHeader;
