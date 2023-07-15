import { createPortal } from 'react-dom';

const Portal = ({ children, portalId }) => {
  return createPortal(children, document.getElementById(portalId));
};

export default Portal;
