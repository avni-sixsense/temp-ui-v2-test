import clsx from 'clsx';

import Show from 'app/hoc/Show';

import classes from './FilterLabel.module.scss';

export const FilterLabel = ({ label, subLabel, theme, values }) => {
  const newValues = Array.isArray(values)
    ? values.length
      ? values.join(', ')
      : 'All'
    : values;

  const isValue = !!values;

  return (
    <span
      className={clsx(
        classes.label,
        theme === 'dark' && classes.darkLabel,
        isValue && classes.labelView
      )}
    >
      {label}

      <Show when={!!subLabel && !isValue}>
        <span className={classes.subLabel}>{subLabel}</span>
      </Show>

      <Show when={isValue}>
        <span className={classes.selectedOptions}>
          <span className={classes.labelValues}>: {newValues}</span>
        </span>
      </Show>
    </span>
  );
};
