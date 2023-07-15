import { useState, useEffect } from 'react';

const TIMEOUT_DURATION = 1000 * 60 * 10; // 10 Minutes

const useCheckUserActive = () => {
  let timer = null;
  const [isUserActive, setIsUserActive] = useState(true);

  const makeUserInactive = () => {
    setIsUserActive(false);
    removeTimer(timer);
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('keypress', resetTimer);
  };

  const makeUserActive = () => {
    setIsUserActive(true);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    resetTimer(timer);
  };

  const setTimer = () => {
    timer = setTimeout(makeUserInactive, TIMEOUT_DURATION);
  };

  const removeTimer = () => {
    clearTimeout(timer);
  };

  const resetTimer = () => {
    if (!isUserActive) return;

    removeTimer();
    setTimer();
  };

  useEffect(() => {
    if (isUserActive) {
      makeUserActive();
    } else {
      makeUserInactive();
    }

    return () => {
      removeTimer();
    };
  }, [isUserActive]);

  return [isUserActive, makeUserActive];
};

export default useCheckUserActive;
