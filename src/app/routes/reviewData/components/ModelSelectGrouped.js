import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CustomizedCheckbox from 'app/components/Checkbox';
import CommonButton from 'app/components/CommonButton';
import CustomizedRadio from 'app/components/Radio';
import toString from 'lodash/toString';
import React, { useEffect, useState } from 'react';

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
  width = 350,
  height = 44,
  multiSelect = false,
  selected = {},
  disabled = false,
  loading = false,
  fileSet,
  handleApplyAllClick,
  handleApplyForSingleClick,
  isLoading = false
}) => {
  const classes = useStyles({ width, height });
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [tempModel, setTempModel] = useState(selected);

  const handleModelChange = model => {
    setTempModel(model);
  };

  useEffect(() => {
    if (Object.keys(selected).length > 0) {
      setValue(selected);
    } else {
      setValue(null);
    }
  }, [selected, fileSet]);

  const handleClick = event => {
    if (selected && Object.keys(selected).length > 0) {
      setValue(selected);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setInputValue('');
    setAnchorEl(null);
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
        className={classes.button}
      >
        <span className='ss-textClamp'>
          {multiSelect ? getDisplayString() : value?.name || value}
        </span>
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
      >
        <Autocomplete
          open
          id='review-model-select'
          disablePortal
          freeSolo
          width={width}
          multiple={multiSelect}
          classes={{
            paper: classes.paper,
            option: classes.option,
            popperDisablePortal: classes.popperDisablePortal
          }}
          onChange={(e, newValue) => {
            handleModelChange(newValue);
            setValue(newValue);
          }}
          value={value}
          renderTags={() => {}}
          limitTags={0}
          getOptionLabel={option => toString(option?.name)}
          getOptionSelected={(option, value) => option?.id === value.id}
          options={models}
          groupBy={option => option?.group}
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
                className={classes.inputBase}
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
              <Typography variant='caption'>{option?.name}</Typography>
            </>
          )}
        />
        {models.length > 0 && (
          <Box display='flex'>
            <Box m={1} width={150}>
              <CommonButton
                wrapperClass={classes.modelBtn}
                text='Apply for this Image'
                disabled={!tempModel}
                onClick={() => {
                  handleApplyForSingleClick(fileSet?.id, tempModel);
                  handleClose();
                }}
              />
            </Box>
            <Box m={1} width={150}>
              <CommonButton
                wrapperClass={classes.modelBtn}
                text='Apply for all Images'
                disabled={!tempModel}
                onClick={() => {
                  handleApplyAllClick(fileSet?.use_case, tempModel);
                  handleClose();
                }}
              />
            </Box>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default ModelSelect;
