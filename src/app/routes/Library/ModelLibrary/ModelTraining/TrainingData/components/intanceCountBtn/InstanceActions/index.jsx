import { faEye, faPlus, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import CommonButton from 'app/components/ReviewButton';
import {
  converObjArraytoString,
  encodeURL,
  getParamsObjFromEncodedString
} from 'app/utils/helpers';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import store from 'store';
import {
  fetchFileSets,
  getTrainingFileSetApiParams,
  removeSelectedFiles,
  setDialogOpen,
  setDialogVariant,
  setTrainingCount
} from 'store/modelTraining/actions';
import { ADDED_FOR_TRAINING } from 'store/modelTraining/constants';
import {
  selectActiveImg,
  selectActiveTrainingMode,
  selectFileSetData,
  selectSelectAll,
  selectTrainingUsecase
} from 'store/modelTraining/selector';
import { setSelectAll } from 'store/reviewData/actions';
import queryString from 'query-string';
import SelectedInstances from './SelectedInstances';

import ButtonContainer from '../ButtonContainer';

import classes from './InstanceActions.module.scss';

const mapTrainingState = createStructuredSelector({
  mode: selectActiveTrainingMode,
  selectAll: selectSelectAll,
  activeImg: selectActiveImg,
  fileSetData: selectFileSetData,
  usecase: selectTrainingUsecase
});

const InstanceActionContainer = () => {
  const dispatch = useDispatch();

  const location = useLocation();
  const { subscriptionId, packId } = useParams();

  const queryClient = useQueryClient();

  const { mode, selectAll, activeImg, fileSetData, usecase } =
    useSelector(mapTrainingState);

  const useCaseId = usecase.id;

  const [isLoading, setIsLoading] = useState(false);

  const handleBtnClick = () => {
    setIsLoading(true);

    const { count, newModel, fileSetData } = store.getState().modelTraining;

    if (
      (selectAll && count > 50000) ||
      (!selectAll && activeImg.length > 50000)
    ) {
      if (mode === ADDED_FOR_TRAINING) {
        dispatch(setDialogVariant('consent_dialog_remove'));
      } else {
        dispatch(setDialogVariant('consent_dialog_add'));
      }
      setIsLoading(false);
      dispatch(setDialogOpen(true));
    } else {
      const parsedParams = getParamsObjFromEncodedString(location.search);
      if (mode === ADDED_FOR_TRAINING) {
        const tempObj = {};
        let fileSetFilters = parsedParams;

        tempObj.use_case_id = useCaseId;
        tempObj.ml_model_id = newModel.id;

        fileSetFilters.train_type__in = 'TRAIN,TEST,VALIDATION,';
        // TODO: temporary fixes
        fileSetFilters.use_case_id__in = `${useCaseId}`;
        fileSetFilters.ml_model_id = `${newModel.id}`;

        if (!selectAll) {
          fileSetFilters.id__in = activeImg
            .map(x => fileSetData[x]?.fileSetId)
            .join(',');
        }

        fileSetFilters = converObjArraytoString(fileSetFilters);
        tempObj.file_set_filters = fileSetFilters;

        api
          .removeFilesFromTraining(tempObj)
          .then(() => {
            if (selectAll) {
              dispatch(
                fetchFileSets(location.search, mode, subscriptionId, useCaseId)
              );
              dispatch(setSelectAll(false));
            } else {
              dispatch(
                setTrainingCount(location.search, subscriptionId, useCaseId)
              );
              dispatch(removeSelectedFiles());
            }

            queryClient.invalidateQueries('addedDefectsInstances');
            queryClient.invalidateQueries('notAddedDefectsInstances');
            queryClient.invalidateQueries('trainingModelSummary');

            setIsLoading(false);

            toast('Images removed from training successfully.');
          })
          .catch(() => {
            setIsLoading(false);
            toast('Something went wrong.');
          });
      } else {
        const tempObj = {};

        let fileSetFilters = parsedParams;

        tempObj.use_case_id = useCaseId;
        tempObj.ml_model_id = newModel.id;

        fileSetFilters.train_type__in = 'NOT_TRAINED';
        fileSetFilters.training_ml_model__in = `${newModel.id}`;
        fileSetFilters.is_gt_classified = true;
        fileSetFilters.use_case_id__in = `${useCaseId}`;

        if (!selectAll) {
          fileSetFilters.id__in = activeImg.map(x => fileSetData[x]?.fileSetId);
        }

        fileSetFilters = converObjArraytoString(fileSetFilters);
        tempObj.file_set_filters = fileSetFilters;

        api
          .addFilesToTraining(tempObj)
          .then(() => {
            if (selectAll) {
              dispatch(
                fetchFileSets(location.search, mode, subscriptionId, useCaseId)
              );
              dispatch(setSelectAll(false));
            } else {
              dispatch(
                setTrainingCount(location.search, subscriptionId, useCaseId)
              );
              dispatch(removeSelectedFiles());
            }

            queryClient.invalidateQueries('addedDefectsInstances');
            queryClient.invalidateQueries('notAddedDefectsInstances');
            queryClient.invalidateQueries('trainingModelSummary');

            setIsLoading(false);

            toast('Images added to training successfully.');
          })
          .catch(() => {
            setIsLoading(false);
            toast('Something went wrong.');
          });
      }
    }
  };

  const handleReviewClick = () => {
    let params = '';

    if (!selectAll) {
      const fileSetIds = activeImg.map(
        fileIndex => fileSetData[fileIndex].fileSetId
      );

      params = queryString.stringify(
        {
          contextual_filters: encodeURL({
            id__in: fileSetIds,
            date: 'ALL_DATE_RANGE'
          })
        },
        { arrayFormat: 'comma' }
      );
    } else {
      const { activeTrainingMode, usecase } = store.getState().modelTraining;

      const urlParams = getParamsObjFromEncodedString(
        getTrainingFileSetApiParams(location.search, activeTrainingMode)
      );
      urlParams['use_case_id__in'] = usecase.id;

      params = queryString.stringify(
        {
          contextual_filters: encodeURL(urlParams)
        },
        { arrayFormat: 'comma' }
      );
    }

    window.open(
      `/${subscriptionId}/${packId}/annotation/review?${params}`,
      '_blank'
    );
  };

  if (!(activeImg.length || selectAll)) return null;

  return (
    <ButtonContainer>
      <div className={classes.container}>
        <SelectedInstances />
        <CommonButton
          variant='tertiary'
          text='Review'
          icon={<FontAwesomeIcon icon={faEye} />}
          onClick={handleReviewClick}
        />
        <CommonButton
          variant={mode === ADDED_FOR_TRAINING ? 'negative' : 'primary'}
          text={mode === ADDED_FOR_TRAINING ? 'Remove' : 'Add to Training'}
          icon={
            <FontAwesomeIcon
              icon={mode === ADDED_FOR_TRAINING ? faTrash : faPlus}
            />
          }
          onClick={handleBtnClick}
        />
        <CommonBackdrop open={isLoading} />
      </div>
    </ButtonContainer>
  );
};

export default InstanceActionContainer;
