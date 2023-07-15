import { useRef, useEffect } from 'react';
import moment from 'moment';

import DateRangePicker from 'react-bootstrap-daterangepicker';

import { dateRanges } from 'app/constants/filters';
import { isCustomDateRange } from 'app/utils/filters';
import { getDateFromFormatedString } from 'app/utils/date';

import classes from './FilterDropdownDate.module.scss';

export const FilterDropdownDate = ({
  handleClose,
  onChange,
  defaultValue,
  value
}) => {
  const ref = useRef();

  const [startDate, endDate] =
    value.length > 0
      ? isCustomDateRange(value)
        ? getDateFromFormatedString(value.split(','))
        : dateRanges[value]
      : defaultValue.value;

  useEffect(() => {
    ref.current.ref.click();
  }, []);

  return (
    <DateRangePicker
      ref={ref}
      initialSettings={{
        showDropdowns: true,
        timePicker24Hour: true,
        timePicker: true,
        startDate,
        endDate,
        minYear: 2020,
        maxYear: parseInt(moment().format('YYYY'), 10) + 1,
        locale: { format: 'HH:mm:ss', firstDay: 1 },
        ranges: dateRanges,
        alwaysShowCalendars: false
      }}
      onCallback={onChange}
      onHide={handleClose}
    >
      <div className={classes.label} style={{ marginTop: 36 }} />
    </DateRangePicker>
  );
};
