import React, { memo } from 'react';

import classes from './SSRadioGroup.module.scss';

const SSRadioGroup = ({
  config,
  options,
  disabled = false,
  direction = 'row'
}) => {
  return (
    <div
      className={classes.radioGroup}
      disabled={disabled}
      direction={direction}
    >
      {options.map(({ value, label }) => {
        const id = `${label}_${value}`;

        return (
          <div
            className={classes.radioContainer}
            key={value}
            onClick={e =>
              config.onChange(e.currentTarget.childNodes[0].value, config.key)
            }
          >
            <input
              id={id}
              type='radio'
              value={value}
              checked={value === config.value}
              className={classes.radioBtn}
              readOnly
            />

            <label className={classes.label} htmlFor={id}>
              {label}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default memo(
  SSRadioGroup,
  (prevProps, nextProps) =>
    nextProps.config.value === prevProps.config.value &&
    nextProps.disabled === prevProps.disabled
);
