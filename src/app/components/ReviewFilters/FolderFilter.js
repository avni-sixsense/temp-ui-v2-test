import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip, Typography } from '@material-ui/core';
import api from 'app/api';
import axios from 'app/api/base';
import { objectToParams, updateNextDataURL } from 'app/utils/helpers';
import dayjs from 'dayjs';
import { debounce, keyBy } from 'lodash';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import FilterBox from './FilterBox';

const info = {
  field: 'folder',
  name: 'Folder'
};

const FolderFilter = ({ setFilters, filterKey, filters = [], lightTheme }) => {
  const { subscriptionId } = useParams();

  const queryClient = useQueryClient();

  const [folderDict, setFolderDict] = useState({});
  const { date__gte: dateGTE = null, date__lte: dateLTE = null } = filters;

  const [lastCursorCall, setLastCursorCall] = useState(null);
  const folderQuery = useSelector(({ filterQuries }) => filterQuries.folder);

  const [data, setData] = useState([]);
  const [next, setNext] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState('');
  const [search, setSearch] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [value, setValue] = useState([]);

  const { data: foldersData, isLoading: isFolderLoading } = useQuery(
    [
      'distinctUploadSessions',
      10,
      null,
      `&date__gte=${dayjs(dateGTE).format(
        'YYYY-MM-DD-HH-mm-ss'
      )}&date__lte=${dayjs(dateLTE).format(
        'YYYY-MM-DD-HH-mm-ss'
      )}${objectToParams(folderQuery)}`,
      subscriptionId,
      true,
      searchParams
    ],
    context => api.getUploadSessionsFilters(...context.queryKey),
    { enabled: !!(subscriptionId && dateGTE && dateLTE) }
  );

  const { data: filteredFoldersData, isLoading: isFilteredFolderLoading } =
    useQuery(
      [
        'FilteredUploadSessions',
        subscriptionId,
        (filters?.[filterKey] || []).join(',')
      ],
      context => api.getUploadSessionsByIds(...context.queryKey),
      { enabled: !!subscriptionId && filters[filterKey]?.length > 0 }
    );

  const { data: foldersDataCount, isLoading: isFolderCountLoading } = useQuery(
    [
      'distinctUploadSessionsCount',
      10,
      0,
      `&date__gte=${dayjs(dateGTE).format(
        'YYYY-MM-DD-HH-mm-ss'
      )}&date__lte=${dayjs(dateLTE).format(
        'YYYY-MM-DD-HH-mm-ss'
      )}${objectToParams(folderQuery)}`,
      subscriptionId,
      false,
      searchParams
    ],
    context => api.getUploadSessionsFilters(...context.queryKey),
    { enabled: !!(subscriptionId && dateGTE && dateLTE) }
  );

  useEffect(() => {
    const keys = keyBy(filteredFoldersData?.results || [], 'id');
    if (
      Array.isArray(filters[filterKey]) &&
      (filteredFoldersData?.results || []).length
    ) {
      setValue(filters[filterKey].map(x => keys[x]));
    } else if ((filteredFoldersData?.results || []).length) {
      setValue([keys[filters[filterKey]]]);
    } else {
      setValue([]);
    }
  }, [filters, filteredFoldersData]);

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
    if (foldersData) {
      setData(foldersData?.results || []);
      const dict = keyBy(foldersData?.results || [], 'id');
      setLastCursorCall(null);
      setFolderDict(dict);
      setNext(updateNextDataURL(foldersData?.next));
    }
  }, [foldersData]);

  useEffect(() => {
    const filteredDict = keyBy(filteredFoldersData?.results || [], 'id');
    const filteredKeys = Object.keys(filteredDict);
    const dataKey = Object.keys(keyBy(data, 'id'));
    if (data.length && !filteredKeys.every(item => dataKey.includes(item))) {
      setData([
        ...(filteredFoldersData?.results || []),
        ...data.filter(item => !filteredKeys.includes(item.id.toString()))
      ]);
      const dict = keyBy(filteredFoldersData?.results || [], 'id');
      setFolderDict({ ...folderDict, ...dict });
    }
  }, [filteredFoldersData, data]);

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
        queryClient.invalidateQueries('distinctUploadSessions');
        queryClient.invalidateQueries('distinctUploadSessionsCount');
      }
    }
  };

  const loadFilesets = () => {
    const t = queryString.parse(next?.split('?')[1])?.cursor || null;
    if (next !== null && lastCursorCall !== t && !isLoading) {
      setIsLoading(true);
      return axios
        .get(next)
        .then(({ data: newFolders }) => {
          const dict = keyBy(newFolders?.results, 'id');
          const fileredKeys = Object.keys(folderDict);
          setFolderDict({ ...folderDict, ...dict });
          setData([
            ...data,
            ...(newFolders?.results || []).filter(
              item => !fileredKeys.includes(item.id.toString())
            )
          ]);

          setLastCursorCall(t);
          setNext(updateNextDataURL(newFolders?.next));

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

  const OptionComponent = ({ option, selected, classes }) => {
    return (
      <Box
        px={0.5}
        py={0}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        width='100%'
        style={{ color: '#3B82F6', fontSize: '0.875rem' }}
      >
        <Tooltip title={option.name}>
          <Typography className={classes.label}>
            {(option.name || '').length > 35
              ? `${option.name.slice(0, 13)}...${option.name.slice(
                  option.name.length - 13
                )} (${option.file_sets})`
              : `${option.name} (${option.file_sets})`}
          </Typography>
        </Tooltip>
        {selected && <FontAwesomeIcon icon={faCheck} />}
      </Box>
    );
  };

  return (
    <FilterBox
      lightTheme={lightTheme}
      data={data}
      isLoading={
        isFolderLoading || isFolderCountLoading || isFilteredFolderLoading
      }
      id='virtualize-demo'
      onClose={handleApplyFilter}
      title={`${info.name}`}
      OptionComponent={OptionComponent}
      loadFileSets={loadFilesets}
      isItemLoaded={isItemLoaded}
      itemcount={foldersDataCount?.count || 0}
      handleSearch={handleSearch}
      search={search}
      isLoadingMoreData={isLoading}
      value={value}
      setValue={setValue}
    />
  );
};

export default FolderFilter;
