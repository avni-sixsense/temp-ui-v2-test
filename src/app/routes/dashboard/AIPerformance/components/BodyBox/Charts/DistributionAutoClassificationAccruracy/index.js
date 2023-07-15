import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { decodeURL, encodeURL } from 'app/utils/helpers';
import queryString from 'query-string';
import { useLocation, useParams } from 'react-router-dom';

import {
  usecaseDistributionFileColumns,
  usecaseDistributionWaferColumns
} from '../../../columns';
import ScrollingPaginatedTable from 'app/components/ScrollingPaginatedTable';
import { AI_PERFORMANCE_ROUTES } from 'store/aiPerformance/constants';
import {
  getDistributionClassificationAccuracyImage,
  getDistributionClassificationAccuracyWafer
} from 'app/api/AiPerformance/UAT';
import useApi from 'app/hooks/useApi';
import WithCondition from 'app/hoc/WithCondition';
import VirtualTable from 'app/components/VirtualTable';
import { FILTER_KEYS } from 'app/utils/constants';

const useStyles = makeStyles(theme => ({
  dataTableHeader: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  header: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  tableContainer: {
    width: '100%',
    overflow: 'auto',
    '& [class*="MuiTableContainer-root"]': {
      overflow: 'auto',
      maxHeight: '500px',
      marginTop: 0,
      '&::-webkit-scrollbar': {
        width: '8px'
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 0px white',
        borderRadius: '5px'
      },

      '&::-webkit-scrollbar-thumb': {
        backgroundColor: ' #dfdcdc',
        borderRadius: '10px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#cecece'
      }
    }
  },
  clickableCell: {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      color: 'inherit'
    }
  }
}));

const DistributionAutoClsasificationAccuracy = () => {
  const classes = useStyles();

  const { UNIT_IMAGES, UNIT_WAFER } = AI_PERFORMANCE_ROUTES;

  const {
    BOOKMARK_FILTER_KEY,
    DATE_FILTERS_KEYS,
    FOLDER_FILTER_KEY,
    GROUND_TRUTH_FILTER_KEY,
    IMAGE_TAG_FILTER_KEY,
    ML_MODEL_FILTER_KEY,
    TRAINING_TYPE_FILTER_KEY,
    USECASE_FILTER_KEY,
    WAFER_FILTER_KEY
  } = FILTER_KEYS;

  const location = useLocation();
  const { subscriptionId, packId, unit } = useParams();

  const { data = [], isLoading } = useApi(
    getDistributionClassificationAccuracyWafer,
    {
      allowedKeys: [
        ...DATE_FILTERS_KEYS,
        FOLDER_FILTER_KEY,
        USECASE_FILTER_KEY,
        WAFER_FILTER_KEY,
        IMAGE_TAG_FILTER_KEY,
        ML_MODEL_FILTER_KEY,
        GROUND_TRUTH_FILTER_KEY,
        TRAINING_TYPE_FILTER_KEY,
        BOOKMARK_FILTER_KEY
      ]
    },
    { enabled: unit === UNIT_WAFER.path }
  );

  const createURL = (data = {}) => {
    if (unit === UNIT_IMAGES.path) {
      const parsedParams = queryString.parse(location.search, {
        arrayFormat: 'comma',
        parseNumbers: true
      });

      const contextualFilters = decodeURL(parsedParams.contextual_filters);
      const otherFilters = decodeURL(parsedParams.other_filters);

      const params = queryString.stringify({
        contextual_filters: encodeURL(
          {
            ...contextualFilters,
            ...otherFilters,
            ...data
          },
          { arrayFormat: 'comma' }
        )
      });

      return `/${subscriptionId}/${packId}/annotation/review?${params}`;
    }
  };

  const modalPerformanceURLHandler = value => {
    const params = queryString.stringify({
      contextual_filters: encodeURL(
        {
          date: 'ALL_DATE_RANGE',
          ...value
        },
        { arrayFormat: 'comma' }
      )
    });
    const modelId = value.ml_model_id__in;
    return `/${subscriptionId}/${packId}/library/model/performance/${modelId}?${params}`;
  };

  const tableHeight = Math.max(window.innerHeight - 260, 400);

  return (
    <Box>
      <Paper>
        <Box mb={3.75} pb={1.5}>
          <Box
            className={classes.header}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            pl={2.5}
            py={1}
            pr={1.25}
          >
            <Box display='flex' alignItems='center'>
              <Box>
                <Typography className={classes.dataTableHeader}>
                  Distribution of Auto-classification & accuracy
                </Typography>
              </Box>
            </Box>
            <Box display='flex' alignItems='center'>
              {/* <CommonButton
									icon={<FontAwesomeIcon icon={faArrowAltFromTop} />}
									size="sm"
									variant="tertiary"
									text="Export"
									wrapperClass={classes.btns}
									onClick={() => {}}
								/> */}
            </Box>
          </Box>
          <Box width='100%' display='flex'>
            <Box className={classes.tableContainer}>
              <WithCondition
                when={unit === UNIT_IMAGES.path}
                then={
                  <ScrollingPaginatedTable
                    columns={usecaseDistributionFileColumns(
                      createURL,
                      classes,
                      modalPerformanceURLHandler
                    )}
                    asyncFn={getDistributionClassificationAccuracyImage}
                    asyncFnParams={{
                      allowedKeys: [
                        ...DATE_FILTERS_KEYS,
                        FOLDER_FILTER_KEY,
                        USECASE_FILTER_KEY,
                        WAFER_FILTER_KEY,
                        IMAGE_TAG_FILTER_KEY,
                        ML_MODEL_FILTER_KEY,
                        GROUND_TRUTH_FILTER_KEY,
                        TRAINING_TYPE_FILTER_KEY,
                        BOOKMARK_FILTER_KEY
                      ]
                    }}
                    fetchSize={20}
                    height={tableHeight}
                  />
                }
                or={
                  <VirtualTable
                    columns={usecaseDistributionWaferColumns(
                      modalPerformanceURLHandler
                    )}
                    data={data}
                    isLoading={isLoading}
                    height={tableHeight}
                  />
                }
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DistributionAutoClsasificationAccuracy;
