import { formateFileSetFiltersForApi } from 'app/utils/helpers';
import { apiCallBack, formatParams } from '../../ApiMethods';
import { ENDPOINTS_CONSTANTS } from '../../endpoints';
import type {
  DistributionAccuracyData,
  DistributionAccuracyWaferData,
  DistributionTableResponse,
  FetchDistributionAccuracyData
} from './types';

const { endpoint, version } = ENDPOINTS_CONSTANTS.UAT;

const API_ENDPOINT = `/api/${version}/classif-ai/${endpoint}/`;

export const getDistributionClassificationAccuracyImage = <
  T extends LocationParams & FetchDistributionAccuracyData
>(
  params: T
): Promise<DistributionTableResponse<DistributionAccuracyData>> => {
  const { allowedKeys, ...rest } = params;

  let finalParams = { ...rest };
  if (allowedKeys.length) {
    const decodedParams: {
      [x in typeof allowedKeys[number]]: number | string;
    } = formatParams('', allowedKeys);
    finalParams = {
      ...finalParams,
      file_set_filters: decodedParams
    };
  }

  return apiCallBack<FetchDistributionAccuracyData>({
    method: 'GET',
    url: `${API_ENDPOINT}metrics/`,
    params: finalParams,
    transformParams: formateFileSetFiltersForApi
  }).then(_ => _.data);
};

export const getDistributionClassificationAccuracyWafer = <
  T extends LocationParams & FetchDistributionAccuracyData
>(
  params: T
): Promise<DistributionAccuracyWaferData[]> => {
  const { allowedKeys, ...rest } = params;

  let finalParams = { ...rest };
  if (allowedKeys.length) {
    const decodedParams: {
      [x in typeof allowedKeys[number]]: number | string;
    } = formatParams('', allowedKeys);
    finalParams = {
      ...finalParams,
      file_set_filters: decodedParams
    };
  }

  return apiCallBack<FetchDistributionAccuracyData>({
    method: 'GET',
    url: `${API_ENDPOINT}wafer-map/metrics/`,
    params: finalParams,
    transformParams: formateFileSetFiltersForApi
  }).then(_ => _.data);
};
