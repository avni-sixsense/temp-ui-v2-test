import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/ReviewButton';
import Show from 'app/hoc/Show';
import { isViewDetailsHash } from 'app/utils/modelTraining';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import {
  selectNewTrainingModel,
  selectOldModel,
  selectTrainingUsecase
} from 'store/modelTraining/selector';

const usestyle = makeStyles(theme => ({
  root: {
    backgroundColor: theme.colors.grey[1]
  },
  header: {
    fontSize: '0.625rem',
    fontWeight: 500,
    color: theme.colors.grey[13],
    textTransform: 'uppercase'
  },
  title: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[13],
    marginRight: theme.spacing(1)
  },
  value: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[19]
  }
}));

const mapModelDetailsToState = createStructuredSelector({
  oldModel: selectOldModel,
  newModel: selectNewTrainingModel,
  usecase: selectTrainingUsecase
});

const ModelDetails = () => {
  const classes = usestyle();

  const { subscriptionId, packId, trainingSessionId } = useParams();
  const navigate = useNavigate();

  const { oldModel, newModel, usecase } = useSelector(mapModelDetailsToState);

  const isViewDetails = isViewDetailsHash();

  const handleEdit = () => {
    navigate(
      `/${subscriptionId}/${packId}/library/model/resume/${trainingSessionId}`
    );
  };

  return (
    <Box pt={2.75} px={1.25} pb={2} className={classes.root}>
      <Box
        mb={2.125}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Typography className={classes.header}>Model Details</Typography>

        <Show when={!isViewDetails}>
          <CommonButton
            onClick={handleEdit}
            text='Edit'
            variant='tertiary'
            icon={<FontAwesomeIcon icon={faPen} />}
          />
        </Show>
      </Box>

      <Box mb={1.5} display='flex' alignItems='center'>
        <Typography className={classes.title}>Model Name</Typography>
        <Typography className={classes.value}>
          {newModel?.name || ''}
        </Typography>
      </Box>

      <Box display='flex' alignItems='center'>
        <Box display='flex' alignItems='center' mr={5}>
          <Typography className={classes.title}>Base Model</Typography>
          <Typography className={classes.value}>
            {oldModel?.name || ''}
          </Typography>
        </Box>

        <Box display='flex' alignItems='center'>
          <Typography className={classes.title}>Usecase</Typography>
          <Typography className={classes.value}>
            {usecase?.name || ''}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ModelDetails;
