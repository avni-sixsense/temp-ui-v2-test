import api from 'app/api';
import { getUseCases } from 'app/api/Usecase';
import SideDrawerBody from 'app/components/SideDrawerBody';
import SideDrawerBodyForms from 'app/components/SideDrawerBody/SideDrawerBodyForms';
import SSProgress from 'app/components/SSProgress';
import Show from 'app/hoc/Show';
import useApi from 'app/hooks/useApi';
import UploadService from 'app/services/uploadService';
import queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { selectIsFilterLoading } from 'store/filter/selector';
import {
  selectInferenceSelectedSession,
  selectISDownloadAiDrawer
} from 'store/inferenceDrawer/selector';

import classes from './inference.module.scss';

const InferenceBody = ({ model, setModel, setIsLoading }) => {
  const { subscriptionId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const [progressSuccessComplete, setProgressSuccessComplete] = useState(false);

  const uploadService = useRef(null);

  const selectedSession = useSelector(selectInferenceSelectedSession);
  const isDownloadAiDrawer = useSelector(selectISDownloadAiDrawer);
  const isFilterLoading = useSelector(selectIsFilterLoading);
  const useCaseId = selectedSession?.[0]?.use_case;

  useEffect(() => {
    const ids = selectedSession.map(item => item.id);
    const params = queryString.stringify(
      { upload_session_id__in: ids },
      { arrayFormat: 'comma' }
    );

    uploadService.current = new UploadService(dispatch, subscriptionId);

    uploadService.current.params = params;
    uploadService.current.uploadSession = selectedSession?.[0];
  }, [selectedSession]);

  const { data: { results: models = [] } = [] } = useQuery(
    [
      'models',
      subscriptionId,
      true,
      undefined,
      `&use_case_id__in=${useCaseId}`
    ],
    context => api.getMlModels(...context.queryKey),
    {
      enabled: !!subscriptionId && !!useCaseId && !isFilterLoading
    }
  );

  const { data: useCases = {}, isLoading: isUsecaseLoading } = useApi(
    getUseCases,
    {
      subscription_id: subscriptionId,
      id__in: useCaseId,
      allowedKeys: []
    },
    {
      enabled: !!useCaseId && !isFilterLoading
    }
  );

  const { data: inferenceProgress = {} } = useQuery(
    [
      'fileInferenceQueueProgress',
      location.search,
      model?.id,
      selectedSession.map(x => x.id),
      !location.pathname.includes('/results')
    ],
    context => api.fileSetInferenceQueueProgressStatus(...context.queryKey),
    {
      enabled:
        progressSuccessComplete && !isDownloadAiDrawer && !isFilterLoading,
      refetchInterval: 5000
    }
  );

  useEffect(() => {
    if (
      Object.keys(inferenceProgress).length &&
      inferenceProgress.finished + inferenceProgress.failed ===
        inferenceProgress.total
    ) {
      setProgressSuccessComplete(false);
    }
  }, [inferenceProgress]);

  const handleStartInferencing = async () => {
    if (model) {
      setIsLoading(true);
      const { inferenceQueue } = uploadService.current;
      await inferenceQueue([model.id]);
      setProgressSuccessComplete(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
    // setShowDialog(true)
  };

  const getInferencePercentage = value => {
    if (Object.keys(value).length && value.total !== 0) {
      return parseInt(
        ((value.finished + value.failed) / value.total) * 100,
        10
      );
    }
    return 0;
  };

  const inferenceActionBtns = [
    {
      name: 'Inference',
      onClick: handleStartInferencing,
      disabled: Object.keys(inferenceProgress).length > 0
    }
  ];

  return (
    <SideDrawerBody>
      <SideDrawerBodyForms
        fields={[
          {
            id: 'use-case',
            type: 'select',
            label: 'Use Case',
            selected: useCases?.results?.[0] || {},
            models: useCases?.results || [],
            placeholder: 'Select use case',
            onChange: () => {},
            disabled: true,
            isLoading: isUsecaseLoading
          },
          {
            id: 'model',
            type: 'select',
            label: 'Select Model',
            onChange: setModel,
            placeholder: 'Select Model Name',
            selected: model,
            models
          }
        ]}
        actionBtns={isDownloadAiDrawer ? [] : inferenceActionBtns}
      />
      <Show
        when={Object.keys(inferenceProgress).length > 0 && !isDownloadAiDrawer}
      >
        <SSProgress value={getInferencePercentage(inferenceProgress)} />
        <div className={classes.inferenceValueContainer}>
          <div className={classes.valueContainer}>
            <div>Total</div>
            <div>{inferenceProgress?.total || 0}</div>
          </div>

          <div className={classes.valueContainer}>
            <div>Inference Successfully</div>
            <div>{inferenceProgress?.finished || 0}</div>
          </div>

          <div className={classes.valueContainer}>
            <div>Inference Failed</div>
            <div>{inferenceProgress?.failed || 0}</div>
          </div>
        </div>
      </Show>
    </SideDrawerBody>
  );
};

export default InferenceBody;
