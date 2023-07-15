import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles(theme => ({
  textField: {
    maxWidth: 50,
    textAlign: 'left',
    backgroundColor: theme.colors.grey[2],

    '& > div': {
      padding: theme.spacing(0, 0.75),
      margin: '0px !important',
      display: 'flex',
      alignItems: 'center'
    },

    '& input': {
      backgroundColor: theme.colors.grey[2],
      color: theme.colors.grey[16],
      fontSize: '0.875rem',
      fontWeight: 500,
      outline: 'none',
      padding: theme.spacing(0),
      height: 25,

      '&::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0
      },
      '&::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0
      }
    },

    '& fieldset': {
      border: `1px solid ${theme.colors.grey[6]}`,
      borderRadius: 4
    }
  },
  endAdornment: {
    padding: 0,
    margin: 0,
    height: '100%',
    maxHeight: '100%',

    '& > p': {
      fontSize: '0.7rem',
      fontWeight: 500,
      color: theme.colors.grey[16],
      lineHeight: 0
    }
  }
}));

const MAX = 100;
const MIN = 0;

const SimilarityInputUpdate = ({ value, onChange, disabled }) => {
  const classes = useStyles();

  const onChangeHandler = (e) => {
    let newValue = e.target.value;
    if (newValue) {
      let parsedValue = parseInt(e.target.value);
      if (parsedValue > MAX) parsedValue = value;
      if (parsedValue < MIN) parsedValue = MIN;
      onChange(parsedValue);
    } else {
      onChange(newValue);
    }
  }

  return (
    <TextField
      type='number'
      value={value}
      onChange={onChangeHandler}
      className={classes.textField}
      size='small'
      variant='outlined'
      InputProps={{
        inputMode: 'numeric', pattern: '[0-9]*',
        inputProps: {
          max: 100, min: 0
        },
        endAdornment: (
          <InputAdornment className={classes.endAdornment} position='end'>
            %
          </InputAdornment>
        )
      }}
      disabled={disabled}
    />
  );
};

export { SimilarityInputUpdate };
