import { apiCallBack } from '../ApiMethods';
import type { Defect } from '../Usecase/types';
import { ENDPOINTS_CONSTANTS } from '../endpoints';
import type { DefectResponse, GetUsecaseDefects } from './types';

const { endpoint, version } = ENDPOINTS_CONSTANTS.DEFECTS;

const API_ENDPOINT = `/api/${version}/classif-ai/${endpoint}/`;

export const getUsecaseDefects = <T extends GetUsecaseDefects>(
  params: T
): Promise<DefectResponse<Defect>> => {
  return apiCallBack({
    method: 'GET',
    url: `${API_ENDPOINT}`,
    params: params
  }).then(_ => _.data);
};
