import { memo, useCallback, useState } from 'react';
// import { useSelector } from 'react-redux';
import clsx from 'clsx';

import useUploadDataWorker from 'app/hooks/useUploadDataWorker';
import useFloatingStatusWidgetState from 'app/hooks/useFloatingStatusWidgetState';

import Draggable from '../Draggable';
import { TitleCard } from './Components/TitleCard';
import { StatusCard } from './Components/StatusCard';

import classes from './FloatingStatusWidget.module.scss';

export const FloatingStatusWidget = memo(() => {
  const [expanded, setExpanded] = useState(false);

  const [state] = useFloatingStatusWidgetState(true);

  const { uploadFolders, uploadIds } = state;

  // const uploadFolders = useSelector(
  //   ({ statusWidget }) => statusWidget.uploadFolders
  // );
  // const uploadIds = useSelector(({ statusWidget }) => statusWidget.uploadIds);

  const { onTerminate, onFileUploadStart, onFileRetry } = useUploadDataWorker();

  const handleClose = useCallback(() => {
    onTerminate();
  }, []);

  if (!state.isWidgetOpen) return null;

  return (
    <Draggable>
      <div className={classes.floatingStatusWidget}>
        <TitleCard
          foldersLength={uploadIds.length}
          expanded={expanded}
          onClose={handleClose}
          allowClose={!uploadIds.length}
          handleToggle={() => setExpanded(d => !d)}
        />

        <div
          className={clsx(classes.floatingStatusWidgetBody, {
            [classes.expanded]: expanded,
            [classes.minimised]: !expanded
          })}
        >
          {Object.values(uploadFolders).map(props => {
            return (
              <StatusCard
                key={props.session.id}
                onFileUploadStart={onFileUploadStart}
                onFileRetry={onFileRetry}
                {...props}
              />
            );
          })}
        </div>
      </div>
    </Draggable>
  );
});
