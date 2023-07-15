import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  inputBase: {
    borderRadius: '8px',
    width: '100% !important',
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
      borderRadius: '8px'
    }
  },
  lightInputBase: {
    borderRadius: '8px',
    width: '100% !important',
    backgroundColor: theme.colors.grey[2],
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
      backgroundColor: theme.colors.grey[0],
      color: theme.colors.grey[19],
      fontSize: '0.8125rem'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '8px'
    },
    '& :hover': {
      '& [class*="MuiOutlinedInput-notchedOutline-"]': {
        borderColor: theme.colors.blue[600],
        borderWidth: '1px',
        boxShadow: '0px 0px 10px rgba(37, 99, 235, 0.1), 0px 0px 1px #2563EB'
      }
    },
    '& .Mui-focused': {
      '& [class*="MuiOutlinedInput-notchedOutline-"]': {
        borderColor: theme.colors.blue[600],
        borderWidth: '1px',
        boxShadow: '0px 0px 10px rgba(37, 99, 235, 0.1), 0px 0px 1px #2563EB'
      }
    }
  },
  paper: {
    width: '300px',
    wordWrap: 'break-word',
    maxWidth: '300px',
    boxShadow: 'none',
    backgroundColor: '#1C2A42',
    color: '#FFFFFF',
    '& p': {
      color: '#FFFFFF',
      fontSize: '0.875rem !important'
    },
    '& li': {
      '& p': {
        msWordBreak: 'break-all',
        overflowX: 'auto'
      },
      '& div': {
        fontSize: '0.875rem',
        color: '#FFFFFF',
        backgroundColor: '#1C2A42'
      },
      paddingLeft: 0
    },
    '& ul': {
      overflowY: 'scroll',
      // maxHeight: '200px',
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
    // '&::-webkit-scrollbar ': {
    // 	width: 3,
    // },

    // /* Track */
    // '&::-webkit-scrollbar-track': {
    // 	borderRadius: 10,
    // },

    // /* Handle */
    // '&::-webkit-scrollbar-thumb': {
    // 	background: '#31456A',
    // 	borderRadius: 10,
    // },

    // /* Handle on hover */
    // '&::-webkit-scrollbar-thumb:hover': {
    // 	background: '#EEEEEE',
    // },
  },
  lightPaper: {
    width: '300px',
    wordWrap: 'break-word',
    maxWidth: '300px',
    boxShadow: 'none',
    backgroundColor: theme.colors.grey[0],
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
      // maxHeight: '200px',
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
    // maxHeight: 190,
    // overflowY: 'scroll',
    // '&::-webkit-scrollbar ': {
    // 	width: 3,
    // },

    // /* Track */
    // '&::-webkit-scrollbar-track': {
    // 	borderRadius: 10,
    // },

    // /* Handle */
    // '&::-webkit-scrollbar-thumb': {
    // 	background: theme.colors.grey[0],
    // 	borderRadius: 10,
    // },

    // /* Handle on hover */
    // '&::-webkit-scrollbar-thumb:hover': {
    // 	background: theme.colors.grey[4],
    // },
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
  lightOption: {
    '&[aria-selected="true"]': {
      backgroundColor: theme.colors.grey[2]
    },
    '&[data-focus="true"]': {
      backgroundColor: theme.colors.grey[1]
    },
    '& div': {
      backgroundColor: 'transparent !important'
    }
  },
  popperDisablePortal: {
    position: 'relative',
    width: 'auto !important',
    // maxHeight: 184,
    overflowY: 'auto',
    backgroundColor: '#1C2A42',
    color: '#FFFFFF',
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
  popperDisablePortalDefect: {
    position: 'relative',
    width: '300px !important'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: theme.colors.grey[14],
    padding: theme.spacing(0.25, 0.75, 0.5, 0.75),
    borderRadius: '2px',
    boxShadow: theme.colors.shadow['base'],
    '& p': {
      color: theme.colors.grey[0],
      fontWeight: 600,
      fontSize: '0.875rem',
      marginRight: theme.spacing(0.6875)
    },
    '& svg': {
      color: theme.colors.grey[8],
      fontWeight: 900,
      fontSize: '0.625rem'
    },
    '& ul': {
      padding: '0px !important'
    }
  },
  lightItem: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    border: `0.8px solid ${theme.colors.grey[4]}`,
    backgroundColor: theme.colors.grey[0],
    padding: theme.spacing(0.25, 0.75, 0.5, 0.75),
    borderRadius: '2px',
    boxShadow: theme.colors.shadow['base'],
    '& p': {
      color: theme.colors.grey[19],
      fontWeight: 600,
      fontSize: '0.875rem',
      marginRight: theme.spacing(0.6875)
    },
    '& svg': {
      color: theme.colors.grey[7],
      fontWeight: 900,
      fontSize: '0.625rem'
    },
    '& ul': {
      padding: '0px !important'
    }
  },
  popper: {
    zIndex: 100
  },
  menuPaper: {
    backgroundColor: '#1C2A42',
    padding: theme.spacing(1)
  },
  lightMenuPaper: {
    backgroundColor: theme.colors.grey[0],
    padding: theme.spacing(1),
    border: `0.5px solid ${theme.colors.grey[4]}`
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
    position: 'absolute',
    bottom: 0,
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
  },
  filterCount: {
    backgroundColor: theme.colors.grey[10],
    color: theme.colors.grey[0],
    borderRadius: '1000px',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.125)
  },
  lightfilterCount: {
    backgroundColor: theme.colors.grey[2],
    color: theme.colors.grey[19],
    borderRadius: '1000px',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.125)
  },

  scroll: {
    '& div': {
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
  },
  loadingText: {
    marginBottom: 0,
    paddingLeft: theme.spacing(0.5)
  },
  AIoutputFilter: {
    '& p': {
      color: theme.colors.grey[9],
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: '0.6875rem'
    },
    '& svg': {
      cursor: 'pointer'
    }
  },
  lightAIoutputFilter: {
    '& p': {
      color: theme.colors.grey[10],
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: '0.6875rem'
    },
    '& svg': {
      cursor: 'pointer'
    }
  },
  popperFilter: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 1),
    width: '227px !important',
    backgroundColor: theme.colors.grey[16],
    border: `0.4px solid ${theme.colors.grey[12]}`,
    boxShadow: theme.colors.shadow.xl,
    bordeRadius: '6px',
    cursor: 'default'
  },
  lightPopperFilter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 1.5, 1.5, 1),
    width: '227px !important',
    backgroundColor: theme.colors.grey[0],
    border: `0.4px solid ${theme.colors.grey[2]}`,
    boxShadow: theme.colors.shadow.xl,
    bordeRadius: '6px',
    cursor: 'default'
  },
  clearFilterBtn: {
    border: 'none'
  }
}));

export default useStyles;
