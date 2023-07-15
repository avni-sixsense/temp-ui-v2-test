import { faSort, faSortDown, faSortUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CustomCheckBox from 'app/components/ReviewCheckbox';
import LoadingOverlay from 'app/components/Tables/LoadingOverlay';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRowSelect, useSortBy, useTable } from 'react-table';
import { createStructuredSelector } from 'reselect';
import { setSelectedDefects } from 'store/modelTraining/actions';
import { selectSelectedDefects } from 'store/modelTraining/selector';

const useStyles = makeStyles(theme => ({
  tableBorder: {
    '& tr td, tr th': {
      borderBottom: `0px`
    },
    '& tr': {
      // borderBottom: `1px solid ${theme.colors.grey[3]}`,
      padding: '0px'
    },
    '& tr:last-child': {
      borderBottom: `0px`
    }
  },
  tableRow: {
    '& tr td': {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: theme.colors.grey[19]
    }
  },
  tableHeader: {
    '&  [class*="stickyHeader"]': {
      backgroundColor: `${theme.colors.grey[1]} !important`,
      '& p': {
        fontSize: '0.6875rem',
        fontWeight: 500,
        color: theme.colors.grey[13],
        textTransform: 'uppercase',
        display: 'flex',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }
    },
    '& p': {
      fontSize: '0.6875rem',
      fontWeight: 500,
      color: theme.colors.grey[13],
      textTransform: 'uppercase',
      display: 'flex',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  },
  table: {
    '& [class*="MuiTableCell-sizeSmall-"]': {
      padding: '6px 6px 6px 0px'
    },
    '& [class*="MuiTableCell-sizeSmall-"]:last-child, [class*="MuiTableCell-sizeSmall-"]:first-child':
      {
        padding: '6px 6px 6px 0px'
      }
  }
}));

const mapDefectTableToState = createStructuredSelector({
  selectedDefects: selectSelectedDefects
});

export default function Table({ columns, data, isLoading, selectable }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { selectedDefects } = useSelector(mapDefectTableToState);

  const { getTableProps, headerGroups, rows, prepareRow, selectedFlatRows } =
    useTable(
      {
        columns,
        data
      },
      useSortBy,
      useRowSelect,
      hooks => {
        hooks.visibleColumns.push(columns =>
          selectable
            ? [
                {
                  id: 'selection',
                  Header: ({ getToggleAllRowsSelectedProps }) => (
                    <CustomCheckBox
                      whiteTheme
                      {...getToggleAllRowsSelectedProps()}
                    />
                  ),
                  Cell: ({ row }) => (
                    <CustomCheckBox
                      whiteTheme
                      {...row.getToggleRowSelectedProps()}
                    />
                  )
                },
                ...columns
              ]
            : [...columns]
        );
      }
    );

  useMemo(() => {
    const newSelectedDefects = selectedDefects.map(({ id }) => id);

    if (
      JSON.stringify(newSelectedDefects.sort()) !==
      JSON.stringify(selectedFlatRows.map(({ original }) => original.id).sort())
    ) {
      dispatch(
        setSelectedDefects(selectedFlatRows.map(({ original }) => original.id))
      );
    }
  }, [selectedFlatRows]);

  return (
    <>
      <LoadingOverlay isLoading={isLoading}>
        <MaUTable
          size='small'
          stickyHeader
          className={classes.table}
          {...getTableProps()}
        >
          <TableHead
            className={`${classes.tableBorder} ${classes.tableHeader}`}
          >
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column =>
                  column.id === 'selection' ? (
                    <TableCell
                      id={`lib_table_header_${column.id.split(' ').join('_')}`}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
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
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{ verticalAlign: 'center' }}
                    >
                      <Typography>
                        {column.render('Header')}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FontAwesomeIcon icon={faSortDown} />
                            ) : (
                              <FontAwesomeIcon icon={faSortUp} />
                            )
                          ) : (
                            <FontAwesomeIcon icon={faSort} />
                          )}
                        </span>
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
