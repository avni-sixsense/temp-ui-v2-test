import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';

import axios from 'app/api/base';
import { updateNextDataURL } from 'app/utils/helpers';
import { debounce } from 'app/utils';

import WithCondition from 'app/hoc/WithCondition';
import Show from 'app/hoc/Show';

import ListboxComponent from 'app/components/ReviewFilters/ListboxComponent';
import TruncateText from 'app/components/TruncateText';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { getAllowedKeysFromParams } from 'app/utils/filters';

import classes from './FilterDropdownSelect.module.scss';

const getOptionLabel = (option, fn) => {
  return fn?.(option) ?? option.name;
};

export const FilterDropdownSelect = ({
  id,
  defaultOptions,
  onChange,
  optionsByIds,
  isMultiSelect,
  titleGetter,
  getList,
  theme,
  additionalOptions,
  value
}) => {
  const [options, setOptions] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const nextCursorRef = useRef(null);
  const lastCursorRef = useRef(null);

  const { subscriptionId } = useParams();

  useEffect(() => {
    if (defaultOptions) {
      setIsLoading(false);
      setItemCount(defaultOptions.length);
      setOptions(defaultOptions);
    }
  }, [defaultOptions]);

  const getFilterList = async () => {
    if (!defaultOptions) {
      let { count } = await getList({
        limit: 10,
        offset: 0,
        params: getAllowedKeysFromParams(window.location.search, id),
        subscriptionId,
        search: inputValue
      });

      let { next, results } = await getList({
        limit: 10,
        params: getAllowedKeysFromParams(window.location.search, id),
        subscriptionId,
        cursor: true,
        search: inputValue
      });

      lastCursorRef.current = null;
      nextCursorRef.current = updateNextDataURL(next);

      for (const { id } of optionsByIds) {
        results = results.filter(d => d.id !== id);
      }

      if (additionalOptions) {
        results.unshift(...additionalOptions);
        count += additionalOptions.length;
      }

      setItemCount(count);
      setIsLoading(false);
      setOptions([...optionsByIds, ...results]);
    }
  };

  const debouncedGetFilterList = useCallback(debounce(getFilterList, 300), [
    inputValue,
    defaultOptions
  ]);

  // useEffect(() => {
  //   if (!options.length) getFilterList();
  // }, [defaultOptions, optionsByIds]);

  useEffect(() => {
    if (!defaultOptions) {
      setIsLoading(true);
      debouncedGetFilterList();
    }

    return debouncedGetFilterList.cancel;
  }, [inputValue]);

  const loadFileSets = () => {
    if (nextCursorRef.current) {
      const params = new URLSearchParams(nextCursorRef.current.split('?')[1]);
      const cursor = params.get('cursor');

      if (lastCursorRef.current !== cursor && !isLoading) {
        setIsLoading(true);

        return axios
          .get(nextCursorRef.current)
          .then(res => {
            let { results, next } = res.data;

            for (const { id } of optionsByIds) {
              results = results.filter(d => d.id !== id);
            }

            lastCursorRef.current = cursor;
            nextCursorRef.current = updateNextDataURL(next);
            setOptions(d => [...d, ...results]);
          })
          .catch(() => {})
          .finally(() => {
            setIsLoading(false);
          });
      }

      return new Promise((resolve, reject) => {
        return resolve();
      });
    }
  };

  const onInputChange = (_, value, reason) => {
    if (reason === 'input') {
      setInputValue(value);
    }
  };

  const isItemLoaded = index => {
    return !!options[index];
  };

  return (
    <Autocomplete
      id={`${id}-dropdown`}
      size='small'
      open
      multiple={isMultiSelect}
      disablePortal
      fullWidth
      options={options}
      loading={isLoading}
      value={value}
      onChange={(...params) => {
        onChange(...params);
        setInputValue('');
      }}
      inputValue={inputValue}
      onInputChange={onInputChange}
      ListboxComponent={ListboxComponent}
      ListboxProps={{
        loadFileSets,
        total: itemCount,
        isItemLoaded,
        isLoading,
        styles: {
          loading: clsx(
            classes.loading,
            theme === 'dark' && classes.darkLoading
          )
        }
      }}
      getOptionLabel={option => getOptionLabel(option, titleGetter)}
      getOptionSelected={(option, value) => option.id === value.id}
      classes={{
        popperDisablePortal: classes.popperDisablePortal,
        paper: clsx(classes.paper, theme === 'dark' && classes.darkPaper),
        listbox: classes.listbox,
        option: clsx(classes.option, theme === 'dark' && classes.darkOption),
        loading: clsx(classes.loading, theme === 'dark' && classes.darkLoading),
        tag: clsx(classes.tag, theme === 'dark' && classes.darkTag),
        input: clsx(theme === 'dark' && classes.darkInputRoot),
        endAdornment: clsx(
          classes.endAdornment,
          theme === 'dark' && classes.darkThemeInputIcons
        )
      }}
      renderInput={params => {
        return (
          <TextField
            {...params}
            variant='outlined'
            placeholder='Search'
            size='small'
            className={clsx(
              classes.input,
              theme === 'dark' && classes.darkInput
            )}
            onKeyDown={e => e.stopPropagation()}
          />
        );
      }}
      renderOption={(option, { selected }) => {
        return (
          <>
            <WithCondition
              when={option.ignoreTruncate}
              then={
                <Typography>{getOptionLabel(option, titleGetter)}</Typography>
              }
              or={
                <TruncateText
                  key={selected + getOptionLabel(option, titleGetter)}
                  label={getOptionLabel(option, titleGetter)}
                />
              }
            />

            <Show when={selected}>
              <FontAwesomeIcon icon={faCheck} />
            </Show>
          </>
        );
      }}
    />
  );
};
