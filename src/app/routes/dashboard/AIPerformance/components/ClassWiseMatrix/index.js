import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import SortOutlinedIcon from '@material-ui/icons/SortOutlined';
import CustomSwitch from 'app/components/CustomSwitch';
import { FilterKey, ReviewScreen } from 'app/utils/filterConstants';
import { decodeURL, encodeURL, NumberFormater } from 'app/utils/helpers';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { setUploadSession } from 'store/reviewData/actions';

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };
  const sortIcon = sortOrder => {
    if (sortOrder === 'asc')
      return (
        <SortOutlinedIcon
          fontSize='small'
          className='float-right'
          style={{ transform: 'rotate(180deg)' }}
        />
      );
    if (sortOrder === 'desc')
      return <SortOutlinedIcon fontSize='small' className='float-right' />;
    return (
      <SortOutlinedIcon
        fontSize='small'
        className='float-right'
        style={{ transform: 'rotate(180deg)' }}
      />
    );
  };

  return (
    <TableHead className={classes.tableHead}>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.dataField}
            align='left'
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.dataField ? order : false}
          >
            {headCell.sort ? (
              <TableSortLabel
                active={orderBy === headCell.dataField}
                direction={orderBy === headCell.dataField ? order : 'asc'}
                onClick={createSortHandler(headCell.dataField)}
                IconComponent={() =>
                  sortIcon(orderBy === headCell.dataField ? order : 'asc')
                }
              >
                <Box mr={2}>
                  <Typography variant='body1'>{headCell.text}</Typography>
                </Box>
              </TableSortLabel>
            ) : (
              <Typography variant='body1'>{headCell.text}</Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    // padding: '2%',
    paddingLeft: '2.5%',
    paddingRight: '2.5%'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    boxShadow: 'none'
  },
  table: {
    minWidth: 750,
    width: '100%',
    backgroundColor: 'white'
  },
  tableHead: {
    backgroundColor: 'white',
    '& .MuiTableRow-root': {
      '& .MuiTableCell-head': {
        borderBottom: '2px solid rgba(230, 230, 230, 0.5)'
      }
    }
  },
  tableRow: {
    '& .MuiTableCell-body': {
      borderBottom: '1px solid rgba(230, 230, 230, 0.5)'
    }
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
  image: {
    width: '200px',
    marginTop: '15px',
    marginBottom: '15px'
  },
  loading: {
    display: 'flex',
    height: '80px',
    justifyContent: 'center'
    // '& > * + *': {
    // 	marginLeft: theme.spacing(2),
    // },
  },
  switch: {
    '& .custom-control-input:checked ~ .custom-control-label::before': {
      background: '#02435D'
    }
  },
  heading: {
    borderBottom: '0.5px solid #D0D0D0'
  }
}));

export default function EnhancedTable({
  data,
  isLoading,
  model,
  displayMatrix,
  handleMatrixDisplay
}) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [sortField, setSortField] = useState('defect.name');

  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionId, packId } = useParams();

  const dispatch = useDispatch();

  const handleRequestSort = (event, property) => {
    const isAsc = sortField === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setSortField(property);
  };

  const handleCellClick = (row, count, label) => {
    if (count) {
      const existingParams = queryString.parse(location.search);

      const contextualFilters = decodeURL(existingParams.contextual_filters);
      const otherFilters = decodeURL(existingParams.other_filters);

      delete contextualFilters?.page;
      delete otherFilters?.page;

      const params = queryString.stringify({
        contextual_filters: encodeURL(
          {
            ...contextualFilters,
            ...otherFilters,
            [label]: row.defect.id,
            ml_model_id__in: model?.id
          },
          { arrayFormat: 'comma' }
        )
      });

      dispatch(setUploadSession(params));

      navigate(`/${subscriptionId}/${packId}/annotation/review?${params}`, {
        state: {
          path: location.pathname,
          params: location.search
        }
      });
    }
  };

  const headCells = [
    {
      dataField: 'defect.name',
      text: 'Defect',
      sort: true,
      formatter: (row, value) => (
        <Typography variant='body2'>{value}</Typography>
      )
    },
    {
      dataField: 'precision',
      text: 'Precision',
      sort: true,
      formatter: (row, value) => (
        <Typography variant='body2'>{value ? `${value}%` : 'N/A'}</Typography>
      )
    },
    {
      dataField: 'recall',
      text: 'Recall',
      sort: true,
      formatter: (row, value) => (
        <Typography variant='body2'>{value ? `${value}%` : 'N/A'}</Typography>
      )
    },
    {
      dataField: 'false_positives.count',
      text: 'False Positive',
      sort: true,
      formatter: (row, value) => (
        <Typography
          variant='body2'
          className='ss_pointer'
          onClick={() =>
            handleCellClick(
              row,
              row.false_positives.count,
              'false_positive_label__in'
            )
          }
        >
          {value}
        </Typography>
      )
    },
    {
      dataField: 'false_negatives.count',
      text: 'False Negative',
      sort: true,
      formatter: (row, value) => (
        <Typography
          variant='body2'
          className='ss_pointer'
          onClick={() =>
            handleCellClick(
              row,
              row.false_negatives.count,
              'false_negative_label__in'
            )
          }
        >
          {NumberFormater(value)}
        </Typography>
      )
    },
    {
      dataField: 'true_positives.count',
      text: 'True Positive',
      sort: true,
      formatter: (row, value) => (
        <Typography
          variant='body2'
          className='ss_pointer'
          onClick={() =>
            handleCellClick(
              row,
              row.true_positives.count,
              'true_positive_label__in'
            )
          }
        >
          {NumberFormater(value)}
        </Typography>
      )
    }
  ];

  return (
    <Box my={4}>
      <Box
        my={1}
        display='flex'
        pb={2}
        justifyContent='space-between'
        className={`${classes.heading}`}
      >
        <Box display='flex'>
          <Typography variant='h2'>Class Wise Metrics</Typography>
        </Box>
        <CustomSwitch
          checked={displayMatrix}
          handleChecked={handleMatrixDisplay}
        />
      </Box>
      {displayMatrix && (
        <Box display='flex' justifyContent='center' px={8} my={3}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Table
              className={classes.table}
              aria-labelledby='tableTitle'
              size='medium'
              aria-label='enhanced table'
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={sortField}
                onRequestSort={handleRequestSort}
                headCells={headCells}
              />
              <TableBody>
                {orderBy(data, [sortField], [order]).map((row, index) => (
                  <TableRow key={index} className={classes.tableRow}>
                    {headCells.map(cell => {
                      const value = get(row, cell.dataField);
                      return (
                        <TableCell
                          key={cell.dataField}
                          align='left'
                          onClick={() => {}}
                        >
                          {cell.formatter(row, value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      )}
    </Box>
  );
}
