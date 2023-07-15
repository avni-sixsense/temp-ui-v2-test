import { toast } from 'react-toastify';
import { getUserInfo } from 'store/common/actions';

export function debounce(cb, delay = 2000) {
  let timeoutRef;

  const cancel = () => {
    clearTimeout(timeoutRef);
  };

  const debounced = (...args) => {
    const context = this;

    if (timeoutRef) clearTimeout(timeoutRef);
    timeoutRef = setTimeout(() => cb.apply(context, args), delay);
  };

  debounced.cancel = cancel;

  return debounced;
}

export function throttle(cb, delay = 1000) {
  let timeoutRef;
  let flag = true;

  return (...args) => {
    if (flag) {
      if (timeoutRef) clearTimeout(timeoutRef);

      flag = false;

      cb.apply(this, args);

      timeoutRef = setTimeout(() => {
        flag = true;
      }, delay);
    }
  };
}

export function cropText(text, showStartNum = 4, showEndNum) {
  return `${text.slice(0, showStartNum)}...${text.slice(
    -(showEndNum ?? showStartNum)
  )}`;
}

export function handleFileDownload(response) {
  const { headers, data } = response;
  const filename = headers['content-disposition'].split('file_name=')[1];
  const blob = new Blob([data], { type: headers['content-type'] });

  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function getSSSelectId(id) {
  return `select-${id}`;
}

export function arraySwap(arr, idx1, idx2) {
  [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
}

export async function withDefaultUiHandler(
  fn,
  { propagateError = true, successMsg, errorMsg, onError } = {}
) {
  try {
    const data = await fn();

    if (successMsg) toast.success(successMsg);

    return data;
  } catch (error) {
    const errorMessage = errorMsg || error.message;

    if (errorMessage) toast.error(errorMessage);

    onError?.();

    if (propagateError) throw error;
  }
}

export function isWindow() {
  return typeof window !== 'undefined';
}

export function isNumber(d) {
  return Number(d) == d;
}

export const convertDataType = value => {
  return isNumber(value) ? Number(value) : value;
};

export function setUserInfo() {
  const { default: store } = require('store/index');
  const { getState, dispatch } = store;

  const { userInfo } = getState().common;

  if (!Object.keys(userInfo).length) {
    dispatch(getUserInfo());
  }
}

export function snakeCaseToWords(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, m => m.replace('_', ' '))
    .replace(/\b([a-z])/g, m => m.toUpperCase());
}

export function capitalize(str) {
  return str.replace(/^./, str[0].toUpperCase());
}
