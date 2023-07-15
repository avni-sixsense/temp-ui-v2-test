import { useEffect, useRef } from 'react';

import ReviewHeader from './ReviewHeader';
import ReviewBody from './ReviewBody';
import ReviewBackdrop from './ReviewBackdrop';

import { handleImgKeyNavigation } from 'app/utils/reviewData';

import classes from './ReviewData.module.scss';
import ReviewInactiveState from './ReviewInactiveState';
import Show from 'app/hoc/Show';
import { useParams } from 'react-router-dom';
import { AUDIT, MANUAL_CLASSIFY } from 'store/reviewData/constants';
import { DEFECT_HOT_KEYS } from 'app/utils/constants';

const ReviewData = () => {
  const ref = useRef(null);

  const { annotationType } = useParams();

  useEffect(() => {
    ref.current?.focus();

    return () => {
      Object.keys(DEFECT_HOT_KEYS).forEach(key => delete DEFECT_HOT_KEYS[key]);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={classes.review}
      tabIndex='0'
      onKeyDown={e => handleImgKeyNavigation(e, annotationType)}
    >
      <ReviewHeader />

      <ReviewBody />

      <ReviewBackdrop />

      <Show
        when={annotationType === MANUAL_CLASSIFY || annotationType === AUDIT}
      >
        <ReviewInactiveState />
      </Show>
    </div>
  );
};

export default ReviewData;
