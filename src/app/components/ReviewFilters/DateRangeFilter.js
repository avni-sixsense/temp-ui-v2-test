import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {
  formatDateFilter,
  getTimeFormat,
  getTimeRangeString
} from 'app/utils/helpers';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';

import useStyles from './styles';

const DateFilter = ({ date, setDeleteDateFilter, setFilters, lightTheme }) => {
  const classes = useStyles();
  const [dateRange, setDateRange] = useState({});

  useEffect(() => {
    if (
      dayjs(date.start).diff(dayjs(dateRange.start)) !== 0 &&
      dayjs(date.end).diff(dayjs(dateRange.end)) !== 0
    ) {
      setDateRange(date);
    }
  }, [date]);

  const handleApplyFilter = (start, end) => {
    setFilters(prev => {
      if (!(moment(start).isValid() && moment(end).isValid())) {
        return {
          ...prev,
          date__gte: null,
          date__lte: null,
          time_format: null
        };
      }
      return {
        ...prev,
        date__gte: start.toDate(),
        date__lte: end.toDate(),
        time_format: getTimeFormat(start, end)
      };
    });
    setDateRange({ start, end });
    setDeleteDateFilter(false);
  };
  const formatted = formatDateFilter(date);
  const timeRange = getTimeRangeString([dateRange.start, dateRange.end]);

  return (
    <Box mr={1} className={lightTheme ? classes.lightItem : classes.item}>
      {dateRange?.start && dateRange?.end && (
        <DateRangePicker
          initialSettings={{
            // startDate: formatted.start.split('-').reverse().join('-'),
            // endDate: formatted.end.split('-').reverse().join('-'),
            showDropdowns: true,
            timePicker24Hour: true,
            timePicker: true,
            startDate: dateRange.start,
            endDate: dateRange.end,
            minYear: 2020,
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
            // onClick={handleClick}
            aria-controls='date-menu'
            aria-haspopup='true'
            display='flex'
            alignItems='center'
          >
            <Typography>
              {timeRange || `${formatted.start} - ${formatted.end}`}
            </Typography>
            <FontAwesomeIcon icon={faChevronDown} />
            {/* <Box ml={1.5}>
						<Typography variant="h4">
							<ExpandMoreIcon />
						</Typography>
					</Box> */}
          </Box>
        </DateRangePicker>
      )}
    </Box>
  );
};

export default DateFilter;
