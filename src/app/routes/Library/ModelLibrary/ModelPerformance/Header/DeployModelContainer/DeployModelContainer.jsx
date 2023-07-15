import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import CommonButton from 'app/components/ReviewButton';
import CommonBackdrop from 'app/components/CommonBackdrop';
import CommonDialog from 'app/components/CommonDialog';
import { DeployModelDialog } from '../../../components/DeployModelDialog';

import api from 'app/api';

import { getModels } from 'store/common/actions';

export const DeployModelContainer = ({
  model,
  onDeploySuccess,
  onUndeploySuccess
}) => {
  const [showDeployModelDialog, setShowDeployModelDialog] = useState(false);
  const [showUndeployDialog, setShowUndeployDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { subscriptionId } = useParams();
 
  if (
    !model ||
    (model.status !== 'deployed_in_prod' &&
      model.status !== 'ready_for_deployment' && model.status !== 'retired' )
  ) {
    return null;
  }

  const onDeploy = (id, confidenceThreshold) => async () => {
    setIsLoading(true);

    try {
      await api.deployModel(id, confidenceThreshold);
      queryClient.invalidateQueries('paginatedModel');
      dispatch(getModels(subscriptionId));
      onDeploySuccess();
      toast.success(`Model deployed successfully`);
    } catch {
      toast.error(`Failed to deploy model. Please try again`);
    } finally {
      setShowDeployModelDialog(false);
      setIsLoading(false);
    }
  };

  const onDeployCancel = () => {
    setShowDeployModelDialog(false);
  };

  const undeployModel = () => {
    if (model) {
      setIsLoading(true);

      api
        .undeployModel(model.id)
        .then(() => {
          queryClient.invalidateQueries('paginatedModel');
          dispatch(getModels(subscriptionId));
          onUndeploySuccess();
          toast.success('Model undeployed successfully');
        })
        .catch(() => {
          toast.error('Failed to deploy model');
        })
        .finally(() => {
          setShowUndeployDialog(false);
          setIsLoading(false);
        });
    }
  };

  const undeployDialogActions = [
    {
      text: 'Cancel',
      variant: 'tertiary',
      callback: () => setShowUndeployDialog(false)
    },
    {
      text: 'Continue',
      callback: undeployModel
    }
  ];

  return (
    <>
      {(model.status === 'ready_for_deployment' || model.status === 'retired') && (
        <CommonButton
          text='Deploy Model'
          variant='primary'
          onClick={() => setShowDeployModelDialog(true)}
        />
      )}

      {model.status === 'deployed_in_prod' && (
        <CommonButton
          text='Undeploy Model'
          variant='primary'
          onClick={() => setShowUndeployDialog(true)}
        />
      )}

      {showDeployModelDialog && (
        <DeployModelDialog
          model={model}
          onDeploy={onDeploy}
          onCancel={onDeployCancel}
        />
      )}

      {showUndeployDialog && (
        <CommonDialog
          open={showUndeployDialog}
          message={`Are you sure you want to undeploy ${model.name} from prod?`}
          actions={undeployDialogActions}
        />
      )}

      <CommonBackdrop open={isLoading} />
    </>
  );
};
