import { faSortDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  ClickAwayListener,
  Paper,
  Popper,
  Typography
} from '@material-ui/core';
import { useState } from 'react';
import classes from './DropDown.module.scss';

interface DropDownData {
  label: string;
  value: string;
}

interface DropDownProps<T> {
  data: T[];
  active: T;
  onChange: (param: T) => void;
}

export const Dropdown = <T extends DropDownData>({
  data,
  active,
  onChange
}: DropDownProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event: Event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleValueChange = (value: T) => {
    handleClose();
    onChange(value);
  };

  const handleDropDownOpen = (event: Event) => {
    if (anchorEl) {
      handleClose();
    } else {
      handleOpen(event);
    }
  };

  return (
    <Box ml={1} className={classes.root}>
      <Box
        className={classes.dropDown}
        py={0.75}
        px={1.5}
        display='flex'
        alignItems='center'
        // @ts-ignore
        onClick={handleDropDownOpen}
      >
        <Box mr={1.25}>
          <Typography className={classes.dropDownText}>
            {active.label}
          </Typography>
        </Box>
        <Box pb={0.5} display='flex' alignItems='center'>
          <FontAwesomeIcon icon={faSortDown} />
        </Box>
      </Box>
      {!!anchorEl && (
        <ClickAwayListener
          className={classes.popper}
          // @ts-ignore
          onClickAway={handleDropDownOpen}
        >
          <Popper
            className={classes.popper}
            open={!!anchorEl}
            // @ts-ignore
            anchorEl={anchorEl}
            placement='bottom-start'
            transition
            disablePortal
          >
            <Paper className={classes.dropDownPaper}>
              <Box p={1}>
                {data.map(item => (
                  <Box
                    key={item.value}
                    py={1}
                    className={classes.options}
                    onClick={() => handleValueChange(item)}
                  >
                    <Typography>{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Popper>
        </ClickAwayListener>
      )}
    </Box>
  );
};
