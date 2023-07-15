import { ACTION_CONSTS } from './constants';

export function openCreateDefectDialog(payload) {
  return { type: ACTION_CONSTS.OPEN_CREATE_DEFECT_DIALOG, payload };
}

export function closeCreateDefectDialog() {
  return { type: ACTION_CONSTS.CLOSE_CREATE_DEFECT_DIALOG };
}
