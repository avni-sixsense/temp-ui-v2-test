import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  infoText: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[16]
  }
}));

const WaferOnHold = () => {
  const classes = useStyles();

  return (
    <Box py={2.5} px={1.5}>
      <Typography className={classes.infoText}>
        If wafer is on hold for more than: 2 Hours
      </Typography>
    </Box>
  );
};

export default WaferOnHold;
