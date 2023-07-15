import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getDecodedURL, isSameObject } from 'app/utils/helpers';

type UseObserveLocationProps = string[];

const useObserveLocation = (locationKeys: UseObserveLocationProps) => {
  const location = useLocation();

  const getParamsFromLocation = () => {
    const { decodedContextual, decodedOther, ...rest } = getDecodedURL(
      location.search
    );

    return { ...decodedContextual, ...decodedOther, ...rest };
  };

  const filterLocationParamsFromAllowedKeys = () => {
    const params = getParamsFromLocation();

    return locationKeys
      .filter(key => params[key])
      .reduce((curr, key) => ({ ...curr, [key]: params[key] }), {});
  };

  const [obervableLocationParams, setObservableLocationParams] = useState(
    filterLocationParamsFromAllowedKeys()
  );

  useEffect(() => {
    const updatedLocationParams = filterLocationParamsFromAllowedKeys();
    if (!isSameObject(obervableLocationParams, updatedLocationParams)) {
      setObservableLocationParams(updatedLocationParams);
    }
  }, [location.search]);

  return obervableLocationParams;
};

export default useObserveLocation;
