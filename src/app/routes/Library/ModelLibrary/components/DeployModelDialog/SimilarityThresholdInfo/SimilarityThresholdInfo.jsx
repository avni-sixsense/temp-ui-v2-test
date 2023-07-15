import { forwardRef, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-light-svg-icons';

import classes from './SimilarityThresholdInfo.module.scss';

export const SimilarityThresholdInfo = forwardRef(({ defaultValue }, ref) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    ref.current.updateValue = newValue => {
      setValue(newValue);
    };
  }, []);

  return (
    <div ref={ref} className={classes.info}>
      <FontAwesomeIcon icon={faCircleInfo} className={classes.infoIcon} />

      <span>
        Model will auto-classify images having similarity score more than{' '}
        {value}%
      </span>
    </div>
  );
});
