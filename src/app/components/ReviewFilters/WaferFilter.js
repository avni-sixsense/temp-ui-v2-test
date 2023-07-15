import api from 'app/api';
import axios from 'app/api/base';
import { objectToParams, updateNextDataURL } from 'app/utils/helpers';
import { debounce, keyBy } from 'lodash';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import FilterBox from './FilterBox';

const WaferFilter = ({ filterKey, setFilters, filters, lightTheme }) => {
  const [data, setData] = useState([]);

  const waferMapQuery = useSelector(
    ({ filterQuries }) => filterQuries.wafermap
  );

  const [waferDict, setWaferDict] = useState({});
  const [next, setNext] = useState(null);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState('');
  const [search, setSearch] = useState('');
  const [value, setValue] = useState([]);

  const queryClient = useQueryClient();

  const { data: wafers, isLoading: isWaferLoading } = useQuery(
    ['wafers', true, searchParams, objectToParams(waferMapQuery)],
    context => api.getPaginateWaferMap(...context.queryKey)
  );

  const { data: filteredWafers, isLoading: isFilteredWaferLoading } = useQuery(
    ['filteredWafers', (filters?.[filterKey] || []).join(',')],
    context => api.getWaferMap(...context.queryKey),
    { enabled: !!filters[filterKey] && filters[filterKey].length > 0 }
  );

  const { data: wafersCount, isLoading: isWaferCountLoading } = useQuery(
    ['wafersCount', false, searchParams, objectToParams(waferMapQuery)],
    context => api.getPaginateWaferMap(...context.queryKey)
  );

  const [lastCursorCall, setLastCursorCall] = useState(null);

  useEffect(() => {
    const keys = keyBy(filteredWafers?.results || [], 'id');
    if (
      Array.isArray(filters[filterKey]) &&
      (filteredWafers?.results || []).length
    ) {
      setValue(filters[filterKey].map(x => keys[x]));
    } else if ((filteredWafers?.results || []).length) {
      setValue([keys[filters[filterKey]]]);
    } else {
      setValue([]);
    }
  }, [filters, filteredWafers]);

  useEffect(() => {
    if (wafers) {
      setData(wafers?.results || []);
      const dict = keyBy(wafers?.results || [], 'id');
      setLastCursorCall(null);
      setWaferDict(dict);
      setNext(updateNextDataURL(wafers?.next));
    }
  }, [wafers]);

  useEffect(() => {
    const filteredDict = keyBy(filteredWafers?.results || [], 'id');
    const filteredKeys = Object.keys(filteredDict);
    const dataKey = Object.keys(keyBy(data, 'id'));
    if (data.length && !filteredKeys.every(item => dataKey.includes(item))) {
      setData([
        ...(filteredWafers?.results || []),
        ...data.filter(item => !filteredKeys.includes(item.id.toString()))
      ]);
      const dict = keyBy(filteredWafers?.results || [], 'id');
      setWaferDict({ ...waferDict, ...dict });
    }
  }, [filteredWafers, data]);

  const handleApplyFilter = () => {
    let ids = [];

    ids = value.map(v => v?.id);
    const temp = {};
    temp[filterKey] = ids;
    setFilters(prev => {
      return { ...prev, ...temp };
    });
  };

  const debounceSearch = () => {
    setSearchParams(search);
  };

  const delayedQuery = useCallback(debounce(debounceSearch, 500), [search]);

  useEffect(() => {
    if (search.length) {
      delayedQuery();
    } else if (isSearched) {
      delayedQuery();
      setTimeout(() => {
        setIsSearched(false);
      }, 3000);
    }
    return delayedQuery.cancel;
  }, [search, delayedQuery, isSearched]);

  const handleSearch = async value => {
    setSearch(value);
    if (value) {
      if (!isSearched) {
        setIsSearched(true);
      } else {
        queryClient.invalidateQueries('wafers');
        queryClient.invalidateQueries('wafersCount');
      }
    }
  };

  const loadFilesets = () => {
    const t = queryString.parse(next?.split('?')[1])?.cursor || null;
    if (next !== null && lastCursorCall !== t && !isLoading) {
      setIsLoading(true);
      return axios
        .get(next)
        .then(({ data: newWafers }) => {
          const dict = keyBy(newWafers?.results, 'id');
          const fileredKeys = Object.keys(waferDict);
          setData([
            ...data,
            ...(newWafers?.results || []).filter(
              item => !fileredKeys.includes(item.id.toString())
            )
          ]);
          setWaferDict({ ...waferDict, ...dict });

          setLastCursorCall(t);
          setNext(updateNextDataURL(newWafers?.next));
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }

    return new Promise((resolve, reject) => {
      return resolve();
    });
  };

  const isItemLoaded = index => {
    return !!(data?.results || [])[index];
  };

  return (
    <FilterBox
      lightTheme={lightTheme}
      data={data}
      isLoading={
        isWaferLoading || isWaferCountLoading || isFilteredWaferLoading
      }
      id={filterKey}
      onClose={handleApplyFilter}
      title='Wafer Id'
      titleGetter='organization_wafer_id'
      loadFileSets={loadFilesets}
      isItemLoaded={isItemLoaded}
      itemcount={wafersCount?.count || 0}
      handleSearch={handleSearch}
      search={search}
      isLoadingMoreData={isLoading}
      value={value}
      setValue={setValue}
    />
  );
};

export default WaferFilter;
