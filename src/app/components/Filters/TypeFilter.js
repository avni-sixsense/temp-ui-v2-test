import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import CustomizedCheckbox from '../Checkbox';
import CommonButton from '../CommonButton';
import ListboxComponent from './ListboxComponent';
import useStyles from './styles';

const TypeFilter = ({ filterKey, data }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const filter = useSelector(({ filters }) => filters.type);

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const location = useLocation();
  const { packId } = useParams();
  const [, setSearchParams] = useSearchParams();

  // useEffect(() => {
  // 	if (data.length) {
  // 		setItems(data.map((item) => item || 'BLANK'))
  // 	}
  // }, [data])

  useEffect(() => {
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    if (params[filterKey] && !filter?.applied.length) {
      if (
        params[filterKey].includes('TEST') &&
        params[filterKey].includes('VALIDATION')
      ) {
        params[filterKey].push('TEST,VALIDATION');
        params[filterKey].splice(params[filterKey].indexOf('TEST'), 1);
        params[filterKey].splice(params[filterKey].indexOf('VALIDATION'), 1);
      }
      dispatch({
        type: 'APPLY_FILTER',
        field: 'type',
        selected: Array.isArray(params[filterKey])
          ? params[filterKey]
          : [params[filterKey]],
        param: filterKey
      });
    }
    if (!params[filterKey] && filter?.applied.length) {
      params[filterKey] = filter.applied;
      const newParams = queryString.stringify(params, { arrayFormat: 'comma' });
      setSearchParams(newParams);
    }
  }, [location.search, filter, filterKey]);

  const handleClick = event => {
    const applied = filter?.applied || [];
    if (applied.length) {
      const items = data.filter(item => applied.includes(item.value));
      setValue(items);
    } else {
      setValue([]);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setInputValue('');
    setAnchorEl(null);
  };

  const handleApplyFilter = () => {
    const ids = value.map(v => v.value);
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    params[filterKey] = ids;
    const newParams = queryString.stringify(
      { ...params, packId },
      { arrayFormat: 'comma' }
    );
    setSearchParams(newParams);
    dispatch({
      type: 'APPLY_FILTER',
      field: 'type',
      selected: ids,
      param: filterKey
    });
    setAnchorEl(null);
  };

  const open = !!anchorEl;

  return (
    <Box mr={4} mb={1} className={classes.item}>
      <Box
        onClick={handleClick}
        aria-controls='type-menu'
        aria-haspopup='true'
        display='flex'
        alignItems='center'
        id={
          location.pathname.includes('results') &&
          location.pathname.includes('data')
            ? 'filter_training_type'
            : 'filter_type'
        }
      >
        <Typography variant='h4'>{`${
          location.pathname.includes('results') &&
          location.pathname.includes('data')
            ? 'Training Type'
            : 'Type'
        }`}</Typography>
        <Box ml={1.5}>
          <Typography variant='h4'>
            <ExpandMoreIcon />
          </Typography>
        </Box>
      </Box>
      {open && (
        <Menu
          id='type-menu'
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
            id={filterKey}
            disablePortal
            width={350}
            multiple
            classes={{
              paper: classes.paper,
              option: classes.option,
              popperDisablePortal: classes.popperDisablePortal
            }}
            onChange={(e, newValue) => setValue(newValue)}
            value={value}
            renderTags={() => {}}
            limitTags={0}
            ListboxComponent={ListboxComponent}
            getOptionLabel={option => option.name}
            getOptionSelected={(option, value) => option.name === value.name}
            inputValue={inputValue}
            onInputChange={(event, value, reason) => {
              if (reason !== 'reset') {
                setInputValue(value);
              }
            }}
            options={data}
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
              <Box display='flex' alignItems='center'>
                <CustomizedCheckbox
                  checked={selected}
                  styles={{ padding: '0 !important', marginRight: '8px' }}
                />
                <Typography variant='caption'>{option.name}</Typography>
              </Box>
            )}
          />
          <Box className={classes.menuItem} p={1}>
            <CommonButton
              variant='primary'
              text='Apply'
              disabled={!value.length}
              onClick={handleApplyFilter}
            />
          </Box>
        </Menu>
      )}
    </Box>
  );
};

export default TypeFilter;
