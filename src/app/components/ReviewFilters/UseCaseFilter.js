import api from 'app/api';
import axios from 'app/api/base';
import { objectToParams, updateNextDataURL } from 'app/utils/helpers';
import { debounce, keyBy } from 'lodash';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import FilterBox from './FilterBox';

const UseCaseFilter = ({ filterKey, setFilters, filters, lightTheme }) => {
  const { subscriptionId } = useParams();
  const [data, setData] = useState([]);
  const [lastCursorCall, setLastCursorCall] = useState(null);
  const [isSearched, setIsSearched] = useState(false);
  const [next, setNext] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useCaseDict, setUseCaseDict] = useState({});
  const [searchParams, setSearchParams] = useState('');
  const [search, setSearch] = useState('');
  const [value, setValue] = useState([]);

  const usecaseQuery = useSelector(({ filterQuries }) => filterQuries.usecase);

  const queryClient = useQueryClient();

  const { data: useCases, isLoading: isUseCaseLoading } = useQuery(
    [
      'useCase',
      10,
      null,
      subscriptionId,
      objectToParams(usecaseQuery),
      false,
      true,
      searchParams
    ],
    context => api.useCase(...context.queryKey)
  );

  const { data: filteredUseCases, isLoading: isFilteredUseCaseLoading } =
    useQuery(
      [
        'filteredUseCase',
        10,
        null,
        subscriptionId,
        '',
        false,
        (filters?.[filterKey] || []).join(',')
      ],
      context => api.useCaseByIds(...context.queryKey),
      { enabled: !!filters[filterKey] && filters[filterKey].length > 0 }
    );

  const { data: useCasesCount, isLoading: isUseCaseCountLoading } = useQuery(
    [
      'useCaseCount',
      10,
      0,
      subscriptionId,
      objectToParams(usecaseQuery),
      false,
      false,
      searchParams
    ],
    context => api.useCase(...context.queryKey)
  );

  useEffect(() => {
    const keys = keyBy(filteredUseCases?.results || [], 'id');
    if (
      Array.isArray(filters[filterKey]) &&
      (filteredUseCases?.results || []).length
    ) {
      setValue(filters[filterKey].map(x => keys[x]));
    } else if ((filteredUseCases?.results || []).length) {
      setValue([keys[filters[filterKey]]]);
    } else {
      setValue([]);
    }
  }, [filters, filteredUseCases]);

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
        queryClient.invalidateQueries('useCase');
        queryClient.invalidateQueries('useCaseCount');
      }
    }
  };

  useEffect(() => {
    if (useCases) {
      setData(useCases?.results || []);
      const dict = keyBy(useCases?.results || [], 'id');
      setLastCursorCall(null);
      setUseCaseDict(dict);
      setNext(updateNextDataURL(useCases?.next));
    }
  }, [useCases]);

  useEffect(() => {
    const filteredDict = keyBy(filteredUseCases?.results || [], 'id');
    const filteredKeys = Object.keys(filteredDict);
    const dataKey = Object.keys(keyBy(data, 'id'));
    if (data.length && !filteredKeys.every(item => dataKey.includes(item))) {
      setData([
        ...(filteredUseCases?.results || []),
        ...data.filter(item => !filteredKeys.includes(item.id.toString()))
      ]);
      const dict = keyBy(filteredUseCases?.results || [], 'id');
      setUseCaseDict({ ...useCaseDict, ...dict });
    }
  }, [filteredUseCases, data]);

  const loadFilesets = () => {
    const t = queryString.parse(next?.split('?')[1])?.cursor || null;
    if (next !== null && lastCursorCall !== t && !isLoading) {
      setIsLoading(true);
      return axios
        .get(next)
        .then(({ data: newUseCases }) => {
          const dict = keyBy(newUseCases?.results, 'id');
          const fileredKeys = Object.keys(useCaseDict);
          setUseCaseDict({ ...useCaseDict, ...dict });
          setData([
            ...data,
            ...(newUseCases?.results || []).filter(
              item => !fileredKeys.includes(item.id.toString())
            )
          ]);

          setLastCursorCall(t);
          setNext(updateNextDataURL(newUseCases?.next));
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
    return !!data[index];
  };

  return (
    <FilterBox
      lightTheme={lightTheme}
      data={data}
      isLoading={
        isUseCaseLoading || isUseCaseCountLoading || isFilteredUseCaseLoading
      }
      titleGetter='name'
      id={filterKey}
      onClose={handleApplyFilter}
      title='Use Case'
      loadFileSets={loadFilesets}
      isItemLoaded={isItemLoaded}
      itemcount={useCasesCount?.count || 0}
      handleSearch={handleSearch}
      search={search}
      isLoadingMoreData={isLoading}
      value={value}
      setValue={setValue}
    />
  );
};

export default UseCaseFilter;
