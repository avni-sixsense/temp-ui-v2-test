/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/aria-role */
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef } from 'react';

import classes from './progress.module.scss';

const MultiHandleProgress = ({
  handles,
  colors = [],
  initialValue,
  setInitialValue,
  onProgressChangeEnd,
  disabled = false
}) => {
  const sliderRef = useRef();
  const sliderCursor = useRef();
  const currentIndex = useRef();
  const dragging = useRef(false);

  const onMouseDown = useCallback((e, index) => {
    e.preventDefault();
    const startPos = sliderRef.current.children[index].offsetLeft;
    const endPos =
      startPos +
      sliderRef.current.children[index].offsetWidth +
      sliderRef.current.children[index + 1].offsetWidth;

    sliderCursor.current = [startPos, endPos];
    currentIndex.current = index;
    dragging.current = true;
  }, []);

  const calculatePercentage = useCallback(value => {
    return Math.round((value * 100) / sliderRef.current.offsetWidth);
  }, []);

  const getUpdatedValue = useCallback((prev, newPos) => {
    const mainBarValue = calculatePercentage(newPos - sliderCursor.current[0]);
    const secondaryBarValue = calculatePercentage(
      sliderCursor.current[1] - newPos
    );
    if (mainBarValue < 1) {
      prev[sliderRef.current.children[currentIndex.current].id] =
        mainBarValue + 1;
      prev[sliderRef.current.children[currentIndex.current + 1].id] =
        secondaryBarValue - 1;
    } else if (secondaryBarValue < 1) {
      prev[sliderRef.current.children[currentIndex.current].id] =
        mainBarValue - 1;
      prev[sliderRef.current.children[currentIndex.current + 1].id] =
        secondaryBarValue + 1;
    } else {
      prev[sliderRef.current.children[currentIndex.current].id] = mainBarValue;
      prev[sliderRef.current.children[currentIndex.current + 1].id] =
        secondaryBarValue;
    }

    return { ...prev };
  }, []);

  const onMove = e => {
    e.preventDefault();

    if (!dragging.current) return;

    const [startPos, endPos] = sliderCursor.current;

    if (e.clientX > startPos && e.clientX < endPos) {
      setInitialValue(getUpdatedValue(initialValue, e.clientX));
    }
  };

  const removeEventListeners = useCallback(() => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, []);

  const onMouseUp = useCallback(e => {
    if (!dragging.current) return;

    e.preventDefault();

    onProgressChangeEnd();

    dragging.current = false;
    sliderCursor.current = null;
    currentIndex.current = null;
  }, []);

  useEffect(() => {
    if (!disabled) {
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMove);
    }

    return () => {
      if (!disabled) removeEventListeners();
    };

    // eslint-disable-next-line
  }, []);

  return (
    <div ref={sliderRef} style={{ display: 'flex' }}>
      {handles.map((item, index) => (
        <div
          key={item}
          className={clsx(classes.progressDiv)}
          style={{
            width: `${initialValue[item]}%`,
            backgroundColor: colors[index] || '#000'
          }}
          id={item}
        >
          {index + 1 < handles.length && (
            <div
              disabled={disabled}
              className={classes.sliderHandler}
              onMouseDown={e => (!disabled ? onMouseDown(e, index) : {})}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MultiHandleProgress;
