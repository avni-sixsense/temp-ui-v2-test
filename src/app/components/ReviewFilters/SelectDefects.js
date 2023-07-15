import { faCheck, faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import api from 'app/api';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import useStyles from './styles';

const info = {
  field: 'folder',
  name: 'Folder'
};

const SelectDefects = ({ value, setValue, lightTheme }) => {
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
    <Box mr={1} className={lightTheme ? classes.lightItem : classes.item}>
      <Box
        onClick={handleClick}
        aria-controls={`${info.name}-menu`}
        aria-haspopup='true'
        display='flex'
        alignItems='center'
      >
        <Typography>Select Defects</Typography>
        <FontAwesomeIcon icon={faChevronDown} />
        {/* <Box ml={1.5}>
					<Typography variant="h4">
						<ExpandMoreIcon />
					</Typography>
				</Box> */}
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
          classes={{
            paper: lightTheme ? classes.lightMenuPaper : classes.menuPaper,
            list: classes.menuList
          }}
          // className={classes.menuDefect}
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
        </Menu>
      )}
    </Box>
  );
};

export default SelectDefects;
