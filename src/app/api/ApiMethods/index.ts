import {
  converObjArraytoString,
  getParamsObjFromEncodedString
} from 'app/utils/helpers';
import type { Method } from 'axios';
import { axiosInstance } from '../axiosConfig';

export type MethodTypes = Method;

export type ApiParams<T, K> = {
  url: string;
  method: MethodTypes;
  data?: K;
  params?: T & { signal?: AbortSignal };
  transformParams?: (params: T) => T;
};

export const formatParams = (
  apiId: string,
  allowedKeys: Array<string> = []
) => {
  const decodedParams: {
    [x in typeof allowedKeys[number]]: string | number;
  } = converObjArraytoString(
    getParamsObjFromEncodedString(window.location.search)
  );

  if (allowedKeys.length) {
    const removableKeys = Object.keys(decodedParams).filter(
      key => !allowedKeys.includes(key)
    );
    removableKeys.forEach(key => delete decodedParams[key]);
  }

  if (decodedParams[`${apiId}_id__in`]) {
    decodedParams.id__in = decodedParams[`${apiId}_id__in`];
    delete decodedParams[`${apiId}_id__in`];
  }

  return decodedParams;
};

export const apiCallBack = <T, K = {}>({
  url,
  method,
  data,
  params,
  transformParams
}: ApiParams<T, K>) => {
  let signal;

  if (params?.signal) {
    signal = params.signal;
    delete params.signal;
  }

  if (params && transformParams) {
    params = transformParams(structuredClone(params)) as typeof params;
  }

  return axiosInstance({ method, data, url, params, signal });
};
