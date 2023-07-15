// import api from 'app/api'
// import axios from 'app/api/base'
// import { getFileSetDefectsFields } from 'app/utils/helpers'

import { SET_SYSTEM_CONFIG_USECASES } from './constants';

export function setConfigUsecases(payload) {
  return { type: SET_SYSTEM_CONFIG_USECASES, payload };
}
