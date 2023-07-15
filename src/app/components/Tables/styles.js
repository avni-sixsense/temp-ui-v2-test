import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    marginTop: theme.spacing(1),
    position: 'relative',
    minHeight: '125px',
    overflowY: 'hidden'
  },
  loadingIndicator: {
    padding: theme.spacing(2, 0)
  },
  firstCell: {
    padding: theme.spacing(0, 0, 0, 3),
    paddingTop: 0
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
  expand: {
    borderTop: ' 2px solid #E6E6E6',
    padding: theme.spacing(2, 0)
  },
  records: {
    background: 'rgba(223,239,245,0.5)'
  },
  items: {
    borderTop: '2px solid #E6E6E6'
  },
  img: {
    width: '100px',
    height: '100px',
    marginRight: '8px',
    borderRadius: 8,
    marginBottom: 8
  },
  cell: {
    display: 'flex !important',
    paddingLeft: '0px !important'
  },
  headCell: {
    borderBottom: '2px solid rgba(230, 230, 230, 0.5)',
    paddingTop: 0
  },
  text: {
    zIndex: 100,
    marginTop: '-65px',
    marginLeft: '22px',
    color: 'white'
  },
  overlayWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 11
  },
  overlay: {
    display: 'table',
    width: '100%',
    height: '100%',
    backgroundColor: alpha(theme.palette.background.paper, 0.7)
  },
  overlayInner: {
    display: 'table-cell',
    width: '100%',
    height: '100%',
    verticalAlign: 'middle',
    textAlign: 'center'
  },
  subRow: {
    '& .MuiTableCell-root': {
      paddingTop: 0,
      paddingBottom: 0,
      verticalAlign: 'sub'
    }
  },
  tableBody: {
    '& .MuiTableRow-root': {
      '& .MuiTableCell-root': {
        border: 'none',
        wordBreak: 'break-word'
      }
    }
  }
}));
export default useStyles;
