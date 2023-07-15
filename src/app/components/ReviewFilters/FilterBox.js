import {
  faCheck,
  faChevronDown,
  faTimes,
  faTimesCircle
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Menu,
  Popper,
  TextField,
  Typography
} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react';
import clsx from 'clsx';
import CommonButton from 'app/components/ReviewButton';

import ListboxComponent from './ListboxComponent';
import useStyles from './styles';

const FilterBox = ({
  lightTheme,

  data,
  onClose,
  id,
  isLoading,
  title = '',
  titleGetter = 'name',
  OptionComponent,
  loadFileSets = () => {},
  itemcount,
  isItemLoaded,
  handleSearch,
  isLoadingMoreData = false,
  search,
  value,
  setValue,
  disabled,
  disabledText,
  clearFilter = false,
  onClearFilter
}) => {
  const classes = useStyles();
  const [popperAnchorEl, setPopperAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    if (disabled) {
      setPopperAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    onClose();
    handleSearch('');
    setAnchorEl(null);
    setPopperAnchorEl(null);
  };
  const onInputChange = val => {
    handleSearch(val);
  };

  const open = !!anchorEl;
  const popperOpen = !!popperAnchorEl;
  return (
    <Box mr={1} className={lightTheme ? classes.lightItem : classes.item}>
      <Box
        onClick={handleClick}
        aria-controls={`${title}-menu`}
        aria-haspopup='true'
        display='flex'
        alignItems='center'
      >
        {(value?.length === 0 || (isLoading && value?.length > 0)) && (
          <Typography>{title}</Typography>
        )}
        {isLoading && <CircularProgress size={10} />}
        {!isLoading && value?.length === 1 && (
          <Typography>{`${title}: ${value.map(
            x => x?.[titleGetter] || ''
          )}`}</Typography>
        )}
        {!isLoading && value?.length > 1 && (
          <Typography>
            {title}
            <span
              className={
                lightTheme ? classes.lightfilterCount : classes.filterCount
              }
            >
              {value?.length}
            </span>
          </Typography>
        )}

        <FontAwesomeIcon icon={faChevronDown} />
      </Box>
      {popperOpen && (
        <ClickAwayListener onClickAway={handleClose}>
          <Popper
            placement='bottom-end'
            open={popperOpen}
            anchorEl={popperAnchorEl}
            transition
            disablePortal
            className={
              lightTheme ? classes.lightPopperFilter : classes.popperFilter
            }
          >
            <Box
              display='flex'
              alignItems='center'
              className={
                lightTheme
                  ? classes.lightAIoutputFilter
                  : classes.AIoutputFilter
              }
            >
              <Typography>{disabledText}</Typography>
              <FontAwesomeIcon icon={faTimes} onClick={handleClose} />
            </Box>
          </Popper>
        </ClickAwayListener>
      )}
      {open && (
        <Menu
          id={`${title}-menu`}
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
          classes={{
            paper: lightTheme ? classes.lightMenuPaper : classes.menuPaper,
            list: classes.menuList
          }}
        >
          <Autocomplete
            open
            loading={isLoading || isLoadingMoreData}
            id={id}
            disablePortal
            width={350}
            multiple
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
            ListboxProps={{
              loadFileSets,
              total: itemcount,
              isItemLoaded,
              isLoading: isLoadingMoreData
            }}
            getOptionLabel={option => option[titleGetter]}
            getOptionSelected={(option, value) => option?.id === value?.id}
            filterOptions={x => x}
            inputValue={search}
            onInputChange={(event, value, reason) => {
              if (reason !== 'reset') {
                onInputChange(value);
              }
            }}
            // onInputChange={handleSearch}
            options={data}
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
            renderOption={(option, { selected }) => {
              if (OptionComponent) {
                return (
                  <OptionComponent
                    option={option}
                    selected={selected}
                    classes={classes}
                  />
                );
              }
              return (
                <Box
                  px={0.5}
                  py={0}
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  width='100%'
                  style={{ color: '#3B82F6', fontSize: '0.875rem' }}
                >
                  <Tooltip title={option[titleGetter]}>
                    <Typography className={classes.label}>
                      {(option[titleGetter] || '').length > 30
                        ? `${option[titleGetter].slice(0, 13)}...${option[
                            titleGetter
                          ].slice(option[titleGetter].length - 13)}`
                        : option[titleGetter]}
                    </Typography>
                  </Tooltip>
                  {selected && <FontAwesomeIcon icon={faCheck} />}
                </Box>
              );
            }}
          />
          {/* <Box className={classes.menuItem} p={1}>
                    <CommonButton
                        variant="primary"
                        text="Apply"
                        disabled={!value.length}
                        onClick={handleApplyFilter}
                    />
                </Box> */}
        </Menu>
      )}
      {clearFilter && (
        <CommonButton
          icon={<FontAwesomeIcon icon={faTimesCircle} />}
          size='xs'
          wrapperClass={clsx(classes.clearFilterBtn, 'ml-1')}
          variant={lightTheme ? 'tertiary' : 'secondary'}
          onClick={onClearFilter}
        />
      )}
    </Box>
  );
};

export default FilterBox;
