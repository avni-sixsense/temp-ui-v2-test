import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import CommonButton from 'app/components/ReviewButton';
import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import { getParamsObjFromEncodedString } from 'app/utils/helpers';
import { handleCloseModelTraining } from 'app/utils/modelTraining';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import {
  setDialogOpen,
  setDialogVariant,
  setPendingTaskId,
  setTrainingCount
} from 'store/modelTraining/actions';
import {
  selectActiveImg,
  selectDialogVariant,
  selectFileSetData,
  selectNewTrainingModel,
  selectSelectAll,
  selectSelectedDefects,
  selectTrainingUsecase
} from 'store/modelTraining/selector';
import { setActiveImg } from 'store/reviewData/actions';

const useStyles = makeStyles(theme => ({
  root: {
    width: '321px'
  },
  titleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[4]}`
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  details: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  button: {
    marginRight: theme.spacing(1.25)
  },
  subText: {
    fontWeight: 600,
    color: theme.colors.grey[16]
  }
}));

const mapTrainingDialogToState = createStructuredSelector({
  dialogVariant: selectDialogVariant,
  newModel: selectNewTrainingModel,
  selectedDefects: selectSelectedDefects,
  usecase: selectTrainingUsecase,
  activeImg: selectActiveImg,
  fileSetData: selectFileSetData,
  selectAll: selectSelectAll
});

const DialogContainer = () => {
  const classes = useStyles();

  const location = useLocation();
  const navigate = useNavigate();
  const { subscriptionId, packId } = useParams();

  const dispatch = useDispatch();

  const [isBackdropOpen, setIsBackdropOpen] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const {
    dialogVariant,
    newModel,
    selectedDefects,
    usecase,
    activeImg,
    fileSetData,
    selectAll
  } = useSelector(mapTrainingDialogToState);

  const queryClient = useQueryClient();

  const useCaseId = usecase.id;

  const handleClose = () => {
    dispatch(setDialogVariant(null));
    dispatch(setDialogOpen(false));
    setIsBackdropOpen(false);
  };

  const handleCloseWithLoading = () => {
    dispatch(setDialogVariant(null));
    dispatch(setDialogOpen(false));
  };

  const handleCheckbox = event => {
    setCheckBox(event.target.checked);
  };

  const handleCloseScreen = () =>
    handleCloseModelTraining(navigate, subscriptionId, packId);

  const handleTerminate = () => {
    setIsBackdropOpen(true);

    api
      .terminateModelProgress(newModel?.training_session)
      .then(() => {
        handleClose();
        toast.success('Session terminated successfully');
        setTimeout(() => {
          toast.success('Screen will be closed in few seconds.');
        }, 1000);

        setTimeout(() => {
          handleCloseScreen();
        }, 5000);
      })
      .catch(() => {
        handleClose();
        toast.error('Failed to terminate session.');
      });
  };

  const handleRemoveDefectFromTraining = () => {
    setIsBackdropOpen(true);
    api
      .deleteModelDefects(newModel.id, {
        defects: selectedDefects.map(({ id }) => parseInt(id, 10))
      })
      .then(() => {
        if (checkBox) {
          const tempObj = {};
          const fileSetFilters = {};
          fileSetFilters.ground_truth_label__in = selectedDefects
            .map(({ id }) => parseInt(id, 10))
            .join(',');
          tempObj.use_case_id = useCaseId;
          tempObj.ml_model_id = newModel.id;
          tempObj.file_set_filters = fileSetFilters;
          // tempObj.ground_truth_label__in = selectedDefects.map((x) => parseInt(x, 10))
          // const params = queryString.stringify(tempObj, { arrayFormat: 'comma' })
          api
            .removeFilesFromTraining(tempObj)
            .then(() => {
              queryClient.invalidateQueries('fileSets');
              queryClient.invalidateQueries('fileSetCount');

              dispatch(setActiveImg([]));
              dispatch(setTrainingCount(newModel, subscriptionId, useCaseId));
              toast('Images removed from training successfully.');
            })
            .then(() => {
              handleClose();
              queryClient.invalidateQueries('addedDefectsInstances');
              queryClient.invalidateQueries('notAddedDefectsInstances');
            })
            .catch(() => {
              handleClose();
              toast('Something went wrong.');
            });
        } else {
          handleClose();
          queryClient.invalidateQueries('addedDefectsInstances');
          queryClient.invalidateQueries('notAddedDefectsInstances');
        }
        queryClient.invalidateQueries('trainingModelSummary');
      })
      .catch(() => {
        toast.error('Something went wrong.');
        handleClose();
      });
  };

  const handleAddDefectToTraining = () => {
    setIsBackdropOpen(true);
    api
      .addModelDefects(newModel.id, {
        defects: selectedDefects.map(({ id }) => parseInt(id, 10))
      })
      .then(() => {
        handleClose();

        queryClient.invalidateQueries('addedDefectsInstances');
        queryClient.invalidateQueries('notAddedDefectsInstances');
        queryClient.invalidateQueries('trainingModelSummary');

        dispatch(setTrainingCount(newModel, subscriptionId, useCaseId));
      })
      .catch(() => {
        toast.error('Something went wrong.');
        handleClose();
      });
  };

  const handleAddToTraining = (runInBackground = false) => {
    setIsBackdropOpen(true);
    const parsedParams = getParamsObjFromEncodedString(location.search);
    const tempObj = { file_set_filters: parsedParams };
    tempObj.use_case_id = useCaseId;
    tempObj.ml_model_id = newModel.id;
    tempObj.file_set_filters.train_type__in = 'NOT_TRAINED';
    tempObj.file_set_filters.use_case_id__in = `${useCaseId}`;
    tempObj.file_set_filters.training_ml_model__in = `${newModel.id}`;
    tempObj.file_set_filters.is_gt_classified = true;
    if (!selectAll) {
      tempObj.file_set_filters.id__in = activeImg
        .map(x => fileSetData[x]?.fileSetId)
        .join(',');
    }
    api
      .bulkAddToTraining(tempObj)
      .then(res => {
        if (runInBackground) {
          setIsBackdropOpen(false);
          toast('Background task is created to add images to training.');
        } else {
          dispatch(setPendingTaskId(res?.task_id || ''));
        }
        handleCloseWithLoading();
      })
      .catch(() => {
        handleCloseWithLoading();
        setIsBackdropOpen(false);
        toast('Something went wrong.');
      });
  };

  const handleRemoveFromTraining = (runInBackground = false) => {
    setIsBackdropOpen(true);
    const parsedParams = getParamsObjFromEncodedString(location.search);
    const tempObj = { file_set_filters: parsedParams };
    tempObj.use_case_id = useCaseId;
    tempObj.ml_model_id = newModel.id;
    tempObj.file_set_filters.train_type__in = 'TRAIN,TEST,VALIDATION,';
    // TODO: temporary fixes
    tempObj.file_set_filters.use_case_id__in = `${useCaseId}`;
    tempObj.file_set_filters.training_ml_model__in = `${newModel.id}`;
    if (!selectAll) {
      tempObj.file_set_filters.id__in = activeImg
        .map(x => fileSetData[x]?.fileSetId)
        .join(',');
    }
    api
      .bulkRemoveFromTraining(tempObj)
      .then(res => {
        if (runInBackground) {
          setIsBackdropOpen(false);
          toast('Background task is created to remove images from training.');
        } else {
          dispatch(setPendingTaskId(res?.task_id || ''));
        }
        handleCloseWithLoading();
      })
      .catch(() => {
        handleCloseWithLoading();
        setIsBackdropOpen(false);
        toast('Something went wrong.');
      });
  };

  const dialogData = {
    close_training: {
      title: 'Exit training',
      details: 'Progress will be saved after exiting the training.',
      buttons: [
        {
          text: 'Exit',
          variant: 'primary',
          onClick: handleCloseScreen
        },
        {
          text: 'Cancel',
          variant: 'tertiary',
          onClick: handleClose
        }
      ]
    },
    stop_training: {
      title: 'Stop Retraining',
      details: 'All training progress will be lost if you stop retraining.',
      buttons: [
        {
          text: 'Stop Retraining',
          variant: 'negative',
          onClick: handleTerminate
        },
        {
          text: 'Cancel',
          variant: 'tertiary',
          onClick: handleClose
        }
      ]
    },
    remove_defect: {
      title: 'Remove defect Retraining',
      details: 'Do you want to remove',
      detailsSubText: 'from training data.',
      checkBox: 'Remove corresponding images also',
      buttons: [
        {
          text: 'Remove defects',
          variant: 'negative',
          onClick: handleRemoveDefectFromTraining
        },
        {
          text: 'Cancel',
          variant: 'tertiary',
          onClick: handleClose
        }
      ]
    },
    add_defect: {
      title: 'Add defects to Retraining',
      details: 'Do you want to add',
      detailsSubText: 'to training data.',
      buttons: [
        {
          text: 'Add defects',
          variant: 'primary',
          onClick: handleAddDefectToTraining
        },
        {
          text: 'Cancel',
          variant: 'tertiary',
          onClick: handleClose
        }
      ]
    },
    consent_dialog_add: {
      title: 'Add images in Training',
      details: [
        'Adding >50k images can take more than 40 sec. So, either run this task in backgound or wait for task completion.',
        'You can add other images or do another task while this task is running in background.'
      ],
      buttons: [
        {
          text: 'Run in backgound',
          variant: 'primary',
          onClick: () => handleAddToTraining(true)
        },
        {
          text: 'Wait for completion',
          variant: 'tertiary',
          onClick: () => handleAddToTraining(false)
        }
      ]
    },
    consent_dialog_remove: {
      title: 'Remove images from Training',
      details: [
        'Removing >50k images can take more than 40 sec. So, either run this task in backgound or wait for task completion.',
        'You can remove other images or do another task while this task is running in background.'
      ],
      buttons: [
        {
          text: 'Run in backgound',
          variant: 'primary',
          onClick: () => handleRemoveFromTraining(true)
        },
        {
          text: 'Wait for completion',
          variant: 'tertiary',
          onClick: () => handleRemoveFromTraining(false)
        }
      ]
    }
  };

  if (!dialogVariant) {
    return null;
  }

  const { details, detailsSubText = null } = dialogData[dialogVariant];

  return (
    <Dialog
      open
      // onClose={handleClose}
    >
      <Box px={1.25} pt={2.125} pb={1.875} className={classes.root}>
        <Box pb={1.25} mb={1.25} className={classes.titleContainer}>
          <Typography className={classes.title}>
            {dialogData[dialogVariant].title}
          </Typography>
        </Box>

        <Box mb={2.5}>
          {Array.isArray(details) ? (
            details.map(x => (
              <Typography className={classes.details}>{x}</Typography>
            ))
          ) : (
            <Typography className={classes.details}>
              {details}{' '}
              <span className={classes.subText}>
                {selectedDefects.map(d => d.name).join(', ')}{' '}
              </span>
              defects {detailsSubText}
            </Typography>
          )}
        </Box>

        {dialogData[dialogVariant]?.checkBox && (
          <Box mb={1.75}>
            <CustomizedCheckbox
              label={dialogData[dialogVariant].checkBox}
              onChange={handleCheckbox}
              checked={checkBox}
              whiteTheme
              smallLabel
            />
          </Box>
        )}

        <Box display='flex' alignItems='center'>
          {dialogData[dialogVariant].buttons.map((button, index) => (
            <CommonButton
              text={button.text}
              variant={button.variant}
              onClick={button.onClick}
              key={index}
              wrapperClass={classes.button}
            />
          ))}
        </Box>
      </Box>
      <CommonBackdrop open={isBackdropOpen} />
    </Dialog>
  );
};

export default DialogContainer;
