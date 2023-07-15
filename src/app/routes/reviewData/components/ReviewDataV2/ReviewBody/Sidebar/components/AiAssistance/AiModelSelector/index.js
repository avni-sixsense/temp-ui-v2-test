import api from 'app/api';
// import Label from 'app/components/Label';
// import CommonButton from 'app/components/ReviewButton';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import {
  selectActiveFileSet,
  selectActiveModel
} from 'store/reviewData/selector';

import InputChipSelect from './ModelSelector';

const mapReviewState = createStructuredSelector({
  fileSet: selectActiveFileSet,
  activeModel: selectActiveModel
});

const AiModelSelectorContainer = ({ onSubmit }) => {
  const { subscriptionId } = useParams();
  const [searchParams, setSearchParams] = useState('');
  const [search, setSearch] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [inputChipValue, setInputChipValue] = useState([]);
  const { fileSet, activeModel } = useSelector(mapReviewState);

  useEffect(() => {
    setInputChipValue(activeModel ? [activeModel] : []);
  }, [activeModel]);

  const { data: models } = useQuery(
    [
      'aiModelSelector',
      subscriptionId,
      false,
      true,
      searchParams,
      `&use_case_id__in=${fileSet.use_case}`
    ],
    context => api.getPaginatedMlModels(...context.queryKey),
    { enabled: !!Object.keys(fileSet).length }
  );

  const { data: modelCountData } = useQuery(
    [
      'aiModelSelector',
      subscriptionId,
      false,
      false,
      searchParams,
      `&use_case_id__in=${fileSet.use_case}`
    ],
    context => api.getPaginatedMlModels(...context.queryKey),
    { enabled: !!Object.keys(fileSet).length }
  );

  const handleInputChipChange = value => {
    if (Array.isArray(value)) {
      setInputChipValue(value);
      onSubmit(value);
    } else {
      setInputChipValue(Object.keys(value).length ? [value] : []);
      onSubmit(Object.keys(value).length ? [value] : []);
    }
  };

  const debounceSearch = () => {
    setSearchParams(search);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // queryClient.invalidateQueries('distinctUploadSessions')
        // queryClient.invalidateQueries('distinctUploadSessionsCount')
      }
    }
  };

  return (
    <>
      {/* <Label label='Select Model' fontWeight={600} className={classes.title} /> */}
      <InputChipSelect
        data={models?.results || []}
        value={inputChipValue}
        onChange={handleInputChipChange}
        itemcount={modelCountData?.count || 0}
        handleSearch={handleSearch}
        search={search}
        nextUrl={models?.next || ''}
        placeholder='Select Model'
      />
    </>
  );
};

export default AiModelSelectorContainer;
