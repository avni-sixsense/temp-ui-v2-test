import UploadDataService from 'app/services/uploadDataService';

const state = {};
let currentSessionId = null;

const addFilesToState = ({ session, files }) => {
  if (!state[session.id]) {
    state[session.id] = {
      session,
      uploadService: new UploadDataService(),
      totalFiles: 0,
      files
    };
  }
};

const handleFilesUpload = sessionId => {
  if (sessionId) {
    const { uploadService, files, session } = state[sessionId];
    const { uppyCurrent } = uploadService;

    let filesToUpload = [];

    for (const file of files) {
      if (!(file instanceof Error)) {
        filesToUpload.push({
          name: file.name,
          data: file,
          meta: {
            upload_session: sessionId,
            sessionId: sessionId,
            subscription: session.subscription
          }
        });
      }
    }

    state[sessionId].totalFiles = filesToUpload.length;
    delete state[sessionId].files;

    uppyCurrent.addFiles(filesToUpload);
    filesToUpload = null;

    watchUppyProgress(uploadService, session);
    uppyCurrent.upload();
  }
};

const handleFileRetry = ({ sessionId }) => {
  const { uploadService } = state[sessionId];

  watchUppyProgress(uploadService, state[sessionId].session);
  uploadService.uppyCurrent.retryAll();
};

const startFilesUpload = ({ sessionId }) => {
  if (!currentSessionId && sessionId && state[sessionId]?.files) {
    currentSessionId = sessionId;
    return handleFilesUpload(sessionId);
  }
};

const watchUppyProgress = (uploadService, session) => {
  const { uppyCurrent } = uploadService;

  uppyCurrent.on('progress', d => {
    if (d) {
      postMessage({
        type: 'SET_PROGRESS',
        payload: { sessionId: session.id, percentage: d }
      });
    }
  });

  uppyCurrent.once('complete', ({ successful, failed }) => {
    if (!failed.length) {
      uppyCurrent.close('unmount');
      delete state[session.id];

      postMessage({
        type: 'UPLOAD_COMPLETE',
        payload: {
          session: JSON.stringify(session),
          successful: successful.length
        }
      });
    } else {
      postMessage({
        type: 'FAILED_UPLOADS',
        payload: {
          session: JSON.stringify(session),
          failed: failed.length,
          successful: successful.length
        }
      });
    }

    currentSessionId = null;
  });
};

onmessage = ({ data }) => {
  switch (data.type) {
    case 'ADD_FILES_TO_STATE':
      addFilesToState(data.payload);
      break;

    case 'START_FILES_UPLOAD':
      startFilesUpload(data.payload);
      break;

    case 'RETRY_FILE_UPLOAD':
      handleFileRetry(data.payload);
      break;

    default:
      throw new Error('Invalid request type');
  }
};
