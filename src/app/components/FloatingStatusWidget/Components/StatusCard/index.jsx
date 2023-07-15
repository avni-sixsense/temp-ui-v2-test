import { memo, useCallback, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

import Show from 'app/hoc/Show';
import TruncateText from 'app/components/TruncateText';

import useFloatingStatusWidgetState from 'app/hooks/useFloatingStatusWidgetState';

import { faExclamationTriangle } from '@fortawesome/pro-light-svg-icons';
import {
  faCircleCheck,
  faRedoAlt,
  faSpinnerThird
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './StatusCard.module.scss';

export const StatusCard = memo(
  ({
    session,
    isRetry,
    isError,
    isComplete,
    onFileUploadStart,
    onFileRetry
  }) => {
    const { name, id } = session;

    // const dispatch = useDispatch();

    const [state, customDispatch, { setFolderRetry }] =
      useFloatingStatusWidgetState(true);

    const isCurrentFolderUploading =
      state.uploadIds[state.uploadIds.length - 1] === id;

    // const isCurrentFolderUploading = useSelector(
    //   selectIsFolderUploadingById(id)
    // );

    const onRetry = useCallback(() => {
      customDispatch(setFolderRetry(id));
    }, []);

    useEffect(() => {
      if (isCurrentFolderUploading) {
        if (isRetry) {
          return onFileRetry(session);
        } else {
          return onFileUploadStart(session);
        }
      }
    }, [isCurrentFolderUploading]);

    return (
      <div className={classes.statusCard}>
        <TruncateText className={classes.name} label={name} />

        <Show when={isError}>
          <div className={classes.error}>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className={classes.errorIcon}
            />

            <Show when={isRetry}>
              <FontAwesomeIcon
                icon={faRedoAlt}
                className={classes.retryButton}
                onClick={onRetry}
              />
            </Show>
          </div>
        </Show>

        <Show when={!isError && !isComplete}>
          <FontAwesomeIcon icon={faSpinnerThird} className={classes.rotate} />
        </Show>

        <Show when={isComplete}>
          <FontAwesomeIcon icon={faCircleCheck} className={classes.checkIcon} />
        </Show>
      </div>
    );
  }
);
