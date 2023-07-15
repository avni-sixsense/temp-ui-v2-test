import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Label from 'app/components/Label';
import InputChipSelect from 'app/components/InputChipSelect';
import CommonButton from 'app/components/ReviewButton';

import WithCondition from 'app/hoc/WithCondition';
import Show from 'app/hoc/Show';

import { faQuestionCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress } from '@material-ui/core';

import {
  clearUserClassification,
  getUserClassification,
  handleUserClassificationChange
} from 'store/reviewData/actions';
import { openCreateDefectDialog } from 'store/createDefectDialog/actions';

import {
  selectActiveFileSet,
  selectFileSetDefects,
  selectGTClassification,
  selectIsUserClassificationLoading,
  selectOtherDefects,
  selectIsNoDefectClassification
} from 'store/reviewData/selector';

import classes from './UserClassification.module.scss';

const mapReviewState = createStructuredSelector({
  GTDefects: selectGTClassification,
  isNoDefectClassification: selectIsNoDefectClassification,
  fileSet: selectActiveFileSet,
  otherDefects: selectOtherDefects,
  fileSetDefects: selectFileSetDefects,
  isUserClassificationLoading: selectIsUserClassificationLoading
});

const UserClassificationContainer = ({ useCase }) => {
  const dispatch = useDispatch();

  const { annotationType, subscriptionId, packId } = useParams();

  const userInfo = useSelector(({ common }) => common.userInfo);

  const {
    GTDefects,
    fileSet,
    otherDefects,
    fileSetDefects,
    isUserClassificationLoading,
    isNoDefectClassification
  } = useSelector(mapReviewState);

  useEffect(() => {
    if (fileSet.id && useCase?.type !== 'DETECTION') {
      dispatch(getUserClassification(fileSet.id));
    }

    return () => {
      dispatch(clearUserClassification(fileSet.id));
    };
  }, [fileSet.id, useCase]);

  const handleSubmit = () => {
    window.open(`/${subscriptionId}/${packId}/library/defect`, '_blank');
  };

  const isUpdatedByAdmin =
    fileSetDefects[fileSet?.files?.[0].id]?.gt_classifications
      ?.is_created_by_admin ?? false;

  const creatableFunc = value => {
    dispatch(openCreateDefectDialog({ name: value }));
  };

  const onChangeDefect = defect => {
    handleUserClassificationChange(defect, annotationType);
  };

  const buttonClickHandler = () => {
    handleUserClassificationChange(GTDefects, annotationType);
  };

  return (
    <div className={classes.userClassification}>
      <Label label='Label' fontWeight={600} />

      <WithCondition
        when={isUserClassificationLoading}
        then={<CircularProgress size={32} />}
        or={
          <InputChipSelect
            multiSelect={useCase?.classification_type === 'MULTI_LABEL'}
            value={GTDefects}
            onChange={onChangeDefect}
            data={otherDefects || []}
            shortcutKey='l'
            secondaryColor={isUpdatedByAdmin}
            disabled={isUpdatedByAdmin && !userInfo?.is_staff}
            showBtn={
              GTDefects &&
              GTDefects.length > 0 &&
              !isUpdatedByAdmin &&
              userInfo?.is_staff
            }
            handleButtonClick={buttonClickHandler}
            creatable
            creatableText='+ Create New Label'
            creatableFunc={creatableFunc}
            clearInputOnCreatable
          />
        }
      />

      <CommonButton
        icon={<FontAwesomeIcon icon={faQuestionCircle} />}
        onClick={handleSubmit}
        variant='secondary'
      />

      <Show when={isUpdatedByAdmin}>
        <Label
          label='*Only admins can update the Label.'
          variant='secondary'
          className={classes.info}
        />
      </Show>
    </div>
  );
};

export default UserClassificationContainer;
