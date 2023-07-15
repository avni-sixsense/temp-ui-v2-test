import {
  actionAddType,
  actionUpdateByIdType,
  createAction,
  createFromDefaultAsyncAction
} from 'store/utils/actions';
import { FETCH_USE_CASE_LIST } from 'store/utils/actions/types';

import { DEFAULT_ERROR_MESSAGE } from 'app/constants';
import { getUseCases } from 'app/api/Usecase';
import type { Usecase, UsecaseFetch } from 'app/api/Usecase/types';

type GetUseCaseList = Omit<
  UsecaseFetch,
  'id__in' | 'model_status__in' | 'get_all_records'
> &
  LocationParams;

export function getUseCaseList(params: GetUseCaseList) {
  return createFromDefaultAsyncAction({
    _reducerName: FETCH_USE_CASE_LIST,
    asyncFn: () => getUseCases(params),
    withDefaultUiHandlerProps: { errorMsg: DEFAULT_ERROR_MESSAGE }
  });
}

export function updateUseCaseList(payload: Usecase) {
  return createAction(actionUpdateByIdType(FETCH_USE_CASE_LIST), payload);
}

export function addToUseCaseList(payload: Usecase) {
  return createAction(actionAddType(FETCH_USE_CASE_LIST), payload);
}
