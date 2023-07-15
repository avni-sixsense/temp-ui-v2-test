// import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CustomCheckBox from 'app/components/Checkbox';
import LoadingOverlay from 'app/components/Tables/LoadingOverlay';
import React, { useMemo } from 'react';
import { useRowSelect, useTable } from 'react-table';

import TableActions from './TableActions';

const useStyles = makeStyles(theme => ({
  tableBorder: {
    '& tr td': {
      borderBottom: '0px'
    }
  },
  tableContainer: {
    marginTop: theme.spacing(1),
    position: 'relative',
    minHeight: '125px',
    overflowY: 'hidden'
  }
}));

export default function Table({
  data,
  columns,
  isLoading,
  drawerClick,
  checkBox = true
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
        hooks.visibleColumns.push(columns =>
          checkBox
            ? [
                // Let's make a column for selection
                {
                  id: 'selection',
                  Header: ({ getToggleAllRowsSelectedProps }) => (
                    <CustomCheckBox {...getToggleAllRowsSelectedProps()} />
                  ),
                  Cell: ({ row }) => (
                    <CustomCheckBox {...row.getToggleRowSelectedProps()} />
                  )
                },
                ...columns
              ]
            : columns
        );
      }
    );

  const selected = useMemo(
    () => selectedFlatRows.map(row => row.original),
    [selectedFlatRows]
  );

  return (
    <>
      {checkBox && (
        <TableActions
          selected={selected}
          data={data}
          drawerClick={drawerClick}
        />
      )}
      <LoadingOverlay isLoading={isLoading}>
        <MaUTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column =>
                  column.id === 'selection' ? (
                    <TableCell
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
                      style={{ verticalAlign: 'top' }}
                      {...column.getHeaderProps()}
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
          <TableBody className={classes.tableBorder}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    if (cell.column.id === 'defects') {
                      return (
                        <TableCell variant='body2' {...cell.getCellProps()}>
                          {cell.value.length}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell variant='body2' {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MaUTable>
      </LoadingOverlay>
    </>
  );
}
