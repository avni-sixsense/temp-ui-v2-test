import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { InputAdornment, TextField } from '@material-ui/core';

import classes from './SimilarityThresholdInput.module.scss';

export const SimilarityThresholdInput = ({
  styles = {},
  defaultValue,
  onChange,
  ...rest
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(defaultValue);
    onChange?.(defaultValue);
  }, [defaultValue]);

  const handleValueChange = event => {
    const { value } = event.target;

    if (!isNaN(value) && Number(value) >= 0 && Number(value) <= 100) {
      setValue(value);
      onChange?.(value);
    }
  };

  return (
    <TextField
      size='small'
      variant='outlined'
      InputProps={{
        endAdornment: (
          <InputAdornment className={classes.endAdornment} position='end'>
            %
          </InputAdornment>
        )
      }}
      className={clsx(styles.textField, classes.textField)}
      value={value}
      onChange={handleValueChange}
      {...rest}
    />
  );
};
