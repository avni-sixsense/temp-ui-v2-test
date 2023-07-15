import clsx from 'clsx';

import Show from 'app/hoc/Show';
import WithCondition from 'app/hoc/WithCondition';

import { isDateFilter } from 'app/utils/filters';

import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import classes from './FilterDropdown.module.scss';

export const FilterDropdown = ({
  id,
  handleClose,
  type,
  onChange,
  defaultOptions,
  defaultValue,
  anchorEl,
  optionsByIds,
  isMultiSelect,
  titleGetter,
  getList,
  theme,
  additionalOptions,
  filterDropdownDate: FilterDropdownDate,
  filterDropdownSelect: FilterDropdownSelect,
  ...props
}) => {
  return (
    <Show when={anchorEl}>
      <WithCondition
        when={isDateFilter(type)}
        then={
          <FilterDropdownDate
            id={id}
            anchorEl={anchorEl}
            handleClose={handleClose}
            onChange={onChange}
            defaultValue={defaultValue}
            theme={theme}
            {...props}
          />
        }
        or={
          <ClickAwayListener onClickAway={handleClose}>
            <Popper
              placement='bottom-start'
              open
              anchorEl={anchorEl}
              className={clsx(
                classes.popper,
                theme === 'dark' && classes.darkPopper
              )}
            >
              <FilterDropdownSelect
                id={id}
                optionsByIds={optionsByIds}
                defaultOptions={defaultOptions}
                onChange={onChange}
                isMultiSelect={isMultiSelect}
                titleGetter={titleGetter}
                getList={getList}
                theme={theme}
                additionalOptions={additionalOptions}
                {...props}
              />
            </Popper>
          </ClickAwayListener>
        }
      />
    </Show>
  );
};
