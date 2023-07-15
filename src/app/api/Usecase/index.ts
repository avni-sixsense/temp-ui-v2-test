import { apiCallBack, formatParams } from '../ApiMethods';
import { ENDPOINTS_CONSTANTS } from '../endpoints';
import type {
  createUseCaseType,
  updateUseCaseType,
  Usecase,
  UsecaseFetch,
  UsecaseResponse
} from 'app/api/Usecase/types';

const { endpoint, version } = ENDPOINTS_CONSTANTS.USECASE;

const API_ENDPOINT = `/api/${version}/classif-ai/${endpoint}/`;

export const getUseCases = <T extends LocationParams & UsecaseFetch>(
  params: T
): Promise<UsecaseResponse<Usecase>> => {
  const { allowedKeys, search, ...rest } = params;

  let finalParams = { ...rest, name__icontains: search };
  if (allowedKeys.length) {
    const decodedParams: {
      [x in typeof allowedKeys[number]]: number | string;
    } = formatParams('use_case', allowedKeys);

    finalParams = { ...finalParams, ...decodedParams };
  }

  if (!finalParams.name__icontains) {
    delete finalParams.name__icontains;
  }

  return apiCallBack<typeof finalParams>({
    method: 'GET',
    url: API_ENDPOINT,
    params: finalParams
  }).then(_ => _.data);
};

export const getUseCaseById = <T extends FetchById>({ id }: T) => {
  return apiCallBack({
    method: 'GET',
    url: `${API_ENDPOINT}${id}/`
  }).then(_ => _.data);
};

export const createUseCase = ({ data }: { data: createUseCaseType }) => {
  return apiCallBack({
    method: 'POST',
    url: API_ENDPOINT,
    data
  }).then(_ => _.data);
};

export const updateUseCase = ({ id, data }: updateUseCaseType) => {
  return apiCallBack({
    method: 'PATCH',
    url: `${API_ENDPOINT}${id}/`,
    data
  }).then(_ => _.data);
};

export const defectOrderPriority = <T extends FetchById>({ id }: { id: T }) =>
  apiCallBack({
    method: 'GET',
    url: `${API_ENDPOINT}${id}/defect_priority_order/`
  }).then(_ => _.data);
