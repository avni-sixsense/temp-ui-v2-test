import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Filters from 'app/components/Filters';
import CustomPagination from 'app/components/Pagination';
import queryString from 'query-string';
import React from 'react';

// import CustomTable from 'app/components/Tables'
import CustomTable from '../../components/Step2Table';

const useStyle = makeStyles(theme => ({
  root: {
    backgroundColor: 'white',
    width: '100%'
  },
  dataLibrary: {
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '16px',
    color: '#02435D'
  },
  headerBtn: {
    background: 'rgba(2, 67, 93, 0.06)',
    border: '1px solid #FFFFFF',
    boxSizing: 'border-box',
    borderRadius: '3px',
    fontSize: '14px',
    minWidth: '63px !important',
    height: '34px',
    color: '#02435D',
    '&:hover': {
      color: 'white',
      border: 'none'
    }
  },
  container: {
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20
  },
  filterBtn: {
    background: '#02435D',
    borderRadius: '32px',
    minWidth: '128px',
    height: '32px',
    fontSize: '12px',
    marginLeft: 10
  },
  formControl: {
    margin: theme.spacing(1),
    // minWidth: '180px',
    borderBottom: 'unset !important',
    '&:before': {
      borderBottom: 'none !important'
    }
  },
  flex: {
    display: 'flex'
  },
  header: {
    marginTop: 0
  },
  filterBtnContainer: {
    // marginBottom: 40,
  },
  label: {
    color: '#000000',
    position: 'relative',
    left: 10,
    top: 15,
    marginRight: 45
  },
  tableTitle: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '28px',
    color: '#02435D'
  },
  tableHeader: {
    marginTop: 40,
    marginLeft: 20,
    marginBottom: 20
  },
  image: { width: '200px', marginTop: '15px', marginBottom: '15px' }
}));

const getDefects = defects => {
  const s = [];
  Object.entries(defects || {}).forEach(([key, value]) => {
    s.push(`${key}(${value})`);
  });
  return s.join(', ');
};

const Step2 = ({
  allSelected,
  count,
  getTableProps,
  headerGroups,
  isLoading,
  page,
  prepareRow,
  rows,
  rowsPerPage,
  setRowsPerPage,
  showAllTitle,
  setShowAllTitle,
  setPage,
  queryParams,
  setQueryParams
}) => {
  const classes = useStyle();

  const handlePagechange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = value => {
    setRowsPerPage(value);
    setPage(1);
  };

  const handleShowAllTitle = status => {
    const params = queryString.parse(queryParams, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    delete params.id__in;
    setShowAllTitle(status);
    setQueryParams(queryString.stringify(params, { arrayFormat: 'comma' }));
  };
  const typeData = [
    {
      name: 'Training',
      value: 'TRAIN'
    },
    {
      name: 'Testing',
      value: 'TEST,VALIDATION'
    },
    {
      name: 'Not used for training',
      value: 'NOT_TRAINED'
    }
  ];

  return (
    <Grid container>
      <Filters
        modelFilter
        modelKey='ml_model_id__in'
        typeFilter
        // dateFilter
        filterModels={false}
        bookmarkFilter
        UseCase
        groundTruth
        gtModel
        typeData={typeData}
      />
      <Grid className={classes.root}>
        <Typography className={classes.tableHeader} variant='h3'>
          Images - Showing&nbsp;
          {count < rowsPerPage ? count : rowsPerPage} of {count} Images
        </Typography>
        <Grid
          className={classes.container}
          container
          justifyContent='space-between'
          alignItems='center'
        >
          <div>
            {allSelected && !showAllTitle ? (
              <Box
                height={34}
                display='flex'
                alignItems='center'
                ml={3}
                style={{ float: 'right', cursor: 'pointer' }}
                onClick={() => handleShowAllTitle(true)}
              >
                <Typography>{`Select all ${count} images`}</Typography>
              </Box>
            ) : (
              ''
            )}
            {showAllTitle ? (
              <Box
                height={34}
                display='flex'
                alignItems='center'
                ml={3}
                style={{ float: 'right', cursor: 'pointer' }}
              >
                <Typography variant='body1'>{`All ${count} images selected`}</Typography>
              </Box>
            ) : (
              ''
            )}
          </div>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <CustomTable
              isLoading={isLoading}
              getDefects={getDefects}
              prepareRow={prepareRow}
              headerGroups={headerGroups}
              rows={rows}
              getTableProps={getTableProps}
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
      </Grid>
    </Grid>
  );
};

export default Step2;
