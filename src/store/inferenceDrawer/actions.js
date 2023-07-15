import { ACTION_CONSTS } from './constants';

export function toggleInferenceModal() {
  return { type: ACTION_CONSTS.TOGGLE_INFERENCE_MODAL };
}

export function setSelectedInferenceSession(data) {
  return { type: ACTION_CONSTS.SET_SELECTED_INFERENCE_SESSION, payload: data };
}

export function setIsDownloadAiDrawer(data) {
  return { type: ACTION_CONSTS.IS_AI_DOWNLOAD_DRAWER, payload: data };
}
