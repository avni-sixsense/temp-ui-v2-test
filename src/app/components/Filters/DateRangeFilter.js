import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  convertToUtc,
  formatDateFilter,
  getTimeFormat,
  getTimezoneWiseDate
} from 'app/utils/helpers';
import dayjs from 'dayjs';
import moment from 'moment';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

import useStyles from './styles';

const DateFilter = ({ setDeleteDateFilter }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const date = useSelector(({ filters }) => filters.date);

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    if (
      params.date__gte &&
      params.date__lte &&
      ((!date.start && !date.end) ||
        dayjs.utc(date.start).format('YYYY-MM-DD-HH-mm-ss') !==
          params.date__gte ||
        dayjs.utc(date.end).format('YYYY-MM-DD-HH-mm-ss') !== params.date__lte)
    ) {
      dispatch({
        type: 'SET_DATE_FILTER',
        date: {
          start: getTimezoneWiseDate(params.date__gte, 'YYYY-MM-DD-HH-mm-ss'),
          end: getTimezoneWiseDate(params.date__lte, 'YYYY-MM-DD-HH-mm-ss'),
          timeFormat: params?.time_format
            ? params.time_format
            : getTimeFormat(
                getTimezoneWiseDate(params.date__gte, 'YYYY-MM-DD-HH-mm-ss'),
                getTimezoneWiseDate(params.date__lte, 'YYYY-MM-DD-HH-mm-ss')
              )
        }
      });
    }
  }, [location.search, date, dispatch]);

  const handleApplyFilter = (start, end) => {
    // dayjs(convertToUtc(start.toDate()), 'YYYY-MM-DD-HH-mm-ss').utc()
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    const formatted = { start: convertToUtc(start), end: convertToUtc(end) };
    // const formatted = formatDateFilter(date)

    // if (start.format('YYYY-MM-DD') !== end.format('YYYY-MM-DD')) {
    // 	formatted = { start: start.format('YYYY-MM-DD-HH-mm-ss'), end: end.format('YYYY-MM-DD-HH-mm-ss') }
    // } else {
    // 	formatted = { start: `${start.format('YYYY-MM-DD')}-00-00-00`, end: end.format('YYYY-MM-DD-HH-mm-ss') }
    // }
    params.date__gte = `${formatted.start}`;
    params.date__lte = `${formatted.end}`;
    params.time_format = 'monthly';
    const newParams = queryString.stringify(params, { arrayFormat: 'comma' });
    setSearchParams(newParams);
    dispatch({
      type: 'SET_DATE_FILTER',
      date: {
        start: getTimezoneWiseDate(params.date__gte, 'YYYY-MM-DD-HH-mm-ss'),
        end: getTimezoneWiseDate(params.date__lte, 'YYYY-MM-DD-HH-mm-ss'),
        timeFormat: getTimeFormat(
          getTimezoneWiseDate(params.date__gte, 'YYYY-MM-DD-HH-mm-ss'),
          getTimezoneWiseDate(params.date__lte, 'YYYY-MM-DD-HH-mm-ss')
        )
      }
    });
    setDeleteDateFilter(false);
  };
  const displayDate = formatDateFilter(date);
  // console.log(
  // 	formatted,
  // 	dayjs(formatted.end, 'YYYY-MM-DD-HH-mm-ss').diff(dayjs(formatted.start, 'YYYY-MM-DD-HH-mm-ss'), 'years')
  // )
  // console.log([
  // 	moment().subtract(12, 'month').toDate(),
  // 	moment().toDate(),
  // 	dayjs(formatted.start, 'YYYY-MM-DD-HH-mm-ss').toDate(),
  // 	dayjs(formatted.end, 'YYYY-MM-DD-HH-mm-ss').toDate(),
  // ])

  return (
    <Box mr={4} mb={1} className={classes.item}>
      {date?.start && date?.end && (
        <DateRangePicker
          initialSettings={{
            // startDate: date.start.split('-').reverse().join('-'),
            // endDate: date.end.split('-').reverse().join('-'),
            showDropdowns: true,
            timePicker24Hour: true,
            timePicker: true,
            startDate: date.start,
            endDate: date.end,
            minYear: 2010,
            maxYear: parseInt(moment().format('YYYY'), 10) + 1,
            locale: {
              format: 'HH:mm:ss',
              firstDay: 1
            },
            ranges: {
              'All Date Range': [
                moment('2020-01-01-00-00-00', 'YYYY-MM-DD-HH-mm-ss').toDate(),
                moment().endOf('day').toDate()
              ],
              Today: [
                moment().startOf('day').toDate(),
                moment().endOf('day').toDate()
              ],
              Yesterday: [
                moment().subtract(1, 'days').startOf('day').toDate(),
                moment().subtract(1, 'days').endOf('day').toDate()
              ],
              'Last 7 Days': [
                moment().subtract(6, 'days').startOf('day').toDate(),
                moment().endOf('day').toDate()
              ],
              'Last 30 Days': [
                moment().subtract(29, 'days').startOf('day').toDate(),
                moment().endOf('day').toDate()
              ],
              'This Month': [
                moment().startOf('month').startOf('day').toDate(),
                moment().endOf('month').endOf('day').toDate()
              ],
              'Last Month': [
                moment()
                  .subtract(1, 'month')
                  .startOf('month')
                  .startOf('day')
                  .toDate(),
                moment()
                  .subtract(1, 'month')
                  .endOf('month')
                  .endOf('day')
                  .toDate()
              ],
              'Last Year': [
                moment().subtract(12, 'month').startOf('day').toDate(),
                moment().endOf('day').toDate()
              ]
            },
            alwaysShowCalendars: false
          }}
          onCallback={handleApplyFilter}
        >
          {/* <button>Click Me To Open Picker!</button> */}

          <Box
            id='filter_date'
            // onClick={handleClick}
            aria-controls='date-menu'
            aria-haspopup='true'
            display='flex'
            alignItems='center'
          >
            <Typography variant='h4'>{`${displayDate.start} - ${displayDate.end}`}</Typography>
            <Box ml={1.5}>
              <Typography variant='h4'>
                <ExpandMoreIcon />
              </Typography>
            </Box>
          </Box>
        </DateRangePicker>
      )}
    </Box>
  );
};

export default DateFilter;
