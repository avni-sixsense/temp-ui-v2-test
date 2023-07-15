import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';

const useStyles = makeStyles(theme => ({
  textfield: {
    '& fieldset': {
      border: `1px solid ${theme.colors.grey[3]}`
    },
    '& div:hover fieldset, .Mui-focused fieldset': {
      border: `1px solid ${theme.colors.grey[5]} !important`
    }
  }
}));

const LightTextfield = ({
  value,
  placeholder,
  onChange,
  className,
  variant = 'outlined',
  size = 'small',
  fullWidth,
  multiline = false,
  rows = 1,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <TextField
      value={value}
      fullWidth={fullWidth}
      placeholder={placeholder}
      onChange={onChange}
      className={`${className} ${classes.textfield}`}
      variant={variant}
      size={size}
      multiline={multiline}
      rows={rows}
      {...rest}
    />
  );
};

export default LightTextfield;
