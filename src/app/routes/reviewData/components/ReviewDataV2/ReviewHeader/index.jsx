import { useParams } from 'react-router-dom';
import clsx from 'clsx';

import ShowCurrentCount from './ShowCurrentCount';
import NavigateWaferBook from './NavigateWaferBook';
import ActionButtons from './ActionButtons';
import ImageActionButtons from './ImageActionButtons';

import WithCondition from 'app/hoc/WithCondition';

import { AUDIT, MANUAL_CLASSIFY } from 'store/reviewData/constants';

import classes from './ReviewHeader.module.scss';

const ReviewHeader = () => {
  const { annotationType } = useParams();

  const headerText =
    annotationType === MANUAL_CLASSIFY
      ? 'Classifying'
      : annotationType === AUDIT
      ? 'Auditing'
      : 'Labelling';

  return (
    <header className={classes.header}>
      <WithCondition
        when={annotationType === MANUAL_CLASSIFY || annotationType === AUDIT}
        then={
          <NavigateWaferBook
            className={clsx(classes.label, classes.valueContainer)}
            text={headerText}
          />
        }
        or={
          <div className={classes.label}>
            <span>{headerText}</span>
            <ShowCurrentCount className={classes.valueContainer} />
            <span>images</span>
          </div>
        }
      />

      <ImageActionButtons />

      <ActionButtons />
    </header>
  );
};

export default ReviewHeader;
