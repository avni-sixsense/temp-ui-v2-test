import { ACTION_CONSTS } from './constants';

export function setToken(token) {
  return { type: ACTION_CONSTS.SET_TOKEN, payload: token };
}
