// import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CustomPagination from 'app/components/Pagination';
import CustomCheckBox from 'app/components/ReviewCheckbox';
import LoadingOverlay from 'app/components/Tables/LoadingOverlay';
import React, { useMemo } from 'react';
import { useRowSelect, useTable } from 'react-table';

import TableActions from './TableActions';

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
  handleDelete,
  drawerClick,
  getUseCase,
  page,
  rowsPerPage,
  handlePagechange,
  handleRowsPerPage,
  total,
  pagination = false
}) {
  const classes = useStyles();

  const { getTableProps, headerGroups, rows, prepareRow, selectedFlatRows } =
    useTable(
      {
        columns,
        data
      },
      useRowSelect,
      hooks => {
        hooks.visibleColumns.push(columns => [
          // Let's make a column for selection
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <CustomCheckBox lightTheme {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <CustomCheckBox lightTheme {...row.getToggleRowSelectedProps()} />
            )
          },
          ...columns
        ]);
      }
    );

  const selected = useMemo(
    () => selectedFlatRows.map(row => row.original),
    [selectedFlatRows]
  );
  return (
    <>
      <TableActions
        selected={selected}
        drawerClick={drawerClick}
        handleDelete={handleDelete}
      />
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
                  column.id === 'selection' ? (
                    <TableCell
                      {...column.getHeaderProps()}
                      style={{
                        width: '1%',
                        verticalAlign: 'center',
                        paddingTop: '5px'
                      }}
                    >
                      {column.render('Header')}
                    </TableCell>
                  ) : (
                    <TableCell
                      {...column.getHeaderProps([
                        {
                          className: column.className,
                          style: { ...column.style, verticalAlign: 'center' }
                        }
                      ])}
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
                    // if (cell.column?.id === 'defect_tags') {
                    // 	return (
                    // 		<TableCell {...cell.getCellProps()}>
                    // 			{getDefects(cell.row.original.defects)}
                    // 		</TableCell>
                    // 	)
                    // }
                    if (cell.column?.id === 'use_case') {
                      return (
                        <TableCell {...cell.getCellProps()}>
                          {getUseCase(cell.row.original.use_case)}
                        </TableCell>
                      );
                    }

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
