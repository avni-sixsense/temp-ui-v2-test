import { Box, Typography } from '@material-ui/core';
import api from 'app/api';
import axios from 'app/api/base';
import { objectToParams, updateNextDataURL } from 'app/utils/helpers';
import { debounce, keyBy } from 'lodash';
import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import FilterBox from './FilterBox';

const AIoutputFilter = ({ filterKey, setFilters, filters, lightTheme }) => {
  const [defectDict, setDefectDict] = useState({});
  const { useAIAssistance } = useSelector(({ review }) => review);

  const queryClient = useQueryClient();

  const { subscriptionId } = useParams();
  const [lastCursorCall, setLastCursorCall] = useState(null);
  const aiOutputQuery = useSelector(
    ({ filterQuries }) => filterQuries.aiOutput
  );

  const [data, setData] = useState([]);
  const [next, setNext] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState('');
  const [search, setSearch] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [value, setValue] = useState([]);

  const { data: defects, isLoading: isDefectLoading } = useQuery(
    [
      'defects',
      subscriptionId,
      true,
      searchParams,
      objectToParams(aiOutputQuery)
    ],
    context => api.getDefects(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  const { data: filteredDefects, isLoading: isFilterDefectLoading } = useQuery(
    ['filteredDefects', subscriptionId, (filters?.[filterKey] || []).join(',')],
    context => api.getDefectsByIds(...context.queryKey),
    {
      enabled: !!(
        subscriptionId &&
        filters[filterKey] &&
        filters[filterKey].length > 0
      )
    }
  );

  const { data: defectsCount, isLoading: isDefectCountLoading } = useQuery(
    [
      'defectsCount',
      subscriptionId,
      false,
      searchParams,
      objectToParams(aiOutputQuery)
    ],
    context => api.getDefects(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  useEffect(() => {
    const keys = keyBy(
      (filteredDefects?.results || []).map(item => {
        return {
          ...item,
          name: `${item?.organization_defect_code || ''}-${item?.name || ''}`
        };
      }),
      'id'
    );
    if (
      Array.isArray(filters[filterKey]) &&
      (filteredDefects?.results || []).length
    ) {
      setValue(filters[filterKey].map(x => keys[x]));
    } else if ((filteredDefects?.results || []).length) {
      setValue([keys[filters[filterKey]]]);
    } else {
      setValue([]);
    }
  }, [filters, filteredDefects]);

  const handleApplyFilter = () => {
    let ids = [];

    ids = value.map(v => v.id);
    const temp = {};
    temp[filterKey] = ids;
    setFilters(prev => {
      return { ...prev, ...temp };
    });
  };
  useEffect(() => {
    const filteredDict = keyBy(filteredDefects?.results || [], 'id');
    const filteredKeys = Object.keys(filteredDict);
    const dataKey = Object.keys(keyBy(data, 'id'));
    if (data.length && !filteredKeys.every(item => dataKey.includes(item))) {
      setData([
        ...(filteredDefects?.results || []).map(item => {
          return {
            ...item,
            name: `${item?.organization_defect_code || ''}-${item?.name || ''}`
          };
        }),
        ...data
          .filter(item => !filteredKeys.includes(item.id.toString()))
          .map(item => {
            return {
              ...item,
              name: `${item?.organization_defect_code || ''}-${
                item?.name || ''
              }`
            };
          })
      ]);
      const dict = keyBy(filteredDefects?.results || [], 'id');
      setDefectDict({ ...defectDict, ...dict });
    }
  }, [filteredDefects, data]);

  useEffect(() => {
    if (defects) {
      const dict = keyBy(defects?.results || [], 'id');
      setData(
        (defects?.results || []).map(item => {
          return {
            ...item,
            name: `${item?.organization_defect_code || ''}-${item?.name || ''}`
          };
        })
      );
      setNext(updateNextDataURL(defects?.next));
      setLastCursorCall(null);
      setDefectDict(dict);
    }
  }, [defects]);

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
        queryClient.invalidateQueries('defects');
        queryClient.invalidateQueries('defectsCount');
      }
    }
  };

  const loadFilesets = () => {
    const t = queryString.parse(next?.split('?')[1])?.cursor || null;
    if (next !== null && lastCursorCall !== t && !isLoading) {
      setIsLoading(true);
      return axios
        .get(next)
        .then(({ data: newDefects }) => {
          const dict = keyBy(newDefects?.results, 'id');
          setDefectDict({ ...defectDict, ...dict });
          const fileredKeys = Object.keys(defectDict);
          setData([
            ...data,
            ...(newDefects?.results || [])
              .filter(item => !fileredKeys.includes(item.id.toString()))
              .map(item => {
                return {
                  ...item,
                  name: `${item?.organization_defect_code || ''}-${
                    item?.name || ''
                  }`
                };
              })
          ]);

          setLastCursorCall(t);
          setNext(updateNextDataURL(newDefects?.next));
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
  const TextComponent = ({ classes }) => {
    return (
      <Box className={classes.AIoutputFilter}>
        <Typography>
          {' '}
          AI output is be based on model selected for AI assistance{' '}
        </Typography>
      </Box>
    );
  };

  return (
    <FilterBox
      lightTheme={lightTheme}
      data={data}
      isLoading={
        isDefectLoading || isDefectCountLoading || isFilterDefectLoading
      }
      id={filterKey}
      onClose={handleApplyFilter}
      title='AI Output'
      loadFileSets={loadFilesets}
      isItemLoaded={isItemLoaded}
      itemcount={defectsCount?.count || 0}
      handleSearch={handleSearch}
      search={search}
      isLoadingMoreData={isLoading}
      value={value}
      setValue={setValue}
      TextComponent={TextComponent}
      disabled={!useAIAssistance}
      disabledText='Enable AI Assistance in right panel and select model to use this filter.'
    />
  );
};

export default AIoutputFilter;
