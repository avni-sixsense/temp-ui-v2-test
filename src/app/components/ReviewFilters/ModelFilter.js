import api from 'app/api';
import axios from 'app/api/base';
import { objectToParams, updateNextDataURL } from 'app/utils/helpers';
import { debounce, keyBy } from 'lodash';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import FilterBox from './FilterBox';

const ModelFilter = ({
  filterKey,
  gtModel = false,
  setFilters,
  filters,
  lightTheme,
  filterModels,
  clearFilter = false,
  handleClearFilter
}) => {
  const location = useLocation();
  const gtModelQuery = useSelector(({ filterQuries }) => filterQuries.gtModel);
  const modelQuery = useSelector(({ filterQuries }) => filterQuries.model);

  const queryClient = useQueryClient();

  const { subscriptionId } = useParams();
  const [modelsDict, setModelsDict] = useState({});
  const [searchParams, setSearchParams] = useState('');
  const [search, setSearch] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [lastCursorCall, setLastCursorCall] = useState(null);
  const [value, setValue] = useState([]);
  const [data, setData] = useState([]);
  const [next, setNext] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFilterParams = isGTModel => {
    if (isGTModel) {
      return objectToParams(gtModelQuery);
    }
    return objectToParams(modelQuery);
  };

  const { data: models, isLoading: isModelLoading } = useQuery(
    [
      'models',
      subscriptionId,
      filterModels,
      true,
      searchParams,
      getFilterParams(gtModel)
    ],
    context => api.getPaginatedMlModels(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  const {
    data: { results: filteredModels = [] } = [],
    isLoading: isFilteredModelLoading
  } = useQuery(
    [
      'filteredModels',
      subscriptionId,
      filterModels,
      (filters?.[filterKey] || []).join(',')
    ],
    context => api.getMlModels(...context.queryKey),
    { enabled: !!subscriptionId && filters[filterKey]?.length > 0 }
  );

  const { data: modelsCount, isLoading: isModecountlLoading } = useQuery(
    [
      'modelscount',
      subscriptionId,
      filterModels,
      false,
      searchParams,
      getFilterParams(gtModel)
    ],
    context => api.getPaginatedMlModels(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  useEffect(() => {
    const keys = keyBy(filteredModels || [], 'id');

    if (Array.isArray(filters[filterKey]) && (filteredModels || []).length) {
      setValue(filters[filterKey].map(x => keys[x]));
    } else if ((filteredModels || []).length) {
      setValue([keys[filters[filterKey]]]);
    } else {
      setValue([]);
    }
  }, [filters, filteredModels]);

  useEffect(() => {
    if (models) {
      setData(models?.results || []);
      const dict = keyBy(models?.results || [], 'id');
      setLastCursorCall(null);
      setModelsDict(dict);
      setNext(updateNextDataURL(models?.next));
    }
  }, [models]);

  useEffect(() => {
    const filteredDict = keyBy(filteredModels || [], 'id');
    const filteredKeys = Object.keys(filteredDict);
    const dataKey = Object.keys(keyBy(data, 'id'));
    if (data.length && !filteredKeys.every(item => dataKey.includes(item))) {
      setData([
        ...(filteredModels || []),
        ...data.filter(item => !filteredKeys.includes(item.id.toString()))
      ]);
      const dict = keyBy(filteredModels || [], 'id');
      setModelsDict({ ...modelsDict, ...dict });
    }
  }, [filteredModels, data]);

  const handleApplyFilter = () => {
    let ids = [];

    ids = value.map(v => v.id);
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
        queryClient.invalidateQueries('models');
        queryClient.invalidateQueries('modelsCount');
      }
    }
  };

  const loadFilesets = () => {
    const t = queryString.parse(next?.split('?')[1])?.cursor || null;
    if (next !== null && lastCursorCall !== t && !isLoading) {
      setIsLoading(true);
      return axios
        .get(next)
        .then(({ data: newModels }) => {
          const dict = keyBy(newModels?.results, 'id');
          setModelsDict({ ...modelsDict, ...dict });
          const fileredKeys = Object.keys(modelsDict);
          setData([
            ...data,
            ...(newModels?.results || []).filter(
              item => !fileredKeys.includes(item.id.toString())
            )
          ]);

          setLastCursorCall(t);
          setNext(updateNextDataURL(newModels?.next));
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
        isModecountlLoading || isModelLoading || isFilteredModelLoading
      }
      id={filterKey}
      onClose={handleApplyFilter}
      title={`${
        gtModel
          ? 'GT Model'
          : `${
              (location.pathname.includes('results') &&
                location.pathname.includes('data')) ||
              location.pathname.includes('review')
                ? 'Training Model'
                : 'Model'
            }`
      }`}
      loadFileSets={loadFilesets}
      isItemLoaded={isItemLoaded}
      itemcount={modelsCount?.count || 0}
      handleSearch={handleSearch}
      search={search}
      isLoadingMoreData={isLoading}
      value={value}
      setValue={setValue}
      clearFilter={clearFilter}
      onClearFilter={handleClearFilter}
    />
  );
};

export default ModelFilter;
