import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InfoHeader from 'app/components/NewInfoHeader';
import ScrollToTop from 'app/components/ScrollToTop';
import reviewTheme from 'app/configs/reviewTheme';
import {
  convertToUtc,
  encodeURL,
  formatDisplayDate,
  getDatesFromTimeRange,
  NumberFormater
} from 'app/utils/helpers';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams
} from 'react-router-dom';
import CustomTable from './components/Table';
import CreateUseCase from './CreateEditUseCase';
import useStyles from './styles';
import { useSelector } from 'react-redux';
import { FilterUrl } from 'app/components/FiltersV2';
import { FILTER_IDS } from 'app/constants/filters';
import { getUseCaseList } from 'store/useCase/actions';
import { SEARCH_PAGE_PARAMS_KEYS } from 'app/constants/searchParams';
import { TABLE_CONST, getLimitOffset } from 'app/utils/table';
import clsx from 'clsx';

const { DATE, USE_CASE, DEFECTS } = FILTER_IDS;
const { PAGE, ROWS_PER_PAGE } = SEARCH_PAGE_PARAMS_KEYS;
const { DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE } = TABLE_CONST;

const UseCaseLibraryContainer = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { subscriptionId, packId } = useParams();

  const page = +(searchParams.get(PAGE) ?? DEFAULT_PAGE);
  const rowsPerPage = +(
    searchParams.get(ROWS_PER_PAGE) ?? DEFAULT_ROWS_PER_PAGE
  );

  const { data: useCase, isLoading } = useSelector(
    ({ useCase }) => useCase.list
  );

  useEffect(() => {
    const { limit, offset } = getLimitOffset(page, rowsPerPage);
    dispatch(
      getUseCaseList({
        limit,
        offset,
        subscription_id: subscriptionId,
        allowedKeys: ['use_case_id__in', 'defect_id__in']
      })
    );
  }, [location.search]);

  const handlePagechange = (_, newPage) => {
    if (newPage === DEFAULT_PAGE) {
      searchParams.delete(PAGE);
    } else {
      searchParams.set(PAGE, newPage);
    }

    setSearchParams(searchParams);
  };

  const handleChangeRowsPerPage = newRowsPerPage => {
    if (newRowsPerPage === DEFAULT_ROWS_PER_PAGE) {
      searchParams.delete(ROWS_PER_PAGE);
    } else {
      searchParams.set(ROWS_PER_PAGE, newRowsPerPage);
    }

    searchParams.delete(PAGE);

    setSearchParams(searchParams);
  };

  const stats = [
    { name: 'Use Cases', key: 'count', count: useCase?.count ?? 0 }
  ];

  const handleClick = useCallback(
    (field, id) => {
      if (field === 'fileSet') {
        const data = getDatesFromTimeRange('ALL_DATE_RANGE');

        const [formatDateStart, formatDateEnd] = [...data];
        const params = queryString.stringify(
          {
            use_case_id__in: id,
            date__gte: convertToUtc(formatDateStart),
            date__lte: convertToUtc(formatDateEnd)
          },
          { arrayFormat: 'comma' }
        );

        navigate(`/${subscriptionId}/${packId}/library/data/results?${params}`);
      } else if (field === 'defect') {
        const params = queryString.stringify(
          { use_case_id__in: id },
          { arrayFormat: 'comma' }
        );

        navigate(`/${subscriptionId}/${packId}/library/defect?${params}`);
      } else if (field === 'model') {
        const params = queryString.stringify({
          other_filters: encodeURL({ use_case_id__in: id })
        });

        navigate(`/${subscriptionId}/${packId}/library/model?${params}`);
      }
    },
    [location.search]
  );

  const isCellClickable = value => value > 0;

  const columns = [
    {
      accessor: 'name',
      Header: 'Use Case Name'
    },
    {
      accessor: 'type',
      Header: 'Use Case Type'
    },
    {
      accessor: 'file_set_count',
      Header: 'Total Images',
      Cell: ({ row }) => {
        const value = row?.values?.file_set_count ?? 0;
        const isClickable = isCellClickable(value);

        return (
          <Box
            onClick={() => {
              if (isClickable) handleClick('fileSet', row.original.id);
            }}
            className={clsx(isClickable && 'textClickable')}
          >
            <Typography>
              {NumberFormater(row?.values?.file_set_count)}
            </Typography>
          </Box>
        );
      }
    },
    {
      accessor: 'defect_count',
      Header: 'Defect Classes',
      Cell: ({ row }) => {
        const value = row?.values?.defect_count ?? 0;
        const isClickable = isCellClickable(value);

        return (
          <Box
            onClick={() => {
              if (isClickable) handleClick('defect', row.original.id);
            }}
            className={clsx(isClickable && 'textClickable')}
          >
            <Typography>{NumberFormater(row?.values?.defect_count)}</Typography>
          </Box>
        );
      }
    },
    {
      accessor: 'ml_models',
      Header: 'Models',
      Cell: ({ row }) => {
        const value = row?.values?.ml_models.length ?? 0;
        const isClickable = isCellClickable(value);

        return (
          <Box
            onClick={() => {
              if (isClickable) handleClick('model', row.original.id);
            }}
            className={clsx(isClickable && 'textClickable')}
          >
            <Typography>
              {NumberFormater(row?.values?.ml_models.length)}
            </Typography>
          </Box>
        );
      }
    },
    {
      accessor: 'created_by',
      Header: 'Created By',
      Cell: ({ row: { values } }) => {
        return (
          <Typography>
            {values?.created_by?.display_name || 'SixSense Admin'}
          </Typography>
        );
      }
    },
    {
      accessor: 'created_ts',
      Header: 'Created On',
      Cell: ({ row: { values } }) => {
        return (
          <Typography>
            {values.created_ts
              ? `${formatDisplayDate(values.created_ts)}`
              : 'Never used'}
          </Typography>
        );
      }
    }
  ];

  const handleDrawer = (mode, selected) => {
    const selectedData = selected[0] || {};
    dispatch({
      type: 'USECASE_SET_USECASE',
      selected: [
        {
          ...selectedData,
          type: `${selectedData.type}_${selectedData.classification_type}`
        }
      ]
    });
    dispatch({ type: 'USECASE_SET_MODE', mode });
    dispatch({ type: 'USECASE_SET_GLOBAL_MODE', mode });
    dispatch({ type: 'USECASE_SET_DRAWER', status: true });
  };

  const handleCreateUsecase = () => {
    dispatch({ type: 'USECASE_SET_USECASE' });
    dispatch({ type: 'USECASE_SET_MODE', mode: 'create' });
    dispatch({ type: 'USECASE_SET_GLOBAL_MODE', mode: 'create' });
    dispatch({ type: 'USECASE_SET_DRAWER', status: true });
  };

  const buttonGrp = [
    {
      text: 'Add Use Case',
      callback: handleCreateUsecase,
      disabled: false
    }
  ];

  const primaryFilters = useMemo(() => [USE_CASE, DEFECTS], []);
  const secondaryFilters = useMemo(() => [DATE], []);

  return (
    <Box p={3}>
      <ThemeProvider theme={reviewTheme}>
        <CssBaseline />

        <InfoHeader
          title='Use Case Library'
          buttonGrp={buttonGrp}
          stats={stats}
        />

        <Box py={2.5}>
          <FilterUrl
            primaryFilters={primaryFilters}
            ignoreFilterKeys={secondaryFilters}
          />
        </Box>

        <Paper elevation={0}>
          <Grid container justifyContent='center'>
            <Grid item xs={12}>
              <Box mb={1.5} px={4} className={classes.tableContainer}>
                <CustomTable
                  columns={columns}
                  data={useCase?.results || []}
                  isLoading={isLoading}
                  drawerClick={handleDrawer}
                  page={page}
                  total={useCase?.count}
                  rowsPerPage={rowsPerPage}
                  handlePagechange={handlePagechange}
                  handleRowsPerPage={handleChangeRowsPerPage}
                  count={Math.ceil(useCase?.count / rowsPerPage)}
                  pagination
                />
              </Box>

              {/* <CustomPagination
							page={page}
							rowsPerPage={rowsPerPage}
							handlePagechange={handlePagechange}
							handleRowsPerPage={handleChangeRowsPerPage}
							count={Math.ceil(useCase?.count / rowsPerPage)}
						/> */}
            </Grid>
          </Grid>
        </Paper>
      </ThemeProvider>

      <CreateUseCase />

      <ScrollToTop />
    </Box>
  );
};

export default UseCaseLibraryContainer;
