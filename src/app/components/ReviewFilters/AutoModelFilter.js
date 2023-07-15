import { faCheck, faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Autocomplete from '@material-ui/lab/Autocomplete';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

// import CommonButton from '../CommonButton'
// import CustomizedRadio from '../Radio'
import ListboxComponent from './ListboxComponent';
import useStyles from './styles';

const AutoModelFilter = ({ filterKey, data, isLoading, lightTheme }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const filter = useSelector(({ filters }) => filters.autoModel);

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [groupedModels, setGroupedModels] = useState([]);

  const location = useLocation();
  const { packId } = useParams();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (data.length && data.length !== groupedModels.length) {
      const tempModel = data.map(x => {
        return { ...x, group: 'Manual' };
      });
      setGroupedModels([
        { name: 'Auto', id: 'AutoModel', group: 'Auto' },
        ...tempModel
      ]);
    }
  }, [data, groupedModels.length]);

  useEffect(() => {
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    if (params.auto_model_selection && !filter?.applied.length) {
      dispatch({
        type: 'APPLY_FILTER',
        field: 'autoModel',
        selected: ['AutoModel'],
        param: 'auto_model_selection'
      });
    } else if (params[filterKey] && !filter?.applied.length) {
      dispatch({
        type: 'APPLY_FILTER',
        field: 'autoModel',
        selected: [params[filterKey]],
        param: filterKey
      });
    }
    if (
      !params.auto_model_selection &&
      filter?.applied.length &&
      filter?.applied?.[0] === 'AutoModel'
    ) {
      params.auto_model_selection = true;
      delete params[filterKey];
      const newParams = queryString.stringify(params, { arrayFormat: 'comma' });
      setSearchParams(newParams);
    } else if (
      !params[filterKey] &&
      filter?.applied.length &&
      filter?.applied?.[0] !== 'AutoModel'
    ) {
      params[filterKey] = filter.applied;
      delete params.auto_model_selection;
      const newParams = queryString.stringify(params, { arrayFormat: 'comma' });
      setSearchParams(newParams);
    }
  }, [location.search, filter, filterKey]);

  const handleClick = event => {
    const applied = filter?.applied;
    if (applied?.length && applied?.[0] !== 'AutoModel') {
      const items = data.filter(item => applied.includes(item.id));
      setValue(items?.[0] || {});
    } else if (applied?.[0] === 'AutoModel') {
      setValue(groupedModels?.[0]);
    } else {
      setValue({});
    }
    setAnchorEl(event.currentTarget);
  };

  // const handleClose = () => {
  // 	setInputValue('')
  // 	setAnchorEl(null)
  // }

  const handleApplyFilter = () => {
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    if (value.id === 'AutoModel') {
      delete params[filterKey];
      params.auto_model_selection = true;
    } else {
      delete params.auto_model_selection;
      params[filterKey] = value.id;
    }

    const newParams = queryString.stringify(
      { ...params, packId },
      { arrayFormat: 'comma' }
    );
    setSearchParams(newParams);
    if (params.auto_model_selection) {
      dispatch({
        type: 'APPLY_FILTER',
        field: 'autoModel',
        selected: ['AutoModel'],
        param: 'auto_model_selection'
      });
    } else if (params[filterKey]) {
      dispatch({
        type: 'APPLY_FILTER',
        field: 'autoModel',
        selected: [value.id],
        param: filterKey
      });
    }
    setAnchorEl(null);
    setInputValue('');
  };
  const open = !!anchorEl;

  return (
    <Box mr={4} className={lightTheme ? classes.lightItem : classes.item}>
      <Box
        onClick={handleClick}
        aria-controls='model-menu'
        aria-haspopup='true'
        display='flex'
        alignItems='center'
      >
        <Typography>Model</Typography>
        <FontAwesomeIcon icon={faChevronDown} />
        {/* <Box ml={1.5}>
					<Typography >
						<ExpandMoreIcon />
					</Typography>
				</Box> */}
      </Box>
      {open && (
        <Menu
          id='model-menu'
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
          onClose={handleApplyFilter}
          classes={{
            paper: lightTheme ? classes.lightMenuPaper : classes.menuPaper,
            list: classes.menuList
          }}
        >
          <Autocomplete
            open
            loading={isLoading}
            id={filterKey}
            disablePortal
            width={350}
            classes={{
              paper: lightTheme ? classes.lightPaper : classes.paper,
              option: lightTheme ? classes.lightOption : classes.option,
              popperDisablePortal: lightTheme
                ? classes.lightPopperDisablePortal
                : classes.popperDisablePortal
            }}
            onChange={(e, newValue) => setValue(newValue)}
            value={value}
            renderTags={() => {}}
            limitTags={0}
            ListboxComponent={ListboxComponent}
            getOptionLabel={option => option.name || ''}
            inputValue={inputValue}
            onInputChange={(event, value, reason) => {
              if (reason !== 'reset') {
                setInputValue(value);
              }
            }}
            options={groupedModels}
            // groupBy={(option) => option?.group}
            renderInput={params => {
              return (
                <TextField
                  {...params}
                  variant='outlined'
                  placeholder='Search'
                  size='small'
                  className={
                    lightTheme ? classes.lightInputBase : classes.inputBase
                  }
                />
              );
            }}
            renderOption={(option, { selected }) => (
              <Box
                px={0.5}
                py={0}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                width='100%'
                style={{ color: '#3B82F6', fontSize: '0.875rem' }}
              >
                <Tooltip title={option.name}>
                  <Typography className={classes.label}>
                    {(option?.name || '').length > 35
                      ? `${option.name.slice(0, 13)}...${option.name.slice(
                          option.name.length - 13
                        )}`
                      : option.name}
                  </Typography>
                </Tooltip>
                {selected && <FontAwesomeIcon icon={faCheck} />}
              </Box>
            )}
          />
          {/* <Box className={classes.menuItem} p={1}>
						<CommonButton
							variant="primary"
							text="Apply"
							disabled={!value || Object.keys(value).length === 0}
							onClick={handleApplyFilter}
						/>
					</Box> */}
        </Menu>
      )}
    </Box>
  );
};

export default AutoModelFilter;
