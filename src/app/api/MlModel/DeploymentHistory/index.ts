import { formateFileSetFiltersForApi } from 'app/utils/helpers';
import { apiCallBack, formatParams } from '../../ApiMethods';
import { ENDPOINTS_CONSTANTS } from '../../endpoints';
import type {
  FetchModelDeploymentHistory,
  ModelDeploymentHistoryResponse,
  UnitType
} from 'app/api/MlModel/DeploymentHistory/types';

const { endpoint, version } = ENDPOINTS_CONSTANTS.ML_MODEL_DEPLOYMENT_HISTORY;

const API_ENDPOINT = `/api/${version}/classif-ai/${endpoint}/`;

export const getModelDeploymentHistory = <
  T extends FetchModelDeploymentHistory & UnitType
>(
  params: T
): Promise<ModelDeploymentHistoryResponse[]> => {
  const { allowedKeys, unit, ...rest } = params;

  let finalParams = { ...rest };
  if (allowedKeys.length) {
    const decodedParams: {
      [x in typeof allowedKeys[number]]: number | string;
    } = formatParams('ml_model', allowedKeys);
    finalParams = {
      ...finalParams,
      file_set_filters: decodedParams
    };
  }

  return apiCallBack<Omit<FetchModelDeploymentHistory, 'allowedKeys'>>({
    method: 'GET',
    url: `${API_ENDPOINT}${unit}/`,
    params: finalParams,
    transformParams: formateFileSetFiltersForApi
  }).then(_ => _.data);
};
