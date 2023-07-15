import { faSortDown, faSortUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import LoadingOverlay from 'app/components/Tables/LoadingOverlay';
import React, { useEffect, useMemo } from 'react';
import { useRowSelect, useSortBy, useTable } from 'react-table';

const useStyles = makeStyles(theme => ({
  tableBorder: {
    '& tr th': {
      borderBottom: `0px`,
      padding: '8px 4px'
    },
    '& tr td': {
      borderBottom: `1px solid ${theme.colors.grey[3]}`,
      padding: '8px 4px'
    },
    '&  tr th:last-child, tr td:last-child': {
      paddingRight: '10px'
    },
    '&  tr th:first-child, tr td:first-child': {
      paddingLeft: '10px'
    },
    '& tr:last-child td': {
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
      useSortBy,
      useRowSelect
      // (hooks) => {
      // 	hooks.visibleColumns.push((columns) => [
      // 		{
      // 			id: 'selection',
      // 			Header: ({ getToggleAllRowsSelectedProps }) => (
      // 				<CustomCheckBox lightTheme {...getToggleAllRowsSelectedProps()} />
      // 			),
      // 			Cell: ({ row }) => <CustomCheckBox lightTheme {...row.getToggleRowSelectedProps()} />,
      // 		},
      // 		...columns,
      // 	])
      // }
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
    <LoadingOverlay isLoading={isLoading}>
      <MaUTable size='small' stickyHeader {...getTableProps()}>
        <TableHead className={`${classes.tableBorder} ${classes.tableHeader}`}>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                const id = `lib_table_header_${column.id.split(' ').join('_')}`;

                return (
                  <TableCell
                    id={id}
                    key={id}
                    {...column.getSortByToggleProps({
                      title: undefined,
                      style: {
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                        width: column.width
                      }
                    })}
                    style={{ verticalAlign: 'center' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Typography
                        style={{ marginRight: '4px' }}
                        variant='body1'
                      >
                        {column.render('Header')}
                      </Typography>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FontAwesomeIcon icon={faSortDown} />
                        ) : (
                          <FontAwesomeIcon icon={faSortUp} />
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody className={`${classes.tableBorder} ${classes.tableRow}`}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <TableCell
                    {...cell.getCellProps({
                      style: {
                        minWidth: cell.column.minWidth,
                        maxWidth: cell.column.maxWidth,
                        width: cell.column.width,
                        overflowWrap: 'anywhere'
                      }
                    })}
                  >
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </MaUTable>
    </LoadingOverlay>
  );
}
