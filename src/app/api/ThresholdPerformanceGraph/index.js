import { precedentFilters } from 'app/utils/filters';
import { encodeURL, getDateFromParams } from 'app/utils/helpers';
import { apiCallBack, formatParams } from '../ApiMethods';

export const similarityPerformanceChart = params => {
  const API_ENDPOINT = `/api/v1/classif-ai/classification/metrics/similarity_vs_performance/`;

  const { allowedKeys, ...rest } = params;

  let finalParams = { ...rest };
  if (allowedKeys.length) {
    const decodedParams = formatParams('', allowedKeys);
    finalParams = { ...finalParams, ...decodedParams };
  }

  return apiCallBack({
    method: 'GET',
    url: API_ENDPOINT,
    params: finalParams,
    transformParams: params => {
      return {
        ...params,
        file_set_filters: encodeURL(
          getDateFromParams(
            precedentFilters(params['file_set_filters']) +
              `&ml_model_id__in=${params['ml_model_id']}`,
            undefined,
            true
          )
        )
      };
    }
  }).then(_ => _.data);
};
