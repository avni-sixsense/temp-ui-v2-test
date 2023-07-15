import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';

const useStyle = makeStyles(theme => ({
  primary: {
    borderRadius: '3px',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: 'normal',
    border: '0px',
    color: '#FFFFFF',
    backgroundColor: '#F56C6C',
    padding: theme.spacing(1, 3),
    '&:hover': {
      backgroundColor: '#E14242'
    },
    '&:disabled': {
      background: '#E0E0E0',
      color: '#000D12',
      opacity: 0.24
    }
  },
  secondary: {
    borderRadius: '3px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: 'normal',
    border: '0px',
    color: '#F56C6C',
    backgroundColor: 'transparent',
    padding: '8px 24px',
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#E14242',
      boxShadow: '0 0 0 transparent'
    }
  },
  tertiary: {
    borderRadius: '3px',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: 'normal',
    border: '0px',
    color: '#02435D',
    backgroundColor: 'rgba(2, 67, 93, 0.06)',
    padding: '8px 24px',
    '&:hover': {
      backgroundColor: 'rgba(2, 67, 93, 0.12)'
    },
    '&:disabled': {
      background: '#E0E0E0',
      color: '#000D12',
      opacity: 0.24
    }
  },
  tertiaryCircle: {
    width: 35,
    height: 35,
    minWidth: 35,
    borderRadius: '50%',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: 'normal',
    border: '0px',
    color: '#02435D',
    backgroundColor: 'rgba(2, 67, 93, 0.2)',
    '&:hover': {
      boxShadow: '0 0 0 transparent',
      backgroundColor: 'rgba(2, 67, 93, 0.3)'
    }
  },
  quaternary: {
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: 'normal',
    color: '#02435D',
    border: 'none',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  disabled: {
    borderRadius: '3px',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    border: '0px',
    color: '#000D12',
    backgroundColor: '#E0E0E0',
    padding: '8px 24px',
    opacity: 0.24
  }
}));

const CommonButton = ({
  text,
  onClick,
  wrapperClass = '',
  variant = 'primary',
  disabled = false,
  toolTipMsg,
  toolTip,
  id = ''
}) => {
  const classes = useStyle();

  if (toolTip) {
    return (
      <Tooltip title={toolTipMsg} placement='bottom-start'>
        <Button
          id={id}
          onClick={onClick}
          disabled={disabled}
          className={`${wrapperClass} ${classes[variant]}`}
        >
          {text}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={`${wrapperClass} ${classes[variant]}`}
    >
      {text}
    </Button>
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
