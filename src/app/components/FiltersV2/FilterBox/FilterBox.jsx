import { useCallback, useRef } from 'react';
import clsx from 'clsx';

import Show from 'app/hoc/Show';
import { FilterDropdown } from '../FilterDropdown';
import CommonButton from 'app/components/ReviewButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCircleXmark } from '@fortawesome/pro-solid-svg-icons';

import { FILTER_IDS } from 'app/constants/filters';
import {
  handleCloseSecondaryFilter,
  isCustomDateRange,
  isDateFilter
} from 'app/utils/filters';
import { DEFAULT_DATE_FORMAT } from 'app/utils/date';

import classes from './FilterBox.module.scss';

export const FilterBox = ({
  id,
  label,
  type,
  isDropdownOpen,
  isSecondaryFilter,
  setFilterList,
  defaultOptions,
  defaultValue,
  url_key,
  show,
  isMultiSelect,
  titleGetter,
  getList,
  theme,
  additionalOptions,
  optionsByIds,
  onClearFilterById,
  onFilterValueChange,
  filterLabel: FilterLabel,
  filterDate: FilterDropdownDate,
  filterSelect: FilterDropdownSelect,
  mode = 'edit',
  ...props
}) => {
  const ref = useRef(null);

  const isModeEdit = mode === 'edit';

  const handleClick = useCallback(() => {
    if (isModeEdit) {
      setFilterList(prev => {
        const idx = prev.findIndex(d => d.id === id);
        if (idx > -1) prev[idx].isDropdownOpen = true;
        return [...prev];
      });
    }
  }, []);

  const handleClose = useCallback(() => {
    setFilterList(prev => {
      const idx = prev.findIndex(d => d.id === id);
      if (idx > -1) prev[idx].isDropdownOpen = false;
      return [...prev];
    });
  }, []);

  const handleChange = useCallback((_, value, action, info) => {
    if (isDateFilter(type)) {
      const dateVal = isCustomDateRange(action)
        ? [
            _.format(DEFAULT_DATE_FORMAT),
            value.seconds(59).format(DEFAULT_DATE_FORMAT)
          ].join(',')
        : action;

      if (dateVal === defaultValue?.label) {
        onClearFilterById(id);
      } else {
        onFilterValueChange({ id, url_key, selectedOptions: dateVal });
      }
    } else if (action === 'clear') {
      onClearFilterById(id);
    } else {
      const { option } = info;

      if (id === FILTER_IDS.MORE) {
        if (action === 'remove-option') {
          setFilterList(prev => {
            const idx = prev.findIndex(d => d.id === option.id);
            if (idx > -1) prev[idx].show = false;
            return [...prev];
          });

          onClearFilterById(option.id);
        } else {
          setFilterList(prev => {
            const idx = prev.findIndex(d => d.id === option.id);

            if (idx > -1) {
              prev[idx].show = true;
              prev[idx].isDropdownOpen = true;

              prev[prev.length - 1].isDropdownOpen = false;
            }

            return [...prev];
          });
        }
      }

      onFilterValueChange({ id, url_key, selectedOptions: value });
    }
  }, []);

  return (
    <>
      <div
        ref={ref}
        className={clsx(
          show ? classes.filterBox : classes.hideFilterBox,
          theme === 'dark' && classes.darkFilterBox,
          !isModeEdit && classes.filterBoxViewMode
        )}
        onClick={handleClick}
      >
        <Show when={show}>
          <FilterLabel
            id={id}
            label={label}
            defaultLabel={defaultValue?.label}
            theme={theme}
            mode={mode}
            {...props}
          />

          {isModeEdit && (
            <FontAwesomeIcon icon={faChevronDown} className={classes.icon} />
          )}

          <Show when={isSecondaryFilter}>
            <CommonButton
              icon={<FontAwesomeIcon icon={faCircleXmark} />}
              size='xs'
              variant={theme === 'dark' ? 'secondary' : 'tertiary'}
              wrapperClass={classes.closeBtn}
              onClick={e => handleCloseSecondaryFilter(e, id, setFilterList)}
            />
          </Show>
        </Show>
      </div>

      <Show when={isDropdownOpen}>
        <FilterDropdown
          anchorEl={ref.current}
          id={id}
          handleClose={handleClose}
          type={type}
          onChange={handleChange}
          setFilterList={setFilterList}
          defaultOptions={defaultOptions}
          defaultValue={defaultValue}
          url_key={url_key}
          optionsByIds={optionsByIds}
          isMultiSelect={isMultiSelect}
          titleGetter={titleGetter}
          getList={getList}
          theme={theme}
          additionalOptions={additionalOptions}
          filterDropdownDate={FilterDropdownDate}
          filterDropdownSelect={FilterDropdownSelect}
          {...props}
        />
      </Show>
    </>
  );
};
