import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import api from 'app/api';
import toString from 'lodash/toString';
import PropType from 'prop-types';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

import CustomizedCheckbox from '../Checkbox';
import CommonButton from '../CommonButton';
import ListboxComponent from './ListboxComponent';
import useStyles from './styles';

const Filter = ({ info }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const date = useSelector(({ filters }) => filters.date);

  const { data = [], isLoading } = useQuery([info.field, date], context =>
    api.getFilters(...context.queryKey)
  );

  const filter = useSelector(({ filters }) => filters[info.field]);

  const [items, setItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (data.length) {
      setItems(data.map(item => item || 'BLANK'));
    }
  }, [data]);

  useEffect(() => {
    const key = `meta_info__${info.field}__in`;
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    if (params[key] && !filter?.applied.length) {
      dispatch({
        type: 'APPLY_FILTER',
        field: info.field,
        selected: Array.isArray(params[key]) ? params[key] : [params[key]],
        param: key
      });
    }
    if (!params[key] && filter?.applied.length) {
      params[key] = filter.applied;
      const newParams = queryString.stringify(params, { arrayFormat: 'comma' });
      setSearchParams(newParams);
    }
  }, [location.search, filter, info.field]);

  const handleClick = event => {
    setValue(filter?.applied || []);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setInputValue('');
    setAnchorEl(null);
  };

  const handleApplyFilter = () => {
    const key = `meta_info__${info.field}__in`;
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    params[key] = value;
    const newParams = queryString.stringify(
      { ...params },
      { arrayFormat: 'comma' }
    );

    setSearchParams(newParams.replace('BLANK', null));

    dispatch({
      type: 'APPLY_FILTER',
      field: info.field,
      selected: value,
      param: `meta_info__${info.field}__in`
    });
    setAnchorEl(null);
  };
  const open = !!anchorEl;

  return (
    <Box mr={4} mb={1} className={classes.item}>
      <Box
        onClick={handleClick}
        aria-controls={`${info.name}-menu`}
        aria-haspopup='true'
        display='flex'
        alignItems='center'
        id={`filter_${info.name
          .split(' ')
          .map(x => x.toLowerCase())
          .join('_')}`}
      >
        <Typography variant='h4'>{info.name}</Typography>
        <Box ml={1.5}>
          <Typography variant='h4'>
            <ExpandMoreIcon />
          </Typography>
        </Box>
      </Box>
      {open && (
        <Menu
          id={`${info.name}-menu`}
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
          open={open}
          onClose={handleClose}
          className={classes.menu}
        >
          <Autocomplete
            loading={isLoading}
            open
            id={info.field}
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
            getOptionLabel={option => toString(option)}
            options={items}
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
              <Box display='flex' alignItems='center'>
                <CustomizedCheckbox
                  checked={selected}
                  styles={{ padding: '0 !important', marginRight: '8px' }}
                />
                <Typography variant='caption'>{option}</Typography>
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

export default Filter;

Filter.propTypes = {
  info: PropType.object.isRequired
};
