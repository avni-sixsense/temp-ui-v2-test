import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Collapse from '../../components/Collapse';
import WaferOnHold from './waferOnHold';

const useStyles = makeStyles(theme => ({
  infoText: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[12]
  }
}));

const NotificationConfigContainer = () => {
  const classes = useStyles();

  return (
    <>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        mb={3}
      >
        <Typography className={classes.infoText}>
          System will send notification based on following configuration.
        </Typography>
      </Box>

      <Box mb={2}>
        <Collapse
          showToggle
          toggleDisabled
          toggleChecked
          title='Notification about wafer on hold'
          content={<WaferOnHold />}
        />
      </Box>

      <Box mb={2}>
        <Collapse
          title='Notify when auto-classification & accuracy at overall level is less than Expected'
          nonCollapse
          showToggle
          toggleDisabled
          toggleChecked
        />
      </Box>

      <Box mb={2}>
        <Collapse
          title='Notify when auto-classification & accuracy at usecases level is less than Expected'
          nonCollapse
          showToggle
          toggleDisabled
          toggleChecked
        />
      </Box>
    </>
  );
};

export default NotificationConfigContainer;
