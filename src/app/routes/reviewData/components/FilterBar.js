import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomizedCheckbox from 'app/components/Checkbox';
import CommonButton from 'app/components/CommonButton';
import CustomizedRadio from 'app/components/Radio';
import React, { useState } from 'react';

const useStyle = makeStyles(theme => ({
  root: {
    '& button': {
      '& span': {
        color: '#02435D',
        fontSize: '14px'
      }
    },
    '& .dropdown-menu': {
      maxHeight: '275px',
      overflowY: 'auto',
      '& .dropdown-header': {
        color: '#02435D',
        fontSize: '10px',

        fontWeight: 'normal'
      },
      '& .form-check-label': {
        color: '#02435D',
        fontSize: '14px'
      }
    }
  },
  chip: {
    margin: theme.spacing(0, 0.5)
  },
  aiChip: {
    background: '#FFFFFF'
  },
  borderDotted: {
    border: '2px dotted #10EA80'
  },
  borderSolid: {
    border: '2px solid #10EA80'
  },
  otherChip: {
    background: '#F1FAFE',
    border: 0
  },
  button: {
    background: '#FFFFFF',
    '& .MuiButton-endIcon': {
      marginLeft: 'auto'
    }
  },
  menu: {
    height: '370px',
    '& .MuiRadio-root': {
      padding: '6px'
    },
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
    padding: theme.spacing(0, 0, 0, 1),
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '&:focus': {
      backgroundColor: 'transparent'
    }
  }
}));

const FilterBar = ({
  model,
  aiDefects,
  otherDefects,
  handleAiDefectChange,
  handleOtherDefectChange,
  noDefect,
  setNoDefect,
  showBtn,
  handleConfirmBtn,
  setShowConfirmBtn
}) => {
  // console.log({
  // 	model,
  // 	aiDefects,
  // 	otherDefects,
  // 	handleAiDefectChange,
  // 	handleOtherDefectChange,
  // 	noDefect,
  // 	setNoDefect,
  // 	showBtn,
  // 	handleConfirmBtn,
  // 	setShowConfirmBtn,
  // })
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNoDefectChange = value => {
    setNoDefect(value);
    setShowConfirmBtn(value);
  };

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display='flex' px={2} py={1}>
      <Box display='flex' flexWrap='wrap' flexGrow={1}>
        <Button
          variant='outlined'
          endIcon={<ExpandMoreIcon />}
          className={classes.button}
          onClick={handleClick}
        >
          Select Record Level Tags
        </Button>
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
          {model ? (
            model.type !== 'CLASSIFICATION' ? (
              <MenuItem>
                <CustomizedRadio
                  checked={noDefect}
                  onChange={() => handleNoDefectChange(!noDefect)}
                />
                <Typography variant='caption'>Non visible defect</Typography>
              </MenuItem>
            ) : (
              <div>
                <MenuItem>
                  <Typography>AI Suggested Defect Tags</Typography>
                </MenuItem>
                {Object.entries(aiDefects)
                  .sort()
                  .map(([key, value], index) => (
                    <MenuItem
                      key={index}
                      className={classes.menuItem}
                      onClick={() => handleAiDefectChange(key)}
                    >
                      {model.classification_type === 'SINGLE_LABEL' ? (
                        <CustomizedRadio checked={value.value} />
                      ) : (
                        <CustomizedCheckbox checked={value.value} />
                      )}
                      <Typography variant='caption'>{key}</Typography>
                    </MenuItem>
                  ))}
                <MenuItem>
                  <Typography>Other Defect Tags</Typography>
                </MenuItem>
                {Object.entries(otherDefects)
                  .sort()
                  .map(([key, value], index) => (
                    <MenuItem
                      key={index}
                      className={classes.menuItem}
                      onClick={() => handleOtherDefectChange(key)}
                    >
                      {model.classification_type === 'SINGLE_LABEL' ? (
                        <CustomizedRadio checked={value.value} />
                      ) : (
                        <CustomizedCheckbox checked={value.value} />
                      )}
                      <Typography variant='caption'>{key}</Typography>
                    </MenuItem>
                  ))}
              </div>
            )
          ) : (
            <MenuItem>Nothing Added yet</MenuItem>
          )}
        </Menu>

        {noDefect ? (
          <Box>
            <Chip
              label='No Defect'
              onDelete={() => {
                handleNoDefectChange(false);
              }}
              className={`${classes.aiChip} ${classes.chip} ${classes.borderDotted}`}
            />
          </Box>
        ) : null}
        {model && model.type !== 'DETECTION' ? (
          <>
            {Object.entries(aiDefects).map(([key, value]) => {
              if (value.value) {
                return (
                  <Box key={key}>
                    <Chip
                      label={key}
                      onDelete={() => {
                        handleAiDefectChange(key);
                      }}
                      className={`${classes.aiChip} ${classes.chip} ${
                        classes[value.class]
                      }`}
                    />
                  </Box>
                );
              }
              return null;
            })}
            {Object.entries(otherDefects).map(([key, value]) => {
              if (value.value) {
                return (
                  <Box key={key}>
                    <Chip
                      label={key}
                      onDelete={() => {
                        handleOtherDefectChange(key);
                      }}
                      className={`${classes.otherChip} ${classes.chip}`}
                    />
                  </Box>
                );
              }
              return null;
            })}
          </>
        ) : null}
      </Box>
      {showBtn ? (
        <CommonButton text='Confirm' onClick={handleConfirmBtn} />
      ) : null}
    </Box>
  );
};

export default FilterBar;
