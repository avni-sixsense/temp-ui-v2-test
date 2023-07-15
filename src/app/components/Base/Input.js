import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import visibility from 'assests/images/visibility.svg';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    formControl: {
      width: '100%'
    },
    inputLabel: {
      ...theme.typeFace.cabin875,
      lineHeight: 1.86,
      marginBottom: '6px'
    },
    textArea: {
      '& .MuiInputBase-root': {
        ...theme.typeFace.cabin875
      },
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${alpha(theme.colors.marineBlue, 0.2)} `,
      width: '100%',
      // height: '40px',
      transition: theme.transitions.create(['border-color', 'box-shadow'])
    },
    input: {
      'label + &': {
        marginTop: theme.spacing(3)
      },
      '& input': {
        padding: theme.spacing(1.25)
      },
      ...theme.typeFace.cabin875,
      padding: '0px',
      borderRadius: 4,
      height: '40px',
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${alpha(theme.colors.marineBlue, 0.2)} `,
      width: '100%',
      // height: '40px',
      // padding: '10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow'])
      // Use the system font instead of the default Roboto font.
      // '&:focus': {
      // 	boxShadow: `${alpha(
      // 		theme.palette.primary.main,
      // 		0.25
      // 	)} 0 0 0 0.2rem`,
      // 	borderColor: theme.palette.primary.main,
      // },
    }
  })
);

export default function CustomInput({
  label,
  required = false,
  password = false,
  multiline = false,
  name = '',
  value = '',
  onChange,
  error = '',
  ...rest
}) {
  const classes = useStyles();
  const [passwordMask, setPasswordMask] = useState(true);
  const handlePassword = () => {
    setPasswordMask(!passwordMask);
  };

  if (multiline) {
    return (
      <FormControl fullWidth>
        <FormHelperText>
          <Typography variant='caption' className={classes.inputLabel}>
            {label}
            {required && <span style={{ color: 'red' }}>*</span>}
          </Typography>
        </FormHelperText>
        <TextField
          multiline
          rows={4}
          fullWidth
          variant='outlined'
          className={classes.textArea}
          defaultValue='type your message here…'
          {...rest}
        />
      </FormControl>
    );
  }
  return (
    <FormControl className={classes.formControl}>
      <FormHelperText>
        <Typography variant='caption' className={classes.inputLabel}>
          {label}
          {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      </FormHelperText>
      <OutlinedInput
        id={`base-input-${name}`}
        className={classes.input}
        name={name}
        value={value}
        type={password && passwordMask ? 'password' : 'text'}
        onChange={onChange}
        rowsMax={3}
        {...rest}
        endAdornment={
          password && (
            <InputAdornment position='end'>
              <IconButton onClick={handlePassword}>
                <img src={visibility} alt='' />
              </IconButton>
            </InputAdornment>
          )
        }
      />
      {error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
}

CustomInput.defaultValue = {
  required: false,
  password: false,
  multiline: false,
  name: '',
  value: '',
  error: ''
};

CustomInput.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  password: PropTypes.bool,
  multiline: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string
};
