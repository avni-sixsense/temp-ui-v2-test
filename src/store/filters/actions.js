/* eslint-disable import/prefer-default-export */
import api from 'app/api';

export function loadFoldeFilter(subscriptionId) {
  return function (dispatch) {
    return api.getDistinctUploadSessions('', subscriptionId).then(_ => {
      const x = {};
      _.forEach(entry => {
        x[entry.id] = entry;
      });
      dispatch({ type: 'SET_FOLDER_DICT', dict: x });
      dispatch({ type: 'SET_FOLDER_VALUES', dict: _ });
    });
  };
}
