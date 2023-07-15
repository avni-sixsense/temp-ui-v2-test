import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import useWebWorker from './useWebWorker';

import { WORKER_IDS } from 'app/constants/workers';
import { updataAllUploadsDataById } from 'store/allUploads/actions';

import useFloatingStatusWidgetState from './useFloatingStatusWidgetState';
// import {
//   resetStatusWidget,
//   setFolderError,
//   setFolderUploadComplete
// } from 'store/statusWidget/actions';
// import useFloatingStatusWidgetState from './useFloatingStatusWidgetState';

let currentProps;

const useUploadDataWorker = props => {
  const worker = useWebWorker(
    WORKER_IDS.UPLOAD_DATA,
    () => new Worker(new URL('workers/uploadData', import.meta.url))
  );

  const dispatch = useDispatch();

  const [
    ,
    customDispatch,
    { toggleStatusWidget, setFolderUploadComplete, setFolderError }
  ] = useFloatingStatusWidgetState();

  const [sessionMeta, setSessionMeta] = useState(null);

  const onAddFilesToState = useCallback((session, files) => {
    worker.postMessage({
      type: 'ADD_FILES_TO_STATE',
      payload: { session, files }
    });
  }, []);

  const onFileUploadStart = useCallback(session => {
    if (props) currentProps = props;
    setSessionMeta(session);

    worker.postMessage({
      type: 'START_FILES_UPLOAD',
      payload: { sessionId: session.id }
    });
  }, []);

  const onFileRetry = useCallback(session => {
    setSessionMeta(session);

    worker.postMessage({
      type: 'RETRY_FILE_UPLOAD',
      payload: { sessionId: session.id }
    });
  }, []);

  const setProgress = useCallback(
    ({ sessionId, percentage }) => {
      if (currentProps?.onProgress && sessionMeta?.id === sessionId) {
        currentProps.onProgress(percentage);
      }
    },
    [sessionMeta]
  );

  const onUploadComplete = useCallback(({ session, successful }) => {
    session = JSON.parse(session);

    customDispatch(setFolderUploadComplete(session.id));

    const payload = {
      ...session,
      use_case_name: currentProps.useCase.name,
      use_case_type: currentProps.useCase.type,
      file_sets: (session.file_sets ?? 0) + successful,
      unlabelled_file_sets_count:
        (session.unlabelled_file_sets_count ?? 0) + successful,
      unreviewed_file_sets_count:
        (session.unreviewed_file_sets_count ?? 0) + successful
    };

    dispatch(updataAllUploadsDataById(payload));

    if (sessionMeta) setSessionMeta(null);
  }, []);

  const onUploadFail = useCallback(({ session, successful, failed }) => {
    session = JSON.parse(session);

    customDispatch(setFolderError(session.id));

    if (successful) {
      const payload = {
        ...session,
        use_case_name: currentProps.useCase.name,
        use_case_type: currentProps.useCase.type,
        file_sets: (session.file_sets ?? 0) + successful,
        unlabelled_file_sets_count:
          (session.unlabelled_file_sets_count ?? 0) + successful,
        unreviewed_file_sets_count:
          (session.unreviewed_file_sets_count ?? 0) + successful
      };

      dispatch(updataAllUploadsDataById(payload));
    }

    toast.error(`${failed} files failed to upload.`);

    if (sessionMeta) setSessionMeta(null);
  }, []);

  const onTerminate = useCallback(() => {
    worker.terminate();
    worker.invoke();
    customDispatch(toggleStatusWidget());
  }, []);

  useEffect(() => {
    worker.onmessage = ({ data }) => {
      switch (data.type) {
        case 'SET_PROGRESS':
          setProgress(data.payload);
          break;

        case 'UPLOAD_COMPLETE':
          onUploadComplete(data.payload);
          break;

        case 'FAILED_UPLOADS':
          onUploadFail(data.payload);
          break;

        default:
          throw new Error('Invalid request type');
      }
    };
  }, [sessionMeta]);

  return {
    onAddFilesToState,
    onFileUploadStart,
    onFileRetry,
    onTerminate
  };
};
export default useUploadDataWorker;
