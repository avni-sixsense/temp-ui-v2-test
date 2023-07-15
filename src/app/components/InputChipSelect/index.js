import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  createFilterOptions
} from '@material-ui/lab/Autocomplete';
import ReviewTags from 'app/components/ReviewTags';
import Show from 'app/hoc/Show';
import clsx from 'clsx';
import mousetrap from 'mousetrap';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import TruncateText from '../TruncateText';
import CommonButton from '../ReviewButton';
import { moveFocusToParent } from 'app/utils/reviewData';
import WithCondition from 'app/hoc/WithCondition';
import Typography from '@material-ui/core/Typography';

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
      backgroundColor: theme.colors.grey[17],

      '& > div': {
        backgroundColor: theme.colors.grey[17]
      }
    },
    '&[data-focus="true"]': {
      backgroundColor: theme.colors.grey[16],

      '& > div': {
        backgroundColor: `${theme.colors.grey[16]} !important`
      }
    }
  },
  lightoption: {
    boxShadow: theme.colors.shadow.sm,
    borderRadius: `1px solid ${theme.colors.grey[4]}`,
    '&[aria-selected="true"]': {
      backgroundColor: theme.colors.grey[3],

      '& > div': {
        backgroundColor: theme.colors.grey[3]
      }
    },
    '&[data-focus="true"]': {
      backgroundColor: theme.colors.grey[2],

      '& > div': {
        backgroundColor: `${theme.colors.grey[2]} !important`
      }
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
  closeBtn: {
    fontSize: '12px',
    cursor: 'pointer'
  },
  inputContainer: {
    position: 'relative',

    '& > div > div': {
      padding: '6px !important'
    }
  },
  inputIconButton: {
    height: 20,
    width: 20,
    position: 'absolute',
    top: '5px',
    right: '5px',
    marginLeft: theme.spacing(0.5)
  },
  inputBase: {
    borderRadius: 4,
    height: 32,
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
      padding: '0px 0px 0px 2px !important',
      marginLeft: 5,
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
    borderRadius: 4,
    height: 32,
    minWidth: props =>
      props.width ? `${props.width} !important` : '200px !important',
    backgroundColor: theme.colors.grey[0],
    color: theme.colors.grey[18],
    border: `1px solid ${theme.colors.grey[6]}`,
    '& [class*="MuiAutocomplete-tag-"]': {
      color: theme.colors.grey[12]
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
      padding: '0px 0px 0px 2px !important',
      marginLeft: 5,
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
  tags: {
    borderRadius: '4px',
    '& p': {
      color: theme.colors.grey[0]
    },
    '& .MuiTypography-body1': {
      fontSize: '0.8125rem !important'
    },
    '& button': {
      padding: 0,
      color: theme.colors.grey[0],
      opacity: 0.5
    },
    '& .MuiSvgIcon-root': {
      fontSize: '0.8125rem !important'
    }
  },
  labelContainer: {
    fontSize: '0.875rem',
    fontWeight: 400,
    color: '#313131'
  },
  icon: { marginLeft: 8 }
}));

const filter = createFilterOptions();

const InputChipSelect = ({
  data: options = [],
  onChange,
  value = [],
  multiSelect = false,
  placeholder = '',
  width,
  disabled = false,
  shortcutKey = '',
  limitTags = 1,
  creatable,
  creatableText,
  creatableFunc = new Promise(resolve => {
    resolve();
  }),
  clearInputOnCreatable = false,
  lightTheme = false,
  secondaryColor = false,
  showBtn = false,
  handleButtonClick,
  shouldFocus = false,
  removableChip = true
}) => {
  const data = [...options];
  const ref = useRef();
  const classes = useStyle({ width });
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(shouldFocus);
  const [isBtnChecked, setIsBtnChecked] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    if (!disabled && !open) {
      ref.current.focus();
      if (inputValue.length) {
        setTimeout(() => {
          setInputValue('');
        }, 10);
      }

      setOpen(true);
    }
  };

  useEffect(() => {
    mousetrap.bind(shortcutKey, (e, combo) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      handleOpen();
    });

    if (ref.current && shouldFocus) {
      ref.current.focus();
    }

    return () => {
      mousetrap.unbind(shortcutKey);
    };
  }, [shortcutKey, shouldFocus]);

  const handleChangedValue = useCallback(
    value => {
      moveFocusToParent();

      if (multiSelect) {
        onChange(value);
      } else {
        onChange(value.reverse()[0] || {});
      }

      setInputValue('');
    },
    [multiSelect, onChange]
  );

  const handleKeyDown = e => {
    if (e.key !== 'Escape') {
      e.stopPropagation();
    }
  };

  return (
    <Autocomplete
      autoHighlight
      disabled={disabled}
      open={open}
      onClose={handleClose}
      freeSolo
      fullWidth
      multiple
      size='small'
      onKeyDown={handleKeyDown}
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

        if (creatable) {
          if (clearInputOnCreatable) {
            setInputValue('');
          }

          if (typeof newValue === 'string') {
            // api call
            creatableFunc(newValue)?.then(res => {
              newValue.pop();
              handleChangedValue([...newValue, res]);
            });
          } else if (Array.isArray(newValue) && newValue[l - 1]?.inputValue) {
            // Create a new value from the user input
            // api call
            creatableFunc(newValue[l - 1].inputValue)?.then(res => {
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
      limitTags={limitTags}
      // groupBy={(option) => option.type}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={option => option.name ?? ''}
      options={
        data.length > 1
          ? data.sort((a, b) => -b.name.localeCompare(a.name))
          : data
      }
      inputValue={inputValue}
      onInputChange={(event, value, reason) => {
        if (reason !== 'reset') {
          if (!open) {
            setOpen(true);
          }
          setInputValue(value);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = [];

        filtered.push(...filter(options, params));

        if (creatable && params.inputValue !== '') {
          filtered.push({
            inputValue: params.inputValue,
            name: creatableText ?? `Create new "${params.inputValue}"`,
            ignoreTruncate: true,
            creatable
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
            />

            <Show when={showBtn}>
              <CommonButton
                icon={<FontAwesomeIcon icon={faCheck} />}
                onClick={event => {
                  event.stopPropagation();
                  if (!isBtnChecked) {
                    setIsBtnChecked(true);
                    if (handleButtonClick) handleButtonClick();
                  }
                }}
                variant='custom'
                customBackground='#059669'
                size='xs'
                wrapperClass={classes.inputIconButton}
                disabled={isBtnChecked}
                toolTip
                toolTipMsg='Mark as Reviewed'
              />
            </Show>
          </div>
        );
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { onDelete, ...rest } = getTagProps({ index });

          return (
            <ReviewTags
              label={option?.name}
              removable={!disabled && removableChip}
              onClick={() => onDelete(option?.name)}
              wrapperClass={clsx({
                [classes.secondaryColor]: !!secondaryColor,
                [classes.creatable]: option.creatable
              })}
              maxWidth={170}
              {...rest}
            />
          );
        })
      }
      renderOption={(option, prop1) => {
        const { selected } = prop1;

        return (
          <>
            <WithCondition
              when={option.ignoreTruncate}
              then={
                <Typography className={clsx(classes.labelContainer)}>
                  {option.name}
                </Typography>
              }
              or={
                <TruncateText
                  label={option.name}
                  classNames={{
                    root: clsx(classes.labelContainer)
                  }}
                  key={selected + option.name}
                />
              }
            />

            <Show when={selected}>
              <FontAwesomeIcon icon={faCheck} className={classes.icon} />
            </Show>
          </>
        );
      }}
    />
  );
};

export default InputChipSelect;
