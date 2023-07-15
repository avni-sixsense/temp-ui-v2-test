// import CssBaseline from '@material-ui/core/CssBaseline'

import { makeStyles } from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CustomBookmark from 'app/components/Bookmark';
import CustomPagination from 'app/components/Pagination';
import CustomCheckBox from 'app/components/ReviewCheckbox';
import LoadingOverlay from 'app/components/Tables/LoadingOverlay';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRowSelect, useTable } from 'react-table';

import DataSetTableActions from '../Dataset/TableAction';
import DatalibTableActions from './TableActions';

const useStyles = makeStyles(theme => ({
  tableBorder: {
    '& tr td, tr th': {
      borderBottom: `1px solid ${theme.colors.grey[1]}`
    },
    '& tr': {
      borderBottom: `1px solid ${theme.colors.grey[1]}`,
      padding: '8px 0px'
    },
    '& tr:last-child': {
      '& td, th': {
        borderBottom: `0px !important`
      }
    }
  },
  border: {
    border: `1px solid ${theme.colors.grey[1]}`
  },
  tableRow: {
    '& tr td': {
      lineHeight: '20px',
      fontWeight: 500,
      color: theme.colors.grey[20],
      fontSize: '0.875rem'
    }
  },
  tableHeader: {
    backgroundColor: `${theme.colors.grey[1]} !important`,
    '&  [class*="stickyHeader"]': {
      backgroundColor: `${theme.colors.grey[1]} !important`,
      '& p': {
        lineHeight: '16px',
        fontWeight: 500,
        color: theme.colors.grey[12],
        fontSize: '0.75rem',
        textTransform: 'uppercase'
      }
    },
    '& p': {
      lineHeight: '16px',
      fontWeight: 500,
      color: theme.colors.grey[12],
      fontSize: '0.75rem',
      textTransform: 'uppercase'
    }
  }
}));

export default function Table({
  data,
  columns,
  isLoading,
  total,
  handleBookmark,
  noBookmark,
  page,
  rowsPerPage,
  handlePagechange,
  handleRowsPerPage,
  count,
  pagination = false
}) {
  const classes = useStyles();
  const { infoMode } = useSelector(({ allUploads }) => allUploads);

  const { getTableProps, headerGroups, rows, prepareRow, selectedFlatRows } =
    useTable(
      {
        columns,
        data
      },
      useRowSelect,
      hooks => {
        hooks.visibleColumns.push(columns =>
          noBookmark
            ? [
                // Let's make a column for selection
                {
                  id: 'selection',
                  Header: ({ getToggleAllRowsSelectedProps }) => (
                    <CustomCheckBox
                      lightTheme
                      {...getToggleAllRowsSelectedProps()}
                    />
                  ),
                  Cell: ({ row }) => (
                    <CustomCheckBox
                      lightTheme
                      {...row.getToggleRowSelectedProps()}
                    />
                  )
                },
                ...columns
              ]
            : [
                // Let's make a column for selection
                {
                  id: 'selection',
                  Header: ({ getToggleAllRowsSelectedProps }) => (
                    <CustomCheckBox
                      lightTheme
                      {...getToggleAllRowsSelectedProps()}
                    />
                  ),
                  Cell: ({ row }) => (
                    <CustomCheckBox
                      lightTheme
                      {...row.getToggleRowSelectedProps()}
                    />
                  )
                },
                {
                  id: 'bookmark',
                  // Header: ({ getToggleAllRowsSelectedProps, ...rest }) => {
                  // 	// console.log({ getToggleAllRowsSelectedProps, ...rest })
                  // 	return <CustomBookmark {...getToggleAllRowsSelectedProps()} />
                  // },
                  Cell: ({ row }) => {
                    return (
                      <CustomBookmark
                        checked={row?.original?.is_bookmarked}
                        onChange={() =>
                          handleBookmark(
                            row?.original?.id,
                            row?.original?.is_bookmarked
                          )
                        }
                      />
                    );
                  }
                },
                ...columns
              ]
        );
      }
    );

  const selected = useMemo(
    () => selectedFlatRows.map(row => row.original),
    [selectedFlatRows]
  );

  return (
    <>
      {infoMode === 'Folder' ? (
        <DatalibTableActions selected={selected} data={data} total={total} />
      ) : (
        <DataSetTableActions selected={selected} total={total} />
      )}
      <LoadingOverlay isLoading={isLoading}>
        <MaUTable
          size='small'
          stickyHeader
          {...getTableProps()}
          className={classes.border}
        >
          <TableHead
            className={`${classes.tableBorder} ${classes.tableHeader}`}
          >
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column =>
                  column.id === 'bookmark' ? (
                    <TableCell
                      id={`lib_table_header_${column.id.split(' ').join('_')}`}
                      {...column.getHeaderProps()}
                      style={{
                        width: '1%',
                        verticalAlign: 'top',
                        paddingTop: '10px'
                      }}
                    >
                      {column.render('Header')}
                    </TableCell>
                  ) : column.id === 'selection' ? (
                    <TableCell
                      id={`lib_table_header_${column.id.split(' ').join('_')}`}
                      {...column.getHeaderProps()}
                      style={{
                        width: '1%',
                        verticalAlign: 'top',
                        paddingTop: '10px'
                      }}
                    >
                      {column.render('Header')}
                    </TableCell>
                  ) : (
                    <TableCell
                      id={`lib_table_header_${column.id.split(' ').join('_')}`}
                      {...column.getHeaderProps()}
                      style={{ verticalAlign: 'center' }}
                    >
                      <Typography variant='body1'>
                        {column.render('Header')}
                      </Typography>
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableHead>
          <TableBody className={`${classes.tableBorder} ${classes.tableRow}`}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    // if (cell.column.Header === 'Use Case') {
                    // 	return (
                    // 		<TableCell {...cell.getCellProps()}>{getUseCase(cell.value)}</TableCell>
                    // 	)
                    // }
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MaUTable>
        {pagination && (
          <CustomPagination
            page={page}
            rowsPerPage={rowsPerPage}
            handlePagechange={handlePagechange}
            handleRowsPerPage={handleRowsPerPage}
            count={Math.ceil(total / rowsPerPage)}
          />
        )}
      </LoadingOverlay>
    </>
  );
}
