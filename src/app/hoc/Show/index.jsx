import { useEffect } from 'react';

const Show = ({ when, children, sad = null }) => {
  useEffect(() => {
    if (typeof sad === 'function' && !when) sad();
  }, [when]);

  if (when) return children;

  return null;
};

export default Show;
