import {
  faExclamationTriangle,
  faRedo
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Show from 'app/hoc/Show';
import clsx from 'clsx';
import React from 'react';

import classes from './SSProgress.module.scss';

const SSProgress = ({ label, value, isError, isUploadFailed, onRetry }) => {
  return (
    <div
      className={clsx(
        classes.container,
        (isError || isUploadFailed) && classes.error
      )}
    >
      <div className={classes.info}>
        <span className={classes.label}>{label}</span>

        <div className={classes.actionContainer}>
          <span className={classes.progressPercent}>{value}% complete</span>

          <Show when={isError || isUploadFailed}>
            <FontAwesomeIcon icon={faExclamationTriangle} color='#be123c' />
          </Show>

          <Show when={isUploadFailed}>
            <FontAwesomeIcon
              onClick={onRetry}
              cursor='pointer'
              icon={faRedo}
              color='#2563eb'
            />
          </Show>
        </div>
      </div>

      <progress max='100' value={value} className={classes.progress} />
    </div>
  );
};

export default SSProgress;
