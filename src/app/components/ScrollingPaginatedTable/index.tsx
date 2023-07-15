import { useMemo, useState } from 'react';

//3 TanStack Libraries!!!
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { useInfiniteQuery } from 'react-query';
import VirtualTable from '../VirtualTable';
import useObserveLocation from 'app/hooks/useObserveLocation';

interface ScrollingPaginatedTableProps<T> {
  columns: ColumnDef<T>[];
  asyncFn: any;
  asyncFnParams: { [x: string]: string | number } & { allowedKeys: string[] };
  fnKey: string;
  height: number;
  fetchSize?: number;
}

const ScrollingPaginatedTable = <T,>({
  columns,
  asyncFn,
  asyncFnParams,
  fnKey,
  height,
  fetchSize = 10
}: ScrollingPaginatedTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { allowedKeys } = asyncFnParams;
  const locationObserver = useObserveLocation(allowedKeys);

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<
    PaginatedTableResponseType<T>
  >(
    [fnKey, sorting, locationObserver, asyncFnParams], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
    async ({ pageParam = 0 }) => {
      const start = pageParam * fetchSize;
      const fetchedData = asyncFn({
        offset: start,
        limit: fetchSize,
        ...asyncFnParams
      });
      return fetchedData;
    },
    {
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnMount: true
    }
  );

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = useMemo(
    () => data?.pages?.flatMap(page => page.results) ?? [],
    [data]
  );
  const totalData = useMemo(() => data?.pages?.[0].count || 0, [data]);

  const onScrollEnd = () => {
    if (flatData.length < totalData) {
      fetchNextPage();
    }
  };

  return (
    <VirtualTable
      data={flatData}
      isLoading={isLoading}
      columns={columns}
      isFetching={isFetching}
      onScrollEnd={onScrollEnd}
      height={height}
    />
  );
};

export default ScrollingPaginatedTable;
