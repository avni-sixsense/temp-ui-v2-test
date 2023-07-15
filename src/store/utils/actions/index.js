import { withDefaultUiHandler } from 'app/utils';

export function actionStartType(type) {
  return type + '_START';
}

export function actionSuccessType(type) {
  return type + '_SUCCESS';
}

export function actionFailureType(type) {
  return type + '_FAILURE';
}

export function actionClearType(type) {
  return type + '_CLEAR';
}

export function actionAddType(type) {
  return type + '_ADD';
}

export function actionUpdateByIdType(type) {
  if (type.includes('FETCH')) {
    type = type.replace('FETCH', 'UPDATE');
  } else {
    type = 'UPDATE_' + type;
  }

  return type + '_BY_ID';
}

export function createFromDefaultAsyncAction({
  _reducerName,
  asyncFn,
  withDefaultUiHandlerProps
}) {
  return dispatch =>
    withDefaultUiHandler(async () => {
      try {
        dispatch({ type: actionStartType(_reducerName) });

        const data = await asyncFn();

        dispatch({ type: actionSuccessType(_reducerName), payload: { data } });

        return data;
      } catch (error) {
        dispatch({ type: actionFailureType(_reducerName), payload: { error } });

        throw error;
      }
    }, withDefaultUiHandlerProps);
}

export function createAction(type, payload) {
  if (payload) return { type, payload };
  return { type };
}
