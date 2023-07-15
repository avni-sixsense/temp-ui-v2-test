import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { formatDateFilter, getTimeFormat } from 'app/utils/helpers';
import dayjs from 'dayjs';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

import DatePicker from './DatePicker';
import useStyles from './styles';

const DateFilter = ({ date, setDeleteDateFilter, lightTheme }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    if (params.date__gte && params.date__lte) {
      const start = params.date__gte.split('-');
      const end = params.date__lte.split('-');
      const startDate = dayjs(start.slice(0, 3).join('-')).toDate();
      const endDate = dayjs(end.slice(0, 3).join('-')).toDate();
      dispatch({
        type: 'SET_DATE_FILTER',
        date: {
          start: startDate,
          end: endDate,
          timeFormat: getTimeFormat(startDate, endDate)
        }
      });
    }
  }, [dispatch, location.search]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = date => {
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    const formatted = formatDateFilter(date);
    params.date__gte = `${formatted.start}-00-00-00`;
    params.date__lte = `${formatted.end}-23-59-59`;
    params.time_format = date.timeFormat;
    const newParams = queryString.stringify(params, { arrayFormat: 'comma' });
    setSearchParams(newParams);
    dispatch({ type: 'SET_DATE_FILTER', date });
    setAnchorEl(null);
    setDeleteDateFilter(false);
  };
  // console.log('date -> ', date)
  const formatted = formatDateFilter(date);
  return (
    <Box
      mr={4}
      mb={1}
      className={lightTheme ? classes.lightItem : classes.item}
    >
      <Box
        onClick={handleClick}
        aria-controls='date-menu'
        aria-haspopup='true'
        display='flex'
        alignItems='center'
      >
        <Typography variant='h4'>{`${formatted.start} - ${formatted.end}`}</Typography>
        <Box ml={1.5}>
          <Typography variant='h4'>
            <ExpandMoreIcon />
          </Typography>
        </Box>
      </Box>
      <Menu
        id='date-menu'
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
        className={classes.dateMenu}
      >
        {!!anchorEl && (
          <DatePicker
            handleApplyFilter={handleApplyFilter}
            date={date}
            handleClose={handleClose}
          />
        )}
      </Menu>
    </Box>
  );
};

export default DateFilter;
