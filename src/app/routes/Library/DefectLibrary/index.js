import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import CommonDialog from 'app/components/CommonDialog';
import Filters from 'app/components/Filters';
import InfoHeader from 'app/components/InfoHeader';
import CustomPagination from 'app/components/Pagination';
import CustomTable from 'app/components/Tables';
import reviewTheme from 'app/configs/reviewTheme';
import {
  FilterKey,
  ModelLibrary,
  ReviewScreen,
  UseCaseLibrary
} from 'app/utils/filterConstants';
import {
  encodeURL,
  formatDisplayDate,
  NumberFormater
} from 'app/utils/helpers';
import capitalize from 'lodash/capitalize';
// import get from 'lodash/get'
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUploadSession } from 'store/reviewData/actions';

import BulkUploadDialog from './components/BulkUploadDialog';
import TableActions from './components/TableActions';
import CreateDefect from './CreateEditDefect';
import useStyles from './styles';
import HotkeysConfig from './components/HotkeysConfig';
import { createStructuredSelector } from 'reselect';
import {
  selectDefectLibDrawerOpen,
  selectDefectLibExpandAll,
  selectDefectLibPage,
  selectDefectLibRowsPerPage,
  selectDefectLibSelected,
  selectDefectLibTotal,
  selectDefectsData
} from 'store/defectLibrary/selectors';

const mapDefectToState = createStructuredSelector({
  drawerOpen: selectDefectLibDrawerOpen,
  total: selectDefectLibTotal,
  selected: selectDefectLibSelected,
  expandAll: selectDefectLibExpandAll,
  rowsPerPage: selectDefectLibRowsPerPage,
  page: selectDefectLibPage,
  data: selectDefectsData
});

const DefectLibrary = () => {
  const dispatch = useDispatch();
  const state = useSelector(mapDefectToState);
  const { drawerOpen, total, selected, expandAll, rowsPerPage, page, data } =
    state;

  const userInfo = useSelector(({ common }) => common.userInfo ?? {});

  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionId, packId } = useParams();

  const queryClient = useQueryClient();

  const classes = useStyles();
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isHotKeyOpen, setIsHotKeyOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const limit = rowsPerPage;
  const offset = rowsPerPage * (page - 1);
  const paramsString = useSelector(({ filters }) => filters.paramsString);

  const handleExpandAll = status => {
    dispatch({ type: 'SET_DEFECT_LIB_EXPAND_ALL', payload: status });
  };

  const handleConfigHotKeyClick = () => {
    setIsHotKeyOpen(true);
  };

  const handleHotkeyClose = () => {
    setIsHotKeyOpen(false);
  };

  const handleImageClick = (fileSet, id) => {
    const existingParams = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });

    if (id) {
      existingParams.files__referenced_defects__in = id;
    } else {
      existingParams.id__in = fileSet;
    }

    delete existingParams.use_case_id__in;

    const params = queryString.stringify({
      contextual_filters: encodeURL({
        priority: true,
        defectImage: true,
        // ai_predicted_label__in: 'NVD',
        ...existingParams
      })
    });

    dispatch(setUploadSession(params));

    navigate(`/${subscriptionId}/${packId}/annotation/review?${params}`, {
      state: {
        path: location.pathname,
        params: location.search
      }
    });
  };

  const expandRowComponent = (row, classes) => {
    if (!(row.reference_files.length || row.defect_meta_info.length))
      return null;
    return (
      <TableRow>
        <TableCell />
        <TableCell colSpan={6}>
          <Collapse in timeout='auto' unmountOnExit>
            {row.reference_files.length > 0 && (
              <Box display='flex' flexWrap='wrap' className={classes.expand}>
                {row.reference_files.map((file, index) => {
                  return (
                    <img
                      src={file.url}
                      alt=''
                      className={classes.img}
                      key={index}
                    />
                  );
                })}
                {row.reference_files.length > 0 ? (
                  <Box display='flex' alignItems='center' px={1}>
                    <Typography
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => handleImageClick(0, row.id)}
                    >
                      Review
                    </Typography>
                  </Box>
                ) : (
                  ''
                )}
              </Box>
            )}
            {row.defect_meta_info.map((info, index) => {
              return (
                <Box className={classes.records} p={2} key={index}>
                  <Box display='flex' flexWrap='wrap' mb={1}>
                    {Object.entries(info.meta_info).map(([key, value]) => (
                      <Box key={key} mr={3}>
                        <Typography variant='body1' gutterBottom>
                          {capitalize(key)}
                        </Typography>
                        <Typography variant='body2' gutterBottom>
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box
                    display='flex'
                    className={classes.items}
                    pt={1}
                    flexWrap='wrap'
                  >
                    {info.reference_files.map((file, index) => {
                      return (
                        <img
                          onClick={() => handleImageClick(file?.file_set)}
                          style={{ cursor: 'pointer' }}
                          src={file.url}
                          alt=''
                          className={classes.img}
                          key={index}
                        />
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </Collapse>
        </TableCell>
      </TableRow>
    );
  };

  const getRefImages = (row, column, classes) => {
    return (
      <>
        {row.reference_files[0] ? (
          <img
            src={`${row.reference_files[0].url}`}
            alt=''
            className={classes.img}
          />
        ) : (
          ''
        )}
        {row.reference_files[1] ? (
          <img
            src={`${row.reference_files[1].url}`}
            alt=''
            className={classes.img}
          />
        ) : (
          ''
        )}
        {row.reference_files.length > 3 ? (
          <Box width={100}>
            <img
              src={`${row.reference_files[2].url}`}
              alt=''
              className={classes.img}
            />
            <div className={classes.text}>{`+${
              row.reference_files.length - 2
            } images`}</div>
          </Box>
        ) : row.reference_files[2] ? (
          <img
            src={`${row.reference_files[2].url}`}
            alt=''
            className={classes.img}
          />
        ) : null}
        {row.reference_files.length > 0 ? (
          <Box display='flex' alignItems='center' px={1}>
            <Typography
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => handleImageClick(0, row.id)}
            >
              Review
            </Typography>
          </Box>
        ) : (
          ''
        )}
      </>
    );
  };
  const { data: defects = {}, isLoading } = useQuery(
    ['defects', limit, offset, subscriptionId, paramsString],
    context => api.defectDetails(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  useEffect(() => {
    return () => {
      dispatch({ type: 'SET_SELECTED', selected });
      queryClient.invalidateQueries('defects');
    };
  }, []);

  useEffect(() => {
    if (defects?.results) {
      const temp = [];

      defects.results.forEach(result => {
        const useCases = [];

        result.use_cases.forEach(useCase => useCases.push(useCase.name));

        temp.push({
          ...result,
          useCases,
          modelNames: result.ml_models
        });
      });

      dispatch({ type: 'SET_DEFECT_LIB_DATA', payload: temp });
      dispatch({ type: 'SET_TOTAL', payload: defects.count });
    }
  }, [defects]);

  useEffect(() => {
    dispatch({ type: 'SET_DEFECT_LIB_PAGE', payload: 1 });
  }, [paramsString]);

  const handleDrawer = mode => {
    dispatch({ type: 'SET_DEFECT' });
    dispatch({ type: 'SET_MODE', mode });
    dispatch({ type: 'SET_GLOBAL_MODE', mode });
    dispatch({ type: 'SET_DRAWER', status: true });
  };

  const handleCreateDefectClick = () => {
    dispatch({ type: 'SET_DEFECT' });
    dispatch({ type: 'SET_MODE', mode: 'create' });
    dispatch({ type: 'SET_GLOBAL_MODE', mode: 'create' });
    dispatch({ type: 'SET_DRAWER', status: true });
  };

  const handlePagechange = (event, newPage) => {
    dispatch({ type: 'SET_DEFECT_LIB_PAGE', payload: newPage });
  };

  const handleChangeRowsPerPage = value => {
    dispatch({ type: 'SET_DEFECT_LIB_ROWS_PER_PAGE', payload: value });
  };

  const handleBulkUploadClick = () => {
    setBulkDialogOpen(true);
  };

  const handleBulkDialogClose = () => {
    setBulkDialogOpen(false);
  };

  const handleSubmitDialog = file => {
    const formData = new FormData();
    formData.append('subscription_id', subscriptionId);
    formData.append('file', file);
    api
      .bulkDefectCSVUpload(formData)
      .then(() => {
        queryClient.invalidateQueries('defects');
        toast('File imported successfully.');
        handleBulkDialogClose();
      })
      .catch(e => {
        const errMsg = e.response.data.msg;
        if (errMsg.includes('unique constraint')) {
          toast.error('Upload failed. Defect name and id should be unique.');
        } else {
          toast.error(errMsg);
        }
        console.error(errMsg);
      });
  };

  const buttonGrp = [
    {
      text: 'Bulk Upload',
      callback: handleBulkUploadClick,
      disabled: false,
      show: userInfo.is_staff ?? false
    },
    {
      text: 'Create Defect',
      callback: handleCreateDefectClick,
      disabled: false
    }
  ];

  const handleSelect = selected => {
    dispatch({ type: 'SET_SELECTED', selected });
  };

  const handleDeleteDefectDialog = status => {
    setShowDialog(status);
  };

  const handleDeleteDefect = () => {
    const defect = selected?.[0];
    if (defect) {
      setLoading(true);
      setShowDialog(false);
      api
        .deleteDefect(defect.id)
        .then(_ => {
          if (_.status === 204) {
            dispatch({
              type: 'SET_DEFECT_LIB_DATA',
              payload: data.filter(row => row.id !== defect.id)
            });
            dispatch({ type: 'SET_TOTAL', total: total - 1 });
            dispatch({ type: 'SET_SELECTED', selected: [] });
            queryClient.invalidateQueries('defects');
            toast.success('Defect deleted successfully');
          }
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 404) {
              toast.error('Defect was already deleted');
            } else {
              toast.error(
                'Defect cannot be deleted because it has some associations'
              );
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getModelNames = row => {
    // const names = row.modelNames.join(', ')
    const { length } = row.modelNames;
    // const s = `${length} Models (${names.substr(0, 30)}...)`
    if (!expandAll) {
      return <Typography variant='body2'>{length}</Typography>;
    }
    return <Typography variant='body2'>{length}</Typography>;
  };

  const handleClick = id => {
    const params = queryString.stringify({
      other_filters: encodeURL({ defect_id__in: id })
    });

    navigate(`/${subscriptionId}/${packId}/library/usecase?${params}`);
  };

  const handleModelClick = id => {
    const params = queryString.stringify({
      other_filters: encodeURL({ defect_id__in: id })
    });

    navigate(`/${subscriptionId}/${packId}/library/model?${params}`);
  };

  const columns = [
    {
      id: 'name',
      name: 'Defect Name',
      variant: 'body2',
      style: { minWidth: '150px', verticalAlign: 'top' }
    },
    {
      id: 'use_cases',
      // name: 'Application',
      name: 'Use Cases',
      style: { minWidth: '200px', verticalAlign: 'top' },
      cell: row => {
        return (
          <Box
            onClick={() => {
              handleClick(row?.id);
            }}
            className='textClickable'
          >
            <Typography variant='body2'>
              {NumberFormater(row?.use_cases?.length)}
            </Typography>
          </Box>
        );
      }
    },
    {
      id: 'ml_models',
      name: 'Models',
      style: { minWidth: '205px', verticalAlign: 'top' },
      cell: row => {
        return (
          <Box
            onClick={
              row.modelNames.length
                ? () => {
                    handleModelClick(row?.id);
                  }
                : () => {}
            }
            className={row.modelNames.length ? 'textClickable' : ''}
          >
            {getModelNames(row)}
          </Box>
        );
      }
    },
    {
      id: 'created_by',
      name: 'Created By',
      style: { minWidth: '110px', verticalAlign: 'top' },
      cell: row => {
        return (
          <Typography variant='body2'>
            {row?.created_by?.display_name || 'SixSense Admin'}
          </Typography>
        );
      }
    },

    {
      id: 'created_ts',
      name: 'Created On',
      style: { minWidth: '200px', verticalAlign: 'top' },
      cell: row => {
        return (
          <Typography variant='body2'>
            {row.created_ts
              ? `${formatDisplayDate(row.created_ts)}`
              : 'Never used'}
          </Typography>
        );
      }
    },
    {
      id: 'description',
      name: 'Defect Definition',
      variant: 'body2',
      style: { minWidth: '150px', verticalAlign: 'top' }
    },

    // {
    // 	id: 'organization_defect_code',
    // 	name: 'Defect Code',
    // 	style: { minWidth: '110px', verticalAlign: 'top' },
    // },
    // {
    // 	id: 'description',
    // 	name: 'Defect Definition',
    // 	style: { minWidth: '200px', verticalAlign: 'top' },
    // },

    {
      id: 'images',
      style: { minWidth: '400px', verticalAlign: 'top' },
      name: 'Reference Images',
      cell: getRefImages,
      visible: !expandAll,
      classes: 'cell'
    },
    {
      id: 'id',
      name: 'Model Output',
      style: { minWidth: '110px', verticalAlign: 'top' },
      variant: 'subtitle1'
    }
  ];

  const stats = [
    {
      name: 'Defects',
      key: 'defect',
      count: total
    }
  ];

  const dialogActions = [
    {
      text: 'Cancel',
      variant: 'tertiary',
      callback: () => handleDeleteDefectDialog(false)
    },
    {
      text: 'Ok',
      callback: handleDeleteDefect
    }
  ];

  return (
    <Box p={3}>
      <InfoHeader title='Defect Library' buttonGrp={buttonGrp} stats={stats} />
      <Filters
        defectFilter
        filterModels={false}
        UseCase
        commontFilter={false}
        modelFilter
        modelKey='ml_model_id__in'
        folderFilter={false}
      />
      <Paper elevation={0} className={classes.tableSection}>
        <Grid container justifyContent='center'>
          <Grid item xs={12}>
            <TableActions
              drawerClick={handleDrawer}
              state={state}
              expandAll={expandAll}
              setExpandAll={handleExpandAll}
              handleDeleteDefect={handleDeleteDefectDialog}
              handleConfigHotKeyClick={handleConfigHotKeyClick}
            />
            <CustomTable
              columns={columns}
              data={data}
              expandableRows
              expandRowComponent={expandRowComponent}
              rowsExpanded={expandAll}
              isLoading={isLoading}
              onSelect={handleSelect}
              checkboxProps={{ verticalAlign: 'top', paddingTop: '10px' }}
            />
            <CustomPagination
              page={page}
              rowsPerPage={rowsPerPage}
              handlePagechange={handlePagechange}
              handleRowsPerPage={handleChangeRowsPerPage}
              count={Math.ceil(total / rowsPerPage)}
            />
          </Grid>
        </Grid>
      </Paper>
      {drawerOpen && <CreateDefect dispatch={dispatch} />}
      {showDialog && (
        <CommonDialog
          open={showDialog}
          message={`Are you sure you want to delete ${selected?.[0]?.name} ?`}
          actions={dialogActions}
        />
      )}
      <CommonBackdrop open={loading} />
      <ThemeProvider theme={reviewTheme}>
        <CssBaseline />
        <BulkUploadDialog
          open={bulkDialogOpen}
          handleClose={handleBulkDialogClose}
          handleSubmit={handleSubmitDialog}
        />
        <HotkeysConfig
          open={isHotKeyOpen}
          handleClose={handleHotkeyClose}
          selected={selected}
        />
      </ThemeProvider>
    </Box>
  );
};

export default DefectLibrary;
