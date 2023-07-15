import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import DataCard from 'app/components/Card/Card';
import { getLandingPage } from 'app/utils/helpers';
import capitalize from 'lodash/capitalize';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { SaveSubscription } from 'store/dataLibrary/actions';

const useStyles = makeStyles(theme => ({
  tabs: {
    height: '100%',
    '& .MuiTabs-indicator': {
      backgroundImage: `linear-gradient(92deg, ${theme.colors.azure} 29%, ${theme.colors.seafoamBlue} 93%)`,
      width: '265.8px',
      height: '4px'
    },
    '& .Mui-selected': {
      ...theme.typeFace.futura1,
      width: ' 131px',
      height: ' 32px',
      '& span': {
        ...theme.typeFace.link
      }
    }
  },
  tabLabel: {
    ...theme.typeFace.futuraBT1,
    marginTop: '1%',
    textTransform: 'unset',
    color: alpha(theme.colors.marineBlue, 0.7)
  },
  sectionLabel: {
    ...theme.typeFace.futura125,
    paddingLeft: theme.spacing(1)
  },
  section: {
    margin: '3%',
    width: '100%'
  },
  appBar: {
    position: 'inherit',
    height: '64px',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 18.75)
    },
    boxShadow: 'inset 0 4px 10px 0 #0000000e'
  },
  subtitle: {
    paddingLeft: theme.spacing(1),
    margin: theme.spacing(2, 0)
  },
  subtitleFont: {
    color: '#02435D',
    fontSize: '1rem !important',
    fontWeight: 500,
    lineHeight: 1.167,
    letterSpacing: 'normal'
  }
}));

const ScopeSelection = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    const ele = document.getElementById(newValue);
    window.scrollTo({
      top: ele.offsetTop - 30,
      behavior: 'smooth'
    });
    setValue(newValue);
  };

  const dispatch = useDispatch();
  // state variables to store packs
  const [demos, setDemos] = useState([]);
  const [availablePacks, setAvailablePacks] = useState([]);
  const [subscribedPacks, setSubscribedPacks] = useState([]);
  const [categories, setCategories] = useState([]);

  // api requests for getting packs once page loads/reloads
  const orgId = 1;

  const { data: packsdata } = useQuery(['packsData', orgId], context =>
    api.getPacks(...context.queryKey)
  );

  const { data: subscriptions } = useQuery(['subscriptions', orgId], context =>
    api.getSubscriptions(...context.queryKey)
  );

  // filter different subsections from returned data once api calls are completed
  useEffect(() => {
    // removing the subscribed packs from data
    if (packsdata && subscriptions) {
      const sub = packsdata.filter(pack => {
        const temp = subscriptions.filter(item => item.pack === pack.id);
        return temp.length !== 0;
      });
      const cat = [];
      sub.forEach(el => {
        const subId = subscriptions.filter(item => item.pack === el.id)[0].id;
        el.subId = subId;
        if (!cat.includes(el.category)) {
          cat.push(el.category);
        }
      });
      setCategories(cat);
      setSubscribedPacks(sub);
      let packs = packsdata.filter(pack => {
        const temp = sub.filter(item => item.id === pack.id);
        return temp.length === 0;
      });
      // filtering out demos from packs
      const demosTemp = packs.filter(pack => pack.is_demo);
      setDemos(demosTemp);
      // removing demos from packs to get the available packs
      packs = packs.filter(pack => {
        const temp = demosTemp.filter(item => item.id === pack.id);
        return temp.length === 0;
      });
      setAvailablePacks(packs);
    }
  }, [subscriptions, packsdata]);

  const onClickHandler = index => {
    const sub = subscriptions.filter(el => el.pack === index)[0];
    const temp = {
      folder: {
        applied: []
      }
    };
    if (sub.file_set_meta_info && sub.file_set_meta_info.length) {
      sub.file_set_meta_info.forEach(info => {
        if (info.is_filterable) {
          temp[info.field] = {
            applied: []
          };
        }
      });
      dispatch({ type: 'SET_STATE', state: temp });
    }

    dispatch({ type: 'SET_FILTERS_LOADED', status: true });
    dispatch(SaveSubscription(sub));
    dispatch({ type: 'RESET_APPLIED' });
  };

  return (
    <>
      <AppBar className={classes.appBar} color='inherit'>
        <Tabs
          className={classes.tabs}
          value={value}
          onChange={handleChange}
          variant='scrollable'
          scrollButtons='on'
          aria-label='scrollable auto tabs example'
        >
          <Tab className={classes.tabLabel} label='Purchased Scopes' />
          {demos.length > 0 ? (
            <Tab
              className={classes.tabLabel}
              label='Demos setup on your data sets'
              wrapped
            />
          ) : null}
          {availablePacks.length > 0 ? (
            <Tab className={classes.tabLabel} label='Explore More' />
          ) : null}
        </Tabs>
      </AppBar>
      <Grid container>
        <Grid id='0' className={classes.section}>
          <Typography variant='h1' className={classes.sectionLabel}>
            Purchased Scopes
          </Typography>
          <Grid container>
            {categories.map(category => {
              const name = capitalize(category);
              return (
                <React.Fragment key={category}>
                  <Grid item xs={12} className={classes.subtitle}>
                    <Typography
                      variant='h1'
                      gutterBottom
                      className={classes.subtitleFont}
                    >
                      {name.includes('Backend')
                        ? `${name} Manufacturing in Packaging Facilities`
                        : name.includes('Frontend')
                        ? `${name} Manufacturing in Wafer Fabs`
                        : name}
                    </Typography>
                  </Grid>
                  {subscribedPacks.map((sub, index) => {
                    if (sub.category === category) {
                      return (
                        <Grid item lg={3} md={4} sm={6} key={index}>
                          <DataCard
                            data={sub}
                            label='Get Started'
                            link={getLandingPage(
                              sub.home_page,
                              sub.subId,
                              sub.id
                            )}
                            click={onClickHandler}
                          />
                        </Grid>
                      );
                    }
                    return null;
                  })}
                </React.Fragment>
              );
            })}
          </Grid>
        </Grid>
        {demos.length > 0 ? (
          <Grid id='1' item className={classes.section}>
            <Typography className={classes.sectionLabel}>
              Demos setup on your data sets
            </Typography>
            <Grid container spacing={2}>
              {demos.map(demo => (
                <Grid item lg={3} md={4} sm={6}>
                  <DataCard
                    label='Try Demo'
                    variant='outlined'
                    link='/tryDemo'
                    data={demo}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        ) : null}
        {availablePacks.lenth > 0 ? (
          <Grid id='2' item className={classes.section}>
            <Typography className={classes.sectionLabel}>
              Explore more
            </Typography>
            <Grid container>
              {availablePacks.map(pack => (
                <Grid item lg={3} md={4} sm={6}>
                  <DataCard
                    locked
                    label='Try Demo'
                    variant='outlined'
                    link='/tryDemo'
                    data={pack}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
};

export default ScopeSelection;
