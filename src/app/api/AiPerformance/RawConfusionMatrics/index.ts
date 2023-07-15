import { formateFileSetFiltersForApi } from 'app/utils/helpers';
import { apiCallBack, formatParams } from '../../ApiMethods';
import { ENDPOINTS_CONSTANTS } from '../../endpoints';
import type {
  RawConfusionMatricsResponse,
  RawConfusionMatricsParams,
  FetchDistributionAccuracyCohort,
  WaferCohortResponse,
  folderCohortResponse,
  FetchFolderLevelDistributionAccuracyData,
  DistributionTableResponse,
  FolderLevelDistributionAccuracyData,
  WaferLevelDistributionAccuracyData
} from './types';

const { endpoint, version } = ENDPOINTS_CONSTANTS.RAW_CONFUSION_MATRICS;

const API_ENDPOINT = (id: number) =>
  typeof endpoint === 'function'
    ? `/api/${version}/classif-ai/${endpoint(id)}/`
    : `/api/${version}/classif-ai/${endpoint}/`;

export const getRawConfusionMatrics = <T extends RawConfusionMatricsParams>(
  params: T
): Promise<RawConfusionMatricsResponse> => {
  const { allowedKeys, mlModelId, ...rest } = params;

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

  return apiCallBack<typeof rest>({
    method: 'GET',
    url: `${API_ENDPOINT(mlModelId)}confusion-matrix/raw/`,
    params: finalParams,
    transformParams: formateFileSetFiltersForApi
  }).then(({ data }) => {
    const { confusion_matrix, defects } = data;
    return {
      confusion_matrix,
      defects: {
        ...Object.keys(defects).reduce(
          (prev, curr) => ({
            ...prev,
            [curr]: {
              ...defects[curr],
              name: defects[curr]?.defect_name || '',
              id: curr
            }
          }),
          {}
        ),
        '-1': {
          id: -1,
          defect_name: 'Unknown',
          name: 'Unknown',
          is_trained_defect: true,
          organization_defect_code: null
        }
      }
    };
  });
};

export const getFolderLevelDistributionAccuracy = <
  T extends LocationParams & FetchFolderLevelDistributionAccuracyData
>(
  params: T
): Promise<DistributionTableResponse<FolderLevelDistributionAccuracyData>> => {
  const { allowedKeys, mlModelId, ...rest } = params;

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

  return apiCallBack<
    Omit<FetchFolderLevelDistributionAccuracyData, 'mlModelId'>
  >({
    method: 'GET',
    url: `${API_ENDPOINT(mlModelId)}upload-session/metrics/`,
    params: finalParams,
    transformParams: formateFileSetFiltersForApi
  }).then(_ => _.data);
};

export const getUATWaferLevelDistributionAccuracy = <
  T extends LocationParams & FetchFolderLevelDistributionAccuracyData
>(
  params: T
): Promise<DistributionTableResponse<WaferLevelDistributionAccuracyData>> => {
  const { allowedKeys, mlModelId, ...rest } = params;

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

  return apiCallBack<
    Omit<FetchFolderLevelDistributionAccuracyData, 'mlModelId'>
  >({
    method: 'GET',
    url: `${API_ENDPOINT(mlModelId)}wafer-map/metrics/`,
    params: finalParams,
    transformParams: formateFileSetFiltersForApi
  }).then(_ => _.data);
};

export const getOnDemandWaferLevelDistributionAccuracy = <
  T extends LocationParams & FetchFolderLevelDistributionAccuracyData
>(
  params: T
): Promise<DistributionTableResponse<WaferLevelDistributionAccuracyData>> => {
  const { allowedKeys, mlModelId, ...rest } = params;

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

  return apiCallBack<
    Omit<FetchFolderLevelDistributionAccuracyData, 'mlModelId'>
  >({
    method: 'GET',
    url: `${API_ENDPOINT(mlModelId)}daily-operations/wafer-map/metrics/`,
    params: finalParams,
    transformParams: formateFileSetFiltersForApi
  }).then(_ => _.data);
};

export const getFolderLevelDistributionAccuracyCohort = <
  T extends LocationParams & FetchDistributionAccuracyCohort
>(
  params: T
): Promise<Array<folderCohortResponse>> => {
  const { allowedKeys, mlModelId, ...rest } = params;

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

  return apiCallBack<Omit<FetchDistributionAccuracyCohort, 'mlModelId'>>({
    method: 'GET',
    url: `${API_ENDPOINT(mlModelId)}upload-session/metric-cohorts/`,
    params: finalParams,
    transformParams: formateFileSetFiltersForApi
  }).then(_ => _.data);
};

export const getUATWaferLevelDistributionAccuracyCohort = <
  T extends LocationParams & FetchDistributionAccuracyCohort
>(
  params: T
): Promise<Array<WaferCohortResponse>> => {
  const { allowedKeys, mlModelId, ...rest } = params;

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

  return apiCallBack<Omit<FetchDistributionAccuracyCohort, 'mlModelId'>>({
    method: 'GET',
    url: `${API_ENDPOINT(mlModelId)}wafer-map/metric-cohorts/`,
    params: finalParams,
    transformParams: formateFileSetFiltersForApi
  }).then(_ => _.data);
};

export const getOnDemandWaferLevelDistributionAccuracyCohort = <
  T extends LocationParams & FetchDistributionAccuracyCohort
>(
  params: T
): Promise<Array<WaferCohortResponse>> => {
  const { allowedKeys, mlModelId, ...rest } = params;

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

  return apiCallBack<Omit<FetchDistributionAccuracyCohort, 'mlModelId'>>({
    method: 'GET',
    url: `${API_ENDPOINT(mlModelId)}daily-operations/wafer-map/metric-cohorts/`,
    params: finalParams,
    transformParams: formateFileSetFiltersForApi
  }).then(_ => _.data);
};
