import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import mousetrap from 'mousetrap';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
// import useKeyboardJs from 'react-use/lib/useKeyboardJs'

const useStyle = makeStyles(theme => ({
  primary: {
    cursor: 'pointer',
    borderRadius: '2px',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: 'normal',
    border: '0px',
    color: theme.colors.grey[0],
    backgroundColor: theme.colors.blue[600],
    whiteSpace: 'nowrap',
    // padding: theme.spacing(1),
    '& .shortCutKey': {
      fontSize: '10px',
      fontWeight: 500,
      backgroundColor: theme.colors.blue[500],
      color: theme.colors.grey[0]
    },
    '& svg': {
      color: theme.colors.grey[0],
      opacity: theme.colors.opacity[7]
    },
    '&:hover': {
      backgroundColor: theme.colors.blue[500],
      '& .shortCutKey': {
        backgroundColor: theme.colors.blue[400]
      }
    },
    '&:disabled': {
      backgroundColor: theme.colors.blue[800],
      opacity: theme.colors.opacity[6],
      '& .shortCutKey': {
        backgroundColor: theme.colors.blue[700],
        opacity: theme.colors.opacity[5]
      }
    }
  },
  negative: {
    cursor: 'pointer',
    borderRadius: '2px',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: 'normal',
    border: '0px',
    color: theme.colors.grey[0],
    backgroundColor: theme.colors.red[600],
    whiteSpace: 'nowrap',
    // padding: theme.spacing(1),
    '& .shortCutKey': {
      fontSize: '10px',
      fontWeight: 500,
      backgroundColor: theme.colors.red[500],
      color: theme.colors.grey[0]
    },
    '& svg': {
      color: theme.colors.grey[0],
      opacity: theme.colors.opacity[7]
    },
    '&:hover': {
      backgroundColor: theme.colors.red[500],
      '& .shortCutKey': {
        backgroundColor: theme.colors.red[400]
      }
    },
    '&:disabled': {
      backgroundColor: theme.colors.red[800],
      opacity: theme.colors.opacity[6],
      '& .shortCutKey': {
        backgroundColor: theme.colors.red[700],
        opacity: theme.colors.opacity[5]
      }
    }
  },
  secondary: {
    cursor: 'pointer',
    borderRadius: '2px',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: 'normal',
    border: '0px',
    color: theme.colors.grey[0],
    backgroundColor: theme.colors.grey[14],
    whiteSpace: 'nowrap',
    // padding: theme.spacing(1),
    '& .shortCutKey': {
      fontSize: '10px',
      fontWeight: 500,
      backgroundColor: theme.colors.grey[13],
      color: theme.colors.grey[9]
    },
    '& svg': {
      color: theme.colors.grey[8]
    },
    '&:hover': {
      backgroundColor: theme.colors.grey[13],
      '& .shortCutKey': {
        backgroundColor: theme.colors.grey[12]
      }
    },
    '&:disabled': {
      backgroundColor: theme.colors.grey[15],
      color: theme.colors.grey[9],
      '& svg': {
        color: theme.colors.grey[11]
      },
      '& .shortCutKey': {
        backgroundColor: theme.colors.grey[14],
        color: theme.colors.grey[11]
      }
    }
  },
  secondaryDisabled: {
    cursor: 'default',
    backgroundColor: theme.colors.grey[15],
    color: theme.colors.grey[9],
    '& svg': {
      color: theme.colors.grey[11]
    },
    '& .shortCutKey': {
      backgroundColor: theme.colors.grey[14],
      color: theme.colors.grey[11]
    }
  },
  primaryDisabled: {
    cursor: 'default',
    backgroundColor: theme.colors.blue[800],
    opacity: theme.colors.opacity[6],
    '& .shortCutKey': {
      backgroundColor: theme.colors.blue[700],
      opacity: theme.colors.opacity[5]
    }
  },
  negativeDisabled: {
    cursor: 'default',
    backgroundColor: theme.colors.red[800],
    opacity: theme.colors.opacity[6],
    '& .shortCutKey': {
      backgroundColor: theme.colors.red[700],
      opacity: theme.colors.opacity[5]
    }
  },
  tertiaryDisabled: {
    cursor: 'default !important',
    backgroundColor: theme.colors.grey[1],
    border: `0.8px solid ${theme.colors.grey[4]}`,
    opacity: theme.colors.opacity[6],
    '& .shortCutKey': {
      backgroundColor: theme.colors.grey[5],
      opacity: theme.colors.opacity[5]
    }
  },
  custom: {
    cursor: 'pointer',
    borderRadius: '2px',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: 'normal',
    border: '0px',
    color: theme.colors.grey[0],
    whiteSpace: 'nowrap',
    // padding: theme.spacing(1),
    '& .shortCutKey': {
      fontSize: '10px',
      fontWeight: 500,
      backgroundColor: theme.colors.grey[13],
      color: theme.colors.grey[9]
    },
    '& svg': {
      color: theme.colors.grey[0],
      opacity: theme.colors.opacity[7]
    }
    // '&:hover': {
    // 	backgroundColor: 'rgba(2, 67, 93, 0.12)',
    // },
    // '&:disabled': {
    // 	background: '#E0E0E0',
    // 	color: '#000D12',
    // 	opacity: 0.24,
    // },
  },
  tertiary: {
    cursor: 'pointer',
    borderRadius: '4px',
    fontWeight: 600,
    lineHeight: 'normal',
    border: `0.8px solid ${theme.colors.grey[4]}`,
    color: theme.colors.grey[19],
    backgroundColor: theme.colors.grey[0],
    // padding: theme.spacing(1),
    boxShadow: theme.colors.shadow.sm,
    whiteSpace: 'nowrap',
    '& .shortCutKey': {
      fontSize: '10px',
      fontWeight: 500,
      backgroundColor: theme.colors.grey[2],
      color: theme.colors.grey[12]
    },
    '& svg': {
      color: theme.colors.grey[7]
    }
    // '&:hover': {
    // 	backgroundColor: 'transparent',
    // 	color: '#E14242',
    // 	boxShadow: '0 0 0 transparent',
    // },
  },

  // tertiaryCircle: {
  // 	width: 35,
  // 	height: 35,
  // 	minWidth: 35,
  // 	borderRadius: '50%',
  // 	fontStyle: 'normal',
  // 	fontWeight: 'normal',
  // 	fontSize: '14px',
  // 	lineHeight: 'normal',
  // 	border: '0px',
  // 	color: '#02435D',
  // 	backgroundColor: 'rgba(2, 67, 93, 0.2)',
  // 	'&:hover': {
  // 		boxShadow: '0 0 0 transparent',
  // 		backgroundColor: 'rgba(2, 67, 93, 0.3)',
  // 	},
  // },
  // quaternary: {
  // 	fontWeight: 'normal',
  // 	fontSize: '14px',
  // 	lineHeight: 'normal',
  // 	color: '#02435D',
  // 	border: 'none',
  // 	backgroundColor: 'transparent',
  // 	'&:hover': {
  // 		backgroundColor: 'transparent',
  // 	},
  // },
  disabled: {
    borderRadius: '3px',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    border: '0px',
    color: '#000D12',
    backgroundColor: '#E0E0E0',
    whiteSpace: 'nowrap',
    padding: '8px 24px',
    opacity: 0.24
  },
  sm: {
    padding: theme.spacing(0.25, 0.75, 0.5, 0.875),
    fontSize: '0.875rem',
    '& svg': {
      fontSize: '0.625rem !important'
    }
  },
  xs: {
    padding: theme.spacing(0.125, 0.5, 0.375, 0.625),
    fontSize: '0.750rem',
    '& svg': {
      fontSize: '0.5rem  !important'
    }
  },
  l: {
    padding: theme.spacing(0.75, 1.25, 1.125, 1.5),
    fontSize: '1rem',
    '& svg': {
      fontSize: '0.75rem  !important',
      marginRight: theme.spacing(1)
    }
  },
  m: {
    padding: theme.spacing(0.5, 1, 0.75, 0.75),
    fontSize: '0.9375rem',
    '& svg': {
      fontSize: '0.625rem !important',
      marginRight: props => (props.text ? theme.spacing(0.75) : 0)
    }
  },
  smallIcon: {
    padding: theme.spacing(0.75),
    '& svg': {
      fontSize: '0.75rem !important'
    }
  },
  extraSmallIcon: {
    padding: theme.spacing(0.625),
    '& svg': {
      fontSize: '0.625rem  !important'
    }
  },
  largeIcon: {
    padding: theme.spacing(1.25),
    '& svg': {
      fontSize: '0.75rem !important'
    }
  },
  mediumIcon: {
    padding: theme.spacing(1),
    '& svg': {
      fontSize: '0.75rem !important'
    }
  }
}));

const CommonButton = props => {
  const {
    text,
    onClick,
    wrapperClass = '',
    variant = 'primary',
    disabled = false,
    toolTipMsg,
    toolTip,
    icon,
    shortcutKey = '',
    size = 'sm',
    customBackground
  } = props;
  const classes = useStyle(props);

  useEffect(() => {
    if (onClick && shortcutKey.length && !disabled) {
      mousetrap.bind(shortcutKey, () => {
        onClick();
      });
    }

    return () => {
      mousetrap.unbind(shortcutKey);
    };
  }, [onClick, shortcutKey, disabled]);

  const refactorShortCuts = data => {
    if (Array.isArray(data)) {
      return data.map(item =>
        item.includes('command') ? item.replaceAll('command', '⌘') : item
      );
    }
    return data.includes('command') ? data.replaceAll('command', '⌘') : data;
  };

  const getShortCutLabel = () => {
    const newShortCutKey = refactorShortCuts(shortcutKey);
    if (Array.isArray(newShortCutKey)) {
      const isMac = navigator.platform === 'MacIntel';
      if (isMac) return newShortCutKey[0];
      return newShortCutKey[1];
    }
    return newShortCutKey;
  };

  if (icon && !text && toolTip) {
    return (
      <Tooltip title={toolTipMsg} placement='bottom-start'>
        <IconButton
          onClick={onClick}
          disabled={disabled}
          className={clsx(wrapperClass, classes[variant], {
            [classes.smallIcon]: size === 'sm',
            [classes.extraSmallIcon]: size === 'xs',
            [classes.largeIcon]: size === 'l',
            [classes.mediumIcon]: size === 'm'
          })}
          style={
            variant === 'custom' && customBackground
              ? { backgroundColor: customBackground }
              : {}
          }
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  }

  if (toolTip) {
    return (
      <Tooltip title={toolTipMsg} placement='bottom-start'>
        <div>
          <Button
            startIcon={icon || ''}
            onClick={onClick}
            disabled={disabled}
            className={`${wrapperClass} ${classes[variant]} ${classes[size]}`}
            style={
              variant === 'custom' && customBackground
                ? { backgroundColor: customBackground }
                : {}
            }
          >
            <Box display='flex' alignItems='center'>
              {text}
              {shortcutKey && (
                <Box
                  ml={1}
                  px={1}
                  py={0.4}
                  className='shortCutKey'
                  textAlign='center'
                >
                  {getShortCutLabel()}
                </Box>
              )}
            </Box>
          </Button>
        </div>
      </Tooltip>
    );
  }

  if (icon && !text) {
    return (
      <IconButton
        onClick={onClick}
        disabled={disabled}
        className={clsx(wrapperClass, classes[variant], {
          [classes.smallIcon]: size === 'sm',
          [classes.extraSmallIcon]: size === 'xs',
          [classes.largeIcon]: size === 'l',
          [classes.mediumIcon]: size === 'm'
        })}
        style={
          variant === 'custom' && customBackground
            ? { backgroundColor: customBackground }
            : {}
        }
      >
        {icon}
      </IconButton>
    );
  }

  return (
    <Box
      onClick={!disabled ? onClick : () => {}}
      className={`${wrapperClass} ${classes[variant]} ${
        disabled
          ? variant === 'primary'
            ? classes.primaryDisabled
            : variant === 'secondary'
            ? classes.secondaryDisabled
            : variant === 'negative'
            ? classes.negativeDisabled
            : variant === 'tertiary'
            ? classes.tertiaryDisabled
            : ''
          : ''
      } ${classes[size]}`}
      style={
        variant === 'custom' && customBackground
          ? { backgroundColor: customBackground }
          : {}
      }
    >
      <Box display='flex' alignItems='center'>
        {icon && (
          <Box
            textAlign='center'
            display='flex'
            mr={size === 'sm' ? '0.375rem' : size === 'xs' ? '0.25rem' : 0}
          >
            {icon}
          </Box>
        )}
        <Box>{text}</Box>
        {shortcutKey && (
          <Box ml={1} px={0.375} className='shortCutKey' textAlign='center'>
            {getShortCutLabel()}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommonButton;

CommonButton.defaultValue = {
  wrapperClass: '',
  variant: 'primary',
  disabled: false,
  onClick: () => {},
  toolTipMsg: '',
  toolTip: false
};

CommonButton.propTypes = {
  text: PropTypes.any,
  onClick: PropTypes.func,
  wrapperClass: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  toolTipMsg: PropTypes.string,
  toolTip: PropTypes.bool
};
