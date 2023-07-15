import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  inputBase: {
    paddingTop: '8px',
    '& .MuiAutocomplete-inputRoot': {
      width: '90%',
      margin: 'auto'
    },
    '& .MuiAutocomplete-endAdornment': {
      display: 'none'
    },
    '& .MuiInput-underline:after': {
      borderBottom: '1px solid #E8EDF1'
    },
    '& .MuiInput-underline:before': {
      borderBottom: '1px solid #E8EDF1'
    }
  },
  paper: {
    width: '300px',
    maxWidth: '300px',
    boxShadow: 'none',
    margin: 0,
    maxHeight: 270
  },
  paperDefect: {
    boxShadow: 'none',
    margin: 0
    // maxHeight: 396
  },
  option: {
    minHeight: 'auto',
    alignItems: 'flex-start',
    paddingTop: 0,
    paddingBottom: 16,
    paddingLeft: 15,
    paddingRight: 8,

    '&[aria-selected="true"]': {
      backgroundColor: 'transparent'
    },
    '&[data-focus="true"]': {
      backgroundColor: 'transparent'
    },
    '& .MuiAutocomplete-option': {
      paddingLeft: '0px'
    }
  },
  popperDisablePortal: {
    position: 'relative'
  },
  popperDisablePortalDefect: {
    position: 'relative',
    width: '300px !important'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  popper: {
    zIndex: 100
  },
  menu: {
    '& .MuiMenu-paper': {
      boxShadow: '-3px 2px 30px rgba(0, 0, 0, 0.14)',
      borderRadius: '3px',
      border: '1px solid #E8EDF1',
      minWidth: '300px',
      maxHeight: '356px',
      '& .MuiAutocomplete-listbox': {
        margin: '12px 0',
        padding: 0
      },
      '& .MuiMenu-list': {
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        height: '100%'
      }
    }
  },
  menuDefect: {
    '& .MuiMenu-paper': {
      boxShadow: '-3px 2px 30px rgba(0, 0, 0, 0.14)',
      borderRadius: '3px',
      border: '1px solid #E8EDF1',
      minWidth: '300px',
      height: '402px',
      '& .MuiMenu-list': {
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        height: '100%'
      },
      '& .MuiAutocomplete-option': {
        padding: 0
      }
    }
  },
  dateMenu: {
    '& .MuiMenu-paper': {
      boxShadow: '-3px 2px 30px rgba(0, 0, 0, 0.14)',
      borderRadius: '3px',
      border: '1px solid #E8EDF1',
      minWidth: '340px',
      minHeight: '356px',
      padding: '8px',
      '& .MuiMenu-list': {
        padding: '0 !important',
        width: '100% !important',
        height: '100%'
      }
    }
  },
  menuItem: {
    // position: 'absolute',
    // bottom: 0,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '&:focus': {
      backgroundColor: 'transparent'
    }
  },
  list: {
    height: '250px',
    overflowY: 'scroll'
  },
  search: {
    width: '80%',
    border: 'none',
    borderBottom: '0.5px solid #E3E3E3',
    fontSize: '12px',
    lineHeight: '32px',
    color: '#000000',
    opacity: 0.5
  },
  cancelBtn: {
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
  applyBtn: {
    borderRadius: '3px',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: 'normal',
    border: '0px',
    color: '#FFFFFF',
    backgroundColor: '#F56C6C !important',
    padding: theme.spacing(1, 3),
    '&:hover': {
      backgroundColor: '#E14242 !important'
    },
    '&:disabled': {
      background: '#E0E0E0 !important',
      color: '#000D12',
      opacity: 0.24
    }
  },
  datePicker: {
    backgroundColor: 'yellow'
  }
}));

export default useStyles;
