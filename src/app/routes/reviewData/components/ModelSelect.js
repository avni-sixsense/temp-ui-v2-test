import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CustomizedCheckbox from 'app/components/Checkbox';
import ListboxComponent from 'app/components/Filters/ListboxComponent';
import CustomizedRadio from 'app/components/Radio';
import clsx from 'clsx';
import toString from 'lodash/toString';
import { memo, useEffect, useState } from 'react';

const useStyles = makeStyles(() => ({
  inputBase: {
    paddingTop: '8px',
    '& .MuiAutocomplete-inputRoot': {
      width: '90%',
      margin: 'auto'
    },
    '& .MuiAutocomplete-endAdornment': {
      display: 'none'
    },
    '& .MuiInput-underline:after': {
      borderBottom: '1px solid #E8EDF1'
    },
    '& .MuiInput-underline:before': {
      borderBottom: '1px solid #E8EDF1'
    }
  },
  paper: {
    minWidth: props => `${props.width - 10}px`,
    boxShadow: 'none',
    margin: 0
  },
  option: {
    minHeight: 'auto',
    padding: 0,
    paddingLeft: '0px !important',
    '&[aria-selected="true"]': {
      backgroundColor: 'transparent'
    },
    '&[data-focus="true"]': {
      backgroundColor: 'transparent'
    },
    '& .MuiAutocomplete-option': {
      paddingLeft: '0px'
    }
  },
  popperDisablePortal: {
    position: 'relative'
  },
  menu: {
    '& .MuiMenu-paper': {
      boxShadow: '-3px 2px 30px rgba(0, 0, 0, 0.14)',
      borderRadius: '3px',
      border: '1px solid #E8EDF1',
      minWidth: props => `${props.width - 10}px`,
      '& .MuiMenu-list': {
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        height: '100%'
      }
    }
  },
  menuItem: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '&:focus': {
      backgroundColor: 'transparent'
    }
  },
  search: {
    width: '80%',
    border: 'none',
    borderBottom: '0.5px solid #E3E3E3',
    fontSize: '12px',
    lineHeight: '32px',
    color: '#000000',
    opacity: 0.5
  },
  button: {
    background: '#FFFFFF',
    width: props => `${props.width - 10}px`,
    height: props => `${props.height - 10}px`,
    '& .MuiButton-endIcon': {
      marginLeft: 'auto'
    }
  }
}));

const ModelSelect = ({
  models,
  onChange,
  width = 350,
  height = 44,
  multiSelect = false,
  selected = null,
  disabled = false,
  loading = false,
  placeholder,
  styles = {},
  defaultValue
}) => {
  const classes = useStyles({ width, height });

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(defaultValue ? defaultValue : []);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!selected) return;
    if (!multiSelect) {
      setValue([selected]);
    } else if (multiSelect) {
      setValue(selected || []);
    }
  }, [selected]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setInputValue('');
    setAnchorEl(null);
  };

  const handleChange = newValue => {
    if (multiSelect) {
      onChange(newValue);
      setValue(newValue);
    } else {
      onChange(newValue[0] || {});
      setValue(newValue[0] ? [newValue[0]] : []);
      handleClose();
    }
  };

  const getDisplayString = () => {
    let s = value
      .map(item => item.name)
      .sort((a, b) => {
        return a.length - b.length || a.localeCompare(b);
      })
      .slice(0, 2)
      .join(', ');
    s += value.length > 2 ? ` +${value.length - 2} more` : '';
    return s;
  };

  return (
    <>
      <Button
        variant='outlined'
        disabled={disabled}
        endIcon={<ExpandMoreIcon />}
        onClick={handleClick}
        className={clsx(classes.button, styles.button)}
      >
        {!value.length && placeholder ? (
          <span className={clsx('ss-textClamp', styles.placeholder)}>
            {placeholder}
          </span>
        ) : (
          <span className='ss-textClamp'>{getDisplayString()}</span>
        )}
      </Button>

      <Menu
        id='review-model-menu'
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        className={classes.menu}
        classes={{ paper: styles.menu }}
      >
        <Autocomplete
          open
          id='review-model-select'
          disablePortal
          freeSolo
          width={width}
          multiple
          classes={{
            paper: clsx(classes.paper, styles.autoComplete),
            option: classes.option,
            popperDisablePortal: classes.popperDisablePortal
          }}
          onChange={(e, newValue, reason) => {
            handleChange(newValue.reverse());
          }}
          value={value}
          renderTags={() => { }}
          limitTags={0}
          ListboxComponent={ListboxComponent}
          getOptionLabel={option => toString(option.name)}
          getOptionDisabled={option => option.name === 'Non Visible Defects'}
          getOptionSelected={(option, value) => option.id === value.id}
          options={models}
          loading={loading}
          inputValue={inputValue}
          onInputChange={(event, value, reason) => {
            if (reason !== 'reset') {
              setInputValue(value);
            }
          }}
          renderInput={params => {
            return (
              <TextField
                {...params}
                variant='standard'
                placeholder='Search'
                className={clsx(classes.inputBase, styles.inputBase)}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' || event.key === 'Delete') {
                    event.stopPropagation()
                  }
                }}
              />
            );
          }}
          renderOption={(option, { selected }) => (
            <>
              {multiSelect ? (
                <CustomizedCheckbox checked={selected} />
              ) : (
                <CustomizedRadio checked={selected} />
              )}
              <Typography variant='caption'>{option.name}</Typography>
            </>
          )}
        />
      </Menu>
    </>
  );
};

export default memo(ModelSelect, (prevProps, nextProps) => {
  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.loading === nextProps.loading &&
    prevProps.selected === nextProps.selected &&
    prevProps.models === nextProps.models
  );
});
