// @flow

// import { grey } from '@material-ui/core/colors'

export default {
  paper: {
    boxShadow: 'none',
    backgroundColor: '#1C2A42',
    color: '#FFFFFF',
    '& p': {
      color: '#FFFFFF'
    },
    '& .MuiAutocomplete-listbox': {
      '& .MuiListSubheader-gutters': {
        fontSize: '0.875rem',
        color: '#FFFFFF',
        backgroundColor: '#1C2A42'
      }
      // '& .MuiAutocomplete-groupUl .MuiAutocomplete-option': {
      // 	display: 'flex',
      // 	alignItems: 'center',
      // 	fontWeight: 400,
      // },
    }
  },
  option: {
    // minHeight: 'auto',
    // alignItems: 'flex-start',
    // padding: 0,
    '&[aria-selected="true"]': {
      backgroundColor: 'transparent'
    },
    '&[data-focus="true"]': {
      backgroundColor: 'transparent'
    }
    // backgroundColor: '#1C2A42',
    // color: '#FFFFFF',
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
  item: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  popper: {
    zIndex: 100
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 400,
    color: '#313131'
  },
  button: {
    borderRadius: '3px',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: 'normal',
    border: '0px',
    color: '#FFFFFF',
    backgroundColor: '#F56C6C',
    padding: '8px 24px',
    '&:hover': {
      backgroundColor: '#E14242'
    },
    '&:disabled': {
      background: '#E0E0E0',
      color: '#000D12',
      opacity: 0.24
    }
  },
  regionInfo: {
    // cursor: 'default',
    // transition: 'opacity 200ms',
    // '&:hover': {
    // 	cursor: 'pointer',
    // },
    // pointerEvents: "none",
    padding: 6,
    '& .name': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      '& .circle': {
        marginRight: 4,
        boxShadow: '0px 0px 2px rgba(0,0,0,0.4)',
        width: 10,
        height: 10,
        borderRadius: 5
      }
    },
    '& .tags': {
      display: 'flex',
      '& .tag': {
        // color: grey[700],
        // display: 'inline-block',
        // margin: 1,
        // fontSize: 10,
        // textDecoration: 'underline',
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        color: '#FFFFFF',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center'
      },
      '& .addIcon': {
        cursor: 'pointer'
      }
    }
  },
  open: {
    minWidth: '175px',
    borderRadius: 0,
    '& .MuiAutocomplete-endAdornment': {
      display: 'none'
    }
  },
  closeBtn: {
    fontSize: '12px',
    cursor: 'pointer'
  },
  inputBase: {
    borderRadius: '8px',
    width: '235px !important',
    backgroundColor: '#162236',
    color: '#FFFFFF',
    '& input': {
      color: '#FFFFFF',
      '&::placeholder': {
        color: '#31456A',
        opacity: 1
      },
      '&:-ms-input-placeholder': {
        color: '#31456A'
      },
      '&::-ms-input-placeholder': {
        color: '#31456A'
      }
    },
    '& .MuiAutocomplete-tag': {
      backgroundColor: '#7C3AED',
      color: '#FFFFFF',
      fontSize: '0.8125rem'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      // border: '1px solid #4F46E5',
      // boxShadow: '0px 0px 5px #C7D2FE',
      // '&:hover': {
      // 	border: '1px solid #4F46E5',
      // 	boxShadow: '0px 0px 5px #C7D2FE',
      // },
      borderRadius: '8px'
    }
  },
  searchIcons: {
    paddingTop: '0px',
    paddingBottom: '0px',
    paddingRight: '0px'
  },
  tags: {
    borderRadius: '4px',
    color: '#FFFFFF',
    '& .MuiTypography-body1': {
      fontSize: '0.8125rem !important'
    },
    '& button': {
      padding: 0,
      color: '#FFFFFF',
      opacity: 0.5
    },
    '& .MuiSvgIcon-root': {
      fontSize: '0.8125rem !important'
    }
  }
};
