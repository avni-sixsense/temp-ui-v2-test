import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import api from 'app/api';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import CustomizedCheckbox from '../Checkbox';
import CommonButton from '../CommonButton';
import ListboxComponent from './ListboxComponent';
import useStyles from './styles';

const info = {
  field: 'folder',
  name: 'Folder'
};

const FolderFilter = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { subscriptionId } = useParams();

  const date = useSelector(({ filters }) => filters.date);

  const { data = [], isLoading } = useQuery(
    ['distinctUploadSessions', subscriptionId, date],
    context => api.getDistinctUploadSessions(...context.queryKey),
    { enabled: !!subscriptionId && !!date }
  );

  const filter = useSelector(({ filters }) => filters.folder);

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (data.length) {
      dispatch({ type: 'SET_FOLDER_DICT', data });
    }
  }, [data, dispatch]);

  useEffect(() => {
    const key = `upload_session_id__in`;
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    if (params[key] && !filter?.applied.length) {
      dispatch({
        type: 'APPLY_FILTER',
        field: 'folder',
        selected: Array.isArray(params[key]) ? params[key] : [params[key]],
        param: key
      });
    }
    if (!params[key] && filter?.applied.length) {
      params[key] = filter.applied;
      const newParams = queryString.stringify(params, { arrayFormat: 'comma' });
      setSearchParams(newParams);
    }
  }, [location.search, filter]);

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
    const key = 'upload_session_id__in';
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    params[key] = value.map(v => v.id);
    const newParams = queryString.stringify(
      { ...params },
      { arrayFormat: 'comma' }
    );
    setSearchParams(newParams);
    dispatch({
      type: 'APPLY_FILTER',
      field: info.field,
      selected: value.map(item => item.id),
      param: 'upload_session_id__in'
    });
    setAnchorEl(null);
  };
  const open = !!anchorEl;
  return (
    <Box mr={4} mb={1} className={classes.item}>
      <Box
        id='filter_folder'
        onClick={handleClick}
        aria-controls={`${info.name}-menu`}
        aria-haspopup='true'
        display='flex'
        alignItems='center'
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
            open
            id='virtualize-demo'
            disablePortal
            loading={isLoading}
            multiple
            classes={{
              paper: classes.paper,
              option: classes.option,
              popperDisablePortal: classes.popperDisablePortal
            }}
            onChange={(e, newValue) => setValue(newValue)}
            value={value}
            renderTags={() => {}}
            ListboxComponent={ListboxComponent}
            getOptionLabel={option => option.name}
            options={data}
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
                <Typography variant='caption'>{`${option.name} (${option.file_set_count})`}</Typography>
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

export default FolderFilter;
