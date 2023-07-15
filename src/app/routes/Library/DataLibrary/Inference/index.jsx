import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import SideDrawer from 'app/components/SideDrawer';
import { encodeURL } from 'app/utils/helpers';
import queryString from 'query-string';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  setIsDownloadAiDrawer,
  setSelectedInferenceSession,
  toggleInferenceModal
} from 'store/inferenceDrawer/actions';
import {
  selectInferenceSelectedSession,
  selectISDownloadAiDrawer
} from 'store/inferenceDrawer/selector';
import { setUploadSession } from 'store/reviewData/actions';

import InferenceBody from './components/inferenceBody';

const Inference = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionId, packId } = useParams();

  const selectedSession = useSelector(selectInferenceSelectedSession);
  const isDownloadAiDrawer = useSelector(selectISDownloadAiDrawer);

  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    dispatch(toggleInferenceModal());
    dispatch(setSelectedInferenceSession([]));
    setModel(null);
    dispatch(setIsDownloadAiDrawer(false));
  };

  const handleReviewClick = () => {
    const folderIds = selectedSession.map(item => item.id);

    const params = queryString.stringify({
      contextual_filters: encodeURL({ upload_session_id__in: folderIds })
    });

    dispatch(setUploadSession(params));
    onClose();

    navigate(`/${subscriptionId}/${packId}/annotation/review?${params}`, {
      state: {
        path: location.pathname,
        params: location.search
      }
    });
  };

  const handleDownloadClick = () => {
    if (model) {
      dispatch({ type: 'SET_ALL_UPLOAD_DOWNLOADING', status: true });
      const sessions = selectedSession.map(session => session.id).join(',');
      api
        .predictionCsv(sessions, model.id)
        .then(_ => {
          const filename =
            _.headers['content-disposition'].split('file_name=')[1];
          const a = window.document.createElement('a');
          a.href = `data:text/csv;charset=utf-8,${encodeURI(_.data)}`;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          dispatch({ type: 'RESET' });
        })
        .finally(() => {
          dispatch({ type: 'SET_ALL_UPLOAD_DOWNLOADING', status: false });
          dispatch({ type: 'SET_ALL_UPLOAD_DOWNLOAD_BTN', status: false });
        });
    }
  };

  const actionBtns = useMemo(
    () => [
      { text: 'Close', onClick: onClose },
      { text: 'Review Results', onClick: handleReviewClick }
    ],
    [selectedSession]
  );

  const downloadAIActionBtns = useMemo(
    () => [
      { text: 'Close', onClick: onClose },
      { text: 'Download', onClick: handleDownloadClick }
    ],
    [selectedSession, model]
  );

  return (
    <SideDrawer
      id='data_lib_upload_drawer'
      open
      headerProps={{ text: 'Inference Data', onClick: onClose }}
      footerProps={{
        text: 'Close this window by clicking on the button below. Inference will happen in the background.',
        actionBtns: isDownloadAiDrawer ? downloadAIActionBtns : actionBtns
      }}
    >
      <InferenceBody
        model={model}
        setModel={setModel}
        setIsLoading={setIsLoading}
      />
      <CommonBackdrop open={isLoading} />
    </SideDrawer>
  );
};

export default Inference;
