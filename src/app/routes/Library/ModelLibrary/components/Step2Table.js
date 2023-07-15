// import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import LoadingOverlay from 'app/components/Tables/LoadingOverlay';
import React from 'react';

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
  isLoading,
  rows,
  headerGroups,
  prepareRow,
  getTableProps
}) {
  const classes = useStyles();

  return (
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
              <TableRow {...row.getRowProps()} style={{ verticalAlign: 'top' }}>
                {row.cells.map(cell => {
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
    </LoadingOverlay>
  );
}
