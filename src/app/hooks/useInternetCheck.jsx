import { useEffect, useState } from 'react';

const useInternetCheck = () => {
  const [isOnline, setIsOnline] = useState(true);

  const setOffline = () => {
    setIsOnline(false);
  };

  const setOnline = () => {
    setIsOnline(true);
  };

  useEffect(() => {
    window.addEventListener('offline', setOffline);
    window.addEventListener('online', setOnline);

    return () => {
      window.removeEventListener('offline', setOffline);
      window.removeEventListener('online', setOnline);
    };
  }, []);

  return isOnline;
};

export default useInternetCheck;
