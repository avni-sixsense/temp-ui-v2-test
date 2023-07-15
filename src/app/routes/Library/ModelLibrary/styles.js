import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paperBg: {
    backgroundColor: '#FFFFFF'
  },
  root: {
    width: '100%'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  tableSection: {
    marginTop: theme.spacing(4)
  },
  table: {
    minWidth: 750,
    '& thead > tr > th': {
      paddingBottom: '8px'
    },
    '& tbody > tr > td': {
      borderBottom: 'none'
    }
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
  divider: {
    width: '100%',
    height: '48px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  dot: {
    width: '6px',
    height: '6px',
    marginLeft: '0.5px',
    background: '#B3C7CE',
    borderRadius: '5px'
  },
  dash: {
    height: '20px',
    borderLeft: '0.5px dashed #000000'
  },
  solid: {
    height: '20px',
    borderLeft: 'none'
  },
  tableContainer: {
    overflow: 'hidden',
    maxHeight: 'calc(100vh - 200px)',
    '& [class*="MuiTableContainer-root"]': {
      overflow: 'auto',
      maxHeight: 'calc(100vh - 360px)',
      // maxHeight: '1500px',
      '&::-webkit-scrollbar': {
        width: '8px'
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 0px white',
        borderRadius: '5px'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: ' #dfdcdc',
        borderRadius: '10px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#cecece'
      }
    }
  }
}));

export default useStyles;
