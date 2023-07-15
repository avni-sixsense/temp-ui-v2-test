import { useRef, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// import { createStructuredSelector } from 'reselect';
import { toast } from 'react-toastify';

import SSProgress from 'app/components/SSProgress';
import useUploadDataWorker from 'app/hooks/useUploadDataWorker';
import api from 'app/api';
// import {
//   addUploadFolder,
//   setFolderRetry,
//   setFolderUploadId
// } from 'store/statusWidget/actions';
// import {
//   selectUploadFolders,
//   selectUploadIds
// } from 'store/statusWidget/selector';
import useFloatingStatusWidgetState from 'app/hooks/useFloatingStatusWidgetState';

// const mapFolderUploadState = createStructuredSelector({
//   uploadIds: selectUploadIds,
//   uploadFolders: selectUploadFolders
// });

const FolderUpload = ({
  folderName,
  files,
  useCase,
  selectedSession,
  sessionUploadCount,
  setSessionUploadCount,
  isFoldersNameExists,
  setIsFoldersNameExists,
  isAutoRenameFolder,
  retry,
  setRetry
}) => {
  const [session, setSession] = useState(selectedSession);
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(0);

  // const { uploadIds, uploadFolders } = useSelector(mapFolderUploadState);

  const timeoutRef = useRef(null);

  const { subscriptionId } = useParams();

  // const dispatch = useDispatch();

  const { onAddFilesToState, onFileUploadStart, onFileRetry } =
    useUploadDataWorker({ onProgress: setProgress, useCase });

  const [
    state,
    customDispatch,
    { addUploadFolder, setFolderRetry, setFolderUploadId }
  ] = useFloatingStatusWidgetState(true);

  const { uploadIds, uploadFolders } = state;

  const getSesionId = async () => {
    try {
      setSessionUploadCount(d => d + 1);
      if (isError) setIsError(false);

      const isAutoRename = isFoldersNameExists ? 'false' : isAutoRenameFolder;

      const payload = {
        name: folderName,
        subscription: subscriptionId,
        use_case: useCase.id
      };

      const res = await api.getSessionId(payload, isAutoRename);

      setSession(res.data);
    } catch (err) {
      if (isFoldersNameExists) setIsFoldersNameExists(false);
      if (!retry) setRetry(true);

      setIsError(true);

      toast.error(err?.response?.data?.name?.[0]);
    } finally {
      clearTimeout(timeoutRef.current);
      setSessionUploadCount(d => d - 1);
    }
  };

  useEffect(() => {
    if (!session && isAutoRenameFolder !== 'false') {
      timeoutRef.current = setTimeout(getSesionId);
    }
  }, [retry]);

  const onRetry = useCallback(() => {
    customDispatch(setFolderRetry(session.id));
  }, [session]);

  useEffect(() => {
    if (session) {
      onAddFilesToState(session, files);
      customDispatch(addUploadFolder({ session }));
      customDispatch(setFolderUploadId(session.id));
    }
  }, [session]);

  useEffect(() => {
    if (
      !sessionUploadCount &&
      session &&
      uploadIds[uploadIds.length - 1] === session.id
    ) {
      timeoutRef.current = setTimeout(() => {
        if (uploadFolders[session.id].isRetry) {
          return onFileRetry(session);
        } else {
          return onFileUploadStart(session);
        }
      });
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [session, sessionUploadCount, uploadIds]);

  return (
    <SSProgress
      label={session?.name ?? folderName}
      value={progress}
      isError={isError}
      onRetry={onRetry}
      isUploadFailed={uploadFolders[session?.id]?.isError}
    />
  );
};

export default FolderUpload;
