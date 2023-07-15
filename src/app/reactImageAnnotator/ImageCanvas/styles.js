// import { grey } from '@material-ui/core/colors'

export default {
  canvas: { width: '100%', height: '100%' },
  transformGrabber: {
    width: 0.01,
    height: 0.01,
    border: '2px solid #FFF',
    position: 'absolute'
  },
  zoomIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#fff',
    opacity: 0.5,
    fontWeight: 'bolder',
    fontSize: 14,
    padding: 4
  },
  pointDistanceIndicator: {
    '& text': {
      fill: '#fff'
    },
    '& path': {
      vectorEffect: 'non-scaling-stroke',
      strokeWidth: 2,
      opacity: 0.5,
      stroke: '#FFF',
      fill: 'none',
      strokeDasharray: 5,
      animationDuration: '4s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      animationPlayState: 'running'
    }
  },
  paperBox: {
    padding: '3% 0 3% 7%',
    background: '#A9A9A9',
    borderRadius: '4px',
    width: '105px',
    opacity: 0.7
  },
  papperBoxFont: {
    fontSize: '11px',
    fontWeight: 500,
    fontFamily: 'Roboto',
    color: '#FFFFFF'
  },
  failedMsgContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  failedMsgIcon: {
    fontSize: '1.3rem',
    color: '#fff'
  },
  failedMsg: {
    fontSize: '1rem',
    fontWeight: 600,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    marginTop: 15
  },
  labelsContainer: {
    display: 'grid',
    gap: 5
  },
  regionLabelContainer: {
    background: 'rgba(37, 99, 235, 0.6)',
    border: '1px solid rgba(37, 99, 235, 0.1)',
    borderRadius: 4,

    '& > div': {
      padding: 3
    },

    '& > div > div > div > *': {
      border: 0,
      boxShadow:
        '0px 1px 3px rgba(14, 22, 35, 0.1), 0px 1px 2px rgba(14, 22, 35, 0.06)',
      borderRadius: 4,

      '& > div > div > fieldset': {
        border: 0
      }
    }
  },
  aiRegionBackground: {
    background: 'rgba(217,119,6,0.6) !important',
    border: '1px solid rgba(217,119,6,0.1) !important'
  }
};
