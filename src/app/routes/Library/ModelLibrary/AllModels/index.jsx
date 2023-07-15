import { faArrowToTop, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
// import { common } from '@material-ui/core/colors'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import CommonDialog from 'app/components/CommonDialog';
import InfoHeader from 'app/components/NewInfoHeader';
import ScrollToTop from 'app/components/ScrollToTop';
import {
  convertToUtc,
  encodeURL,
  formatDisplayDate,
  getDatesFromTimeRange,
  NumberFormater
} from 'app/utils/helpers';
import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
// import BookmarkBorderChild from 'assests/images/icons/BookmarkSmall.svg'
import { useQueryClient, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams
} from 'react-router-dom';
import { toast } from 'react-toastify';
import { setShouldTrainingOpen } from 'store/modelTraining/actions';
import { FILTER_IDS } from 'app/constants/filters';

import CustomTable from '../components/Table';
import useStyles from '../styles';
import UploadModel from '../UploadModel';
import { FilterUrl } from 'app/components/FiltersV2';
import { SEARCH_PAGE_PARAMS_KEYS } from 'app/constants/searchParams';
import { getLimitOffset, TABLE_CONST } from 'app/utils/table';
import { selectIsFilterLoading } from 'store/filter/selector';
import useApi from 'app/hooks/useApi';
import { getUseCases } from 'app/api/Usecase';

const { DATE, USE_CASE, DEFECTS, MODEL, MODEL_STATUS } = FILTER_IDS;
const { PAGE, ROWS_PER_PAGE } = SEARCH_PAGE_PARAMS_KEYS;
const { DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE } = TABLE_CONST;

const AllModels = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { subscriptionId, packId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { selected, uploadModelDrawer } = useSelector(
    ({ modelLibrary }) => modelLibrary
  );

  const isFilterLoading = useSelector(selectIsFilterLoading);

  const queryClient = useQueryClient();

  const page = +(searchParams.get(PAGE) ?? DEFAULT_PAGE);
  const rowsPerPage = +(
    searchParams.get(ROWS_PER_PAGE) ?? DEFAULT_ROWS_PER_PAGE
  );

  const { limit, offset } = getLimitOffset(page, rowsPerPage);

  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: models, isLoading } = useQuery(
    ['paginatedModel', subscriptionId, limit, offset, location.search],
    context => api.getPaginatedModels(...context.queryKey),
    { enabled: !!subscriptionId && !isFilterLoading }
  );

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries('paginatedModel');
    };
  }, []);

  // TODO: NEED TO UPDATE ALLOWED KEYS HERE
  const { data: useCase } = useApi(
    getUseCases,
    {
      subscription_id: subscriptionId,
      get_all_records: true,
      allowedKeys: []
      // allowedKeys: ['ml_model_id__in', 'use_case_id__in', 'defect_id__in']
    },
    {
      enabled: !isFilterLoading
    }
  );

  const total = models?.count ?? 0;

  const stats = [{ name: 'Models', key: 'count', count: total }];

  const getDefects = defects => {
    // const s = `${defects.length} Defects`
    const t = [];
    defects.forEach(defect => {
      t.push(defect.name);
    });
    if (defects.length) {
      return t.join(', ');
    }
    return '';
  };

  const getUseCase = useCaseId => {
    return useCase?.results?.filter(x => x.id === useCaseId)?.[0]?.name;
  };

  const handleClick = (id, field) => {
    if (field === 'defect') {
      const params = queryString.stringify(
        { ml_model_id__in: id },
        { arrayFormat: 'comma' }
      );

      navigate(`/${subscriptionId}/${packId}/library/defect?${params}`);
    } else if (field === 'TRAIN') {
      const data = getDatesFromTimeRange('ALL_DATE_RANGE');

      const [formatDateStart, formatDateEnd] = [...data];
      const params = queryString.stringify(
        {
          training_ml_model__in: id,
          date__gte: convertToUtc(formatDateStart),
          date__lte: convertToUtc(formatDateEnd)
        },
        { arrayFormat: 'comma' }
      );

      navigate(`/${subscriptionId}/${packId}/library/data/results?${params}`);
    }
  };

  const columns = [
    {
      accessor: 'name',
      Header: 'Model Name',
      style: { width: '20%' }
    },
    {
      accessor: 'use_case',
      Header: 'Use Case',
      style: { width: '40%' }
    },
    {
      accessor: 'status',
      Header: 'Status',
      style: { width: '5%' }
    },
    {
      accessor: 'type',
      Header: 'Type',
      style: { width: '5%' }
    },
    {
      accessor: 'training_file_set_count',
      Header: 'Training Images',
      style: { width: '9%' },
      Cell: ({ row }) => {
        return (
          <Box
            onClick={
              row.values.status !== 'training_failed'
                ? () => {
                    handleClick(row.original.id, 'TRAIN');
                  }
                : () => {}
            }
            className={
              row.values.status !== 'training_failed' ? 'textClickable' : ''
            }
          >
            <Typography>
              {NumberFormater(row?.values?.training_file_set_count || 0)}
            </Typography>
          </Box>
        );
      }
    },
    {
      accessor: 'defect_tags',
      Header: 'Defects',
      style: { width: '8%' },
      Cell: ({ row }) => {
        return (
          <Box
            onClick={
              row.values.status !== 'training_failed'
                ? () => {
                    handleClick(row.original.id, 'defect');
                  }
                : () => {}
            }
            className={
              row.values.status !== 'training_failed' ? 'textClickable' : ''
            }
          >
            <Typography>
              {NumberFormater(row?.original?.defects?.length)}
            </Typography>
          </Box>
        );
      }
    },
    {
      accessor: 'inferenced_file_set_count',
      Header: 'Inferenced Images',
      style: { width: '10%' },
      Cell: ({ row }) => {
        return (
          <Box
          // onClick={() => {
          // 	handleClick(row.original.id)
          // }}
          // className="textClickable"
          >
            <Typography>
              {NumberFormater(row?.values?.inferenced_file_set_count)}
            </Typography>
          </Box>
        );
      }
    },
    {
      accessor: 'created_by',
      Header: 'Created By',
      style: { width: '10%' },
      Cell: ({ value }) => {
        return (
          <Typography>{value?.display_name || 'SixSense Admin'}</Typography>
        );
      }
    },
    // {
    // 	accessor: 'source',
    // 	Header: 'Source',
    // 	style: { width: '20%' },
    // },
    {
      accessor: 'last_used_for_inference_at',
      Header: 'Last Used For Inference',
      style: { width: '5%' },
      Cell: ({ row: { values } }) => {
        if (values?.last_used_for_inference_at) {
          return (
            <Typography>{`${formatDisplayDate(
              values?.last_used_for_inference_at
            )}`}</Typography>
          );
        }
        return <Typography>Never used</Typography>;
      }
    },
    {
      accessor: 'created_ts',
      Header: 'Create Date',
      Cell: ({ row: { values } }) => {
        return values.created_ts
          ? `${formatDisplayDate(values.created_ts)}`
          : 'Never used';
      }
    }
    // {
    // 	id: 'training_started_at',
    // 	name: 'Training start time',
    // 	style: { width: '15%' },
    // 	cell: (row) => (
    // 		<Typography variant="subtitle1">
    // 			{row?.training_started_at ? formatDate(row.training_started_at) : ''}
    // 		</Typography>
    // 	),
    // },
    // {
    // 	id: 'training_finished_at',
    // 	name: 'Training end time',
    // 	style: { width: '15%' },
    // 	cell: (row) => (
    // 		<Typography variant="subtitle1">
    // 			{row?.training_finished_at ? formatDate(row.training_finished_at) : ''}
    // 		</Typography>
    // 	),
    // },
  ];
  const handleDrawer = (selected, showTrainingProgress = false) => {
    // dispatch({ type: 'MODEL_LIB_SET_DRAWER', status: !state.drawerOpen })
    // if (state.drawerOpen) {
    // 	setShowProgress(false)
    // 	setSearchParams({
    // 		search: prevAppliedFilters,
    // 	})
    // 	serPrevAppliedFilters('')
    // 	dispatch({ type: 'RESET_APPLIED' })
    // } else if (showTrainingProgress) {
    // 	setShowProgress(true)
    // 	dispatch({ type: 'MODEL_LIB_SET_ACTIVE_STEP', step: 4 })
    // } else {
    // serPrevAppliedFilters(location.search)
    // setSearchParams({
    // 	search: `packId=${packId}`,
    // })

    // dispatch({ type: 'RESET_APPLIED' })
    // dispatch({ type: 'MODEL_LIB_SET_SELECTED', selected })
    // dispatch({ type: 'MODEL_LIB_SET_ACTIVE_STEP', step: 0 })
    // dispatch({ type: 'MODEL_LIB_SET_MODEL', payload: selected?.[0] })
    dispatch(setShouldTrainingOpen(true));

    const contextualFilters = { date: 'ALL_DATE_RANGE' };

    const params = queryString.stringify({
      contextual_filters: encodeURL(contextualFilters)
    });

    navigate(
      `/${subscriptionId}/${packId}/library/model/retrain/${selected[0]?.id}?${params}`
    );
    // }
  };

  const handleUploadModelClick = () => {
    dispatch({ type: 'MODEL_LIB_RESET_UPLOAD_MODEL' });
    dispatch({ type: 'MODEL_LIB_SET_UPLOAD_MODEL_DRAWER_CLICK', status: true });
  };

  const handleCreateModelClick = () => {
    navigate('create');
  };

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

  const handleDeleteDialog = (status, selected) => {
    dispatch({ type: 'MODEL_LIB_SET_SELECTED', selected });
    setShowDialog(status);
  };

  const handleDelete = () => {
    const model = selected?.[0];
    if (model) {
      setShowDialog(false);
      setLoading(true);
      api
        .deleteModel(model.id, subscriptionId)
        .then(_ => {
          if (_.status === 204) {
            dispatch({
              type: 'REMOVE_FILTER',
              field: 'model',
              param: 'ml_model_id__in',
              item: model?.id
            });
            queryClient.invalidateQueries('paginatedModel');
            dispatch({ type: 'MODEL_LIB_SET_SELECTED', selected: [] });
            const params = queryString.parse(location.search, {
              arrayFormat: 'comma',
              parseNumbers: true
            });
            if (
              params.ml_model_id__in &&
              Array.isArray(params.ml_model_id__in) &&
              params.ml_model_id__in.includes(model.id)
            ) {
              params.ml_model_id__in = params.ml_model_id__in.filter(
                x => x !== model.id
              );
            } else if (params.ml_model_id__in) {
              delete params.ml_model_id__in;
            }
            setSearchParams(
              queryString.stringify(params, { arrayFormat: 'comma' })
            );

            toast.success('Deleted model successfully');
          }
        })
        .catch(() => {
          toast.error(`Couldn't delete the model. Please try again.`);
        })
        .finally(() => setLoading(false));
    }
  };

  const dialogActions = [
    {
      text: 'Cancel',
      variant: 'tertiary',
      callback: () => handleDeleteDialog(false)
    },
    {
      text: 'Ok',
      callback: handleDelete
    }
  ];

  const buttonGrp = [];

  if (!window.location.origin.includes('infineon')) {
    buttonGrp.push(
      {
        text: 'Upload Model',
        callback: handleUploadModelClick,
        disabled: false,
        icon: <FontAwesomeIcon icon={faArrowToTop} />,
        variant: 'tertiary'
      },
      {
        text: 'Create Model',
        callback: handleCreateModelClick,
        disabled: false,
        icon: <FontAwesomeIcon icon={faPlus} />,
        variant: 'primary'
      }
    );
  }

  const primaryFilters = useMemo(
    () => [USE_CASE, DEFECTS, MODEL, MODEL_STATUS],
    []
  );
  const secondaryFilters = useMemo(() => [DATE], []);

  return (
    <Box p={3}>
      <InfoHeader title='Model Library' buttonGrp={buttonGrp} stats={stats} />

      <Box py={2.5}>
        <FilterUrl
          primaryFilters={primaryFilters}
          ignoreFilterKeys={secondaryFilters}
        />
      </Box>

      <Paper elevation={0}>
        <Grid container justify='center'>
          <Grid item xs={12}>
            <Box mb={1.5} px={4} className={classes.tableContainer}>
              <CustomTable
                drawerClick={handleDrawer}
                handleDelete={handleDeleteDialog}
                data={models?.results || []}
                columns={columns}
                isLoading={isLoading}
                getDefects={getDefects}
                getUseCase={getUseCase}
                page={page}
                total={total}
                rowsPerPage={rowsPerPage}
                handlePagechange={handlePagechange}
                handleRowsPerPage={handleChangeRowsPerPage}
                count={Math.ceil(total / rowsPerPage)}
                pagination
              />
            </Box>

            {/* <CustomPagination
								page={page}
								rowsPerPage={rowsPerPage}
								handlePagechange={handlePagechange}
								handleRowsPerPage={handleChangeRowsPerPage}
								count={Math.ceil(total / rowsPerPage)}
							/> */}
          </Grid>
        </Grid>
      </Paper>

      {uploadModelDrawer && <UploadModel />}

      <ScrollToTop />

      {showDialog && (
        <CommonDialog
          open={showDialog}
          message={`Are you sure you want to delete  the Model ${selected?.[0]?.name} ?`}
          actions={dialogActions}
        />
      )}

      <CommonBackdrop open={loading} />
    </Box>
  );
};

export default AllModels;
