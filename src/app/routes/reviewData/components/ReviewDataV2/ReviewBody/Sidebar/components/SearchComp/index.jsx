import {
  faEye,
  faEyeSlash,
  faSortAmountDownAlt
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, Tooltip } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Label from 'app/components/Label';
import CommonButton from 'app/components/ReviewButton';
import Show from 'app/hoc/Show';
import WithCondition from 'app/hoc/WithCondition';
import React, { useState } from 'react';
import InferenceVisibilityActions from './InferenceVisibilityActions';

import classes from './SearchComp.module.scss';

const SearchCompContainer = ({
  searchable = true,
  data = [],
  onVisibilityChange,
  sortable = true,
  visibility = true,
  placeholder = 'Search',
  showInferenceButton = false,
  status = '',
  startInferenceClick,
  isLoading
}) => {
  const [allVisible] = useState(
    data.filter(x => x.visible === true).length > 0
  );
  const [search, setSearch] = useState('');

  const handleAllVisiblilityClick = () => {
    onVisibilityChange(
      data.map(x => {
        return { ...x, visible: !allVisible };
      })
    );
  };

  const handleVisibility = id => {
    onVisibilityChange(
      data.map(x => {
        return x.id === id ? { ...x, visible: !x.visible } : x;
      })
    );
  };
  const handleSearch = event => {
    setSearch(event.target.value);
  };

  return (
    <div className={classes.root} onKeyDown={e => e.stopPropagation()}>
      <Show when={searchable}>
        <TextField
          fullWidth
          className={classes.searchBar}
          onChange={handleSearch}
          placeholder={placeholder}
          variant='outlined'
          size='small'
          InputProps={{
            endAdornment: (
              <>
                <Show when={sortable}>
                  <CommonButton
                    variant='secondary'
                    size='small'
                    onClick={() => {}}
                    wrapperClass={classes.icon}
                    icon={<FontAwesomeIcon icon={faSortAmountDownAlt} />}
                  />
                </Show>
                <Show when={visibility}>
                  <CommonButton
                    variant='secondary'
                    size='small'
                    onClick={handleAllVisiblilityClick}
                    wrapperClass={classes.icon}
                    icon={
                      <WithCondition
                        when={allVisible}
                        then={<FontAwesomeIcon icon={faEye} />}
                        or={<FontAwesomeIcon icon={faEyeSlash} />}
                      />
                    }
                  />
                </Show>
              </>
            )
          }}
        />
      </Show>
      <div className={classes.listContainer}>
        {data
          .filter(x => x.name.toLowerCase().includes(search.toLowerCase()))
          .map(row => (
            <div className={classes.listItem} key={row.id}>
              <div className={classes.keyContainer}>
                <Show when={row.squareIcon}>
                  <div
                    style={{
                      backgroundColor: row.squareIcon,
                      width: '12px',
                      height: '12px',
                      marginRight: '5px'
                    }}
                  />
                </Show>

                <Show when={row.avatar}>
                  <Avatar
                    alt='avatar'
                    src={row.avatar}
                    className={classes.avatar}
                  />
                </Show>

                <WithCondition
                  when={row.name.length > 18}
                  then={
                    <Tooltip title={row.name}>
                      <Label
                        fontWeight={500}
                        label={`${row.name.slice(0, 15)}...`}
                      />
                    </Tooltip>
                  }
                  or={<Label fontWeight={500} label={row.name} />}
                />
              </div>

              <WithCondition
                when={isLoading}
                then={<CircularProgress size={30} />}
                or={
                  <InferenceVisibilityActions
                    status={status}
                    handleVisibility={handleVisibility}
                    row={row}
                    visibility={visibility}
                    showInferenceButton={showInferenceButton}
                    startInferenceClick={startInferenceClick}
                  />
                }
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchCompContainer;
