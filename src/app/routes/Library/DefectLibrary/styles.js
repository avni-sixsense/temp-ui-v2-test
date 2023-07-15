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
  table: {
    minWidth: 750,
    '& thead > tr > th': {
      paddingBottom: '8px !important'
    },
    '& tbody > tr > td': {
      borderBottom: 'none'
    }
  },
  tableHeadBorder: {
    minWidth: 750,
    '& thead > tr > th': {
      paddingBottom: '8px',
      borderBottom: 'none'
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
  tableSection: {
    marginTop: theme.spacing(4)
  }
}));

export default useStyles;
