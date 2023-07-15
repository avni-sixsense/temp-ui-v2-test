import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { NumberFormater, encodeURL, decodeURL } from 'app/utils/helpers';
import { getParamsObjFromEncodedString } from 'app/utils/helpers';
import { AI_PERFORMANCE_ROUTES } from 'store/aiPerformance/constants';
import queryString from 'query-string';

const { UNIT_WAFER, UNIT_IMAGES } = AI_PERFORMANCE_ROUTES;

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[18]
  },
  root: {
    borderRadius: '8px',
    backgroundColor: theme.colors.grey[0],
    boxShadow: theme.colors.shadow.base,
    minWidth: '200px'
  },
  value: {
    fontSize: '1.875rem',
    fontWeight: 700,
    color: theme.colors.grey[18]
  },
  subTitleKey: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10],
    whiteSpace: 'nowrap'
  },
  subTitleValue: {
    fontSize: '0.8125rem',
    fontWeight: 700,
    color: theme.colors.grey[10]
  },
  btns: {
    marginLeft: theme.spacing(1)
  },
  titleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  isErrorCard: {
    fontWeight: 700,
    fontSize: '14px',
    color: theme.colors.red[600],
    paddingLeft: theme.spacing(1.875),
    paddingBottom: theme.spacing(0.875)
  },
  positiveImprovement: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: theme.colors.green[600],
    paddingBottom: theme.spacing(0.25),
    paddingLeft: theme.spacing(1)
  },
  negativeImprovement: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: theme.colors.red[600],
    paddingBottom: theme.spacing(0.25),
    paddingLeft: theme.spacing(1)
  },
  versusText: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10],
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(0.5)
  },
  cursor: {
    cursor: 'pointer'
  },
  holdCardBorder: {
    border: `1px solid ${theme.colors.red[700]}`
  }
}));

const useStylesBootstrap = makeStyles(theme => ({
  arrow: {
    color: theme.palette.common.black
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontWeight: 500,
    fontSize: '0.75rem'
  }
}));

const DataCard = ({
  subTitle = {},
  wrapperClass = '',
  isLoading,
  cardList,
  containerOuter = '',
  isModelPerformance = false
}) => {
  const classes = useStyles();
  const tooltipClasses = useStylesBootstrap();
  const { subscriptionId, packId, unit } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const handleCardClick = data => {
    if (unit === UNIT_WAFER.path) {
      const finalParamObj = getParamsObjFromEncodedString(`${location.search}`);

      const paramsObj = {};

      if (data?.status__in) {
        finalParamObj.status__in = data?.status__in;
      }

      if (finalParamObj.use_case_id__in) {
        paramsObj.use_case_id__in = finalParamObj?.use_case_id__in;
        delete finalParamObj.use_case_id__in;
      }

      if (finalParamObj.wafer_id__in) {
        paramsObj.wafer_id__in = finalParamObj?.wafer_id__in;
        delete finalParamObj.wafer_id__in;
      }

      if (data?.use_case_id__in) {
        paramsObj.use_case_id__in = data?.use_case_id__in;
      }

      if (data?.wafer_id__in) {
        paramsObj.wafer_id__in = data?.wafer_id__in;
      }
      finalParamObj.use_case__type__in = 'CLASSIFICATION';

      const params = { contextual_filters: encodeURL(finalParamObj) };

      if (Object.keys(paramsObj).length) {
        params.other_filters = encodeURL(paramsObj);
      }

      navigate(
        `/${subscriptionId}/${packId}/dashboard/wafer-book?${queryString.stringify(
          params
        )}`
      );
    } else if (unit === UNIT_IMAGES.path || isModelPerformance) {
      let parsedParams = queryString.parse(location.search, {
        arrayFormat: 'comma',
        parseNumbers: true
      });

      const contextualFilters = decodeURL(parsedParams.contextual_filters);
      const otherFilters = decodeURL(parsedParams.other_filters);

      parsedParams = {
        ...parsedParams,
        ...data,
        use_case__type__in: 'CLASSIFICATION'
      };

      const params = queryString.stringify({
        contextual_filters: encodeURL(
          {
            ...contextualFilters,
            ...otherFilters,
            ...data,
            use_case__type: 'CLASSIFICATION',
            use_case__classification_type: 'SINGLE_LABEL'
          },
          { arrayFormat: 'comma' }
        )
      });

      navigate(`/${subscriptionId}/${packId}/annotation/review?${params}`);
    }
  };

  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='flex-start'
      flexWrap='wrap'
      width='100%'
      className={containerOuter}
    >
      {cardList.map(
        (
          {
            list,
            title,
            value,
            improvement,
            isPercent,
            isHoldCard,
            key,
            isErrorCard,
            onClickData
          },
          index
        ) => {
          const onClick =
            onClickData && value !== 'N/A' && value !== 0
              ? () => handleCardClick(onClickData)
              : undefined;

          const tooltip =
            isHoldCard && (value === 'N/A' || value === 0)
              ? 'No wafer to classify.'
              : '';
          return (
            <Tooltip classes={tooltipClasses} title={tooltip} key={index}>
              <Box
                onClick={onClick || (() => {})}
                flex={1}
                mr={1.5}
                my={0.75}
                className={`${classes.root} ${wrapperClass} ${
                  onClick ? classes.cursor : ''
                } ${
                  isHoldCard && value !== 0 && value !== 'N/A'
                    ? classes.holdCardBorder
                    : ''
                }`}
              >
                <Box
                  className={classes.titleContainer}
                  py={0.5}
                  pl={1.75}
                  // pr={1.25}
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Box>
                    <Typography className={classes.title}>{title}</Typography>
                  </Box>
                  <Box>
                    {/* <CommonButton
          icon={<FontAwesomeIcon icon={faArrowAltFromTop} />}
          size="sm"
          variant="tertiary"
          wrapperClass={classes.btns}
        /> */}
                  </Box>
                </Box>
                <Box pl={1.5} pr={1.25}>
                  {isLoading ? (
                    <Box py={2} display='flex' alignItems='center'>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Box display='flex' alignItems='flex-end'>
                        <Typography className={classes.value}>
                          {NumberFormater(value)}
                          {isPercent ? '%' : null}
                        </Typography>
                        {(improvement || improvement === 0) && (
                          <Typography
                            className={
                              (improvement || improvement === 0) &&
                              improvement >= 0
                                ? classes.positiveImprovement
                                : classes.negativeImprovement
                            }
                          >
                            {improvement >= 0
                              ? `${`+${improvement}%`}`
                              : `${`${improvement}%`}`}
                          </Typography>
                        )}
                        {isErrorCard > 0 && (
                          <Typography
                            className={classes.isErrorCard}
                          >{`${isErrorCard} wafers failed`}</Typography>
                        )}
                        {(improvement || improvement === 0) && (
                          <Typography
                            className={classes.versusText}
                          >{` vs Target: 90%`}</Typography>
                        )}
                      </Box>
                      <Box pb={1.5} display='flex' alignItems='center'>
                        {Object.keys(subTitle).map((x, index) => (
                          <Box
                            display='flex'
                            alignItems='center'
                            mr={6}
                            key={index}
                          >
                            <Typography
                              className={classes.subTitleKey}
                            >{`${x}: `}</Typography>
                            <Typography className={classes.subTitleValue}>
                              {subTitle[x]}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Tooltip>
          );
        }
      )}
    </Box>
  );
};

export { DataCard };
