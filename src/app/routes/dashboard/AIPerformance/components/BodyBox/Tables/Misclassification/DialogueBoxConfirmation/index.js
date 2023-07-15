import { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { encodeURL, getDateFromParams } from 'app/utils/helpers';
import Box from '@material-ui/core/Box';
import { toast } from 'react-toastify';
import CommonButton from 'app/components/ReviewButton';
import ReviewImage1 from 'assests/images/similar_image.png';
import api from 'app/api';

import { getParamsObjFromEncodedString } from 'app/utils/helpers';

import { useDispatch } from 'react-redux';
import { setMisclassificationImagesRowIds } from 'store/aiPerformance/actions';

const useStyles = makeStyles(theme => ({
  root: {
    width: 360,
    borderRadius: '4px',
    color: `${theme.colors.grey[20]}`
  },
  header: {
    padding: '12px 12px 8px 12px',
    fontSize: 14,
    fontWeight: 600,
    borderBottom: `1px solid ${theme.colors.grey[4]}`
  },
  body: {
    padding: '8px 12px 8px 12px',
    fontSize: 12
  },
  imgContainer: {
    textAlign: 'center',
    padding: '0px 0px 12px 0px'
  },
  footer: {
    padding: 12,
    fontSize: 14,
    display: 'flex',
    background: '#F0F7FF'
  },
  buttonRight: {
    marginLeft: 12
  },
  dark: {
    fontWeight: 600
  }
}));

const DialogueBoxConfirmation = ({
  hideDialogueBox,
  dialogBoxConfig,
  mlModelId
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    gtDefectName,
    modalDefectName,
    modalDefectId,
    gtDefectId,
    modelOrganizationDefectCode,
    gtOrganizationDefectCode,
    id
  } = dialogBoxConfig;
  const modelsDict = useSelector(({ common }) => common.modelsDict);
  const modelName = modelsDict[mlModelId]?.name;
  const [isLoading, setIsLoading] = useState(false);

  const onConfirmationHandler = async () => {
    const fileSetFilters = getDateFromParams(
      window.location.search,
      undefined,
      true
    );

    fileSetFilters['ai_predicted_label__in'] = modalDefectId;
    fileSetFilters['ground_truth_label__in'] = gtDefectId;

    setIsLoading(true);
    try {
      const apiResponse = await api.getSimilarImages({
        file_set_filters: encodeURL(fileSetFilters),
        ml_model_id: mlModelId
      });
      const { task_id } = apiResponse.data;
      dispatch(
        setMisclassificationImagesRowIds({
          id,
          gtDefectName,
          modalDefectName,
          modelOrganizationDefectCode,
          gtOrganizationDefectCode,
          isFetching: true,
          selectedModal: modelName,
          taskId: task_id
        })
      );
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      hideDialogueBox();
    }
  };

  const DIALOGUE_BOX_TEXT = {
    SIMILAR_TRAINING_IMAGES: {
      header: 'Generate similar training images?',
      para: (
        <>
          <p>
            Generate similar training images for the misclassification pair{' '}
            <span className={classes.dark}>
              {modelOrganizationDefectCode} - {modalDefectName} &{' '}
              {gtOrganizationDefectCode} - {gtDefectName}
            </span>{' '}
            of model <span className={classes.dark}>{modelName}</span>.
          </p>
          <span>
            File generation takes some time. Check the progress and download the
            file from the <span className={classes.dark}>Task Bar</span> tab.
          </span>
        </>
      ),
      imageContainer: (
        <Box className={classes.imgContainer}>
          <img src={ReviewImage1} alt='sm' width={178} height={108} />
        </Box>
      ),
      confirmButton: (
        <CommonButton
          disabled={isLoading}
          onClick={onConfirmationHandler}
          text='Generate'
        />
      ),
      cancelButton: (
        <CommonButton
          variant='tertiary'
          wrapperClass={classes.buttonRight}
          onClick={hideDialogueBox}
          text='No, Cancel'
        />
      )
    }
  };

  return (
    <Dialog open>
      <Box className={classes.root}>
        <Box className={classes.header}>
          {DIALOGUE_BOX_TEXT['SIMILAR_TRAINING_IMAGES'].header}
        </Box>
        <Box className={classes.body}>
          {DIALOGUE_BOX_TEXT['SIMILAR_TRAINING_IMAGES'].para}
        </Box>
        {DIALOGUE_BOX_TEXT['SIMILAR_TRAINING_IMAGES'].imageContainer}

        <Box className={classes.footer}>
          {DIALOGUE_BOX_TEXT['SIMILAR_TRAINING_IMAGES'].confirmButton}
          {DIALOGUE_BOX_TEXT['SIMILAR_TRAINING_IMAGES'].cancelButton}
        </Box>
      </Box>
    </Dialog>
  );
};

export default DialogueBoxConfirmation;
