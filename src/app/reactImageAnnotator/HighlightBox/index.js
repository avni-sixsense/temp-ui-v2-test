// @flow

import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React, { useRef, useState } from 'react';
// import Popper from '@material-ui/core/Popper'
// import Paper from '@material-ui/core/Paper'
// import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  '@keyframes borderDance': {
    from: { strokeDashoffset: 0 },
    to: { strokeDashoffset: 100 }
  },
  highlightBox: {
    transition: 'opacity 500ms',
    '&:not(.highlighted)': {
      opacity: 0
    },
    '&:not(.highlighted):hover': {
      opacity: 0.6
    },
    '& path': {
      vectorEffect: 'non-scaling-stroke',
      strokeWidth: 2,
      stroke: ({ region }) => region?.color || '#FFF',
      fill: 'none',
      strokeDasharray: 5,
      animationName: '$borderDance',
      animationDuration: '4s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      animationPlayState: 'running'
    }
  },
  popper: {
    zIndex: 100,
    margin: '8px',
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      opacity: 0.7,
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent rgba(169, 169, 169, 0.5) transparent transparent`
      }
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      opacity: 0.7,
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent rgba(169, 169, 169, 0.5)`
      }
    }
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    }
  },
  paperBox: {
    padding: '9px',
    background: 'rgba(169, 169, 169, 0.5)',
    borderRadius: '4px',
    width: '110px'
  },
  papperBoxFont: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#FFFFFF',
    lineHeight: '13px'
  }
});

export default ({
  mouseEvents,
  dragWithPrimary,
  zoomWithPrimary,
  zoomOutWithPrimary,
  createWithPrimary,
  onBeginMovePoint,
  onSelectRegion,
  region: r,
  pbox
}) => {
  const classes = useStyles({ region: r });
  const anchorRef = useRef(null);
  // const [arrowRef, setArrowRef] = useState(null)

  return (
    <>
      <svg
        ref={anchorRef}
        key={r.id}
        className={classnames(classes.highlightBox, {
          highlighted: r.highlighted
        })}
        {...mouseEvents}
        {...(!zoomWithPrimary && !zoomOutWithPrimary && !dragWithPrimary
          ? {
              onMouseDown: e => {
                if (
                  !r.locked &&
                  r.type === 'point' &&
                  r.highlighted &&
                  e.button === 0
                ) {
                  return onBeginMovePoint(r);
                }
                if (e.button === 0 && !createWithPrimary)
                  return onSelectRegion(r);
                mouseEvents.onMouseDown(e);
              }
            }
          : {})}
        style={{
          ...(r.highlighted
            ? {
                pointerEvents: r.type !== 'point' ? 'none' : undefined,
                cursor: 'grab'
              }
            : {
                cursor: !(
                  zoomWithPrimary ||
                  zoomOutWithPrimary ||
                  dragWithPrimary ||
                  createWithPrimary ||
                  r.is_ai_region
                )
                  ? 'pointer'
                  : undefined,
                pointerEvents:
                  zoomWithPrimary ||
                  zoomOutWithPrimary ||
                  dragWithPrimary ||
                  (createWithPrimary && !r.highlighted)
                    ? 'none'
                    : undefined
              }),
          position: 'absolute',
          left: pbox.x - 5 ? pbox.x - 5 : 0,
          top: pbox.y - 5 ? pbox.y - 5 : 0,
          width: pbox.w + 10 ? pbox.w + 10 : 0,
          height: pbox.h + 10 ? pbox.h + 10 : 0
        }}
      >
        <path
          d={`M5,5 L${pbox.w ? pbox.w + 5 : 0},5 L${pbox.w ? pbox.w + 5 : 0},${
            pbox.h ? pbox.h + 5 : 0
          } L5,${pbox.h ? pbox.h + 5 : 0} Z`}
        />
      </svg>
      {/* <Popper
				open={r.highlighted || false}
				anchorEl={anchorRef.current}
				transition
				disablePortal
				placement={700 - pbox.x > 350 ? 'right' : 'left'}
				className={classes.popper}
				modifiers={{
					flip: {
						enabled: true,
					},
					preventOverflow: {
						enabled: true,
						boundariesElement: 'scrollParent',
					},
					arrow: {
						enabled: true,
						element: arrowRef,
					},
				}}
			>
				<span className={classes.arrow} ref={setArrowRef} />
				<Paper className={classes.paperBox}>
					<Typography className={classes.papperBoxFont}>{`Length: ${parseFloat(r.h).toFixed(5)}`}</Typography>
					<Typography className={classes.papperBoxFont}>{`Width: ${parseFloat(r.w).toFixed(5)}`}</Typography>
					<Typography className={classes.papperBoxFont}>{`Area: ${parseFloat(r.h * r.w).toFixed(
						5
					)}`}</Typography>
				</Paper>
			</Popper> */}
    </>
  );
};
