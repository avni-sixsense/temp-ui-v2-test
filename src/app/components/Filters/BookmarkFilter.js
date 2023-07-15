import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

import CustomizedCheckbox from '../Checkbox';
import CommonButton from '../CommonButton';
import ListboxComponent from './ListboxComponent';
import useStyles from './styles';

const BookmarkFilter = ({ data, filterKey }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const filter = useSelector(({ filters }) => filters.bookmark);

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const location = useLocation();
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
      dispatch({
        type: 'APPLY_FILTER',
        field: 'bookmark',
        selected: params.is_bookmarked
          ? params.is_bookmarked === 'false'
            ? ['notBookmarked']
            : ['bookmarked']
          : [],
        param: filterKey
      });
    }
    if (!params.is_bookmarked && filter?.applied.length) {
      if (filter.applied.length === 1) {
        if (filter.applied[0] === 'bookmarked') {
          params.is_bookmarked = true;
        } else {
          params.is_bookmarked = false;
        }
      }
      const newParams = queryString.stringify(params, { arrayFormat: 'comma' });
      setSearchParams(newParams);
    }
  }, [location.search, filter, filterKey]);

  const handleClick = event => {
    const applied = filter?.applied || [];
    if (applied.length) {
      const items = data.filter(item => applied.includes(item.id));
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
    const ids = value.map(v => v.id);
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });

    if (ids.length === 1) {
      if (ids[0] === 'bookmarked') {
        params[filterKey] = true;
      } else {
        params[filterKey] = false;
      }
    } else if (params[filterKey]) {
      delete params[filterKey];
    }

    const newParams = queryString.stringify(
      { ...params },
      { arrayFormat: 'comma' }
    );

    setSearchParams(newParams);

    dispatch({
      type: 'APPLY_FILTER',
      field: 'bookmark',
      selected: ids,
      param: filterKey
    });
    setAnchorEl(null);
  };

  const open = !!anchorEl;

  return (
    <Box mr={4} mb={1} className={classes.item}>
      <Box
        id='filter_bookmark'
        onClick={handleClick}
        aria-controls='bookmark-menu'
        aria-haspopup='true'
        display='flex'
        alignItems='center'
      >
        <Typography variant='h4'>Bookmark</Typography>
        <Box ml={1.5}>
          <Typography variant='h4'>
            <ExpandMoreIcon />
          </Typography>
        </Box>
      </Box>
      {open && (
        <Menu
          id='bookmark-menu'
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
            id='is_bookmarked'
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

export default BookmarkFilter;
