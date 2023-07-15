import { createContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const StableNavigateContext = createContext(null);

const StableNavigateContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  return (
    <StableNavigateContext.Provider value={navigateRef}>
      {children}
    </StableNavigateContext.Provider>
  );
};

export { StableNavigateContext, StableNavigateContextProvider };
