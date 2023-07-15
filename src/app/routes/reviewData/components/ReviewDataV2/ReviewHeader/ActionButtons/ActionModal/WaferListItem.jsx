import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import React from 'react';
import { useParams } from 'react-router-dom';
import { AUDIT, MANUAL_CLASSIFY } from 'store/reviewData/constants';

import classes from './WaferListItem.module.scss';

const REVIEWED_IMAGE_LABEL = {
  [MANUAL_CLASSIFY]: 'Classified',
  [AUDIT]: 'Audited'
};

const UNREVIEWED_IMAGE_LABEL = {
  [MANUAL_CLASSIFY]: 'Unclassified',
  [AUDIT]: 'Unaudited'
};

const KeyValueContainer = ({ label, value }) => {
  return <div className={classes.counter}>{`${label}: ${value}`}</div>;
};

const WaferListItem = ({ checked, onChange, data = {} }) => {
  const { annotationType } = useParams();

  const {
    organization_wafer_id: label = '',
    classified = 0,
    unclassified = 0,
    audited = 0,
    unaudited = 0
  } = data;

  const reviewedImageCount =
    annotationType === MANUAL_CLASSIFY ? classified : audited;

  const unreviewedImageCount =
    annotationType === MANUAL_CLASSIFY ? unclassified : unaudited;

  return (
    <div className={classes.container}>
      <div>
        <CustomizedCheckbox checked={checked} onChange={onChange} />
      </div>
      <div className={classes.labelContainer}>
        <div className={classes.label}>{label}</div>
        <div className={classes.counterContainer}>
          <KeyValueContainer
            label={REVIEWED_IMAGE_LABEL[annotationType]}
            value={reviewedImageCount}
          />
          <KeyValueContainer
            label={UNREVIEWED_IMAGE_LABEL[annotationType]}
            value={unreviewedImageCount}
          />
        </div>
      </div>
    </div>
  );
};

export default WaferListItem;
