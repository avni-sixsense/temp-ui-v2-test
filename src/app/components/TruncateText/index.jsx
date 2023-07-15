import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import Show from 'app/hoc/Show';

import Tooltip from '@material-ui/core/Tooltip';

import classes from './TruncateText.module.scss';

const handleCopy = (event, value) => {
  event.clipboardData.setData('text/plain', value);
  event.preventDefault();
};

const TruncateText = ({
  label,
  subLabel,
  classNames,
  showToolTip = true,
  tooltipText = null
}) => {
  const ref = useRef();

  const firstLabelLen = useRef(Math.floor((label.length * 70) / 100)).current;
  const lastLabelLen = useRef(label.length - firstLabelLen);

  const [posShift, setPosShift] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const { scrollWidth, offsetWidth, firstElementChild, lastElementChild } =
        ref.current;
      const overflow = scrollWidth - offsetWidth;

      if (overflow) {
        const firstChildWidth = firstElementChild.offsetWidth;
        const lastChildWidth = lastElementChild.offsetWidth;

        if (lastChildWidth > offsetWidth / 2) {
          lastLabelLen.current = 5;
        }

        const parentPadding = 8;

        const gap = offsetWidth - firstChildWidth;
        const shift = scrollWidth - firstChildWidth - gap - parentPadding;

        setPosShift(-shift);
      }
    }
  }, [label, posShift]);

  return (
    <Tooltip title={showToolTip ? tooltipText || label : ''}>
      <div
        ref={ref}
        className={clsx(classNames?.root, classes.truncateText)}
        onCopy={e => handleCopy(e, label)}
      >
        <span className={classes.label1}>
          {label.substring(0, firstLabelLen)}
        </span>

        <span
          className={clsx(classes.label2, {
            [classes.overflow]: posShift !== 0
          })}
          style={{ left: posShift }}
        >
          {label.substring(label.length - lastLabelLen.current, label.length)}

          <Show when={subLabel}>
            <span className={clsx(classNames?.subLabel)}>{subLabel}</span>
          </Show>
        </span>
      </div>
    </Tooltip>
  );
};

export default TruncateText;
