import dayjs from 'dayjs';

const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const duration = require('dayjs/plugin/duration');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

export const timeZone = dayjs.tz.guess();

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD-HH-mm-ss';

export const getTimeZoneDate = value =>
  dayjs.utc(value, DEFAULT_DATE_FORMAT).tz(timeZone);

export function dateFormatter(value, format = DEFAULT_DATE_FORMAT) {
  const date = getTimeZoneDate(value);
  return date.format(format);
}

export function dateRangeFormatter(
  [startDate, endDate],
  format = DEFAULT_DATE_FORMAT
) {
  return [dateFormatter(startDate, format), dateFormatter(endDate, format)];
}

export function getDateLabels(
  [startDate, endDate],
  format = DEFAULT_DATE_FORMAT
) {
  return [
    dayjs(startDate, DEFAULT_DATE_FORMAT).format(format),
    dayjs(endDate, DEFAULT_DATE_FORMAT).format(format)
  ];
}

export function getDateFromFormatedString([startDate, endDate]) {
  return [
    dayjs(startDate, DEFAULT_DATE_FORMAT).toDate(),
    dayjs(endDate, DEFAULT_DATE_FORMAT).toDate()
  ];
}
