import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import api from 'app/api';
import CommonDialog from 'app/components/CommonDialog';
import Button from 'app/components/ReviewButton';
import {
  convertToUtc,
  encodeURL,
  getDatesFromTimeRange
} from 'app/utils/helpers';
import queryString from 'query-string';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getModels } from 'store/common/actions';
import {
  setActiveStep,
  setEditMode,
  setModelName,
  setModelUseCase,
  setNewModel,
  setOldModel,
  setShouldTrainingOpen
} from 'store/modelTraining/actions';
import { DeployModelDialog } from './DeployModelDialog';
import CommonBackdrop from 'app/components/CommonBackdrop';

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(3.75, 0, 1, 0)
  }
}));

const TableActions = ({ drawerClick, selected, handleDelete }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [showDeployDialog, setShowDeployDialog] = useState(null);
  const [showUndeployDialog, setShowUndeployDialog] = useState(false);
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { subscriptionId, packId } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const undeployModel = () => {
    const id = selected?.[0]?.id;

    if (id) {
      api
        .undeployModel(id)
        .then(() => {
          queryClient.invalidateQueries('paginatedModel');
          dispatch(getModels(subscriptionId));
          toast.success('Model undeployed successfully');
        })
        .finally(() => {
          setShowUndeployDialog(false);
        })
        .catch(() => {
          toast.error('Failed to deploy model');
        });
    }
  };

  const handleShowDeployDialog = model => {
    setShowDeployDialog(model);
  };

  const handleShowUndeployDialog = status => {
    setShowUndeployDialog(status);
  };

  const handleShowTerminateDialog = status => {
    setShowTerminateDialog(status);
  };

  const handleShowProgress = row => {
    const trainingSessionId = row[0].training_session;

    if (trainingSessionId) {
      navigate(`training-progress/${trainingSessionId}`);
    }
  };

  const showData = type => {
    const data = getDatesFromTimeRange('ALL_DATE_RANGE');

    const [formatDateStart, formatDateEnd] = [...data];
    const params = queryString.stringify(
      {
        training_ml_model__in: selected.map(row => row.id),
        train_type__in: type,
        date__gte: convertToUtc(formatDateStart),
        date__lte: convertToUtc(formatDateEnd)
      },
      { arrayFormat: 'comma' }
    );

    navigate(`/${subscriptionId}/${packId}/library/data/results?${params}`);
  };

  const undeployDialogActions = [
    {
      text: 'Cancel',
      variant: 'tertiary',
      callback: () => handleShowUndeployDialog(false)
    },
    {
      text: 'Continue',
      callback: undeployModel
    }
  ];

  const handleTerminate = () => {
    api
      .terminateModelProgress(selected[0].training_session)
      .then(res => {
        queryClient.invalidateQueries('paginatedModel');
        toast.success('Session terminated successfully');
      })
      .finally(() => {
        setShowTerminateDialog(false);
      })
      .catch(() => {
        toast.error('Failed to terminate session.');
      });
  };

  const terminateDialogAction = [
    {
      text: 'Cancel',
      variant: 'tertiary',
      callback: () => handleShowTerminateDialog(false)
    },
    {
      text: 'Continue',
      callback: handleTerminate
    }
  ];

  const handleIsViewDetailsClick = row => {
    const trainingSessionId = row[0].training_session;

    if (trainingSessionId) {
      navigate(`training-overview/${trainingSessionId}#viewDetails`);
    }
  };

  const handleViewModelPerformance = id => {
    const params = queryString.stringify({
      contextual_filters: encodeURL(
        { ml_model_id__in: id, date: 'ALL_DATE_RANGE' },
        { arrayFormat: 'comma' }
      )
    });

    navigate(`performance/${id}?${params}`);
  };

  const onDeploy = (id, confidenceThreshold) => async () => {
    setIsLoading(true);

    try {
      await api.deployModel(id, confidenceThreshold);
      queryClient.invalidateQueries('paginatedModel');
      dispatch(getModels(subscriptionId));
      toast.success(`Model deployed successfully`);
    } catch {
      toast.error(`Failed to deploy model. Please try again`);
    } finally {
      setShowDeployDialog(null);
      setIsLoading(false);
    }
  };

  const onCancelDeploy = () => {
    setShowDeployDialog(null);
  };

  return (
    <Grid
      className={classes.header}
      spacing={2}
      container
      alignItems='center'
      justifyContent='flex-start'
    >
      <Grid item>
        <Button
          id='model_lib_btn_Retrain_Model'
          onClick={() => navigate(`retrain/${selected[0].id}`)}
          disabled={
            selected.length !== 1 ||
            (selected.length === 1 &&
              // selected[0].use_case_id === 4 &&
              (selected[0].status === 'draft' ||
                selected[0].status === 'training'))
          }
          text='Retrain Model'
          variant='tertiary'
        />
      </Grid>
      <Grid item>
        <Button
          id='resume_training_data'
          onClick={() => navigate(`resume/${selected[0].training_session}`)}
          disabled={
            selected.length !== 1 ||
            (selected.length === 1 && selected[0].status !== 'draft')
          }
          text='Resume Training Data Creation'
          variant='tertiary'
        />
      </Grid>
      <Grid item>
        <Button
          id='model_lib_btn_view_details'
          onClick={() => handleIsViewDetailsClick(selected)}
          disabled={
            selected.length !== 1 ||
            (selected[0].status !== 'training' &&
              selected[0].status !== 'ready_for_deployment' &&
              selected[0].status !== 'deployed_in_prod' &&
              selected[0].status !== 'training_failed')
          }
          text='View Details'
          variant='tertiary'
        />
      </Grid>
      <Grid item>
        <Button
          id='model_lib_btn_Delete'
          onClick={() => handleDelete(true, selected)}
          disabled={selected.length !== 1}
          text='Delete'
          variant='tertiary'
        />
      </Grid>
      <Grid item>
        <Button
          id='model_lib_btn_Deploy'
          onClick={() => handleShowDeployDialog(selected[0])}
          disabled={
            selected.length !== 1 ||
            selected[0].status !== 'ready_for_deployment'
          }
          text='Deploy'
          variant='tertiary'
        />
      </Grid>
      <Grid item>
        <Button
          id='model_lib_btn_undeploy'
          onClick={() => handleShowUndeployDialog(true)}
          disabled={
            selected.length !== 1 || selected[0].status !== 'deployed_in_prod'
          }
          text='Undeploy'
          variant='tertiary'
        />
      </Grid>
      <Grid item>
        <Button
          id='model_lib_btn_view_performance'
          onClick={() => handleViewModelPerformance(selected[0].id)}
          disabled={
            selected.length !== 1 ||
            selected[0].status === 'draft' ||
            selected[0].status === 'training' ||
            selected[0].status === 'training_failed' ||
            selected[0].status === 'user_terminated'
          }
          text='View Performance'
          variant='tertiary'
        />
      </Grid>
      <Grid item>
        <Button
          id='model_lib_btn_Show_Training_Data'
          onClick={() => showData('TRAIN')}
          disabled={
            selected.length === 0 ||
            selected.map(x => x.status !== 'training_failed').includes(false)
          }
          text='Show Training Data'
          variant='tertiary'
        />
      </Grid>
      <Grid item>
        <Button
          id='model_lib_btn_Show_Progress'
          onClick={() => handleShowProgress(selected)}
          disabled={
            selected.length !== 1 ||
            !selected?.[0]?.training_session ||
            selected?.[0]?.status !== 'training'
          }
          text='Show Progress'
          variant='tertiary'
        />
      </Grid>
      {/* <Grid item>
				<Button
					id="model_lib_btn_Terminate"
					onClick={() => handleShowTerminateDialog(true)}
					disabled={
						selected.length !== 1 ||
						!selected?.[0]?.training_session ||
						selected?.[0]?.status !== 'training'
					}
					text="Terminate"
					variant="tertiary"
				/>
			</Grid> */}
      <Grid item>
        <Button
          id='model_lib_btn_Show_Testing_Data'
          onClick={() => showData('TEST,VALIDATION')}
          disabled={
            selected.length === 0 ||
            selected.map(x => x.status !== 'training_failed').includes(false)
          }
          text='Show Testing Data'
          variant='tertiary'
        />
      </Grid>

      {showTerminateDialog && (
        <CommonDialog
          open={showTerminateDialog}
          message={`Are you sure you want to terminate ${selected?.[0].name} ?`}
          actions={terminateDialogAction}
        />
      )}

      {showDeployDialog && (
        <DeployModelDialog
          model={showDeployDialog}
          onDeploy={onDeploy}
          onCancel={onCancelDeploy}
        />
      )}

      {showUndeployDialog && (
        <CommonDialog
          open={showUndeployDialog}
          message={`Are you sure you want to undeploy ${selected?.[0].name} from prod?`}
          actions={undeployDialogActions}
        />
      )}

      <CommonBackdrop open={isLoading} />
    </Grid>
  );
};

export default TableActions;
