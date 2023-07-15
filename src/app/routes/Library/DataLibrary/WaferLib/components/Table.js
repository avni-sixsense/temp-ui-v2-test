import { makeStyles } from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CustomCheckBox from 'app/components/ReviewCheckbox';
import LoadingOverlay from 'app/components/Tables/LoadingOverlay';
import React, { useEffect, useMemo } from 'react';
import { useRowSelect, useTable } from 'react-table';

import TableActions from './TableActions';

const useStyles = makeStyles(theme => ({
  tableBorder: {
    '& tr td, tr th': {
      borderBottom: `0px`
    },
    '& tr': {
      borderBottom: `1px solid ${theme.colors.grey[3]}`,
      padding: '8px 0px'
    },
    '& tr:last-child': {
      borderBottom: `0px`
    }
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
  columns,
  data,
  isLoading,
  total,
  rowsPerPage,
  showAllTitle,
  setShowAllTitle
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

  const selectedRows = useMemo(
    () => selectedFlatRows.map(row => row.original),
    [selectedFlatRows]
  );

  useEffect(() => {
    if (showAllTitle && selectedRows.length === 0) {
      setShowAllTitle(false);
    }
  }, [showAllTitle, selectedRows, setShowAllTitle]);

  return (
    <>
      <TableActions
        total={total}
        selectedRows={selectedRows}
        rowsPerPage={rowsPerPage}
        showAllTitle={showAllTitle}
        setShowAllTitle={setShowAllTitle}
      />
      <LoadingOverlay isLoading={isLoading}>
        <MaUTable size='small' stickyHeader {...getTableProps()}>
          <TableHead
            className={`${classes.tableBorder} ${classes.tableHeader}`}
          >
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column =>
                  column.id === 'selection' ? (
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
                  {row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </MaUTable>
      </LoadingOverlay>
    </>
  );
}
