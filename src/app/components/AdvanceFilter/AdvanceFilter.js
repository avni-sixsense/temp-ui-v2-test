import { faFilter } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// import ModeSelector from 'app/components/ModeSelector'
import CommonButton from 'app/components/ReviewButton';
import Filter from 'app/components/ReviewFilters';
import { FilterKey } from 'app/utils/filterConstants';
import {
  convertToUtc,
  covertToArrayFormat,
  decodeURL,
  encodeURL,
  getParamsObjFromEncodedString,
  getTimeFormat,
  getTimeFormatFromTimeRange,
  getTimeRangeString,
  getTimezoneWiseDate,
  ranges
} from 'app/utils/helpers';
import dayjs from 'dayjs';
import moment from 'moment';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import FilterActions from './components/filterActions';

const useStyles = makeStyles(theme => ({
  filterBar: {
    backgroundColor: theme.colors.grey[16],
    border: `0.2px solid ${theme.colors.grey[13]}`,
    borderRadius: '4px',
    '& input': {
      color: theme.colors.grey[0]
    },
    [theme.breakpoints.down('lg')]: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5)
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5)
    }
  },
  lightFilterBar: {
    backgroundColor: theme.colors.grey[0],
    border: `1px solid #a8c3e85c`,
    borderRadius: '4px',
    '& input': {
      color: theme.colors.grey[18]
    },
    [theme.breakpoints.down('lg')]: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5)
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5)
    }
  },
  root: {
    // gridArea: 'advanceFilterBar',
    overflow: 'hidden',
    boxShadow: theme.colors.shadow.md,
    width: 'unset'
  }
}));

const trainFilterKey = 'train_type__in';

const AdvanceFilter = ({
  onlyFolder = false,
  dateFilter = false,
  modelFilter = false,
  typeFilter = false,
  modelKey,
  UseCase = false,
  filterModels = true,
  bookmarkFilter = false,
  commontFilter = true,
  folderFilter = true,
  defectFilter = false,
  groundTruth = false,
  gtModel = false,
  autoModelFilter = false,
  wafermap = false,
  lightTheme = false,
  autoClassified = false,
  yearlyDateFilter = false,
  waferTagFilter = false,
  uploadSessionTagFilter = false,
  filesetTagFilter = false,
  aiOutputFilter = false,
  reviewedFilter = false,
  waferStatus = false,
  waferMetaInfoFilter = false,
  modelStatusFilter = false,

  // defaultDateRange = {
  // 	start: moment('2020-01-01-00-00-00', 'YYYY-MM-DD-HH-mm-ss').toDate(),
  // 	end: moment().endOf('day').toDate(),
  // },
  screenFilterKey = ''
}) => {
  const classes = useStyles();

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({});

  const filterMode = 'Simple';

  useEffect(() => {
    setFilters({});
  }, [screenFilterKey]);

  // const handleAdvanceFilter = (filter) => {
  // 	setFilterMode(filter)
  // }
  const handleClearFilters = () => {
    const filterSession = JSON.parse(sessionStorage.getItem(FilterKey) || {});
    const screenFilter = filterSession?.[screenFilterKey] || {};
    screenFilter.other_filters = {};
    sessionStorage.setItem(
      FilterKey,
      JSON.stringify({ ...filterSession, [screenFilterKey]: screenFilter })
    );

    const s = queryString.stringify(
      {
        other_filters: encodeURL({}),
        contextual_filters: encodeURL(screenFilter.contextual_filters),
        screen_key: screenFilterKey
      },
      { arrayFormat: 'comma' }
    );
    // dispatch(resetReviewData())
    if (s !== location.search.replace('?', '')) {
      const finalParam = getParamsObjFromEncodedString(s);
      setFilters(finalParam);
      setSearchParams(s);
    }
  };
  const handleApplyFilters = () => {
    if (filterMode === 'Simple' && Object.keys(filters).length > 0) {
      const filterSession = JSON.parse(sessionStorage.getItem(FilterKey) || {});
      const screenFilter = filterSession?.[screenFilterKey] || {};

      const updatedFiltersKey = Object.keys(filters);
      const allowedKeys = [
        ...Object.keys(screenFilter?.other_filters || {}).filter(key =>
          updatedFiltersKey.includes(key)
        ),
        ...updatedFiltersKey
      ];

      const tempObj = {};
      allowedKeys.forEach(x => {
        tempObj[x] = filters[x];
      });

      // const tempObj = { ...(screenFilter?.other_filters || {}), ...filters }
      const timeRange = getTimeRangeString([
        filters.date__gte,
        filters.date__lte
      ]);
      const timeRangeTimeFormat = getTimeFormatFromTimeRange(timeRange);
      if (timeRange) {
        tempObj.time__range = timeRange;
        tempObj.time_format = timeRangeTimeFormat;
        delete tempObj.date__gte;
        delete tempObj.date__lte;
      } else if (filters.date__gte && filters.date__lte) {
        tempObj.date__gte = convertToUtc(tempObj.date__gte);
        tempObj.date__lte = convertToUtc(tempObj.date__lte);
        delete tempObj.time__range;
        delete tempObj.time_format;
      } else {
        delete tempObj.date__gte;
        delete tempObj.date__lte;
        delete tempObj.time_format;
        delete tempObj.time__range;
      }
      screenFilter.other_filters = { ...tempObj };
      screenFilter.key = screenFilterKey;
      sessionStorage.setItem(
        FilterKey,
        JSON.stringify({ ...filterSession, [screenFilterKey]: screenFilter })
      );
      const contextualFilters = encodeURL(screenFilter.contextual_filters);
      const otherFilters = encodeURL(screenFilter.other_filters);
      // tempObj.time__range = dayjs(filters.date__lte).diff(dayjs(filters.date__gte))
      // console.log(dayjs().endOf('day').subtract(tempObj.time__range, 'millisecond'))
      const s = queryString.stringify(
        {
          other_filters: otherFilters,
          contextual_filters: contextualFilters,
          screen_key: screenFilterKey
        },
        { arrayFormat: 'comma' }
      );
      // dispatch(resetReviewData())

      if (s !== location.search.replace('?', '')) {
        setSearchParams(s);
      }
    }
  };

  // useEffect(() => {
  // 	const paramsObj = queryString.parse(location.search, { arrayFormat: 'comma', parseNumbers: true })
  // 	if ((!paramsObj?.date__gte || !paramsObj?.date__lte || !paramsObj.time_format) && dateFilter) {
  // 		if (!paramsObj?.date__gte || !paramsObj?.date__lte) {
  // 			if (yearlyDateFilter) {
  // 				paramsObj.date__gte = dayjs()
  // 					.subtract(12, 'months')
  // 					.startOf('day')
  // 					.utc()
  // 					.format('YYYY-MM-DD-HH-mm-ss')
  // 			} else {
  // 				paramsObj.date__gte = dayjs().subtract(6, 'days').startOf('day').utc().format('YYYY-MM-DD-HH-mm-ss')
  // 			}
  // 			paramsObj.date__lte = dayjs().endOf('day').utc().format('YYYY-MM-DD-HH-mm-ss')
  // 			paramsObj.time_format = getTimeFormat(
  // 				yearlyDateFilter
  // 					? dayjs().subtract(12, 'months').startOf('day').utc()
  // 					: dayjs().subtract(6, 'days').startOf('day').utc(),
  // 				dayjs().endOf('day').utc()
  // 			)
  // 		} else {
  // 			paramsObj.time_format = getTimeFormat(
  // 				dayjs(paramsObj.date__gte, 'YYYY-MM-DD-HH-mm-ss').utc().toDate(),
  // 				dayjs(paramsObj.date__lte, 'YYYY-MM-DD-HH-mm-ss').utc().toDate()
  // 			)
  // 		}
  // 		navigate({ search: queryString.stringify(paramsObj, { arrayFormat: 'comma' }) })
  // 	}
  // }, [location.search])

  useEffect(() => {
    const parsedParams = queryString.parse(location.search);
    if (!screenFilterKey || parsedParams.screen_key !== screenFilterKey) return;
    const filterSession = JSON.parse(sessionStorage.getItem(FilterKey) || {});

    const screenFilter = filterSession?.[screenFilterKey] || {};
    let paramsObj = {};
    paramsObj = {
      ...(screenFilter?.contextual_filters || {}),
      ...(screenFilter?.other_filters || {})
    };
    if (
      !Object.keys(paramsObj).length ||
      JSON.stringify(paramsObj) !==
        JSON.stringify(covertToArrayFormat(paramsObj))
    ) {
      const decodedUrl = queryString.parse(location.search);
      const contextualFilters = decodeURL(decodedUrl.contextual_filters);
      const otherFilters = decodeURL(decodedUrl.other_filters);
      sessionStorage.setItem(
        FilterKey,
        JSON.stringify({
          ...filterSession,
          [screenFilterKey]: {
            contextual_filters: contextualFilters,
            other_filters: otherFilters,
            key: screenFilterKey
          }
        })
      );
      paramsObj = {
        ...(contextualFilters || {}),
        ...(otherFilters || {})
      };
    }

    if (
      !Object.keys(filters).length ||
      (paramsObj.date__gte &&
        !filters.date__gte &&
        filters.date__gte !== null) ||
      (paramsObj.date__lte &&
        !filters.date__lte &&
        filters.date__lte !== null) ||
      (paramsObj.time__range &&
        !filters.date__lte &&
        filters.date__lte !== null &&
        !filters.date__lte &&
        filters.date__lte !== null)
    ) {
      // const paramsObj = queryString.parse(location.search, { arrayFormat: 'comma', parseNumbers: true })
      if (paramsObj.date__gte && paramsObj.date__lte) {
        paramsObj.date__gte = getTimezoneWiseDate(
          paramsObj.date__gte,
          'YYYY-MM-DD-HH-mm-ss'
        );
        paramsObj.date__lte = getTimezoneWiseDate(
          paramsObj.date__lte,
          'YYYY-MM-DD-HH-mm-ss'
        );
        paramsObj.time_format = getTimeFormat(
          getTimezoneWiseDate(paramsObj.date__gte, 'YYYY-MM-DD-HH-mm-ss'),
          getTimezoneWiseDate(paramsObj.date__lte, 'YYYY-MM-DD-HH-mm-ss')
        );
        delete paramsObj.time__range;
      }

      if (paramsObj.time__range) {
        const [start, end] = ranges[paramsObj.time__range];
        paramsObj.date__gte = start;
        paramsObj.date__lte = end;
        paramsObj.time_format = getTimeFormat(start, end);
        delete paramsObj.time__range;
      }

      if (
        (!paramsObj?.date__gte || !paramsObj?.date__lte) &&
        dateFilter &&
        !paramsObj.time__range
      ) {
        if (yearlyDateFilter) {
          paramsObj.date__gte = moment()
            .subtract(12, 'month')
            .startOf('day')
            .toDate();
        } else {
          paramsObj.date__gte = moment()
            .subtract(6, 'days')
            .startOf('day')
            .toDate();
        }
        paramsObj.date__lte = moment().endOf('day').toDate();
        paramsObj.time_format = 'weekly';
      }

      if (!paramsObj.time_format && dateFilter) {
        paramsObj.time_format = getTimeFormat(
          dayjs(paramsObj.date__gte, 'YYYY-MM-DD-HH-mm-ss').toDate(),
          dayjs(paramsObj.date__lte, 'YYYY-MM-DD-HH-mm-ss').toDate()
        );
      }
      if (
        paramsObj[trainFilterKey] &&
        paramsObj[trainFilterKey].includes('TEST') &&
        paramsObj[trainFilterKey].includes('VALIDATION')
      ) {
        paramsObj[trainFilterKey].push('TEST,VALIDATION');
        paramsObj[trainFilterKey].splice(
          paramsObj[trainFilterKey].indexOf('TEST'),
          1
        );
        paramsObj[trainFilterKey].splice(
          paramsObj[trainFilterKey].indexOf('VALIDATION'),
          1
        );
      }
      if (JSON.stringify(paramsObj) !== JSON.stringify(filters)) {
        setFilters(paramsObj);
      }
    }
  }, [location.search, filters, screenFilterKey, yearlyDateFilter, dateFilter]);

  const typeData = location.pathname.includes('dashboard')
    ? [
        { id: 'TRAIN', name: 'Training', value: 'TRAIN' },
        { id: 'TEST,VALIDATION', name: 'Testing', value: 'TEST,VALIDATION' }
      ]
    : [
        { id: 'TRAIN', name: 'Training', value: 'TRAIN' },
        { id: 'TEST,VALIDATION', name: 'Testing', value: 'TEST,VALIDATION' },
        {
          id: 'NOT_TRAINED',
          name: 'Not used for training',
          value: 'NOT_TRAINED'
        }
      ];

  const filterModeList = [{ label: 'Simple' }, { label: 'Advanced' }];

  if (filterMode === 'Simple') {
    return (
      <Box
        id='advanceFilter'
        width='100%'
        pb={0}
        className={classes.root}
        onKeyDown={e => e.stopPropagation()}
      >
        <Box
          className={lightTheme ? classes.lightFilterBar : classes.filterBar}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          pl={1}
          pr={1.75}
        >
          <Filter
            onlyFolder={onlyFolder}
            dateFilter={dateFilter}
            modelFilter={modelFilter}
            typeFilter={typeFilter}
            modelKey={modelKey}
            UseCase={UseCase}
            filterModels={filterModels}
            bookmarkFilter={bookmarkFilter}
            autoClassified={autoClassified}
            commontFilter={commontFilter}
            folderFilter={folderFilter}
            defectFilter={defectFilter}
            groundTruth={groundTruth}
            gtModel={gtModel}
            autoModelFilter={autoModelFilter}
            wafermap={wafermap}
            typeData={typeData}
            setFilters={setFilters}
            filters={filters}
            lightTheme={lightTheme}
            waferTagFilter={waferTagFilter}
            uploadSessionTagFilter={uploadSessionTagFilter}
            filesetTagFilter={filesetTagFilter}
            aiOutputFilter={aiOutputFilter}
            reviewedFilter={reviewedFilter}
            waferStatus={waferStatus}
            waferMetaInfoFilter={waferMetaInfoFilter}
            modelStatusFilter={modelStatusFilter}
          />

          <Box p={1} pr={0} display='flex' alignItems='center'>
            {/* <Box mx={1} p={0.375} display="flex" className={classes.toggle}>
							<Box
								px={0.625}
								onClick={() => handleAdvanceFilter('Simple')}
								className={filterMode === 'Simple' ? classes.activeBtn : ''}
							>
								<Typography className={classes.toggleBtn}>Simple</Typography>
							</Box>
							<Box
								px={0.625}
								onClick={() => handleAdvanceFilter('Advanced')}
								className={filterMode === 'Advanced' ? classes.activeBtn : ''}
							>
								<Typography className={classes.toggleBtn}>Advanced</Typography>
							</Box>
						</Box> */}
            <FilterActions
              handleApplyFilters={handleApplyFilters}
              handleClearFilters={handleClearFilters}
              lightTheme={lightTheme}
            />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      id='advanceFilter'
      pb={0}
      className={classes.root}
      onKeyDown={e => e.stopPropagation()}
    >
      <TextField
        fullWidth
        className={lightTheme ? classes.lightFilterBar : classes.filterBar}
        size='small'
        variant='outlined'
        InputProps={{
          endAdornment: (
            <Box p={1} pr={0} display='flex' alignItems='center'>
              {/* <ModeSelector
								onChange={handleAdvanceFilter}
								active={filterMode}
								modes={filterModeList}
								lightTheme={lightTheme}
							/> */}
              <CommonButton
                text='Apply Filters'
                onClick={() => {}}
                size='sm'
                variant={lightTheme ? 'primary' : 'secondary'}
                icon={<FontAwesomeIcon icon={faFilter} />}
              />
            </Box>
          )
        }}
      />
    </Box>
  );
};

export default AdvanceFilter;
