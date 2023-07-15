import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import api from 'app/api';
import { navRoutes } from 'app/configs/routes';
import { goToRoute } from 'app/utils/navigation';
// import WorkspaceIcon from 'assests/images/sidebar/workspace.svg'
import clsx from 'clsx';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import { setNotificationCount } from 'store/notifications/actions';

const drawerWidth = 231;

const checkPath = path => {
  return window.location.pathname.includes(path);
};

const useStyles = makeStyles(theme => ({
  menuContainer: {
    height: 95
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    zIndex: 5,
    borderRight: 'none !important',
    '& .MuiListItemIcon-root': {
      minWidth: '40px'
    }
  },
  drawerOpen: {
    width: drawerWidth,
    borderRight: 'none',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    borderRight: 'none',
    overflowX: 'hidden',
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7)
    }
  },
  subList: {
    // marginLeft: theme.spacing(5),
    '& .MuiListItem-button': {
      paddingLeft: theme.spacing(5),
      borderLeft: '3px solid #ffffff'
    }
  },
  tabs: {
    color: '#02435D'
  },
  toggleBtn: {
    height: '20px',
    width: '20px',
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    // borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    position: 'fixed',
    bottom: 40,
    left: 40,
    zIndex: 1300,
    marginLeft: '180px',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    cursor: 'pointer'
  },
  drawerList: {
    marginTop: '110px'
  },
  toggleBtnContainer: {
    height: ' 20px',
    width: '20px',
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    // borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    position: 'fixed',
    bottom: 40,
    left: 45,
    zIndex: 1300,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    cursor: 'pointer'
  },
  rightBtn: {
    marginLeft: 5
  },
  text: {
    color: '#02435D'
  },
  bg: {
    backgroundColor: '#DCF3FC',
    borderLeft: '3px solid #4DC0E0 !important'
  },
  scope: {
    marginTop: 'auto',
    position: 'fixed',
    left: 0,
    bottom: 0,
    zIndex: 1200,
    marginBottom: 36,
    padding: '0 10px',
    height: 30,
    lineHeight: 1,
    alignItems: 'center',
    display: 'flex',
    '& a:hover': {
      textDecoration: 'none'
    }
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  scopeIcon: {
    width: 30,
    borderRadius: 50,
    background: 'grey',
    height: 30,
    marginRight: 5,
    opacity: 0.7
  },
  click: {
    color: '#02435D',
    lineHeight: '16px'
  },
  scopeImg: {
    width: 30,
    marginRight: 5,
    '& img': {
      height: 30
    }
  },
  flex: {
    '& span': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  notificationCount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0ECFD',
    borderRadius: '1000px',
    '& p': {
      fontSize: '0.625rem !important',
      fontWeight: 500,
      color: '#3E5680'
    }
  }
}));

const Sidebar = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const { subscriptionId, packId } = useParams();

  const { unread: count } = useSelector(({ notifications }) => notifications);

  const { data } = useQuery(
    ['subscribedPack', subscriptionId],
    context => api.packDetails(...context.queryKey.slice(1)),
    { enabled: !!subscriptionId, forceFetchOnMount: false }
  );

  const { data: notificationCount } = useQuery(
    'notificationCount',
    api.getNotificationCount,
    {
      refetchInterval: 1000 * 10,
      enabled: !(
        location.pathname.includes('train') ||
        location.pathname.includes('review') ||
        location.pathname.includes('audit') ||
        location.pathname.includes('manual-classify')
      )
    }
  );

  useEffect(() => {
    dispatch(setNotificationCount(notificationCount));
  }, [notificationCount]);

  const [open, setOpen] = useState(false);
  const [tabOpen, setTabOpen] = useState(null);

  const handleDrawerOpen = useCallback(() => {
    if (!open) {
      setOpen(true);

      if (location.pathname.includes('dashboard')) {
        setTabOpen(0);
      } else if (location.pathname.includes('library')) {
        setTabOpen(1);
      }
    }
  }, [open]);

  const handleDrawerClose = useCallback(() => {
    setOpen(false);
    setTabOpen(null);
  }, []);

  const handleClickOpen = index => {
    if (tabOpen !== index) {
      setTabOpen(index);
    }
  };

  return (
    <>
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
        onMouseOver={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
      >
        <List className={classes.drawerList}>
          {navRoutes.map((route, index) => {
            let basePath = route.path;

            if (route.defaultParams) {
              basePath += `/${route.defaultParams}`;
            }

            return (
              <Fragment key={index}>
                <ListItem
                  onClick={
                    route.subRoutes
                      ? () => handleClickOpen(index)
                      : () => {
                          dispatch({ type: 'RESET_APPLIED' });
                          goToRoute(
                            navigate,
                            `/${subscriptionId}/${packId}/${basePath}`
                          );
                          // navigate(`${subscriptionId}/${packId}/${basePath}`);
                        }
                  }
                  button
                >
                  <ListItemIcon>
                    {route.name === 'Notifications' ? (
                      <Badge
                        color='secondary'
                        variant='dot'
                        invisible={!notificationCount}
                        overlap='rectangular'
                      >
                        <img
                          src={route.icon}
                          alt='icon'
                          className={clsx(
                            { [classes.tabs]: tabOpen === index },
                            'pl-2'
                          )}
                        />
                      </Badge>
                    ) : (
                      <img
                        src={route.icon}
                        alt='icon'
                        className={clsx(
                          { [classes.tabs]: tabOpen === index },
                          'pl-2'
                        )}
                      />
                    )}
                  </ListItemIcon>

                  <ListItemText
                    id={`drawer_btn_${route.name.split(' ').join('_')}`}
                    className={clsx({
                      [classes.text]: !tabOpen === index,
                      [classes.tabs]: tabOpen === index,
                      [classes.flex]: route.name === 'Notifications'
                    })}
                  >
                    <Typography variant='h3'>{route.name}</Typography>

                    {route.name === 'Notifications' && (
                      <Box
                        ml={0.25}
                        px={0.375}
                        className={classes.notificationCount}
                      >
                        <Typography>{count}</Typography>
                      </Box>
                    )}
                  </ListItemText>

                  {route.subRoutes ? (
                    tabOpen === index ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  ) : null}
                </ListItem>

                {route.subRoutes && tabOpen === index ? (
                  <List className={classes.subList}>
                    {route.subRoutes.map((subRoute, i) => {
                      if (!subRoute) return null;

                      let subPath = `${basePath}/${subRoute.path}`;

                      if (subRoute.defaultParams) {
                        subPath += `/${subRoute.defaultParams}`;
                      }

                      return (
                        <ListItem
                          onClick={() => {
                            if (!location.pathname.includes(subRoute.path)) {
                              const path = `/${subscriptionId}/${packId}/${subPath}`;

                              if (subRoute.default) {
                                dispatch({ type: 'RESET_APPLIED' });
                                goToRoute(navigate, path);
                                // navigate(path);
                              } else {
                                // dispatch(
                                //   setParams(
                                //     params.replace(
                                //       'training_ml_model__in',
                                //       'ml_model_id__in'
                                //     )
                                //   )
                                // );

                                // navigate(
                                //   `${subscriptionId}/${packId}/${subPath}?${location.search.replace(
                                //     'training_ml_model__in',
                                //     'ml_model_id__in'
                                //   )}`
                                // );

                                goToRoute(navigate, path);
                                // navigate(path);
                              }
                            }
                          }}
                          button
                          key={i}
                          className={clsx({
                            [classes.bg]: checkPath(subRoute.path)
                          })}
                        >
                          <ListItemIcon>
                            <img
                              src={
                                checkPath(subRoute.path)
                                  ? subRoute.iconActive
                                  : subRoute.icon
                              }
                              alt='icon'
                              className='pl-2'
                            />
                          </ListItemIcon>

                          <ListItemText
                            id={`drawer_btn_${subRoute.name
                              .split(' ')
                              .join('_')}`}
                            className={clsx({
                              [classes.text]: !checkPath(subRoute.path),
                              [classes.tabs]: checkPath(subRoute.path)
                            })}
                          >
                            <Typography variant='h5'>
                              {subRoute.name}
                            </Typography>
                          </ListItemText>
                        </ListItem>
                      );
                    })}
                  </List>
                ) : null}
              </Fragment>
            );
          })}
        </List>
      </Drawer>

      <div className={classes.scope}>
        {data?.image ? (
          <div className={classes.scopeImg}>
            <img src={data.image} alt='' />
          </div>
        ) : (
          <div className={classes.scopeIcon} />
        )}
        {open && (
          <div className={classes.title}>
            <Typography variant='body1' style={{ lineHeight: 1 }}>
              {data?.name}
            </Typography>
            <NavLink id='drawer_btn_Click_to_change' to='/'>
              <span className={classes.click}> Click to change</span>
            </NavLink>
          </div>
        )}
      </div>
      <div
        className={clsx({
          [classes.toggleBtnContainer]: !open,
          [classes.toggleBtn]: open
        })}
      >
        {!open ? (
          <ChevronRightIcon
            id='drawer_btn_open'
            onClick={handleDrawerOpen}
            className={classes.rightBtn}
          />
        ) : (
          <ChevronLeftIcon
            id='drawer_btn_close'
            onClick={handleDrawerClose}
            className={classes.rightBtn}
          />
        )}
      </div>
    </>
  );
};

export default Sidebar;
