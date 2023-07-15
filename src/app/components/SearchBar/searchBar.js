import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import WithCondition from 'app/hoc/WithCondition';
// import ListboxComponent from './ListboxComponent'
import React, { useEffect, useState } from 'react';
import TruncateText from '../TruncateText';

// const info = {
// 	field: 'folder',
// 	name: 'Folder',
// }

const useStyles = makeStyles(theme => ({
  lightInputBase: {
    borderRadius: '8px',
    width: '100% !important',
    color: theme.colors.grey[21],
    '& input': {
      color: theme.colors.grey[21],
      '&::placeholder': {
        color: theme.colors.grey[10],
        opacity: 1
      },
      '&:-ms-input-placeholder': {
        color: theme.colors.grey[10]
      },
      '&::-ms-input-placeholder': {
        color: theme.colors.grey[10]
      }
    },
    '& .MuiAutocomplete-tag': {
      color: theme.colors.grey[19],
      fontSize: '0.8125rem'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '8px'
    },
    '& :hover': {
      '& [class*="MuiOutlinedInput-notchedOutline-"]': {
        borderColor: theme.colors.grey[5],
        borderWidth: '1px',
        boxShadow: '0px 0px 10px rgba(37, 99, 235, 0.1), 0px 0px 1px #BBD2F1'
      }
    },
    '& .Mui-focused': {
      '& [class*="MuiOutlinedInput-notchedOutline-"]': {
        borderColor: theme.colors.grey[5],
        borderWidth: '1px',
        boxShadow: '0px 0px 10px rgba(37, 99, 235, 0.1), 0px 0px 1px #BBD2F1'
      }
    },
    '& .Mui-disabled': { opacity: 0.5 }
  },
  lightPaper: {
    width: '400px',
    wordWrap: 'break-word',
    maxWidth: '400px',
    backgroundColor: theme.colors.grey[0],
    boxShadow: theme.colors.shadow.lg,
    color: theme.colors.grey[19],
    '& p': {
      color: theme.colors.grey[19],
      fontSize: '0.875rem !important'
    },
    '& li': {
      '& p': {
        msWordBreak: 'break-all',
        overflowX: 'auto'
      },
      '& div': {
        fontSize: '0.875rem',
        color: theme.colors.grey[19],
        backgroundColor: theme.colors.grey[0]
      },
      paddingLeft: 0
    },
    '& ul': {
      overflowY: 'scroll',
      maxHeight: '200px',
      '&::-webkit-scrollbar ': {
        width: 3
      },

      /* Track */
      '&::-webkit-scrollbar-track': {
        borderRadius: 10
      },

      /* Handle */
      '&::-webkit-scrollbar-thumb': {
        background: '#31456A',
        borderRadius: 10
      },

      /* Handle on hover */
      '&::-webkit-scrollbar-thumb:hover': {
        background: theme.colors.grey[4]
      }
    }
  },
  lightOption: {
    '&[aria-selected="true"]': {
      backgroundColor: 'transparent'
    },
    '&[data-focus="true"]': {
      backgroundColor: 'transparent'
    }
  },
  lightPopperDisablePortal: {
    position: 'relative',
    width: 'auto !important',
    // maxHeight: 184,
    overflowY: 'auto',
    backgroundColor: theme.colors.grey[0],
    color: theme.colors.grey[19],
    '&::-webkit-scrollbar ': {
      width: 3
    },

    /* Track */
    '&::-webkit-scrollbar-track': {
      borderRadius: 10
    },

    /* Handle */
    '&::-webkit-scrollbar-thumb': {
      background: theme.colors.grey[0],
      borderRadius: 10
    },

    /* Handle on hover */
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.colors.grey[4]
    }
  },
  lightMenuPaper: {
    backgroundColor: theme.colors.grey[0],
    padding: theme.spacing(1),
    border: `0.5px solid ${theme.colors.grey[4]}`
  },
  tags: {
    background: '#fff',
    width: 'fit-content !important',
    maxWidth: '100%',
    marginRight: 5
  }
}));

const tooltipStyles = makeStyles(theme => ({
  arrow: {
    color: theme.colors.grey[23]
  },
  tooltip: {
    backgroundColor: theme.colors.grey[23],
    fontSize: '0.75rem'
  }
}));

const FolderFilter = ({
  data = [],
  isLoading,
  value,
  setValue,
  multiple = true,
  variant,
  placeholder,
  fullWidth = false,
  disabled = false,
  tooltipTitle = false
}) => {
  const classes = useStyles();
  const tooltipClasses = tooltipStyles();

  const [inputValue, setInputValue] = useState('');

  const handleChange = value => {
    if (multiple) {
      setValue(value);
    } else {
      setValue(value.reverse()[0] || {});
    }
  };

  useEffect(() => {
    setInputValue('');
  }, [value]);

  const renderSearchBarComp = (
    <Autocomplete
      fullWidth={fullWidth}
      id='virtualize-demo'
      loading={isLoading}
      multiple
      disabled={disabled}
      classes={{
        paper: classes.lightPaper,
        option: classes.lightOption,
        popperDisablePortal: classes.lightPopperDisablePortal
      }}
      onChange={(e, newValue) => handleChange(newValue)}
      value={value}
      limitTags={3}
      // renderTags={() => {}}
      // ListboxComponent={ListboxComponent}
      getOptionLabel={option => option.name}
      options={data}
      inputValue={inputValue}
      onInputChange={(event, value, reason) => {
        if (reason !== 'reset') {
          setInputValue(value);
        }
      }}
      renderTags={value =>
        value.map(option => {
          return (
            <TruncateText
              classNames={{ root: classes.tags }}
              key={option.name}
              label={option.name}
            />
          );
        })
      }
      renderInput={params => {
        return (
          <TextField
            {...params}
            variant={variant || 'standard'}
            placeholder={
              !multiple && value.length > 0 ? '' : placeholder || 'Search'
            }
            size='small'
            className={classes.lightInputBase}
            InputProps={
              variant
                ? { ...params.InputProps }
                : {
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position='start'>
                          <SearchIcon />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    )
                  }
            }
          />
        );
      }}
      renderOption={(option, { selected }) => (
        <Box
          px={0.5}
          py={0}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          width='100%'
          style={{ color: '#3B82F6', fontSize: '0.875rem' }}
        >
          <Typography className={classes.label}>{`${option.name}`}</Typography>
          {selected && <FontAwesomeIcon icon={faCheck} />}
        </Box>
      )}
    />
  );

  return (
    <WithCondition
      when={tooltipTitle}
      then={
        <Tooltip
          classes={tooltipClasses}
          placement='right-end'
          arrow
          title={tooltipTitle}
        >
          {renderSearchBarComp}
        </Tooltip>
      }
      or={renderSearchBarComp}
    />
  );
};

export default FolderFilter;
