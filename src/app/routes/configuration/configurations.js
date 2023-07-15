import { lazy } from 'react';
import { Routes, useNavigate, useParams } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import {
  NOTIFICATION_CONFIG,
  SYSTEM_CONFIG,
  USER_ROLE
} from 'store/configuration/constants';

import { renderRoute } from 'app/services/Routing';

const SystemConfig = lazy(() => import('./tabs/systemConfig'));
const NotificationConfig = lazy(() => import('./tabs/notificationConfig'));
const UserRole = lazy(() => import('./tabs/userRoles'));

const tabs = [
  { name: SYSTEM_CONFIG, path: SYSTEM_CONFIG, element: SystemConfig },
  {
    name: NOTIFICATION_CONFIG,
    path: NOTIFICATION_CONFIG,
    element: NotificationConfig
  },
  { name: USER_ROLE, path: USER_ROLE, element: UserRole }
];

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: '987px',
    width: '70%'
  },
  activeTab: {
    borderBottom: `2px solid ${theme.colors.blue[500]}`
  },
  activeTabText: {
    fontSize: '1rem',
    fontWeight: 700,
    color: theme.colors.grey[22]
  },
  tabText: {
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.colors.grey[13]
  },
  tab: {
    cursor: 'pointer'
  }
}));

const ConfigurationsContainer = () => {
  const classes = useStyles();

  const navigate = useNavigate();
  const activeTab = useParams()['*'];

  const handleTabChange = value => {
    navigate(value);
  };

  return (
    <Box className={classes.root} px={4} py={3}>
      <Box display='flex' alignItems='flex-end' mb={1.375}>
        {tabs.map((data, index) => (
          <Box
            px={0.5}
            pb={0.75}
            className={`${classes.tab} ${
              activeTab === data.name ? classes.activeTab : ''
            }`}
            mr={4}
            key={index}
            onClick={() => handleTabChange(data.name)}
          >
            <Typography
              className={
                activeTab === data.name
                  ? classes.activeTabText
                  : classes.tabText
              }
            >
              {data.name}
            </Typography>
          </Box>
        ))}
      </Box>

      <Routes>{tabs.map(renderRoute)}</Routes>
    </Box>
  );
};

export default ConfigurationsContainer;
