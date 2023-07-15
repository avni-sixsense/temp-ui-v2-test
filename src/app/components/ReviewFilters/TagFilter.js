import api from 'app/api';
import axios from 'app/api/base';
import {
  FilesetTag,
  UploadSessionTag,
  WaferMapTag
} from 'app/utils/filterConstants';
import { updateNextDataURL } from 'app/utils/helpers';
import { debounce, keyBy } from 'lodash';
import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';

import FilterBox from './FilterBox';

const info = {
  [UploadSessionTag]: 'Folder Tag',
  [FilesetTag]: 'Image Tag',
  [WaferMapTag]: 'Image Tag'
};

const apiCallData = {
  [UploadSessionTag]: api.getAllPaginatedUploadSessionsTags,
  [FilesetTag]: api.getAllPaginatedFilesetTags,
  [WaferMapTag]: api.getAllPaginatedWaferTags
};
const apiData = {
  [UploadSessionTag]: api.getAllUploadSessionsTags,
  [FilesetTag]: api.getAllFilesetTags,
  [WaferMapTag]: api.getAllWaferTags
};

const TagFilter = ({
  setFilters,
  filters = [],
  lightTheme,
  filterKey,
  variant
}) => {
  const [tagDict, setTagDict] = useState({});
  const [data, setData] = useState([]);
  const [lastCursorCall, setLastCursorCall] = useState(null);
  const [next, setNext] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState('');
  const [search, setSearch] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [value, setValue] = useState([]);

  const queryClient = useQueryClient();

  const { data: tags, isLoading: isTagsLoading } = useQuery(
    ['tags', true, searchParams],
    context => apiCallData[variant](...context.queryKey),
    { enabled: !!variant }
  );

  const { data: filteredTags, isLoading: isFilteredTagsLoading } = useQuery(
    ['filteredTags', (filters?.[filterKey] || []).join(',')],
    context => apiData[variant](...context.queryKey),
    { enabled: !!variant && filters[filterKey]?.length > 0 }
  );

  const { data: tagsCount, isLoading: isTagsLoadingCount } = useQuery(
    ['tagsCount', false, searchParams],
    context => apiCallData[variant](...context.queryKey),
    { enabled: !!variant }
  );

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries('tags');
      queryClient.invalidateQueries('filteredTags');
      queryClient.invalidateQueries('tagsCount');
    };
  }, []);

  useEffect(() => {
    const keys = keyBy(filteredTags?.results || [], 'id');
    if (
      Array.isArray(filters[filterKey]) &&
      (filteredTags?.results || []).length
    ) {
      setValue(filters[filterKey].map(x => keys[x]));
    } else if ((filteredTags?.results || []).length) {
      setValue([keys[filters[filterKey]]]);
    } else {
      setValue([]);
    }
  }, [filters, filteredTags]);

  useEffect(() => {
    setTotal(tagsCount?.count || 0);
  }, [tagsCount]);

  useEffect(() => {
    if (tags) {
      setData(tags?.results || []);
      const dict = keyBy(tags?.results || [], 'id');
      setLastCursorCall(null);
      setTagDict(dict);
      setNext(updateNextDataURL(tags?.next));
    }
  }, [tags]);

  useEffect(() => {
    const filteredDict = keyBy(filteredTags?.results || [], 'id');
    const filteredKeys = Object.keys(filteredDict);
    const dataKey = Object.keys(keyBy(data, 'id'));
    if (data.length && !filteredKeys.every(item => dataKey.includes(item))) {
      setData([
        ...(filteredTags?.results || []),
        ...data.filter(item => !filteredKeys.includes(item.id.toString()))
      ]);
      const dict = keyBy(filteredTags?.results || [], 'id');
      setTagDict({ ...tagDict, ...dict });
    }
  }, [filteredTags, data]);

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
        queryClient.invalidateQueries('tags');
        queryClient.invalidateQueries('tagsCount');
      }
    }
  };

  const handleApplyFilter = () => {
    let ids = [];

    ids = value.map(v => v.id);
    const temp = {};
    temp[filterKey] = ids;
    setFilters(prev => {
      return { ...prev, ...temp };
    });
  };

  const loadFilesets = () => {
    const t = queryString.parse(next?.split('?')[1])?.cursor || null;
    if (next !== null && lastCursorCall !== t && !isLoading) {
      setIsLoading(true);
      return axios
        .get(next)
        .then(({ data: newTags }) => {
          const dict = keyBy(newTags?.results, 'id');
          setTagDict({ ...tagDict, ...dict });
          const fileredKeys = Object.keys(tagDict);
          setData([
            ...data,
            ...(newTags?.results || []).filter(
              item => !fileredKeys.includes(item.id.toString())
            )
          ]);

          setLastCursorCall(t);
          setNext(updateNextDataURL(newTags?.next));
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
      isLoading={isTagsLoading || isTagsLoadingCount || isFilteredTagsLoading}
      id='virtualize-demo'
      onClose={handleApplyFilter}
      title={`${info[variant]}`}
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

export default TagFilter;
