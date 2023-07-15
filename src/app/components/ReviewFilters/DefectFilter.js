import api from 'app/api';
import axios from 'app/api/base';
import { FilterKey } from 'app/utils/filterConstants';
import { objectToParams, updateNextDataURL } from 'app/utils/helpers';
import { debounce, keyBy } from 'lodash';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import FilterBox from './FilterBox';

const gtDefectsData = [
  { id: 'no_gt', name: 'No Label' },
  { id: 'NVD', name: 'No Defects' }
];

const getDefectObj = (keys, value) => {
  if (value === 'no_gt') {
    return { id: 'no_gt', name: 'No Label' };
  }

  if (value === 'NVD') {
    return { id: 'NVD', name: 'No Defects' };
  }

  return keys[value];
};

const checkIfRegularDefect = name => name !== 'no_gt' && name !== 'NVD';

const DefectFilter = ({
  filterKey,
  groundTruth,
  setFilters,
  filters,
  lightTheme
}) => {
  const location = useLocation();
  const [defectDict, setDefectDict] = useState({});

  const queryClient = useQueryClient();

  const { subscriptionId } = useParams();

  const [lastCursorCall, setLastCursorCall] = useState(null);
  const defectQuery = useSelector(({ filterQuries }) => filterQuries.defect);
  const groundTruthQuery = useSelector(
    ({ filterQuries }) => filterQuries.groundTruth
  );

  const [data, setData] = useState([]);
  const [next, setNext] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState('');
  const [search, setSearch] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [value, setValue] = useState([]);

  const getFilterParams = isGroundTruth => {
    if (isGroundTruth) {
      return objectToParams(groundTruthQuery);
    }
    return objectToParams(defectQuery);
  };

  const { data: defects, isLoading: isDefectLoading } = useQuery(
    [
      'defects',
      subscriptionId,
      true,
      searchParams,
      getFilterParams(groundTruth)
    ],
    context => api.getDefects(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  const { data: filteredDefects, isLoading: isFilterDefectLoading } = useQuery(
    [
      'filteredDefects',
      subscriptionId,
      (filters?.[filterKey] || [])
        .filter(x => checkIfRegularDefect(x))
        .join(',')
    ],
    context => api.getDefectsByIds(...context.queryKey),
    {
      enabled: !!(
        subscriptionId &&
        filters[filterKey] &&
        filters[filterKey].length > 0 &&
        filters[filterKey].filter(x => checkIfRegularDefect(x)).length > 0
      )
    }
  );

  const { data: defectsCount, isLoading: isDefectCountLoading } = useQuery(
    [
      'defectsCount',
      subscriptionId,
      false,
      searchParams,
      getFilterParams(groundTruth)
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
      (Array.isArray(filters[filterKey]) &&
        (filteredDefects?.results || []).length) ||
      (((filters[filterKey] || []).includes('NVD') ||
        (filters[filterKey] || []).includes('no_gt')) &&
        !isFilterDefectLoading)
    ) {
      setValue(filters[filterKey].map(x => getDefectObj(keys, x)));
    } else if ((filteredDefects?.results || []).length) {
      setValue([getDefectObj(keys, filters[filterKey])]);
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
    const filterSession = JSON.parse(sessionStorage.getItem(FilterKey) || {});
    const screenKey = queryString.parse(location.search)?.screen_key || '';
    const screenFilter = filterSession?.[screenKey] || {};
    if (defects) {
      if (
        filterKey === 'ground_truth_label__in' &&
        screenFilter.key === 'review'
      ) {
        const dict = keyBy(
          [...gtDefectsData, ...(defects?.results || [])],
          'id'
        );
        setDefectDict({ ...defectDict, ...dict });

        setData([
          ...gtDefectsData,
          ...(defects?.results || []).map(item => {
            return {
              ...item,
              name: `${item?.organization_defect_code || ''}-${
                item?.name || ''
              }`
            };
          })
        ]);
      } else {
        const dict = keyBy(defects?.results || [], 'id');
        setData(
          (defects?.results || []).map(item => {
            return {
              ...item,
              name: `${item?.organization_defect_code || ''}-${
                item?.name || ''
              }`
            };
          })
        );

        setLastCursorCall(null);
        setDefectDict(dict);
      }

      setNext(updateNextDataURL(defects?.next));
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

  const total = (defectsCount?.count ?? 0) + gtDefectsData.length;

  return (
    <FilterBox
      lightTheme={lightTheme}
      data={data}
      isLoading={
        isDefectLoading || isDefectCountLoading || isFilterDefectLoading
      }
      id={filterKey}
      onClose={handleApplyFilter}
      title={`${groundTruth ? 'Label' : 'Defects'}`}
      loadFileSets={loadFilesets}
      isItemLoaded={isItemLoaded}
      itemcount={total}
      handleSearch={handleSearch}
      search={search}
      isLoadingMoreData={isLoading}
      value={value}
      setValue={setValue}
    />
  );
};

export default DefectFilter;
