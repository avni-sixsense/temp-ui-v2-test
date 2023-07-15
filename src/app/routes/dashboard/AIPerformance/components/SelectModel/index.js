import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ListboxComponent from 'app/components/Filters/ListboxComponent';
import CustomizedRadio from 'app/components/Radio';
import React, { useEffect, useState } from 'react';

const useStyle = makeStyles(() => ({
  dropDown: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    minWidth: '250px',
    border: ' 1px solid rgba(2, 67, 93, 0.2)',
    boxSizing: 'border-box',
    borderRadius: '3px',
    '& h3': {
      margin: 'auto'
    }
  },
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
    minWidth: '250px',
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
      minWidth: '250px',
      '& .MuiMenu-list': {
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        height: '100%',
        wordBreak: 'break-word'
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
  }
}));

const SelectModel = ({ models = [], page, setPage }) => {
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState({});
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (models.length) {
      const temp = models
        .filter(
          item =>
            item.status === 'deployed_in_prod' ||
            item.status === 'ready_for_deployment'
        )
        .map((model, index) => ({ ...model, index }));
      setOptions(temp);
      if (temp[page]) {
        setValue(temp[page]);
      } else {
        setPage(0);
      }
    }
  }, [models, page, setPage]);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // useEffect(() => {
  // 	if (options.length && value?.index) {
  // 		setPage(value.index)
  // 	}
  // }, [options, setPage, value])

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
    setInputValue('');
  };

  return (
    <Box display='flex'>
      <Box display='flex' mx={2}>
        <Box mx={1} pt={1}>
          <Typography variant='h4'>Model:</Typography>
        </Box>
        <Box
          p={0.5}
          width={250}
          aria-describedby={id}
          className={classes.dropDown}
          type='button'
          onClick={handleClick}
        >
          <Typography variant='h3' className='ss-textClamp'>{`${
            options?.[page]?.name || ''
          }`}</Typography>
          <ExpandMoreIcon fontSize='small' />
        </Box>
        <Menu
          id='model-select'
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
            id='menu-demo'
            disablePortal
            classes={{
              paper: classes.paper,
              option: classes.option,
              popperDisablePortal: classes.popperDisablePortal
            }}
            onChange={(e, newValue) => setPage(newValue.index)}
            value={value}
            defaultValue={options[0]}
            renderTags={() => {}}
            getOptionSelected={option =>
              value ? option.index === page : false
            }
            getOptionLabel={option => option.name || ''}
            ListboxComponent={ListboxComponent}
            options={options}
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
                <CustomizedRadio checked={selected} />
                <Typography variant='caption'>{option.name}</Typography>
              </>
            )}
          />
        </Menu>
      </Box>
    </Box>
  );
};

export default SelectModel;
