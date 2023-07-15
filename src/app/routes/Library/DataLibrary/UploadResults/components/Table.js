import { makeStyles } from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CustomCheckBox from 'app/components/Checkbox';
import LoadingOverlay from 'app/components/Tables/LoadingOverlay';
import React, { useEffect, useMemo } from 'react';
import { useRowSelect, useTable } from 'react-table';

import TableActions from './TableActions';

const useStyles = makeStyles(() => ({
  tableBorder: {
    '& tr td': {
      borderBottom: '0px'
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
              <CustomCheckBox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <CustomCheckBox {...row.getToggleRowSelectedProps()} />
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
        <MaUTable {...getTableProps()}>
          <TableHead>
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
                      style={{ verticalAlign: 'top' }}
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
