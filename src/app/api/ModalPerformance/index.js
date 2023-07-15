import { apiCallBack, formatParams } from '../ApiMethods';

export const getModalAccuracyData = params => {
  const { allowedKeys, ...rest } = params;

  let finalParams = { ...rest };
  if (allowedKeys.length) {
    const decodedParams = formatParams('', allowedKeys);
    // formatParams at last TODO
    finalParams = { ...finalParams, ...decodedParams };
  }

  return apiCallBack({
    method: 'GET',
    url: `/api/v1/classif-ai/classification/metrics/accuracy/`,
    params: finalParams
  }).then(_ => _.data);
};

export const getModalInfo = params => {
  const { modelId } = params;

  return apiCallBack({
    method: 'GET',
    url: `/api/v1/classif-ai/ml-model/${modelId}/`,
    params: {}
  }).then(_ => _.data);
};
