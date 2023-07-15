import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import api from 'app/api';
import NoDefectConfirmation from './NoDefectConfirmation';
import { getDefect } from 'store/reviewData/actions';
import { getCurrentModelFromState } from 'app/utils/reviewData';
import styles from './NoDefectContainer.module.scss';
import {
  selectActiveFileSetDefects,
  selectIsNoDefect,
  selectFileSetId
} from 'store/reviewData/selector';

import { createStructuredSelector } from 'reselect';
import { toast } from 'react-toastify';

const mapReviewState = createStructuredSelector({
  activeFileSetsDefects: selectActiveFileSetDefects,
  isNoDefect: selectIsNoDefect,
  fileSetId: selectFileSetId
});

const NoDefectContainer = () => {
  const [isDialogBoxHidden, setIsDialogBoxHidden] = useState(false);
  const { activeFileSetsDefects, isNoDefect, fileSetId } =
    useSelector(mapReviewState);

  const dispatch = useDispatch();

  const isGTDetection = activeFileSetsDefects['gt_detections'];
  const detectionRegions =
    activeFileSetsDefects['gt_detections']?.['detection_regions'];

  const toggleDialogBox = () =>
    setIsDialogBoxHidden(isDialogBoxHidden => !isDialogBoxHidden);

  const onChangehandler = () => {
    if (!isGTDetection) {
      // create the ground truth
      const fileId = activeFileSetsDefects.id;

      try {
        api
          .addUserDetection({
            is_no_defect: true,
            file: fileId,
            user: 1,
            detection_regions: []
          })
          .then(() => {
            dispatch(getDefect([fileSetId], getCurrentModelFromState()));
          });
      } catch {
        toast('Something went wrong.');
      }
    } else if (detectionRegions.length) {
      toggleDialogBox();
    } else if (isNoDefect) {
      // Delete the GT
      const gtDetectionId = activeFileSetsDefects.gt_detections.id;
      try {
        api.deleteUserDetection(gtDetectionId).then(() => {
          dispatch(getDefect([fileSetId], getCurrentModelFromState()));
        });
      } catch {
        toast('Something went wrong.');
      }
    } else {
      // set defect to true
      const fileId = activeFileSetsDefects.id;
      const gtDetectionId = activeFileSetsDefects.gt_detections.id;
      try {
        api
          .updateUserDetection(gtDetectionId, {
            is_no_defect: true,
            file: fileId,
            user: 1,
            detection_regions: []
          })
          .then(() => {
            dispatch(getDefect([fileSetId], getCurrentModelFromState()));
          });
      } catch {
        toast('Something went wrong.');
      }
    }
  };

  const subTitle = (
    <span className={styles.subtitleContainer}>
      If image has no defect signature, then mark as No Defect.
    </span>
  );

  return (
    <div>
      <CustomizedCheckbox
        checked={isNoDefect}
        onChange={onChangehandler}
        label='No Defect'
        subtitle={subTitle}
      />
      {isDialogBoxHidden && (
        <NoDefectConfirmation toggleDialogBox={toggleDialogBox} />
      )}
    </div>
  );
};

export default NoDefectContainer;
