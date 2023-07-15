/* eslint-disable func-names */
/* eslint-disable react/no-this-in-sfc */
import { faArrowAltFromTop } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
// import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
// import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
// import ExpandMore from '@material-ui/icons/ExpandMore'
import EmptyState from 'app/components/EmptyState';
import CommonButton from 'app/components/ReviewButton';
import SearchBar from 'app/components/SearchBar/searchBar';
import { decodeURL, encodeURL, NumberFormater } from 'app/utils/helpers';
import arrowDown from 'assests/images/arrow_long_down.svg';
import arrowRight from 'assests/images/arrow_long_right.svg';
import info from 'assests/images/info.svg';
import SortIcon from 'assests/images/sortingIcon.svg';
import $ from 'jquery';
import lowerCase from 'lodash/toLower';
// import sortBy from 'lodash/sortBy'
import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { sortDefectsForMatrix } from 'store/aiPerformance/actions';
import { selectConfusionMatrics } from 'store/aiPerformance/selectors';
// import { setUploadSession } from 'store/reviewData/actions'

const useStyle = makeStyles(theme => ({
  heading: {
    borderBottom: '0.5px solid rgba(208,208,208,0.5)'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 83,
    '& .MuiOutlinedInput-root': {
      '& .MuiSelect-outlined.MuiSelect-outlined': {
        padding: theme.spacing(1.25)
      }
    }
  },
  csv: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none'
    }
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  subTitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  btns: {
    marginLeft: theme.spacing(1)
  },
  axisLabels: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[22]
  },
  totalPredictedTitle: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.colors.grey[22]
  },
  cellText: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.colors.grey[22]
  },
  defectNames: {
    fontSize: '0.5625rem',
    fontWeight: 400,
    color: theme.colors.grey[22]
  },
  sortIconBoth: {
    width: '10px'
  },
  sortIcons: {
    color: '#91969D'
  }
}));

const mapAiPerformanceState = createStructuredSelector({
  confusionMatrix: selectConfusionMatrics
});

const ConfusionMatrix = ({ columnCount, mlModelId, modelSelection }) => {
  const { subscriptionId, packId } = useParams();

  const { confusionMatrix } = useSelector(mapAiPerformanceState);

  const {
    isLoading: matrixLoading,
    data: { matrix = {}, matrixMeta = {} },
    isError
  } = confusionMatrix;
  const [confusionMatrixOrder, setConfusionMatrixOrder] = useState('asc');
  const location = useLocation();

  const [csvData, setCsvData] = useState([]);

  const [data, setData] = useState({});

  const [visibleMatrixConfig, setVisibleMatrixConfig] = useState({
    rows: 0,
    columns: 0
  });
  const [matrixGridConfig, setMatrixGridConfig] = useState({
    rows: 0,
    columns: 0
  });
  const [value, setValue] = useState([]);

  const classes = useStyle();

  const [show, setShow] = useState(true);

  // const dispatch = useDispatch()

  useEffect(() => {
    if (matrix.length) {
      setData(sortDefectsForMatrix(confusionMatrixOrder, matrix));
      setMatrixGridConfig({
        rows: matrix.length,
        columns: matrix[0].ai_defects.length
      });
      setVisibleMatrixConfig({
        rows: Math.min(matrix.length, columnCount),
        columns: Math.min(matrix[0].ai_defects.length, columnCount)
      });
    }
  }, [matrix, confusionMatrixOrder, columnCount]);

  const handleGetURL = (count, actual, predicted, totalActual) => {
    // if (count) {
    const currentParams = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });

    const contextualFilters = decodeURL(currentParams.contextual_filters);
    const otherFilters = decodeURL(currentParams.other_filters);

    delete contextualFilters.packId;
    delete otherFilters.packId;

    const q = {};

    if (actual) {
      q.ground_truth_label__in = actual;
    }

    if (predicted && predicted !== -1) {
      q.ai_predicted_label__in = predicted;
    }

    q.model_selection = modelSelection;

    if (!totalActual) {
      q.is_confident_defect = predicted !== -1;
    }

    if (!totalActual) {
      q.is_confident_defect = predicted !== -1;
    }

    const params = queryString.stringify({
      contextual_filters: encodeURL(
        {
          ...contextualFilters,
          ...otherFilters,
          ml_model_id__in: mlModelId,
          ...q
        },
        { arrayFormat: 'comma' }
      )
    });

    return `/${subscriptionId}/${packId}/annotation/review?${params}`;
    // }
  };

  const createLink = useCallback(
    (count, actual, predicted, totalActual) => {
      if (count) {
        const generatedURL = handleGetURL(
          count,
          actual,
          predicted,
          totalActual
        );

        return `${window.location.origin}${generatedURL}`;
      }
    },
    [subscriptionId, location.search]
  );
  const createMatrixData = useCallback(
    row => {
      const rowData = [];
      const id = row.defect.id;
      rowData.push(row.defect.name);
      row.ai_defects.forEach(row => {
        rowData.push(
          row.count
            ? `=HYPERLINK(""${createLink(row.count, id, id)}"";${row.count})`
            : row.count
        );
      });
      rowData.push(
        matrixMeta[id].gt_count
          ? `=HYPERLINK(""${createLink(
              matrixMeta[id].gt_count,
              id,
              undefined,
              true
            )}"";${matrixMeta[id].gt_count})`
          : matrixMeta[id].gt_count
      );
      rowData.push(matrixMeta[id].recall);
      return rowData;
    },
    [data, createLink]
  );
  useEffect(() => {
    if (Object.keys(data).length && Object.keys(matrixMeta).length) {
      const csv = [];
      const xLabel = ['', '', '', 'AI Labels'];
      const headerList = ['', '', ''];
      const totalPredicted = ['', 'Total Predicted'];
      const classwisePrecision = ['', 'Classwise Precision'];
      csv.push(['In distribution labels']);
      csv.push(xLabel);
      if (Object.keys(data).length > 0) {
        const [firstDefect] = data.inDistribution;
        (firstDefect?.ai_defects || []).map(aiDefect =>
          headerList.push(aiDefect.defect.name)
        );
        data.inDistribution.forEach((headers, index) => {
          totalPredicted.push(
            matrixMeta[headers.defect.id].model_count
              ? `=HYPERLINK(""${createLink(
                  matrixMeta[headers.defect.id].model_count,
                  undefined,
                  headers.ai_defects[index].defect.id
                )}"";${matrixMeta[headers.defect.id].model_count})`
              : matrixMeta[headers.defect.id].model_count
          );
          classwisePrecision.push(matrixMeta[headers.defect.id].precision);
        });
        headerList.push('Total Actual');
        headerList.push('Classwise Recall');
        csv.push(headerList);
        data.inDistribution.forEach((row, index) => {
          if (index === 0) {
            csv.push(['', 'User Labels', ...createMatrixData(row)]);
          } else {
            csv.push(['', '', ...createMatrixData(row)]);
          }
        });
        csv.push(['Out of distribution labels']);
        data.outOfDistribution.forEach(row => {
          csv.push(['', '', ...createMatrixData(row)]);
        });

        csv.push(totalPredicted);
        csv.push(classwisePrecision);
      }
      setCsvData(csv);
    }
  }, [data, createMatrixData, createLink]);

  const handleMatrixDisplay = () => {
    setShow(!show);
  };

  // const options = () => {
  //   const temp = [];
  //   const maxRows = matrixGridConfig ? Math.min(matrixGridConfig, 18) : 18;
  //   for (let index = maxRows - 5; index <= maxRows; index += 1) {
  //     temp.push(
  //       <MenuItem value={index} key={index}>
  //         {index}
  //       </MenuItem>
  //     );
  //   }
  //   return temp;
  // };

  const handleChange = event => {
    setVisibleMatrixConfig(event.target.value);
  };

  // need to find better solution for scroll bind
  const handleScroll = () => {
    $('#grid').scroll(function () {
      $('#predicted').prop('scrollTop', this.scrollTop);
      $('#v-scroll').prop('scrollTop', this.scrollTop);
      $('#total-predicted').prop('scrollLeft', this.scrollLeft);
      $('#precision').prop('scrollLeft', this.scrollLeft);
      $('#actual').prop('scrollLeft', this.scrollLeft);
      $('#h-scroll').prop('scrollLeft', this.scrollLeft);
      $('#total-actual').prop('scrollTop', this.scrollTop);
      $('#recall').prop('scrollTop', this.scrollTop);
    });
  };

  const handleHorizontalScroll = () => {
    $('#h-scroll').scroll(function () {
      $('#actual').prop('scrollLeft', this.scrollLeft);
      $('#grid').prop('scrollLeft', this.scrollLeft);
      $('#total-predicted').prop('scrollLeft', this.scrollLeft);
      $('#precision').prop('scrollLeft', this.scrollLeft);
    });
  };

  const handleConfusionMatrixOrder = () => {
    if (confusionMatrixOrder === 'asc') {
      setConfusionMatrixOrder('desc');
    } else if (confusionMatrixOrder === 'desc' || !confusionMatrixOrder) {
      setConfusionMatrixOrder('asc');
    }
  };

  return (
    <Paper>
      <Box mb={2} pl={1} pt={1.125} pb={2.375}>
        <Box
          my={1}
          pl={1}
          pr={1.25}
          display='flex'
          pb={0.875}
          justifyContent='space-between'
          className={`${classes.heading}`}
        >
          <Box display='flex'>
            <Box>
              <Typography className={classes.title}>
                Confusion Matrix
              </Typography>
              <Typography className={classes.subTitle}>
                This table is misclassification between two defect.
              </Typography>
            </Box>
          </Box>
          <Box display='flex' alignItems='center'>
            {/* <CommonButton
						icon={<FontAwesomeIcon icon={faCog} />}
						size="sm"
						variant="tertiary"
						wrapperClass={classes.btns}
					/> */}
            <CSVLink
              filename='Confusion Matrix.csv'
              data={csvData}
              className={classes.csv}
            >
              <CommonButton
                icon={<FontAwesomeIcon icon={faArrowAltFromTop} />}
                size='sm'
                variant='tertiary'
                text='Export'
                wrapperClass={classes.btns}
                // onClick={() => {}}
              />
            </CSVLink>
          </Box>
        </Box>
        {matrixLoading ? (
          <Box display='flex' justifyContent='center'>
            <CircularProgress />
          </Box>
        ) : (
          <Collapse in={show}>
            <Grid container className='confusion-grid'>
              {isError ? (
                <Box width='100%' textAlign='center'>
                  <Typography>Something went wrong.</Typography>
                </Box>
              ) : !matrixLoading && Object.entries(matrix).length === 0 ? (
                <Box width='100%' textAlign='center'>
                  <EmptyState />
                </Box>
              ) : (
                <>
                  <Grid item container xs={12} justifyContent='center'>
                    <Grid xs={12} item>
                      <Box
                        display='flex'
                        justifyContent='flex-end'
                        width='100%'
                      >
                        <Box width='400px'>
                          <SearchBar
                            fullWidth
                            data={Object.values(matrix).map(
                              item => item.defect
                            )}
                            isLoading={matrixLoading}
                            value={value}
                            setValue={setValue}
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <div
                        className='container'
                        style={{
                          gridTemplateColumns: `35px 70px ${
                            visibleMatrixConfig.columns * 41
                          }px 41px 41px 4px`,
                          gridTemplateRows: `35px 60px ${
                            visibleMatrixConfig.rows * 41
                          }px 41px 41px 4px`
                        }}
                      >
                        <div className='v-nav'>
                          <img src={info} alt='' />
                          <Typography className={classes.axisLabels}>
                            User Labels
                          </Typography>

                          <img
                            src={arrowDown}
                            alt='arrow down'
                            className='my-1'
                          />
                        </div>
                        <div className='h-nav'>
                          <img src={info} alt='' />
                          <Typography className={classes.axisLabels}>
                            AI Labels
                          </Typography>

                          <Box
                            display='flex'
                            flexDirection='column'
                            alignItems='center'
                            justifyContent='center'
                            onClick={handleConfusionMatrixOrder}
                          >
                            {!confusionMatrixOrder && (
                              <img
                                className={classes.sortIconBoth}
                                src={SortIcon}
                                alt='sort'
                              />
                            )}
                            {confusionMatrixOrder === 'asc' && (
                              <ArrowDropUpIcon className={classes.sortIcons} />
                            )}
                            {confusionMatrixOrder === 'desc' && (
                              <ArrowDropDownIcon
                                className={classes.sortIcons}
                              />
                            )}
                          </Box>
                          <img src={arrowRight} alt='' />
                        </div>
                        <div
                          className='actual-data'
                          id='actual'
                          style={{
                            gridTemplateColumns: `repeat(${matrixGridConfig.columns}, 41px)`
                          }}
                        >
                          {Object.values(data)
                            .flat()
                            .map((column, index) => {
                              if (index) {
                                return null;
                              }
                              return column.ai_defects.map(
                                (prediction, index) => {
                                  return (
                                    <div
                                      className={`${classes.defectNames} head-cell`}
                                      key={index}
                                    >
                                      {lowerCase(
                                        `${
                                          prediction.defect
                                            .organization_defect_code || ''
                                        } - ${prediction.defect.name}`
                                      )}
                                    </div>
                                  );
                                }
                              );
                            })}
                        </div>
                        <div
                          className='predicted'
                          id='predicted'
                          style={{
                            gridTemplateRows: `repeat(${matrixGridConfig.rows}, 41px)`
                          }}
                        >
                          {Object.values(data)
                            .flat()
                            .map((actual, index) => {
                              return (
                                <div
                                  key={index}
                                  className={`${classes.defectNames} head-cell`}
                                >
                                  {lowerCase(
                                    `${
                                      actual.defect.organization_defect_code ||
                                      ''
                                    } - ${actual.defect.name}`
                                  )}
                                </div>
                              );
                            })}
                        </div>
                        <div
                          className='data-container'
                          id='grid'
                          style={{
                            gridTemplateColumns: `repeat(${matrixGridConfig.columns}, 41px)`,
                            gridTemplateRows: ` repeat(${matrixGridConfig.rows}, 41px)`
                          }}
                          onScroll={handleScroll}
                        >
                          {Object.values(data)
                            .flat()
                            .map(actual => {
                              return actual.ai_defects.map(
                                (prediction, index) => {
                                  return (
                                    <Link
                                      className={`${
                                        actual.defect.name ===
                                        prediction.defect.name
                                          ? 'diagonal cell'
                                          : prediction.rank === 0
                                          ? 'rank0 cell'
                                          : prediction.rank === 1
                                          ? 'rank1 cell'
                                          : prediction.rank === 2
                                          ? 'rank2 cell'
                                          : 'cell'
                                      } ${
                                        value
                                          .map(x => x.name)
                                          .includes(prediction.defect.name)
                                          ? 'selected-cell'
                                          : ''
                                      }`}
                                      role='cell'
                                      key={index}
                                      to={handleGetURL(
                                        prediction.count,
                                        actual.defect.id,
                                        prediction.defect.id
                                      )}
                                    >
                                      <Typography className={classes.cellText}>
                                        {prediction.count}
                                      </Typography>
                                    </Link>
                                  );
                                }
                              );
                            })}
                        </div>
                        <div className='total-predicted-title'>
                          <img src={info} alt='' className='info-icon' />
                          <Typography className={classes.totalPredictedTitle}>
                            Total Predicted
                          </Typography>
                        </div>
                        <div
                          className='total-predicted'
                          id='total-predicted'
                          style={{
                            gridTemplateColumns: `repeat(${matrixGridConfig.columns}, 41px)`
                          }}
                        >
                          {(data?.inDistribution || []).map((actual, index) => {
                            return (
                              <Link
                                to={handleGetURL(
                                  matrixMeta[actual.defect.id].model_count,
                                  undefined,
                                  actual.ai_defects[index]?.defect?.id
                                )}
                              >
                                <Typography
                                  className={`${classes.cellText} cell`}
                                  key={index}
                                >
                                  {NumberFormater(
                                    matrixMeta[actual.defect.id].model_count
                                  )}
                                </Typography>
                              </Link>
                            );
                          })}
                        </div>
                        <div className='precision-title'>
                          <img src={info} alt='' className='info-icon' />
                          <Typography className={classes.totalPredictedTitle}>
                            Class-wise Precision
                          </Typography>
                        </div>
                        <div
                          className='precision'
                          id='precision'
                          style={{
                            gridTemplateColumns: `repeat(${matrixGridConfig.columns}, 41px)`
                          }}
                        >
                          {Object.values(data)
                            .flat()
                            .map((actual, index) => {
                              return (
                                <Typography
                                  className={`${classes.cellText} cell`}
                                  key={index}
                                >
                                  {!matrixMeta[actual.defect.id]?.precision &&
                                  matrixMeta[actual.defect.id]?.precision !== 0
                                    ? 'N/A'
                                    : NumberFormater(
                                        matrixMeta[actual.defect.id].precision
                                      )}
                                </Typography>
                              );
                            })}
                        </div>
                        <div className='total-actual-title'>
                          <img src={info} alt='' className='info-icon' />
                          <Typography className={classes.totalPredictedTitle}>
                            Total Actual
                          </Typography>
                        </div>
                        <div
                          className='total-actual'
                          id='total-actual'
                          style={{
                            gridTemplateRows: `repeat(${matrixGridConfig.rows}, 41px)`
                          }}
                        >
                          {Object.values(data)
                            .flat()
                            .map((actual, index) => {
                              return (
                                <Link
                                  to={handleGetURL(
                                    matrixMeta[actual.defect.id].gt_count,
                                    actual.defect.id,
                                    undefined,
                                    true
                                  )}
                                >
                                  <Typography
                                    className={`${classes.cellText} cell`}
                                    key={index}
                                  >
                                    {NumberFormater(
                                      matrixMeta[actual.defect.id].gt_count
                                    )}
                                  </Typography>
                                </Link>
                              );
                            })}
                        </div>
                        <div className='recall-title'>
                          <img src={info} alt='' className='info-icon' />
                          <Typography className={classes.totalPredictedTitle}>
                            Class-wise Recall
                          </Typography>
                        </div>
                        <div
                          className='recall'
                          id='recall'
                          style={{
                            gridTemplateRows: `repeat(${matrixGridConfig.rows}, 41px)`
                          }}
                        >
                          {Object.values(data)
                            .flat()
                            .map((actual, index) => {
                              return (
                                <Typography
                                  className={`${classes.cellText} cell`}
                                  key={index}
                                >
                                  {!matrixMeta[actual.defect.id]?.recall &&
                                  matrixMeta[actual.defect.id]?.recall !== 0
                                    ? 'N/A'
                                    : NumberFormater(
                                        matrixMeta[actual.defect.id].recall
                                      )}
                                </Typography>
                              );
                            })}
                        </div>
                        <div
                          className='h-scroll'
                          id='h-scroll'
                          onScroll={handleHorizontalScroll}
                          style={{
                            gridTemplateColumns: `repeat(${matrixGridConfig.columns}, 41px)`
                          }}
                        >
                          {Object.values(data)
                            .flat()
                            .map((actual, index) => {
                              return <div className='cell' key={index} />;
                            })}
                        </div>
                        <div
                          className='v-scroll'
                          id='v-scroll'
                          style={{
                            gridTemplateRows: `repeat(${matrixGridConfig.columns}, 41px)`
                          }}
                        >
                          {Object.values(data)
                            .flat()
                            .map((actual, index) => {
                              return <div className='cell' key={index} />;
                            })}
                        </div>
                      </div>
                    </Grid>
                  </Grid>{' '}
                </>
              )}
            </Grid>
          </Collapse>
        )}
      </Box>
    </Paper>
  );
};

export default ConfusionMatrix;
