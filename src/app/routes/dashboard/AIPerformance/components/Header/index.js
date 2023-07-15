import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { FilterUrl } from 'app/components/FiltersV2';
import { FILTER_IDS, DATE_RANGE_KEYS } from 'app/constants/filters';
import { decodeURL, encodeURL } from 'app/utils/helpers';
import { goToRoute } from 'app/utils/navigation';
import { memo, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setConfusionUsecase } from 'store/aiPerformance/actions';
import { AI_PERFORMANCE_ROUTES } from 'store/aiPerformance/constants';
import queryString from 'query-string';

import TimerContainer from './components/Timer';
import { getFiltersMeta } from 'app/utils/filters';

const { MONITORING, ON_DEMAND_AUDIT, UAT, UNIT_IMAGES, UNIT_WAFER } =
  AI_PERFORMANCE_ROUTES;

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: theme.colors.grey[19]
  },
  subHeader: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[19]
  },
  container: {
    backgroundColor: theme.colors.grey[0]
  },
  widgetContainer: {
    borderRadius: '8px',
    backgroundColor: theme.colors.grey[1],
    border: `0.5px solid ${theme.colors.grey[5]}`
  },
  popperTitleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  gridContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  gridNumber: {
    borderRadius: '4px',
    backgroundColor: theme.colors.grey[3],
    width: '77px',
    height: '40px',
    cursor: 'pointer'
  },
  activeGridNumber: {
    borderRadius: '4px',
    backgroundColor: theme.colors.blue[300],
    width: '77px',
    height: '40px',
    cursor: 'pointer'
  },
  popperContainer: {
    width: 359,
    height: 194,
    boxShadow: theme.colors.shadow.lg
  },
  modeContainer: {
    backgroundColor: theme.colors.grey[1],
    border: `1px solid ${theme.colors.grey[5]}`,
    padding: theme.spacing(0.25, 0.25, 0.25, 1),
    borderRadius: '4px',
    fontSize: '12px'
  },
  modeTitle: {
    fontWeight: 500,
    color: theme.colors.grey[12]
  },
  selectedMode: {
    padding: theme.spacing(0.125, 0.5, 0.375, 0.5),
    backgroundColor: theme.colors.blue[600],
    borderRadius: '4px',
    '& p': {
      fontWeight: 600,
      color: `${theme.colors.grey[0]} !important`
    },
    cursor: 'pointer'
  },
  normalMode: {
    padding: theme.spacing(0.125, 0.5, 0.375, 0.5),
    backgroundColor: theme.colors.grey[0],
    borderRadius: '4px',
    border: `1px solid ${theme.colors.grey[4]}`,
    '& p': {
      fontWeight: 600,
      color: `${theme.colors.grey[19]} !important`
    },
    cursor: 'pointer'
  }
}));

const PRIMARY = 'primary';
const SECONDARY = 'secondary';
const IS_META_FILTERS = 'isMetaFilters';

const {
  DATE,
  USE_CASE,
  WAFER,
  BOOKMARK,
  FOLDER,
  MODEL,
  TRAINING_TYPE,
  GROUND_TRUTH,
  IMAGE_TAG
} = FILTER_IDS;

const FILTERS_LIST = {
  [MONITORING.path]: {
    [UNIT_WAFER.path]: {
      [PRIMARY]: [
        { id: DATE, defaultValue: DATE_RANGE_KEYS.LAST_7_DAYS },
        USE_CASE,
        WAFER
      ],
      [SECONDARY]: [],
      [IS_META_FILTERS]: true
    },
    [UNIT_IMAGES.path]: {
      [PRIMARY]: [
        { id: DATE, defaultValue: DATE_RANGE_KEYS.LAST_7_DAYS },
        USE_CASE,
        WAFER,
        GROUND_TRUTH
      ],
      [SECONDARY]: [BOOKMARK],
      [IS_META_FILTERS]: true
    }
  },
  [ON_DEMAND_AUDIT.path]: {
    [UNIT_WAFER.path]: {
      [PRIMARY]: [DATE, USE_CASE, WAFER, GROUND_TRUTH],
      [SECONDARY]: [],
      [IS_META_FILTERS]: true
    },
    [UNIT_IMAGES.path]: {
      [PRIMARY]: [DATE, USE_CASE, WAFER, GROUND_TRUTH],
      [SECONDARY]: [BOOKMARK],
      [IS_META_FILTERS]: true
    }
  },
  [UAT.path]: {
    [UNIT_WAFER.path]: {
      [PRIMARY]: [DATE, FOLDER, USE_CASE, WAFER, MODEL, IMAGE_TAG],
      [SECONDARY]: []
    },
    [UNIT_IMAGES.path]: {
      [PRIMARY]: [
        DATE,
        FOLDER,
        USE_CASE,
        WAFER,
        MODEL,
        IMAGE_TAG,
        GROUND_TRUTH,
        { id: TRAINING_TYPE, label: 'Type' }
      ],
      [SECONDARY]: [BOOKMARK]
    }
  }
};

const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { subscriptionId, packId, ...remainingParams } = useParams();
  const [mode, unit] = remainingParams['*'].split('/');

  const navigate = useNavigate();

  useEffect(() => {
    if (mode === MONITORING.path) {
      dispatch(setConfusionUsecase({}));
      sessionStorage.removeItem('confusionUsecase');
    }
  }, [mode]);

  const handleModeChange = currentMode => {
    if (mode !== currentMode) {
      goToRoute(navigate, `${currentMode}/${unit}`);
    }
  };

  const handleUnitChange = currentUnit => {
    if (unit !== currentUnit) {
      const navigateToPath = goToRoute(undefined, `${mode}/${currentUnit}`);

      const { contextual_filters, other_filters } = queryString.parse(
        navigateToPath.split('?')[1]
      );

      const nextRouteParams = decodeURL(other_filters, true);

      const currentRouteParams = decodeURL(
        queryString.parse(window.location.search).other_filters,
        true
      );

      const currentFilterList = new Set(
        [
          ...FILTERS_LIST[mode][unit][PRIMARY],
          ...FILTERS_LIST[mode][unit][SECONDARY]
        ].map(d => getFiltersMeta(typeof d === 'string' ? d : d.id).url_key)
      );

      const nextRouteFilterList = new Set(
        [
          ...FILTERS_LIST[mode][currentUnit][PRIMARY],
          ...FILTERS_LIST[mode][currentUnit][SECONDARY]
        ].map(d => getFiltersMeta(typeof d === 'string' ? d : d.id).url_key)
      );

      const otherFilters = { ...nextRouteParams, ...currentRouteParams };

      Object.keys(otherFilters).forEach(d => {
        if (d.includes('meta_info__')) {
          if (!FILTERS_LIST[mode][currentUnit][IS_META_FILTERS]) {
            delete otherFilters[d];
          }
        } else if (
          !nextRouteFilterList.has(d) ||
          (currentFilterList.has(d) && !currentRouteParams[d])
        ) {
          delete otherFilters[d];
        }
      });

      const params = { contextual_filters: contextual_filters };

      if (Object.keys(otherFilters).length) {
        params.other_filters = encodeURL(otherFilters);
      }

      navigate(
        `/${subscriptionId}/${packId}/dashboard/ai-performance/${mode}/${currentUnit}?${queryString.stringify(
          params
        )}`
      );
    }
  };

  const primaryFilters = useMemo(
    () => FILTERS_LIST[mode][unit][PRIMARY],
    [mode, unit]
  );
  const secondaryFilters = useMemo(
    () => FILTERS_LIST[mode][unit][SECONDARY],
    [mode, unit]
  );
  const isFilterSetMetaFilters = useMemo(
    () => FILTERS_LIST[mode][unit][IS_META_FILTERS],
    [mode, unit]
  );
  const ignoreFilterKeys = useMemo(() => ['ml_model_status__in'], []);

  return (
    <Box pt={1} pb={1} pr={1} pl={1} mb={0.25} className={classes.container}>
      <Box mb={1.75} display='flex' alignItems='center'>
        <Typography className={classes.header}>AI Performance:</Typography>
        {/* <Typography className={classes.subHeader}>You can see the perfromance of AI on this page.</Typography> */}
        <Box
          className={classes.modeContainer}
          display='flex'
          alignItems='center'
          ml={1.5}
        >
          <Typography className={classes.modeTitle}>MODE:</Typography>
          <Box
            onClick={() => handleModeChange(MONITORING.path)}
            ml={0.75}
            className={
              mode === MONITORING.path
                ? classes.selectedMode
                : classes.normalMode
            }
          >
            <Typography>{MONITORING.label}</Typography>
          </Box>

          <Box
            onClick={() => handleModeChange(ON_DEMAND_AUDIT.path)}
            ml={0.75}
            className={
              mode === ON_DEMAND_AUDIT.path
                ? classes.selectedMode
                : classes.normalMode
            }
          >
            <Typography>{ON_DEMAND_AUDIT.label}</Typography>
          </Box>

          <Box
            onClick={() => handleModeChange(UAT.path)}
            ml={0.75}
            className={
              mode === UAT.path ? classes.selectedMode : classes.normalMode
            }
          >
            <Typography>{UAT.label}</Typography>
          </Box>
        </Box>

        <Box
          className={classes.modeContainer}
          display='flex'
          alignItems='center'
          ml={1.25}
          mr={2.5}
        >
          <Typography className={classes.modeTitle}>UNIT:</Typography>
          {/* <Box
						onClick={() => handleUnitChange('lot')}
						ml={0.75}
						className={unit === 'lot' ? classes.selectedMode : classes.normalMode}
					>
						<Typography>Lot</Typography>
					</Box> */}
          <Box
            onClick={() => handleUnitChange(UNIT_WAFER.path)}
            ml={0.75}
            className={
              unit === UNIT_WAFER.path
                ? classes.selectedMode
                : classes.normalMode
            }
          >
            <Typography>{UNIT_WAFER.label}</Typography>
          </Box>

          <Box
            onClick={() => handleUnitChange(UNIT_IMAGES.path)}
            ml={0.75}
            className={
              unit === UNIT_IMAGES.path
                ? classes.selectedMode
                : classes.normalMode
            }
          >
            <Typography>{UNIT_IMAGES.label}</Typography>
          </Box>
        </Box>

        <TimerContainer mode={mode} />
      </Box>

      <Box width='100%'>
        <FilterUrl
          key={mode}
          primaryFilters={primaryFilters}
          secondaryFilters={secondaryFilters}
          isFilterSetMetaFilters={isFilterSetMetaFilters}
          ignoreFilterKeys={ignoreFilterKeys}
        />
      </Box>
    </Box>
  );
};

export default memo(Header);
