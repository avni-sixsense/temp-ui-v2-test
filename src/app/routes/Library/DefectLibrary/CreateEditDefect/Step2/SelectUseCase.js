import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';

const useStyle = makeStyles(() => ({
  dropDown: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    minWidth: '185px',
    border: ' 1px solid rgba(2, 67, 93, 0.2)',
    boxSizing: 'border-box',
    borderRadius: '3px',
    '& h3': {
      margin: 'auto'
    }
  },
  menu: {
    backgroundColor: '#FFFFFF',
    maxHeight: '240px',
    overflowY: 'auto',
    border: '1px solid rgba(0, 0, 0, 0.15)',
    borderRadius: '0.25rem',
    zIndex: 5000
  }
}));

const SelectUseCase = ({ useCases, setSelected, selected }) => {
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <Box display='flex'>
      <Box>
        <Box
          p={0.5}
          aria-describedby={id}
          className={classes.dropDown}
          type='button'
          onClick={handleClick}
        >
          <Typography variant='h3'>
            {selected === '' ? 'Select' : selected?.name}
          </Typography>
          <ExpandMoreIcon fontSize='small' />
        </Box>
        <Popper
          className={classes.menu}
          id={id}
          open={open}
          anchorEl={anchorEl}
          placement='bottom-start'
        >
          <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <div>
              {useCases.map((model, index) => {
                return (
                  <Box display='flex' alignItems='center' key={index}>
                    <Radio
                      color='primary'
                      size='small'
                      checked={selected?.id === model.id}
                      onChange={() => setSelected(model)}
                    />
                    <Typography variant='h4'>{model.name}</Typography>
                  </Box>
                );
              })}
            </div>
          </ClickAwayListener>
        </Popper>
      </Box>
    </Box>
  );
};

export default SelectUseCase;
