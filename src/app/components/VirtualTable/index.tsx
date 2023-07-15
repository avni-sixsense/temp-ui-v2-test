import { useRef, useState } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CircularProgress, makeStyles, Typography } from '@material-ui/core';
import { faSortDown, faSortUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Show from 'app/hoc/Show';
import WithCondition from 'app/hoc/WithCondition';
import type { ClassNameMap } from '@material-ui/core/styles/withStyles';

const useStyles: (props: { height: number }) => ClassNameMap = makeStyles(
  (theme: any) => ({
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
    },
    container: {
      height: props => props.height,
      overflow: 'auto'
    }
  })
);

interface VirtualTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading: boolean;
  onScrollEnd?: () => void;
  isFetching?: boolean;
  height: number;
}

const VirtualTable = <T,>({
  columns,
  data,
  isLoading = false,
  onScrollEnd,
  isFetching = false,
  height
}: VirtualTableProps<T>) => {
  const classes = useStyles({ height });

  const ref = useRef(null);
  const tbodyRef = useRef<HTMLTableSectionElement | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => ref.current,
    estimateSize: () => 50,
    overscan: 5
  });

  const items = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = items.length > 0 ? items[0].start || 0 : 0;
  const paddingBottom =
    items.length > 0 ? totalSize - items[items.length - 1].end : 0;

  const isInViewport = () => {
    if (tbodyRef.current) {
      const parentRect = tbodyRef.current.getBoundingClientRect();
      const lastElement = (
        tbodyRef.current.lastChild as HTMLTableRowElement
      ).getBoundingClientRect();

      return (
        lastElement.top >= parentRect.top &&
        lastElement.bottom <= parentRect.bottom
      );
    }
  };

  const onScollCapture = () => {
    if (onScrollEnd && isInViewport() && !isFetching) {
      onScrollEnd();
    }
  };

  return (
    <div
      ref={ref}
      className={classes.container}
      onScrollCapture={onScollCapture}
    >
      <MaUTable size='small' stickyHeader>
        <TableHead className={`${classes.tableBorder} ${classes.tableHeader}`}>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(column => {
                return (
                  <TableCell
                    id={column.id}
                    key={column.id}
                    colSpan={column.colSpan}
                    style={{
                      width: column.getSize(),
                      verticalAlign: 'center'
                    }}
                  >
                    <div
                      {...{
                        className: column.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: column.column.getToggleSortingHandler()
                      }}
                    >
                      <Typography variant='body1'>
                        {flexRender(
                          column.column.columnDef.header,
                          column.getContext()
                        )}
                        {{
                          asc: <FontAwesomeIcon icon={faSortUp} />,
                          desc: <FontAwesomeIcon icon={faSortDown} />
                        }[column.column.getIsSorted() as string] ?? null}
                      </Typography>
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>

        <WithCondition
          when={isLoading}
          then={
            <TableRow key='loading'>
              <TableCell
                key='loading-cell'
                colSpan={columns.length}
                style={{ textAlign: 'center' }}
              >
                <CircularProgress />
              </TableCell>
            </TableRow>
          }
          or={
            <TableBody
              className={`${classes.tableBorder} ${classes.tableRow}`}
              ref={tbodyRef}
            >
              {paddingTop > 0 && (
                <TableRow>
                  <TableCell style={{ height: `${paddingTop}px` }}></TableCell>
                </TableRow>
              )}

              {items.map(virtualRow => {
                const row = rows[virtualRow.index] as Row<T>;

                return (
                  <TableRow key={virtualRow.key}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}

              <Show when={isFetching}>
                <TableRow key='loading'>
                  <TableCell
                    key='loading-cell'
                    colSpan={columns.length}
                    style={{ textAlign: 'center' }}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              </Show>

              {paddingBottom > 0 && (
                <TableRow>
                  <TableCell
                    style={{ height: `${paddingBottom}px` }}
                  ></TableCell>
                </TableRow>
              )}
            </TableBody>
          }
        />
      </MaUTable>
    </div>
  );
};

export default VirtualTable;
