import { Dialog, Paper, Typography } from '@material-ui/core';
import api from 'app/api';
import CommonButton from 'app/components/ReviewButton';
import useCheckUserActive from 'app/hooks/useCheckUserActive';
import useInternetCheck from 'app/hooks/useInternetCheck';
import { convertToArray, decodeURL } from 'app/utils/helpers';
import { goToPreviousRoute } from 'app/utils/navigation';
import {
  checkAndActiveWaferAvailability,
  makeWaferInactive
} from 'app/utils/waferbook';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import { resetReviewData } from 'store/reviewData/actions';
import { MANUAL_CLASSIFY } from 'store/reviewData/constants';
import classes from './ReviewInactiveState.module.scss';

const VAR_BUSY_WAFER_DIALOG = 'busy_wafer_dialog';
const VAR_INACTIVE_TIMER_DIALOG = 'inactive_timer_dialog';
const VAR_PAGE_INACTIVE_DIALOG = 'page_inactive_dialog';
const VAR_OFFLINE_DIALOG = 'offline_dialog';
const WAFER_ACTIVE_POLLING_TIME = 1000 * 15; // 15 seconds
const INACTIVE_TIMER_DURATION_IN_SECONDS = 10;

const ReviewInactiveState = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inactivityTimout = useRef(null);
  const isOnline = useInternetCheck();
  const activeWaferTimeout = useRef(null);
  const { annotationType } = useParams();

  const { subscriptionId, packId } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isUserActive, resetTimer] = useCheckUserActive();
  const [inactivityTimer, setInActivityTimer] = useState(
    INACTIVE_TIMER_DURATION_IN_SECONDS
  );
  const [activeDialog, setActiveDialog] = useState({});
  const [waferIds, setWaferIds] = useState([]);

  useEffect(() => {
    const allWafersId = convertToArray(
      decodeURL(queryString.parse(window.location.search).contextual_filters)
        .allWafersId
    ).join(',');

    api
      .getWaferMap('', allWafersId)
      .then(res => {
        setWaferIds(res?.results || []);
      })
      .catch(() => {
        toast('Filed to fetch wafer data.');
      });
  }, []);

  useEffect(() => {
    if (waferIds.length) {
      activeWaferTimeout.current = setInterval(() => {
        try {
          checkAndActiveWaferAvailability(
            waferIds.map(item => item.id),
            true
          );
        } catch (error) {
          console.log(error);
        }
      }, WAFER_ACTIVE_POLLING_TIME);
    }

    return () => {
      clearInterval(activeWaferTimeout.current);
    };
  }, [waferIds, isUserActive]);

  const handleResetInactiveTimer = () => {
    setIsOpen(false);
    setActiveDialog({});
    resetTimer();
  };

  const checkIfWaferActive = async () => {
    const isWaferInUse = await checkIfWaferInUse();

    if (isWaferInUse) {
      setIsOpen(true);
      setActiveDialog(BUSY_WAFER_DIALOG);
    } else {
      setIsOpen(false);
      setActiveDialog({});
      resetTimer();
    }
  };

  const handleForceReview = () => {
    checkAndActiveWaferAvailability(
      waferIds.map(item => item.id),
      true
    )
      .then(() => {
        resetTimer();
        setIsOpen(false);
        setActiveDialog({});
      })
      .catch(() => {
        toast('Something went wrong.');
      });
  };

  const handleCloseReview = async () => {
    if (isOnline) {
      try {
        await makeWaferInactive(waferIds.map(item => item.id));
      } catch ({ response }) {
        toast('Something went wrong.');
        return;
      }
    }

    goToPreviousRoute(navigate, `/${subscriptionId}/${packId}/library/data`);

    dispatch(resetReviewData());
  };

  const INACTIVE_TIMER_DIALOG = {
    id: VAR_INACTIVE_TIMER_DIALOG,
    header: 'Are you still working',
    info: 'If not, then page will get become inactive in XXXX sec, so that other user can work on these wafers',
    btnGroup: [
      {
        text: 'Yes, Continue',
        onClick: handleResetInactiveTimer,
        variant: 'primary'
      },
      {
        text: 'Exit',
        onClick: handleCloseReview,
        variant: 'tertiary'
      }
    ]
  };

  const PAGE_INACTIVE_DIALOG = {
    id: VAR_PAGE_INACTIVE_DIALOG,
    header: 'Page inactive',
    info: 'Page became inactive. Click classify to continue.',
    btnGroup: [
      {
        text: annotationType === MANUAL_CLASSIFY ? 'Classify' : 'Audit',
        onClick: checkIfWaferActive,
        variant: 'primary'
      },
      {
        text: 'Exit',
        onClick: handleCloseReview,
        variant: 'tertiary'
      }
    ]
  };

  const OFFLINE_DIALOG = {
    id: VAR_OFFLINE_DIALOG,
    header: 'Wafer inactive',
    info: 'Wafer became inactive due to error in internet connection.',
    btnGroup: [
      {
        text: 'Exit',
        onClick: handleCloseReview,
        variant: 'primary'
      }
    ]
  };

  const BUSY_WAFER_DIALOG = {
    id: VAR_BUSY_WAFER_DIALOG,
    header: 'Wafer already in review',
    info: 'XXXX is already being reviewed by other user.',
    btnGroup: [
      {
        text: 'Exit',
        onClick: handleCloseReview,
        variant: 'primary'
      },
      {
        text: annotationType === MANUAL_CLASSIFY ? 'Classify' : 'Audit',
        onClick: handleForceReview,
        variant: 'tertiary'
      }
    ]
  };

  const checkIfWaferInUse = async () => {
    try {
      await checkAndActiveWaferAvailability(waferIds.map(item => item.id));
      return false;
    } catch ({ response }) {
      if (response.status === 400) return true;

      toast('Something went wrong.');
      return true;
    }
  };

  useEffect(() => {
    if (!waferIds.length) return;

    if (!isOnline) {
      setIsOpen(true);
      setActiveDialog(OFFLINE_DIALOG);
    } else if (
      isOnline &&
      activeDialog?.id === OFFLINE_DIALOG.id &&
      checkIfWaferInUse()
    ) {
      setIsOpen(true);
      setActiveDialog(BUSY_WAFER_DIALOG);
    } else {
      setIsOpen(false);
      setActiveDialog({});
    }
  }, [isOnline, waferIds]);

  useEffect(() => {
    if (inactivityTimer === 0) {
      setActiveDialog(PAGE_INACTIVE_DIALOG);
      clearInterval(activeWaferTimeout.current);
    }
  }, [inactivityTimer]);

  useEffect(() => {
    if (!isUserActive) {
      setIsOpen(true);
      setActiveDialog(INACTIVE_TIMER_DIALOG);
      setInActivityTimer(10);
      inactivityTimout.current = setInterval(() => {
        setInActivityTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000); // 1 second
    }

    return () => {
      if (inactivityTimout.current) clearInterval(inactivityTimout.current);
    };
  }, [isUserActive]);

  const getInfoValue = () => {
    if (!activeDialog.id || activeDialog.id === VAR_PAGE_INACTIVE_DIALOG)
      return '';

    if (activeDialog.id === VAR_INACTIVE_TIMER_DIALOG) return inactivityTimer;

    if (activeDialog.id === VAR_BUSY_WAFER_DIALOG)
      return waferIds.map(item => item.organization_wafer_id).join(',');
  };

  return (
    <Dialog className={classes.modal} open={isOpen}>
      <Paper className={classes.paper}>
        <div className={classes.headerContainer}>
          <Typography className={classes.header}>
            {activeDialog.header}
          </Typography>

          {/* <IconButton className={classes.closeIcon} onClick={() => {}}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton> */}
        </div>

        <div className={classes.modalBody}>
          <div>
            <Typography>
              {(activeDialog?.info || '').replace('XXXX', getInfoValue())}
            </Typography>
          </div>
          <div className={classes.modalActionBtns}>
            {(activeDialog?.btnGroup || []).map((item, index) => (
              <CommonButton {...item} size='sm' key={index} />
            ))}
          </div>
        </div>
      </Paper>
    </Dialog>
  );
};

export default ReviewInactiveState;
