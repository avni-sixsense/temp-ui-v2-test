import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import api from 'app/api';
import Filters from 'app/components/Filters';
import InfoHeader from 'app/components/InfoHeader';
import CustomPagination from 'app/components/Pagination';
import { goToPreviousRoute } from 'app/utils/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import initialState from 'store/constants/initial';

import CustomTable from './components/Table';

const stats = [
  {
    name: 'Folders',
    key: 'upload_session_count'
  },
  {
    name: 'Records',
    key: 'fileset_count'
  }
];

const typeData = [
  {
    id: 1,
    name: 'Training',
    value: 'TRAIN'
  },
  { id: 2, name: 'Testing', value: 'TEST,VALIDATION' },
  { id: 3, name: 'Not used for training', value: 'NOT_TRAINED' }
];

const UploadResults = () => {
  const { subscriptionId, packId } = useParams();
  const navigate = useNavigate();

  const dispatchGlobal = useDispatch();

  const tableStructure = useSelector(state => state.dataLibrary.tableStructure);
  const paramsString = useSelector(({ filters }) => filters.paramsString);

  const [count, setCount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(
    initialState.pagination.defaultPageSize
  );
  const [showAllTitle, setShowAllTitle] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    [
      'fileSets',
      rowsPerPage,
      rowsPerPage * (page - 1),
      subscriptionId,
      paramsString,
      true
    ],
    context => api.getFileSets(...context.queryKey),
    { enabled: paramsString !== '' }
  );

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries('fileSets');
    };
  }, []);

  useEffect(() => {
    if (data?.results) {
      const filteredData = [];
      data.results.forEach(result => {
        const sessionid = result.upload_session;
        const folder = result.upload_session_name;
        result.files.forEach(el => {
          const temp = {
            ...el,
            ...result.meta_info
          };
          temp.id = el.id;
          temp.Images = el.url;
          temp.fileSetId = el.file_set;
          temp.src = el.url;
          temp.Folder = folder;
          temp.sessionId = sessionid;
          filteredData.push(temp);
        });
      });
      setCount(data.count);
      setTableData(filteredData);
    }
  }, [data]);

  useEffect(() => {
    const temp = [
      {
        Header: 'Images',
        accessor: 'src',
        Cell: ({ value }) => (
          <img
            src={value}
            alt=''
            style={{ width: '200px', height: '200px', margin: '8px 0' }}
          />
        )
      },
      {
        Header: 'Folder',
        accessor: 'Folder',
        Cell: ({ value }) => <Typography variant='body2'>{value}</Typography>
      },
      {
        Header: 'File',
        accessor: 'name',
        Cell: ({ value }) => <Typography variant='body2'>{value}</Typography>
      }
    ];
    if (tableStructure?.length > 0) {
      tableStructure.forEach(el => {
        temp.push({
          Header: el.name,
          accessor: el.field,
          Cell: ({ value }) => (
            <Typography variant='subtitle1'>{value}</Typography>
          )
        });
        return { ...el, label: el.name, id: el.field };
      });
    }
    setColumns(temp);
  }, [tableStructure]);

  useEffect(() => {
    setPage(1);
  }, [paramsString]);

  const handlePagechange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = value => {
    setRowsPerPage(value);
    setPage(1);
  };

  const buttonGrp = [
    // {
    // 	text: 'Upload Data',
    // 	callback: handleUploadDataClick,
    // 	disabled: false,
    // },
  ];

  const handleGoBack = () => {
    dispatchGlobal({ type: 'RESET_APPLIED' });
    goToPreviousRoute(navigate, `${subscriptionId}/${packId}/library/data`);
  };

  return (
    <>
      <Box
        mb={3}
        mt={2}
        id='data_lib_btn_main_folder'
        onClick={handleGoBack}
        className='ss_pointer'
      >
        <Typography variant='h4' />
        <ArrowBackIosIcon style={{ fontSize: '0.75rem' }} /> Main Folder
      </Box>

      <InfoHeader title='Data Library' stats={stats} buttonGrp={buttonGrp} />

      <Filters
        modelFilter
        modelKey='training_ml_model__in'
        typeFilter
        dateFilter
        filterModels={false}
        bookmarkFilter
        typeData={typeData}
        wafermap
        UseCase
        groundTruth
      />

      <Paper elevation={0}>
        <Grid container justifyContent='center'>
          <Grid item xs={12}>
            <CustomTable
              isLoading={isLoading}
              data={tableData}
              columns={columns}
              total={count}
              rowsPerPage={rowsPerPage}
              setShowAllTitle={setShowAllTitle}
              showAllTitle={showAllTitle}
            />

            <CustomPagination
              page={page}
              rowsPerPage={rowsPerPage}
              handlePagechange={handlePagechange}
              handleRowsPerPage={handleChangeRowsPerPage}
              count={Math.ceil(count / rowsPerPage)}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default UploadResults;
