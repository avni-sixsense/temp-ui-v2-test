import clsx from 'clsx';
import React from 'react';
// import PropTypes from 'prop-types';

import classes from './Label.module.scss';

const FONT_WEIGHT_CONSTANTS = {
  400: 'normal',
  500: 'medium',
  600: 'bold'
};

const Label = ({
  label,
  variant = 'primary',
  size = 'small',
  fontWeight = '400',
  uppercase = false,
  className = null,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        classes[variant],
        classes[size],
        classes[FONT_WEIGHT_CONSTANTS[fontWeight]],
        {
          [classes.uppercase]: uppercase
        },
        className && className
      )}
      {...rest}
    >
      {label}
    </div>
  );
};

export default Label;

// HELP: IT WILL BE USE WHILE ADDING TYPESCRIPT

// Label.prototype = {
//   label: PropTypes.string.isRequired,
//   size: PropTypes.arrayOf(
//     PropTypes.oneOf(['xxLarge', 'xLarge', 'large', 'medium', 'small', 'xSmall', 'xxSmall])
//   ),
//   variant: PropTypes.arrayOf(
//     PropTypes.oneOf([
//       'primary',
//       'secondary',
//       'tertiary',
//       'error'
//     ]).isRequired
//   ),
//   fontWeight: PropTypes.arrayOf(PropTypes.oneOf(['400', '500', '600']))
// };
