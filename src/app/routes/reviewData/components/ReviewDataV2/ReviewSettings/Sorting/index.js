import { faSlidersV } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import CommonButton from 'app/components/ReviewButton';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setContainerMeta } from 'store/reviewData/actions';

import SortingDialog from './SortingDialog';

const useStyles = makeStyles(theme => ({
  buttonBar: {
    backgroundColor: 'rgba(28, 42, 66, 0.7)',
    borderRadius: '4px',
    border: `0.2px solid ${theme.colors.grey[13]}`
  },
  paper: {
    backgroundColor: theme.colors.grey[17],
    width: '20.125rem',
    marginTop: theme.spacing(1.25)
  },
  popper: {
    zIndex: 999
  }
}));

const Sorting = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const anchorEl = useRef(null);
  const tempContainerMetaRef = useRef({});

  const handleBtnClick = event => {
    anchorEl.current = event.currentTarget;
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    anchorEl.current = null;
    setIsDialogOpen(false);
  };

  const handleWithoutApplyClose = e => {
    dispatch(setContainerMeta(tempContainerMetaRef.current));
    handleClose();
  };

  return (
    <>
      <CommonButton
        onClick={handleBtnClick}
        icon={<FontAwesomeIcon icon={faSlidersV} />}
        variant='secondary'
      />

      {isDialogOpen && (
        <ClickAwayListener
          disableReactTree
          onClickAway={handleWithoutApplyClose}
        >
          <Popper
            className={classes.popper}
            placement='bottom-end'
            open={isDialogOpen}
            anchorEl={anchorEl.current}
            transition
            disablePortal
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper className={classes.paper}>
                  <SortingDialog
                    handleClose={handleClose}
                    handleWithoutApplyClose={handleWithoutApplyClose}
                    tempContainerMetaRef={tempContainerMetaRef}
                  />
                </Paper>
              </Fade>
            )}
          </Popper>
        </ClickAwayListener>
      )}
    </>
  );
};

export default Sorting;
