import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import { createStructuredSelector } from 'reselect';

import { debounce } from 'lodash';

import { setActiveImg, setSearchText } from 'store/reviewData/actions';
import { selectActiveImageMode } from 'store/reviewData/selector';

import TextField from '@material-ui/core/TextField';

import classes from './Search.module.scss';

const mapSearchState = createStructuredSelector({
  activeImageMode: selectActiveImageMode
});

const Search = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const searchRef = useRef('');

  const { activeImageMode } = useSelector(mapSearchState);

  const queryClient = useQueryClient();

  const handleSearch = useCallback(async event => {
    const { value } = event.target;
    setSearch(value);

    delayedQuery(value);
  }, []);

  const updateDebouncedValues = value => {
    dispatch(setSearchText(value));

    if (searchRef !== value) {
      queryClient.invalidateQueries('inferenceStatus');
      queryClient.invalidateQueries('fileSet');
      queryClient.invalidateQueries('autoModel');

      searchRef.current = value;
    }
  };

  const delayedQuery = useCallback(debounce(updateDebouncedValues, 1000), []);

  useEffect(() => {
    return () => {
      dispatch(setSearchText(''));
    };
  }, []);

  useEffect(() => {
    dispatch(setSearchText(''));
    setSearch('');
  }, [activeImageMode]);

  return (
    <TextField
      size='small'
      variant='outlined'
      className={classes.searchInput}
      onChange={handleSearch}
      onKeyDown={e => e.stopPropagation()}
      placeholder='Search'
      value={search}
    />
  );
};

export default Search;
