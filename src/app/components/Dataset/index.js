import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ClickAwayListener,
  IconButton,
  makeStyles,
  Typography
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import InputChipSelect from 'app/components/InputChipSelect';
import clsx from 'clsx';
import React, { useState } from 'react';

import CommonButton from '../ReviewButton';

const filterData = [
  {
    name: 'has any of...',
    value: 'has any of',
    multiSelect: true
  },
  {
    name: 'has all of...',
    value: 'has all of',
    multiSelect: true
  },
  {
    name: 'is exactly...',
    value: 'is exactly',
    multiSelect: false
  },
  {
    name: 'has none of...',
    value: 'has none of',
    multiSelect: true
  }
];

const useStyles = makeStyles(theme => ({
  removeTagIcon: {
    color: `${theme.colors.red[600]} !important`
  },
  paper: {
    backgroundColor: theme.colors.grey[17],
    width: '20.125rem',
    marginTop: theme.spacing(1.25)
  },
  lightPaper: {
    backgroundColor: theme.colors.grey[0],
    border: `1px solid ${theme.colors.grey[6]}`,
    width: '20.125rem',
    marginTop: theme.spacing(1.25),
    borderRadius: '4px'
  },
  header: {
    fontWeight: 600,
    color: theme.colors.grey[0],
    fontSize: '0.9375rem'
  },
  lightHeader: {
    fontWeight: 600,
    color: theme.colors.grey[14],
    fontSize: '0.9375rem'
  },
  closeIcon: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.colors.grey[8]
  },
  lightCloseIcon: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.colors.grey[8]
  },
  headerContainer: {
    borderBottom: `1px solid ${theme.colors.grey[16]}`
  },
  lightHeaderContainer: {
    borderBottom: `1px solid ${theme.colors.grey[4]}`
  },
  popper: {
    zIndex: 999
  },
  lightSelectText: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[12],
    marginBottom: theme.spacing(0.75)
  },
  selectText: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.colors.grey[0],
    marginBottom: theme.spacing(0.75)
  },
  formControl: {
    marginLeft: 0
  },
  actionBtn: {
    marginRight: theme.spacing(1)
  }
}));

const DatasetContainer = ({
  lightTheme = false,
  removeDialog = false,
  data,
  creatableFunc,
  disabled,
  onSubmit,
  text = '',
  size
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [inputChipValue, setInputChipValue] = useState([]);

  const handleBtnClick = event => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleTagsChange = value => {
    if (Array.isArray(value)) {
      setInputChipValue(value);
    } else {
      setInputChipValue(Object.keys(value).length ? [value] : []);
    }
  };

  const handlePopperClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    if (removeDialog) {
      onSubmit(inputChipValue, true);
    } else {
      onSubmit(inputChipValue);
    }
    setInputChipValue([]);
    handlePopperClose();
  };

  return (
    <>
      <Box
        mr={removeDialog ? 0 : 1}
        className={classes.buttonBar}
        display='flex'
        flexWrap='wrap'
      >
        <CommonButton
          text={text}
          size={size}
          variant={lightTheme ? 'tertiary' : 'secondary'}
          onClick={handleBtnClick}
          disabled={disabled}
        />
      </Box>
      {open && (
        <ClickAwayListener onClickAway={handlePopperClose}>
          <Popper
            className={classes.popper}
            placement='bottom-end'
            open={open}
            anchorEl={anchorEl}
            transition
            disablePortal
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper
                  className={clsx({
                    [classes.paper]: !lightTheme,
                    [classes.lightPaper]: lightTheme
                  })}
                >
                  <Box pt={2.125} px={1.25} pb={1.875}>
                    <Box
                      pb={1.25}
                      className={clsx({
                        [classes.headerContainer]: !lightTheme,
                        [classes.lightHeaderContainer]: lightTheme
                      })}
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <Typography
                        className={clsx({
                          [classes.header]: !lightTheme,
                          [classes.lightHeader]: lightTheme
                        })}
                      >
                        {removeDialog
                          ? 'Select a data set to remove images'
                          : 'Select a data set to add images'}
                      </Typography>
                      <IconButton
                        className={clsx({
                          [classes.closeIcon]: !lightTheme,
                          [classes.lightCloseIcon]: lightTheme
                        })}
                        onClick={handlePopperClose}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </IconButton>
                    </Box>
                    <Box pt={1.25}>
                      <Box pb={2.5}>
                        <InputChipSelect
                          data={data}
                          value={inputChipValue}
                          onChange={handleTagsChange}
                          // multiSelect
                          lightTheme={lightTheme}
                          creatable={!removeDialog}
                          creatableFunc={creatableFunc}
                        />
                      </Box>
                      <Box display='flex' alignItems='center'>
                        <CommonButton
                          text={removeDialog ? 'Remove' : 'Add'}
                          variant={removeDialog ? 'negative' : 'primary'}
                          wrapperClass={classes.actionBtn}
                          onClick={handleSubmit}
                          disabled={inputChipValue.length === 0}
                        />
                        <CommonButton
                          text='Cancel'
                          onClick={handlePopperClose}
                          variant={lightTheme ? 'tertiary' : 'secondary'}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Popper>
        </ClickAwayListener>
      )}
    </>
  );
};
export default DatasetContainer;
