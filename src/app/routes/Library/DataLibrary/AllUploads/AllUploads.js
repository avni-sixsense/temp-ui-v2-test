import { faArrowToTop, faTag } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles, Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import { FilterUrl } from 'app/components/FiltersV2';
import InfoHeader from 'app/components/NewInfoHeader';
import ReviewTags from 'app/components/ReviewTags';
import Show from 'app/hoc/Show';
import {
  encodeURL,
  formatDisplayDate,
  NumberFormater
} from 'app/utils/helpers';
import { keyBy } from 'lodash';
import get from 'lodash/get';
import queryString from 'query-string';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams
} from 'react-router-dom';
import { toast } from 'react-toastify';
// import { changeInfoHeader } from 'store/dataLibrary/actions';
// import { setParams } from 'store/reviewData/actions';
import { toggleUploadDataModal } from 'store/uploadData/actions';
import { FILTER_IDS } from 'app/constants/filters';
import CustomTable from './components/Table';
import DatasetCloumns from './Dataset/columns';
import { getLimitOffset, TABLE_CONST } from 'app/utils/table';
import { SEARCH_PAGE_PARAMS_KEYS } from 'app/constants/searchParams';
import { selectIsFilterLoading } from 'store/filter/selector';
import useApi from 'app/hooks/useApi';
import { getUseCases } from 'app/api/Usecase';

const { DATE, FOLDER, TAGS_UPLOAD, USE_CASE, BOOKMARK } = FILTER_IDS;

const stats = [
  { name: 'Folders', key: 'upload_session_count' },
  { name: 'Images', key: 'fileset_count' }
];

const useStyles = makeStyles(() => ({
  tableContainer: {
    overflow: 'hidden',
    maxHeight: 'calc(100vh - 200px)',
    '& [class*="MuiTableContainer-root"]': {
      overflow: 'auto',
      maxHeight: 'calc(100vh - 360px)',
      // maxHeight: '1500px',
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
  }
}));

const { PAGE, ROWS_PER_PAGE } = SEARCH_PAGE_PARAMS_KEYS;
const { DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE } = TABLE_CONST;

const AllUploads = () => {
  const classes = useStyles();

  const location = useLocation();
  const navigate = useNavigate();
  const { packId, subscriptionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  const isBookmarkedRef = useRef(false);

  const queryClient = useQueryClient();

  const uploadState = useSelector(({ upload }) => upload);

  const page = +(searchParams.get(PAGE) ?? DEFAULT_PAGE);
  const rowsPerPage = +(
    searchParams.get(ROWS_PER_PAGE) ?? DEFAULT_ROWS_PER_PAGE
  );

  const { limit, offset } = getLimitOffset(page, rowsPerPage);

  const { data, dataset, infoMode } = useSelector(
    ({ allUploads }) => allUploads
  );

  const isFilterLoading = useSelector(selectIsFilterLoading);

  const { data: useCases, isLoading: isUsecaseLoading } = useApi(getUseCases, {
    subscription_id: subscriptionId,
    get_all_records: true,
    allowedKeys: []
  });

  const { isLoading, data: allUploadRows } = useQuery(
    ['uploadSessions', limit, offset, location.search, subscriptionId],
    context => api.getUploadSessions(...context.queryKey),
    { enabled: !!subscriptionId && !isFilterLoading }
  );

  const { data: dataSets, isLoading: isDataSetLoading } = useQuery(
    ['dataSetLib'],
    context => api.getDataset(...context.queryKey),
    { enabled: !isFilterLoading }
  );

  useEffect(() => {
    queryClient.invalidateQueries('uploadSessions');
  }, [location.search]);

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries('uploadSessions');
    };
  }, []);

  useEffect(() => {
    dispatch({
      type: 'SET_ALL_DATASET_DATA',
      payload: dataSets?.results || []
    });
  }, [dataSets]);

  useEffect(() => {
    if (allUploadRows?.results && useCases?.results) {
      const useCaseDict = keyBy(useCases.results, 'id');

      const allUploadData = (allUploadRows.results || []).map(item => ({
        ...item,
        use_case_name: useCaseDict[item.use_case]?.name || '',
        use_case_type: useCaseDict[item.use_case]?.type || ''
      }));

      dispatch({ type: 'SET_ALL_UPLOAD_DATA', payload: allUploadData });
    }
  }, [allUploadRows, useCases]);

  const handleReviewClick = useCallback(data => {
    const contextualFilters = { date: 'ALL_DATE_RANGE', ...data };

    const params = queryString.stringify({
      contextual_filters: encodeURL(contextualFilters)
    });

    navigate(`/${subscriptionId}/${packId}/annotation/review?${params}`);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessor: 'name',
        Header: 'Name',
        variant: 'body2',
        // width: '200px',
        Cell: ({ row: { original } }) => {
          const [tag1, tag2, ...rest] = original?.tags || [];
          return (
            <Box display='flex' alignItems='center'>
              <Typography>{original.name}</Typography>
              <Box
                display='flex'
                alignItems='center'
                sx={{ gap: '4px' }}
                ml={1}
              >
                {tag1?.name && (
                  <ReviewTags
                    wrapperClass='mr-2'
                    icon={<FontAwesomeIcon icon={faTag} />}
                    label={tag1.name}
                    variant='lightgrey'
                  />
                )}
                {tag2?.name && (
                  <ReviewTags
                    wrapperClass='mr-2'
                    icon={<FontAwesomeIcon icon={faTag} />}
                    label={tag2.name}
                    variant='lightgrey'
                  />
                )}
                {/* {rest?.length === 1 && (
                  <ReviewTags
                    wrapperClass='mr-2'
                    icon={<FontAwesomeIcon icon={faTag} />}
                    label={rest[0]?.name}
                    variant='lightgrey'
                  />
                )} */}
                {rest?.length >= 1 && (
                  <Tooltip title={rest.map(x => x.name).join(', ')}>
                    <Box>
                      <ReviewTags
                        wrapperClass='mr-2'
                        icon={<FontAwesomeIcon icon={faTag} />}
                        label={`+${rest.length}`}
                        variant='lightgrey'
                        showTooltip={false}
                      />
                    </Box>
                  </Tooltip>
                )}
              </Box>
            </Box>
          );
        }
      },
      {
        accessor: 'use_case_name',
        Header: 'Use Case',
        maxWidth: '200px'
      },
      {
        accessor: 'file_sets',
        Header: 'Total Images',
        maxWidth: '200px',
        Cell: ({ value, row: { original } }) => {
          if (get(uploadState, original.id, undefined)) {
            const { uploaded, total } = uploadState[original.id];
            if (uploaded !== total) {
              return <Typography>{`${uploaded} / ${total}`}</Typography>;
            }
            return (
              <Box
                onClick={() => {
                  handleReviewClick({ upload_session_id__in: original.id });
                }}
                className='textClickable'
              >
                <Typography>{`${total}`}</Typography>
              </Box>
            );
          }
          return (
            <Box
              onClick={() => {
                handleReviewClick({ upload_session_id__in: original.id });
              }}
              className='textClickable'
            >
              <Typography>{NumberFormater(value)}</Typography>
            </Box>
          );
        }
      },
      {
        accessor: 'unlabelled_file_sets_count',
        Header: 'Unlabelled Images',
        maxWidth: '200px',
        Cell: ({ value, row: { original } }) => {
          return (
            <Box
              onClick={() => {
                handleReviewClick({
                  upload_session_id__in: original.id,
                  is_gt_classified: false
                });
              }}
              className='textClickable'
            >
              <Typography>{NumberFormater(value)}</Typography>
            </Box>
          );
        }
      },
      {
        accessor: 'unreviewed_file_sets_count',
        Header: 'Unreviewed Images',
        maxWidth: '200px',
        Cell: ({ value, row: { original } }) => {
          return (
            <Box
              onClick={() => {
                handleReviewClick({
                  upload_session_id__in: original.id,
                  is_reviewed: false
                });
              }}
              className='textClickable'
            >
              <Typography>{NumberFormater(value)}</Typography>
            </Box>
          );
        }
      },
      {
        accessor: 'created_ts',
        Header: 'Create Date',
        maxWidth: '200px',
        Cell: ({ row: { values } }) => {
          return values.created_ts
            ? `${formatDisplayDate(values.created_ts)}`
            : 'Never used';
        }
      },
      {
        accessor: 'user_name',
        Header: 'Created By',
        maxWidth: '200px',
        Cell: ({ row: { values } }) => values.user_name || 'SixSense Admin'
      }
    ],
    [uploadState]
  );

  const handlePageChange = (_, newPage) => {
    if (newPage === DEFAULT_PAGE) {
      searchParams.delete(PAGE);
    } else {
      searchParams.set(PAGE, newPage);
    }

    setSearchParams(searchParams);

    if (isBookmarkedRef.current) {
      isBookmarkedRef.current = false;
      queryClient.invalidateQueries('uploadSessions');
    }
  };

  const handleRowsPerPageChange = newRowsPerPage => {
    if (newRowsPerPage === DEFAULT_ROWS_PER_PAGE) {
      searchParams.delete(ROWS_PER_PAGE);
    } else {
      searchParams.set(ROWS_PER_PAGE, newRowsPerPage);
    }

    searchParams.delete(PAGE);

    setSearchParams(searchParams);
  };

  const handleBookmark = (id, isBookmarked) => {
    dispatch({
      type: 'SET_ALL_UPLOAD_BOOKMARK',
      payload: id
    });
    api
      .bookmarkFolders(id, { is_bookmarked: !isBookmarked })
      .then(() => {
        isBookmarkedRef.current = true;
      })
      .catch(() => {
        dispatch({
          type: 'SET_ALL_UPLOAD_BOOKMARK',
          payload: id
        });
      });
  };

  const handleDatasets = data => {
    const { is_locked: isLocked, name } = data;
    api
      .updateDataset(data.id, { is_locked: !isLocked, name })
      .then(() => {
        dispatch({
          type: 'SET_DATA_SET_LOCKED',
          payload: data.id
        });
      })
      .catch(() => {
        toast.error('Something went wrong');
      });
  };

  const handleUploadDataClick = () => {
    dispatch(toggleUploadDataModal());

    // dispatch({ type: 'SET_ALL_UPLOAD_DOWNLOAD_BTN', status: false })
    // dispatch({ type: 'SET_ALL_UPLOAD_ACTIVE_STEP', step: 0 })
    // dispatch({ type: 'SET_ALL_UPLOAD_DRAWER', status: true })
  };

  // const handleViewAllFiles = () => {
  // 	navigate({
  // 		pathname: `${location.pathname}/results`,
  // 		search: `packId=${packId}`,
  // 	})
  // }
  // const handleUploadDatasetClick = () => {};
  const buttonGrp = [
    {
      text: 'Upload Data',
      callback: handleUploadDataClick,
      disabled: false,
      icon: <FontAwesomeIcon icon={faArrowToTop} />
    }
    // {
    // 	text: 'View All Images',
    // 	callback: handleViewAllFiles,
    // },
  ];
  const dataButtongrp = [
    // {
    // 	text: 'create Dataset',
    // 	callback: handleUploadDatasetClick,
    // 	icon: <FontAwesomeIcon icon={faArrowToTop} />,
    // },
  ];

  const total = allUploadRows?.count || 0;
  // const handleModeChange = mode => {
  //   dispatch(changeInfoHeader(mode));
  //   dispatch({ type: 'SET_ALL_UPLOAD_PAGE', payload: 1 });
  // };

  const primaryFilters = useMemo(
    () => [DATE, FOLDER, TAGS_UPLOAD, USE_CASE],
    []
  );
  const secondaryFilters = useMemo(() => [BOOKMARK], []);

  return (
    <>
      <InfoHeader
        title='Data Library'
        buttonGrp={infoMode === 'Folder' ? buttonGrp : dataButtongrp}
        stats={stats}
        // onChange={handleModeChange}
      />

      <Box py={2.5}>
        <Show when={infoMode === 'Folder'}>
          <FilterUrl
            primaryFilters={primaryFilters}
            secondaryFilters={secondaryFilters}
          />
        </Show>
      </Box>

      <Paper elevation={0} className={classes.tableContainerPaper}>
        <Grid container justifyContent='center'>
          <Grid item xs={12}>
            <Box mb={1.5} px={4} className={classes.tableContainer}>
              <Show when={!isFilterLoading}>
                {infoMode === 'Folder' ? (
                  <CustomTable
                    columns={columns}
                    data={data || []}
                    isLoading={isLoading || isUsecaseLoading}
                    total={total}
                    handleBookmark={handleBookmark}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePagechange={handlePageChange}
                    handleRowsPerPage={handleRowsPerPageChange}
                    count={Math.ceil(total / rowsPerPage)}
                    pagination
                  />
                ) : (
                  <CustomTable
                    columns={DatasetCloumns(handleDatasets, handleReviewClick)}
                    data={dataset || []}
                    isLoading={isDataSetLoading}
                    total={dataSets?.count || 0}
                    page={page}
                    noBookmark
                    rowsPerPage={rowsPerPage}
                    handlePagechange={handlePageChange}
                    handleRowsPerPage={handleRowsPerPageChange}
                    count={Math.ceil((dataSets?.count || 0) / rowsPerPage)}
                    pagination
                  />
                )}
              </Show>
            </Box>

            {/* <CustomPagination
								page={page}
								rowsPerPage={rowsPerPage}
								handlePagechange={handlePageChange}
								handleRowsPerPage={handleRowsPerPageChange}
								count={Math.ceil(total / rowsPerPage)}
							/> */}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default AllUploads;
