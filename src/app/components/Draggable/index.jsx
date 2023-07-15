import { useCallback, useEffect, useState } from 'react';

import Portal from '../Portal';

import classes from './Draggable.module.scss';

const DragMove = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ dx: 0, dy: 0 });

  const onMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onMouseMove = useCallback(e => {
    e.preventDefault();
    setPos(d => ({ dx: d.dx + e.movementX, dy: d.dy + e.movementY }));
  }, []);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const addEventListeners = useCallback(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  const removeEventListeners = useCallback(() => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, []);

  useEffect(() => {
    if (isDragging) {
      addEventListeners();
    }

    return () => {
      removeEventListeners();
    };
  }, [isDragging]);

  return (
    <Portal portalId='widget'>
      <div
        className={classes.draggable}
        data-dragging={isDragging}
        onMouseDown={onMouseDown}
        style={{ transform: `translateX(${pos.dx}px) translateY(${pos.dy}px)` }}
      >
        {children}
      </div>
    </Portal>
  );
};

export default DragMove;
