import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { createStructuredSelector } from 'reselect';
import {
  selectActiveFileSetDefects,
  selectFileSetId
} from 'store/reviewData/selector';

import { makeStyles } from '@material-ui/core/styles';
import { getDefect } from 'store/reviewData/actions';

import { getCurrentModelFromState } from 'app/utils/reviewData';
import Box from '@material-ui/core/Box';
import api from 'app/api';
import CommonButton from 'app/components/ReviewButton';
import styles from '../NoDefectContainer.module.scss';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.colors.grey[17],
    width: 300,
    borderRadius: '4px'
  },
  header: {
    color: theme.colors.grey[1],
    padding: '12px 12px 8px 12px',
    fontSize: 14,
    fontWeight: 600,
    borderBottom: '1px solid #1C2A42'
  },
  body: {
    color: theme.colors.grey[8],
    padding: '8px 12px 12px 8px',
    fontSize: 14
  },
  footer: {
    color: theme.colors.grey[8],
    padding: 12,
    fontSize: 14,
    backgroundColor: theme.colors.grey[18],
    display: 'flex'
  }
}));

const mapReviewState = createStructuredSelector({
  activeFileSetsDefects: selectActiveFileSetDefects,
  fileSetId: selectFileSetId
});

const NoDefectConfirmation = ({ toggleDialogBox }) => {
  const { activeFileSetsDefects, fileSetId } = useSelector(mapReviewState);

  const dispatch = useDispatch();

  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  const onConfirmationHandler = async () => {
    const gtDetectionId = activeFileSetsDefects.gt_detections.id;
    const fileId = activeFileSetsDefects.gt_detections.file;
    setIsLoading(true);

    try {
      api
        .updateUserDetection(gtDetectionId, {
          is_no_defect: true,
          file: fileId,
          detection_regions: []
        })
        .then(res => {
          dispatch(getDefect([fileSetId], getCurrentModelFromState()));
        });
    } catch {
      toast('something went wrong.');
    }

    setIsLoading(false);

    toggleDialogBox();
  };

  return (
    <Dialog open>
      <Box className={classes.root}>
        <Box className={classes.header}>Mark selected image as No Defect?</Box>
        <Box className={classes.body}>
          <p>Defect boxes and assigned defect labels will be removed.</p>
          <p>
            Do you want to mark this image as{' '}
            <span className={styles.pText}>no defect?</span>
          </p>
        </Box>
        <Box className={classes.footer}>
          <CommonButton
            onClick={onConfirmationHandler}
            wrapperClass={styles.buttonWrapper}
            text='Yes, mark as No Defect'
            disabled={isLoading}
          />
          <CommonButton
            variant='secondary'
            wrapperClass={styles.buttonWrapper}
            onClick={toggleDialogBox}
            text='No, cancel'
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default NoDefectConfirmation;
