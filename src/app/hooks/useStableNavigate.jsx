import { useContext } from 'react';

import { StableNavigateContext } from 'context/StableNavigateContext';

const useStableNavigate = () => {
  const navigateRef = useContext(StableNavigateContext);

  if (navigateRef.current === null)
    throw new Error('StableNavigate context is not initialized');

  return navigateRef.current;
};

export default useStableNavigate;
