import { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SideDrawer from 'app/components/SideDrawer';
import UploadDataBody from './components/UploadDataBody';

import {
  setSelectedSession,
  toggleUploadDataModal
} from 'store/uploadData/actions';
// import { toggleStatusWidget } from 'store/statusWidget/actions';
import { selectSelectedSession } from 'store/uploadData/selector';

// import store from 'store/index';
import useFloatingStatusWidgetState from 'app/hooks/useFloatingStatusWidgetState';

const UploadData = () => {
  const dispatch = useDispatch();

  const [state, customDispatch, { toggleStatusWidget }] =
    useFloatingStatusWidgetState(true);

  const [sessionUploadCount, setSessionUploadCount] = useState(0);

  const selectedSession = useSelector(selectSelectedSession);

  const onClose = useCallback(() => {
    // const {
    //   statusWidget: { uploadFolders, isWidgetOpen }
    // } = store.getState();

    const { uploadFolders, isWidgetOpen } = state;

    if (Object.keys(uploadFolders).length && !isWidgetOpen) {
      customDispatch(toggleStatusWidget());
    }

    if (selectedSession) {
      dispatch(setSelectedSession(null));
    }

    dispatch(toggleUploadDataModal());
  }, [selectedSession, state]);

  const actionBtns = useMemo(
    () => [{ text: 'Minimise', onClick: onClose }],
    [state]
  );

  const disabled = sessionUploadCount > 0;

  return (
    <SideDrawer
      id='data_lib_upload_drawer'
      open
      headerProps={{ text: 'Upload Data', onClick: onClose, disabled }}
      footerProps={{
        text: 'Minimise this window by clicking on the button below. Upload will happen in the background. You can check the status of uploaded images in Data Library',
        actionBtns,
        disabled
      }}
    >
      <UploadDataBody
        selectedSession={selectedSession}
        sessionUploadCount={sessionUploadCount}
        setSessionUploadCount={setSessionUploadCount}
      />
    </SideDrawer>
  );
};

export default memo(UploadData);
