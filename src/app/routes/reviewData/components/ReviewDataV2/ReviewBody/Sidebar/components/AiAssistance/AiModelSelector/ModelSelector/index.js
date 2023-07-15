import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ReviewTags from 'app/components/ReviewTags';
import { updateNextDataURL } from 'app/utils/helpers';
import axios from 'app/api/base';
import clsx from 'clsx';
import { keyBy } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

import ListboxComponent from '../../ListboxComponent';

const useStyle = makeStyles(theme => ({
  paper: {
    boxShadow: 'none',
    backgroundColor: theme.colors.grey[15],
    color: theme.colors.grey[0],
    '& p': {
      color: theme.colors.grey[0],
      fontSize: '0.875rem !important'
    },
    '& li div': {
      fontSize: '0.875rem',
      color: theme.colors.grey[0],
      backgroundColor: theme.colors.grey[15]
    },
    '& ul': {
      // overflowY: 'scroll',
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
        background: '#EEEEEE'
      }
    }
    // maxHeight: 190,
    // overflowY: 'scroll',
  },
  lightPaper: {
    boxShadow: 'none',
    backgroundColor: theme.colors.grey[0],
    border: `1px solid ${theme.colors.grey[6]}`,
    color: theme.colors.grey[17],
    '& p': {
      color: theme.colors.grey[17],
      fontSize: '0.875rem !important'
    },
    '& li div': {
      fontSize: '0.875rem',
      color: theme.colors.grey[17],
      backgroundColor: theme.colors.grey[0]
    },
    '& ul': {
      // overflowY: 'scroll',
      '&::-webkit-scrollbar ': {
        width: 3
      },

      /* Track */
      '&::-webkit-scrollbar-track': {
        borderRadius: 10
      },

      /* Handle */
      '&::-webkit-scrollbar-thumb': {
        background: theme.colors.grey[4],
        borderRadius: 10
      },

      /* Handle on hover */
      '&::-webkit-scrollbar-thumb:hover': {
        background: theme.colors.grey[5]
      }
    }
    // maxHeight: 190,
    // overflowY: 'scroll',
  },
  option: {
    '&[aria-selected="true"]': {
      backgroundColor: theme.colors.grey[17]
    },
    '&[data-focus="true"]': {
      backgroundColor: theme.colors.grey[16]
    },
    '& div': {
      backgroundColor: 'transparent !important'
    }
  },
  lightoption: {
    boxShadow: theme.colors.shadow.sm,
    borderRadius: `1px solid ${theme.colors.grey[4]}`,
    '&[aria-selected="true"]': {
      backgroundColor: theme.colors.grey[3]
    },
    '&[data-focus="true"]': {
      backgroundColor: theme.colors.grey[2]
    },
    '& div': {
      backgroundColor: 'transparent !important'
    }
  },
  popperDisablePortal: {
    position: 'relative',
    width: 'auto !important',
    maxHeight: 184,
    overflowY: 'auto',
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
      background: '#EEEEEE'
    }
  },
  inputContainer: {
    position: 'relative'
  },
  inputBase: {
    borderRadius: '8px',
    minWidth: props =>
      props.width ? `${props.width} !important` : '200px !important',
    backgroundColor: theme.colors.grey[19],
    color: theme.colors.grey[0],
    '& [class*="MuiAutocomplete-tag-"]': {
      color: theme.colors.grey[3]
    },
    '& > div': {
      height: '100%',
      lineHeight: 'inherit',

      '& > :nth-child(3)': {
        display: 'none'
      }
    },
    '& input': {
      color: theme.colors.grey[0],
      '&::placeholder': {
        color: theme.colors.grey[3],
        opacity: 1
      },
      '&:-ms-input-placeholder': {
        color: theme.colors.grey[3]
      },
      '&::-ms-input-placeholder': {
        color: theme.colors.grey[3]
      }
    },
    '& .MuiAutocomplete-tag': {
      backgroundColor: '#7C3AED',
      color: theme.colors.grey[0],
      fontSize: '0.8125rem'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '8px'
    }
  },
  secondaryColor: {
    backgroundColor: theme.colors.green[600]
  },
  lightInputBase: {
    borderRadius: '8px',
    minWidth: props =>
      props.width ? `${props.width} !important` : '200px !important',
    backgroundColor: theme.colors.grey[0],
    color: theme.colors.grey[18],
    '& [class*="MuiAutocomplete-tag-"]': {
      color: theme.colors.grey[4]
    },
    '& > div': {
      height: '100%',
      lineHeight: 'inherit',

      '& > :nth-child(3)': {
        display: 'none'
      }
    },
    '& input': {
      color: theme.colors.grey[18],
      '&::placeholder': {
        color: theme.colors.grey[7],
        opacity: 1
      },
      '&:-ms-input-placeholder': {
        color: theme.colors.grey[7]
      },
      '&::-ms-input-placeholder': {
        color: theme.colors.grey[7]
      }
    },
    '& .MuiAutocomplete-tag': {
      backgroundColor: '#7C3AED',
      color: theme.colors.grey[0],
      fontSize: '0.8125rem'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '8px'
    }
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 400,
    color: '#313131'
  },
  optionContainer: { color: theme.colors.blue[500], fontSize: '0.875rem' }
}));

const AiModelSelector = ({
  data = [],
  onChange,
  value = [],
  disabled,
  multiSelect = false,
  placeholder = '',
  lightTheme = false,
  secondaryColor = false,
  itemcount,
  nextUrl = null,
  search,
  handleSearch,
  creatable,
  creatableFunc = new Promise(resolve => {
    resolve();
  }),
  isinitialDataLoading = false
}) => {
  const classes = useStyle();

  const ref = useRef();
  const lastCursorCallRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [next, setNext] = useState(null);
  const [options, setOptions] = useState([]);

  const onInputChange = val => {
    handleSearch(val);
  };

  useEffect(() => {
    const valueKeys = Object.keys(keyBy(value, 'id'));
    setOptions(data.filter(item => !valueKeys.includes(item.id.toString())));
  }, [data, value]);

  useEffect(() => {
    setNext(updateNextDataURL(nextUrl) || null);
  }, [nextUrl]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    if (!disabled && !open) {
      ref.current.focus();
      setOpen(true);
    }
  };

  const handleChangedValue = value => {
    if (!value.length) return;
    if (multiSelect) {
      onChange(value);
    } else {
      onChange(value.reverse()[0] || {});
    }
    onInputChange('');
  };

  const loadFileSets = useCallback(() => {
    if (next !== null && lastCursorCallRef.current !== next && !isLoading) {
      setIsLoading(true);

      return axios
        .get(next)
        .then(({ data: newModels }) => {
          const valueKeys = Object.keys(keyBy(value, 'id'));

          setOptions([
            ...options,
            ...(newModels?.results || []).filter(
              item => !valueKeys.includes(item.id.toString())
            )
          ]);

          lastCursorCallRef.current = next;
          setNext(updateNextDataURL(newModels?.next) || null);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }

    return new Promise((resolve, reject) => {
      return resolve();
    });
  }, [isLoading, next, options, value]);

  const isItemLoaded = index => {
    return !!options[index];
  };

  return (
    <Autocomplete
      disabled={disabled}
      open={open}
      onClose={handleClose}
      // freeSolo
      fullWidth
      multiple
      size='small'
      classes={{
        paper: clsx({
          [classes.paper]: !lightTheme,
          [classes.lightPaper]: lightTheme
        }),
        option: clsx({
          [classes.option]: !lightTheme,
          [classes.lightoption]: lightTheme
        }),
        popperDisablePortal: classes.popperDisablePortal
      }}
      onChange={(e, newValue) => {
        const l = newValue?.length;
        if (creatable && !isinitialDataLoading) {
          if (typeof newValue === 'string') {
            // api call
            creatableFunc(newValue).then(res => {
              newValue.pop();
              handleChangedValue([...newValue, res]);
            });
          } else if (Array.isArray(newValue) && newValue[l - 1]?.inputValue) {
            // Create a new value from the user input
            // api call
            creatableFunc(newValue[l - 1].inputValue).then(res => {
              newValue.pop();
              handleChangedValue([...newValue, res]);
            });
          } else {
            handleChangedValue(newValue);
          }
        } else {
          handleChangedValue(newValue);
        }
      }}
      value={value}
      // groupBy={(option) => option.type}
      ListboxComponent={ListboxComponent}
      ListboxProps={{
        loadFileSets,
        total: itemcount,
        isItemLoaded,
        isLoading: isLoading || isinitialDataLoading
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={option => option.name || ''}
      options={[...value, ...options]}
      inputValue={search}
      onInputChange={(event, value, reason) => {
        if (reason !== 'reset') {
          if (!open) {
            setOpen(true);
          }
          onInputChange(value);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = [];

        filtered.push(...options);
        if (
          creatable &&
          !options.some(item => item.name === params.inputValue) &&
          params.inputValue !== ''
        ) {
          filtered.push({
            inputValue: params.inputValue,
            name: `Create new "${params.inputValue}"`
          });
        }

        return filtered;
      }}
      renderInput={params => {
        return (
          <div className={classes.inputContainer}>
            <TextField
              {...params}
              inputRef={ref}
              fullWidth
              variant='outlined'
              placeholder={placeholder || 'Add...'}
              className={clsx({
                [classes.inputBase]: !lightTheme,
                [classes.lightInputBase]: lightTheme
              })}
              onClick={handleOpen}
              onKeyDown={e => e.stopPropagation()}
            />
          </div>
        );
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { onDelete, ...rest } = getTagProps({ index });
          return (
            <ReviewTags
              label={option?.name}
              removable={false}
              onClick={() => onDelete(option?.name)}
              wrapperClass={clsx({
                [classes.secondaryColor]: !!secondaryColor
              })}
              {...rest}
            />
          );
        })
      }
      renderOption={(option, prop1) => {
        const { selected } = prop1;
        return (
          <>
            <Box
              px={0.5}
              py={0}
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              width='100%'
              className={classes.optionContainer}
            >
              <Typography className={classes.label}>{option.name}</Typography>
              {selected && <FontAwesomeIcon icon={faCheck} />}
            </Box>
          </>
        );
      }}
    />
  );
};

export default AiModelSelector;
