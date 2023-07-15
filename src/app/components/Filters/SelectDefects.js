import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import api from 'app/api';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import CustomizedCheckbox from '../Checkbox';
import useStyles from './styles';

const info = {
  field: 'folder',
  name: 'Folder'
};

const SelectDefects = ({ value, setValue }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const { subscriptionId } = useParams();

  const { data: defects = [] } = useQuery(
    ['defects', subscriptionId],
    context => api.getDefects(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setInputValue('');
    setAnchorEl(null);
  };
  const open = !!anchorEl;
  return (
    <Box mr={4} className={classes.item}>
      <Box
        onClick={handleClick}
        aria-controls={`${info.name}-menu`}
        aria-haspopup='true'
        display='flex'
        alignItems='center'
      >
        <Typography variant='h4'>Select Defects</Typography>
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
          open={!!anchorEl}
          onClose={handleClose}
          className={classes.menuDefect}
        >
          <Autocomplete
            open
            id='virtualize-demo'
            disablePortal
            multiple
            fullWidth
            classes={{
              paper: classes.paperDefect,
              option: classes.option,
              popperDisablePortal: classes.popperDisablePortalDefect
            }}
            onChange={(e, newValue) => setValue(newValue)}
            value={value}
            renderTags={() => {}}
            getOptionLabel={option => option.name}
            options={defects?.results || []}
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
                <CustomizedCheckbox checked={selected} />
                <Typography variant='caption'>{option.name}</Typography>
              </Box>
            )}
          />
        </Menu>
      )}
    </Box>
  );
};

export default SelectDefects;
