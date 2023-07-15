import { faSignOut } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/ReviewButton';
import {
  handleCloseModelTraining,
  isViewDetailsHash
} from 'app/utils/modelTraining';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setDialogOpen, setDialogVariant } from 'store/modelTraining/actions';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.grey[14]
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[1]
  },
  exitBtn: {
    backgroundColor: theme.colors.grey[12]
  }
}));

const TrainingHeader = ({ title }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { subscriptionId, packId } = useParams();

  const isViewDetails = isViewDetailsHash();

  const handleCloseScreen = !isViewDetails
    ? () => {
        dispatch(setDialogVariant('close_training'));
        dispatch(setDialogOpen(true));
      }
    : () => handleCloseModelTraining(navigate, subscriptionId, packId);

  return (
    <Box className={classes.root} px={2} py={1.625}>
      <Box>
        <Typography className={classes.title}>{title}</Typography>
      </Box>

      <Box>
        <CommonButton
          text='Exit'
          onClick={handleCloseScreen}
          icon={<FontAwesomeIcon icon={faSignOut} />}
          variant='secondary'
          wrapperClass={classes.exitBtn}
          size='sm'
        />
      </Box>
    </Box>
  );
};

export default TrainingHeader;
