/* eslint-disable react/sort-comp */
import 'react-day-picker/lib/style.css';

import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { getTimeFormat } from 'app/utils/helpers';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';

import CommonButton from '../CommonButton';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  datePicker: {
    fontWeight: 'normal',
    fontSize: '0.875rem !important',
    color: '#02435D',
    width: '148px',
    height: '41px',
    textAlign: 'left'
  },
  menuItem: {
    fontWeight: 'normal',
    fontSize: '0.875rem !important',
    color: '#02435D'
  }
}));

const now = dayjs();
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const fromMonth = new Date(currentYear, currentMonth);
const toMonth = new Date(currentYear + 10, 11);

const MenuProps = {
  getContentAnchorEl: null,
  keepMounted: true,
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5
    }
  }
};
function YearMonthForm({ date, localeUtils, onChange }) {
  const classes = useStyles();
  const months = localeUtils.getMonths();

  const years = [];
  const year = date.getFullYear();
  for (let i = year - 10; i <= year + 1; i += 1) {
    years.push(i);
  }

  const handleMonth = e => {
    onChange(new Date(year, e.target.value));
  };

  const handleYear = e => {
    onChange(new Date(e.target.value, date.getMonth()));
  };

  // const handleChange = function handleChange(e) {
  // 	const { year, month } = e.target.form
  // 	onChange(new Date(year.value, month.value))
  // }

  return (
    <form className='DayPicker-Caption p-0'>
      <Box display='flex' justifyContent='space-around'>
        <FormControl variant='outlined' className={classes.formControl}>
          <Select
            labelId='demo-simple-select-outlined-label'
            id='demo-simple-select-outlined'
            value={year}
            onChange={handleYear}
            className={classes.datePicker}
            MenuProps={MenuProps}
          >
            {years.map(year => (
              <MenuItem className={classes.menuItem} value={year} key={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant='outlined' className={classes.formControl}>
          <Select
            labelId='demo-simple-select-outlined-label'
            id='demo-simple-select-outlined'
            value={date.getMonth()}
            onChange={handleMonth}
            className={classes.datePicker}
            MenuProps={MenuProps}
          >
            {months.map((month, i) => (
              <MenuItem className={classes.menuItem} value={i} key={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* <select name="year" onChange={handleChange} value={date.getFullYear()} className="year">
				{years.map((year) => (
					<option key={year} value={year}>
						{year}
					</option>
				))}
			</select> */}
      {/* <select name="month" onChange={handleChange} value={date.getMonth()} className="month">
				{months.map((month, i) => (
					<option key={month} value={i}>
						{month}
					</option>
				))}
			</select> */}
    </form>
  );
}

YearMonthForm.propTypes = {
  date: PropTypes.object.isRequired,
  localeUtils: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
    this.applyDateFilter = this.applyDateFilter.bind(this);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      from: now.subtract(1, 'week').toDate(),
      to: now.toDate(),
      enteredTo: now.toDate(), // Keep track of the last day for mouseEnter.
      month: fromMonth
    };
  }

  componentDidMount() {
    this.setState({
      from: this.props.date.start,
      to: this.props.date.end,
      enteredTo: this.props.date.end
    });
  }

  // eslint-disable-next-line class-methods-use-this
  isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  }

  handleDayClick(day, modifiers, e) {
    e.stopPropagation();
    const { from, to } = this.state;
    if (from && to && day >= from && day <= to) {
      this.handleResetClick();
      return;
    }
    if (this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null
      });
    } else {
      this.setState({
        to: day,
        enteredTo: day
      });
    }
  }

  handleDayMouseEnter(day) {
    const { from, to } = this.state;
    if (!this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day
      });
    }
  }

  handleResetClick() {
    this.setState(this.getInitialState());
  }

  handleYearMonthChange(month) {
    this.setState({ month });
  }

  // eslint-disable-next-line class-methods-use-this

  applyDateFilter() {
    const date = {
      start: this.state.from,
      end: this.state.to,
      actualStart: this.state.from,
      actualEnd: this.state.to,
      timeFormat: getTimeFormat(this.state.from, this.state.to)
    };
    this.props.handleApplyFilter(date);
  }

  render() {
    const { from, enteredTo, to } = this.state;
    const modifiers = { start: from, end: enteredTo };
    const disabledDays = { before: this.state.from };
    const selectedDays = [from, { from, to: enteredTo }];
    return (
      <div>
        <Box
          display='flex'
          px={1}
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography variant='h4'>Select the Date & Year</Typography>
          <CloseIcon
            fontSize='small'
            className='ss_pointer'
            onClick={this.props.handleClose}
          />
        </Box>
        <DayPicker
          className='Range'
          //   numberOfMonths={2}
          showOutsideDays
          month={this.state.month}
          fromMonth={fromMonth}
          toMonth={toMonth}
          selectedDays={selectedDays}
          disabledDays={disabledDays}
          modifiers={modifiers}
          onDayClick={this.handleDayClick}
          onDayMouseEnter={this.handleDayMouseEnter}
          captionElement={({ date, localeUtils }) => (
            <YearMonthForm
              date={date}
              localeUtils={localeUtils}
              onChange={this.handleYearMonthChange}
            />
          )}
        />
        <div>
          <CommonButton
            disabled={!(from && to)}
            onClick={this.applyDateFilter}
            text='Apply'
          />
        </div>
      </div>
    );
  }
}
