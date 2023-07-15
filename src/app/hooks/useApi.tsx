import { useEffect, useRef, useState } from 'react';

import useObserveLocation from './useObserveLocation';

import { isSameObject } from 'app/utils/helpers';

const API_STATUS = {
  IDLE: 'idle',
  SUCCESS: 'success',
  ERROR: 'error',
  FAILED: 'failed',
  LOADING: 'loading'
};

type ApiOptions = {
  enabled: boolean;
};

type UseApiResponse<K> = {
  data: K | undefined;
  isIdle: boolean;
  isLoading: boolean;
  isError: boolean;
  isFailed: boolean;
  isSuccess: boolean;
  refetch: Function;
};

const DEFAULT_API_OPTIONS = { enabled: true };

const useApi = <T extends LocationParams, K>(
  asyncFn: Function,
  { allowedKeys, ...rest }: T,
  { enabled }: ApiOptions = DEFAULT_API_OPTIONS
): UseApiResponse<K> => {
  const [apiStatus, setApiStatus] = useState(
    enabled ? API_STATUS.LOADING : API_STATUS.IDLE
  );

  const locationObserver = useObserveLocation(allowedKeys);

  const apiParamsRef = useRef<null | typeof rest>(null);
  const locationObserverRef = useRef<null | typeof locationObserver>(null);
  const dataRef = useRef<K | undefined>(undefined);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchData = async (controller: AbortController) => {
    setApiStatus(API_STATUS.LOADING);

    try {
      const data: K = await asyncFn({
        allowedKeys,
        signal: controller.signal,
        ...apiParamsRef.current
      });

      dataRef.current = data;
      setApiStatus(API_STATUS.SUCCESS);
    } catch (error) {
      setApiStatus(API_STATUS.ERROR);
    }
  };

  const abort = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  };

  const fetchApiControllor = () => {
    if (!controllerRef.current) {
      controllerRef.current = new AbortController();
      fetchData(controllerRef.current);
    }
  };

  const refetchApi = () => {
    if (enabled) {
      abort();
      fetchApiControllor();
    }
  };

  useEffect(() => {
    return abort;
  }, []);

  useEffect(() => {
    if (enabled) {
      if (
        !isSameObject(apiParamsRef.current, rest) ||
        !isSameObject(locationObserver, locationObserverRef.current)
      ) {
        apiParamsRef.current = rest;
        locationObserverRef.current = locationObserver;

        abort();
        fetchApiControllor();
      }
    } else if (controllerRef.current) {
      apiParamsRef.current = null;
      locationObserverRef.current = null;

      abort();
    }
  }, [locationObserver, enabled, rest]);

  return {
    data: dataRef.current,
    isIdle: apiStatus === API_STATUS.IDLE,
    isLoading: apiStatus === API_STATUS.LOADING,
    isError: apiStatus === API_STATUS.ERROR,
    isFailed: apiStatus === API_STATUS.FAILED,
    isSuccess: apiStatus === API_STATUS.SUCCESS,
    refetch: refetchApi
  };
};

export default useApi;
