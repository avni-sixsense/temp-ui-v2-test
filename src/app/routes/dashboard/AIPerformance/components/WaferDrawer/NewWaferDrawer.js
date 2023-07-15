import {
  faArrowDownToLine,
  faArrowLeft,
  faCheck,
  faWebcam
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import { AnimatedDiv } from 'app/components/Animated';
import { FilterUrl } from 'app/components/FiltersV2';
import CommonButton from 'app/components/ReviewButton';
import TagsContainer from 'app/components/Tags';
import { DATE_RANGE_KEYS, FILTER_IDS } from 'app/constants/filters';
import { decodeURL, encodeURL } from 'app/utils/helpers';
import { goToPreviousRoute } from 'app/utils/navigation';
import { checkAndActiveWaferAvailability } from 'app/utils/waferbook';
import { keyBy } from 'lodash';
import queryString from 'query-string';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  CLASSIFY,
  AUDIT,
  AI_PERFORMANCE_ROUTES
} from 'store/aiPerformance/constants';
import { selectWaferTableStructure } from 'store/helpers/selector';

import { classifyWafer } from '../columns';
import CustomTable from '../DataTable';
import WaferAvailableDialog from './WaferAvailableDialog';

const useStyles = makeStyles(theme => ({
  container: {
    width: 'auto',
    height: '100vh',
    backgroundColor: theme.colors.grey[1]
  },
  header: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.colors.grey[900]
  },
  headerContainer: {
    backgroundColor: theme.colors.grey[1]
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.colors.grey[12]
  },
  value: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.colors.grey[12]
  },
  backIcon: {
    cursor: 'pointer'
  },
  btnContainer: {
    cursor: 'pointer'
  },
  btn: {
    fontWeight: 700,
    color: theme.colors.blue[600]
  },
  manualClassBtn: {
    borderRadius: '100%',
    '& svg': {
      color: `${theme.colors.grey[0]} !important`
    }
  },
  auditBtn: {
    borderRadius: '100%',
    backgroundColor: theme.colors.grey[0],
    border: `0.2px solid ${theme.colors.blue[600]}`,
    '& svg': {
      color: `${theme.colors.blue[600]} !important`
    },
    '&:hover': {
      borderRadius: '100%',
      backgroundColor: theme.colors.blue[600],
      '& svg': {
        color: `${theme.colors.grey[0]} !important`
      }
    }
  },
  hiddenDiv: {
    display: 'none'
  },
  AdvanceFilterHeader: {
    backgroundColor: theme.colors.grey[0]
  },
  tableContainer: {
    backgroundColor: theme.colors.grey[0],
    overflow: 'hidden',

    '& > div': {
      maxHeight: '100% !important'
    }
  },
  tagsContainer: {
    backgroundColor: theme.colors.grey[1],
    border: `0.5px solid ${theme.colors.grey[5]}`,
    borderRadius: theme.spacing(1)
  },
  waferCount: {
    fontSize: '0.875rem',
    fontWeight: 400,
    color: theme.colors.grey[12]
  },
  failedIcon: {
    color: theme.colors.yellow[600],
    marginRight: theme.spacing(0.75)
  }
}));

const PRIMARY_COLUMN_IDS = ['lot_id', 'device_id', 'inspection_layer'];

const { DATE, USE_CASE, WAFER, WAFER_STATUS } = FILTER_IDS;

const ClassifyWafer = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [sortingParams, setSortingParams] = useState('ordering=-created_ts');
  const clickedModeRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isWaferDialogOpen, setIsWaferDialogOpen] = useState(false);
  const [isUsecaseLoading, setIsUsecaseLoading] = useState(false);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [waferDialog, setWaferDialog] = useState({});
  const [metaColumns, setMetaColumns] = useState({
    primaryColumns: [],
    secondaryColumns: []
  });

  const defaultSortAscRef = useRef(false);

  const tableStructure = useSelector(selectWaferTableStructure);

  useEffect(() => {
    const primaryColumns = [];
    const secondaryColumns = [];
    if (tableStructure?.length > 0) {
      tableStructure.forEach(el => {
        if (PRIMARY_COLUMN_IDS.includes(el.field)) {
          primaryColumns.push({
            name: el.name,
            selector: el.field
          });
        } else {
          secondaryColumns.push({
            name: el.name,
            selector: el.field
          });
        }
      });
    }
    setMetaColumns({ primaryColumns, secondaryColumns });
  }, [tableStructure]);

  const ref = useRef(null);

  const queryClient = useQueryClient();

  const { subscriptionId, packId } = useParams();
  const [tableData, setTableData] = useState([]);

  const getParams = () => {
    if (sortingParams.length) {
      return `${window.location.search}&${sortingParams}`;
    }

    return window.location.search;
  };

  const { data: wafers, isLoading: isWafersLoading } = useQuery(
    ['DrawerWafers', getParams(), rowsPerPage, (page - 1) * rowsPerPage],
    context => api.getWaferBookData(...context.queryKey),
    { refetchInterval: false, enabled: rowsPerPage > 0 }
  );

  const { data: waferTags = [], isLoading: isWaferTagLoading } = useQuery(
    ['waferTags'],
    context => api.getAllWaferTags(...context.queryKey),
    { enabled: tableData.length > 0 }
  );

  useEffect(() => {
    if (sortingParams.length) {
      if (sortingParams.includes('-')) {
        defaultSortAscRef.current = true;
      } else {
        defaultSortAscRef.current = false;
      }

      queryClient.invalidateQueries('DrawerWafers');
    }
  }, [sortingParams]);

  const isLoading =
    isWafersLoading || isWaferTagLoading || isUsecaseLoading || !rowsPerPage;

  const getWaferTagsByWaferId = encodedString => {
    return new Promise((resolve, reject) => {
      api
        .getWaferTags(encodedString)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(() => {
          reject();
        });
    });
  };

  useEffect(() => {
    setPage(1);
    setSelectedRows([]);
  }, [location.search]);

  const getUseCaseById = ids => {
    return new Promise((resolve, reject) => {
      api
        .getConfigUsecases('', [...new Set(ids)])
        .then(data => {
          resolve(keyBy(data?.results || [], 'id'));
        })
        .catch(() => {
          reject();
        });
    });
  };

  useLayoutEffect(() => {
    if (ref.current) {
      const offsetTop = // (Height of all components before the table is equivalent to offsetTop for the table)
        ref.current.children[0].clientHeight +
        ref.current.children[1].clientHeight;

      if (offsetTop) {
        const availableTableBodyHeight = // (window.innerHeight - offsetTop - height of table header - height of table footer which includes pagination)
          window.innerHeight - offsetTop - 36 - 60;

        const possibleRowNums = availableTableBodyHeight / 32;
        setRowsPerPage(Math.floor(possibleRowNums) - 1);
      }
    }
  }, []);

  useEffect(() => {
    if (wafers) {
      if (!wafers.count) {
        setTableData([]);
        setTotal(0);
        return;
      }
      const encodedString = btoa(
        `id__in=${wafers.results.map(x => x.id).join(',')}`
      );
      setIsUsecaseLoading(true);
      getWaferTagsByWaferId(encodedString)
        .then(res => {
          setTableData(
            wafers.results.map(wafer => {
              return {
                ...wafer,
                tags: res[wafer.id] || [],
                ...wafer.meta_info
              };
            })
          );
          setTotal(wafers.count);
          setIsUsecaseLoading(false);
        })
        .catch(() => {
          toast('Failed to load wafer tags. Please refresh the page.');
          setTableData(
            wafers.results.map(wafer => ({ ...wafer, ...wafer.meta_info }))
          );
          setTotal(wafers.count);
          setIsUsecaseLoading(false);
        });
    }
  }, [wafers]);

  useEffect(() => {
    if (tableData.length && !tableData[0]?.use_case_name) {
      setIsUsecaseLoading(true);
      getUseCaseById(tableData.map(x => x.use_case))
        .then(res => {
          setTableData(
            tableData.map(wafer => {
              return {
                ...wafer,
                use_case_name:
                  res[wafer.use_case]?.name || 'No Usecase available'
              };
            })
          );
          setIsUsecaseLoading(false);
        })
        .catch(() => {
          toast('Failed to load wafer tags. Please refresh the page.');
          setTableData(tableData);
          setIsUsecaseLoading(false);
        });
    }
  }, [tableData]);

  const handleChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const handleDrawerClose = () => {
    goToPreviousRoute(
      navigate,
      `/${subscriptionId}/${packId}/dashboard/ai-performance/${AI_PERFORMANCE_ROUTES.MONITORING.path}/${AI_PERFORMANCE_ROUTES.UNIT_WAFER.path}`
    );
  };

  const handleCreateTag = data => {
    const payload = { name: data, description: '' };

    return new Promise((resolve, reject) =>
      api
        .createNewWaferTag(payload)
        .then(res => {
          queryClient.invalidateQueries('waferTags');
          toast('Created new tag successfully');
          resolve(res.data);
        })
        .catch(({ response }) => {
          if (response?.status === 400) {
            toast('Tag with the provided name already exists.');
          } else {
            toast('Something went wrong, please try again.');
          }
          reject();
        })
    );
  };
  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = rowsPerPage => {
    setRowsPerPage(rowsPerPage);
    handlePageChange(null, 1);
  };

  const handleClassifyClick = (isUserActive = false, rows) => {
    const mode = clickedModeRef.current;
    clickedModeRef.current = null;
    const reviewWafersList = rows || selectedRows;

    if (reviewWafersList.length > 0) {
      const { id } = reviewWafersList[0];

      const parsedParams = queryString.parse(location.search);

      const contextual_filters = decodeURL(parsedParams.contextual_filters);
      const other_filters = decodeURL(parsedParams.other_filters);

      const finalParamObj = {
        ...contextual_filters,
        ...other_filters,
        date: DATE_RANGE_KEYS.ALL_DATE_RANGE
      };

      delete finalParamObj.time_format;
      delete finalParamObj.upload_session_id__in;
      delete finalParamObj.use_case_id__in;
      delete finalParamObj.time__range;

      if (mode === CLASSIFY) {
        delete finalParamObj.ground_truth_label__in;
      }

      finalParamObj.wafer_id__in = id;
      finalParamObj.allWafersId = reviewWafersList.map(d => d.id);

      const params = queryString.stringify({
        contextual_filters: encodeURL(finalParamObj)
      });

      if (!isUserActive) {
        navigate(
          `/${subscriptionId}/${packId}/annotation/${
            mode === CLASSIFY ? 'manual-classify' : 'audit'
          }?${params}`
        );

        return;
      }

      checkAndActiveWaferAvailability(
        reviewWafersList.map(item => item.id),
        true
      )
        .then(() => {
          navigate(
            `/${subscriptionId}/${packId}/annotation/${
              mode === CLASSIFY ? 'manual-classify' : 'audit'
            }?${params}`
          );
        })
        .catch(() => {
          toast('Something went wrong.');
        });
    }
  };

  const checkWaferAvailable = (mode, wafers) => {
    clickedModeRef.current = mode;
    const rows = wafers || selectedRows;

    const WAFER_DIALOG = {
      header: 'Wafer already in review',
      info: ' is already being reviewed by other user.',
      buttonGroup: [
        {
          text: 'Exit',
          variant: 'primary',
          onClick: handleClose
        },
        {
          text: mode === CLASSIFY ? 'Classify' : 'Audit',
          variant: 'tertiary',
          onClick: () => handleClassifyClick(true)
        }
      ]
    };
    if (wafers) setSelectedRows(wafers);

    // CHECK IF WAFER AVAILABLE
    checkAndActiveWaferAvailability(rows.map(item => item.id))
      .then(res => {
        // IF WAFER/WAFERS AVAILABLE
        handleClassifyClick(false, wafers);
      })
      .catch(({ response }) => {
        const { status } = response;

        // WAFER IS BEING USED BY OTHER USER
        if (status === 400) {
          WAFER_DIALOG.info = (
            <span>
              <span>
                {rows.map(item => item.organization_wafer_id).join(', ')}
              </span>
              {` ${WAFER_DIALOG.info}`}
            </span>
          );
          setWaferDialog(WAFER_DIALOG);
          setIsWaferDialogOpen(true);
          return;
        }
        toast('Something went wrong.');
      });
  };

  const handleClose = () => {
    setIsWaferDialogOpen(false);
  };

  const handleAddTags = tags => {
    const encodedString = btoa(
      `id__in=${selectedRows.map(x => x.id).join(',')}`
    );
    api
      .updateTagsOnWafers({ tag_ids: tags.map(x => x.id) }, encodedString)
      .then(() => {
        setSelectedRows([]);
        getWaferTagsByWaferId(encodedString)
          .then(res => {
            setTableData(
              tableData.map(wafer => {
                return { ...wafer, tags: res[wafer.id] || wafer.tags };
              })
            );
            toast('Tags Added to wafers successfully');
          })
          .catch(() => {
            toast('Failed to load tags in UI, Please refresh the page.');
          });
      })
      .catch(() => {
        setSelectedRows([]);
        toast('Something went wrong.');
      });
    setToggleCleared(!toggleCleared);
  };

  const handleRemoveTags = (tags, isAllRemove = false) => {
    const encodedString = btoa(
      `id__in=${selectedRows.map(x => x.id).join(',')}`
    );
    api
      .removeTagsOnWafers(
        isAllRemove
          ? { remove_all_tags: true }
          : { tag_ids: tags.map(x => x.id) },
        encodedString
      )
      .then(() => {
        setSelectedRows([]);
        getWaferTagsByWaferId(encodedString)
          .then(res => {
            setTableData(
              tableData.map(wafer => {
                if (selectedRows.map(x => x.id).includes(wafer.id)) {
                  return { ...wafer, tags: res[wafer.id] || [] };
                }
                return wafer;
              })
            );
            toast('Tag removed from wafers successfully');
          })
          .catch(() => {
            toast('Failed to load tags in UI, Please refresh the page.');
          });
      })
      .catch(() => {
        setSelectedRows([]);
        toast('Something went wrong.');
      });
    setToggleCleared(!toggleCleared);
  };

  const handleWaferExport = () => {
    api
      .getWaferBookZip(selectedRows.map(item => item.id).join(','))
      .catch(async ({ response }) => {
        const error = JSON.parse(await response.data.text());
        if (error?.message) {
          toast(error.message);
        } else {
          toast('Something went wrong.');
        }
      });
  };

  const onSort = (...e) => {
    setPage(1);
    const [{ url_key }, sortingOrder] = e;

    setSortingParams(
      `ordering=${sortingOrder === 'asc' ? url_key : `-${url_key}`}`
    );
  };

  const primaryFilters = useMemo(
    () => [DATE, WAFER, USE_CASE, WAFER_STATUS],
    []
  );
  const ignoreFilterKeys = useMemo(() => ['ml_model_status__in'], []);

  return (
    <Paper className={classes.container} ref={ref}>
      <Box
        px={2.25}
        py={1.625}
        className={classes.headerContainer}
        display='flex'
        alignItems='center'
      >
        <Box mr={1.25} onClick={handleDrawerClose} className={classes.backIcon}>
          <FontAwesomeIcon className={classes.header} icon={faArrowLeft} />
        </Box>
        <Box>
          <Typography className={classes.header}>Waferbook</Typography>
        </Box>
      </Box>
      {/* <Box mb={1.5} px={2.25} display="flex" alignItems="center">
					<Typography className={classes.label}>Total Wafers:</Typography>
					<Typography className={classes.value}>{(wafers || []).length}</Typography>
				</Box> */}
      <Box
        px={2.25}
        py={1.625}
        className={classes.AdvanceFilterHeader}
        display='flex'
        flexDirection='column'
      >
        <Box mb={1.5}>
          <FilterUrl
            primaryFilters={primaryFilters}
            isWaferbookMetaFilters
            isMetaFiltersAsSecondaryFilters={false}
            ignoreFilterKeys={ignoreFilterKeys}
          />
        </Box>

        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          flexWrap='wrap'
        >
          <Typography className={classes.waferCount}>{`Showing ${Math.min(
            rowsPerPage,
            total
          )} of ${total} Wafers`}</Typography>
          <Box
            display='grid'
            gridAutoFlow='column'
            gridGap={5}
            p={1}
            className={classes.tagsContainer}
          >
            <CommonButton
              text='Classify'
              variant='tertiary'
              icon={<FontAwesomeIcon icon={faWebcam} />}
              disabled={
                selectedRows.length === 0 ||
                selectedRows.some(d => d.status === 'pending')
              }
              onClick={() => checkWaferAvailable(CLASSIFY)}
            />

            <CommonButton
              text='Audit'
              variant='tertiary'
              icon={<FontAwesomeIcon icon={faCheck} />}
              disabled={
                selectedRows.length === 0 ||
                selectedRows.some(d => d.status !== 'auto_classified')
              }
              onClick={() => checkWaferAvailable(AUDIT)}
            />

            <CommonButton
              text='Export'
              variant='tertiary'
              icon={<FontAwesomeIcon icon={faArrowDownToLine} />}
              disabled={
                selectedRows.length === 0 ||
                selectedRows.some(
                  item =>
                    !(
                      item.status === 'auto_classified' ||
                      item.status === 'manually_classified'
                    )
                )
              }
              onClick={handleWaferExport}
            />

            <TagsContainer
              text='Add Wafer Tag'
              data={waferTags?.results || []}
              lightTheme
              creatableFunc={handleCreateTag}
              disabled={selectedRows.length === 0}
              onSubmit={handleAddTags}
            />

            <TagsContainer
              text='Remove Wafer Tag'
              data={waferTags?.results || []}
              lightTheme
              removeDialog
              disabled={selectedRows.length === 0}
              onSubmit={handleRemoveTags}
            />
          </Box>
        </Box>
      </Box>

      <AnimatedDiv
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 100 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className={classes.tableContainer}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <CustomTable
              data={tableData}
              columns={classifyWafer(classes, checkWaferAvailable, metaColumns)}
              total={total}
              selectableRows
              clearSelectedRows={toggleCleared}
              handleChange={handleChange}
              page={page}
              rowsPerPage={rowsPerPage}
              handlePagechange={handlePageChange}
              handleRowsPerPage={handleRowsPerPageChange}
              scrollableHeight={window.innerHeight - 300}
              pagination
              onSort={onSort}
              defaultSortAsc={defaultSortAscRef.current}
            />
          )}
        </div>
      </AnimatedDiv>
      <WaferAvailableDialog
        {...waferDialog}
        open={isWaferDialogOpen}
        handleClose={handleClose}
      />
    </Paper>
  );
};

export default ClassifyWafer;
