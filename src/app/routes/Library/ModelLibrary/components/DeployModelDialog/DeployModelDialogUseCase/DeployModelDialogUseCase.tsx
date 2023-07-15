import { CircularProgress } from '@material-ui/core';

import useApi from 'app/hooks/useApi';
import WithCondition from 'app/hoc/WithCondition';

import { getUseCaseById } from 'app/api/Usecase';

export const DeployModelDialogUseCase = ({ id }: { id: number }) => {
  const { data = {}, isLoading } = useApi(getUseCaseById, {
    id,
    allowedKeys: []
  });

  return (
    <WithCondition
      when={isLoading}
      then={<CircularProgress size={12} />}
      or={(data as any).name}
    />
  );
};
