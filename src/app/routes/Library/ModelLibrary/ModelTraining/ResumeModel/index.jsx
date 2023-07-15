import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import queryString from 'query-string';

import api from 'app/api';

import ModelTrainingLayout from '../components/Layout';
import ModelDetails from '../components/ModelDetails';

import { convertTrainingSessionResToNewModel } from 'app/utils/modelTraining';
import { setModelUseCase, setNewModel } from 'store/modelTraining/actions';

import { encodeURL } from 'app/utils/helpers';
import { SEARCH_FILTER_PARAMS_KEYS } from 'app/constants/searchParams';
import { DATE_RANGE_KEYS } from 'app/constants/filters';

const ResumeModel = () => {
  const { subscriptionId, packId, trainingSessionId } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [modelDetails, setModelDetails] = useState({
    modelName: { value: '', error: false },
    useCase: [],
    baseModel: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const { data = {}, isLoading: isTrainingSessionLoading } = useQuery(
    [trainingSessionId],
    context => api.getTrainingSession(...context.queryKey)
  );

  const { data: newModelData = {}, isLoading: isNewModelLoading } = useQuery(
    [data.new_ml_model],
    context => api.getMlModelByid(...context.queryKey),
    { enabled: !!data.new_ml_model }
  );

  const prevModelApiFn = data.base_ml_model
    ? api.getBaseMlModelById
    : api.getMlModelByid;

  const prevModelId = data.base_ml_model ?? data.old_ml_model;

  const { data: prevModelData, isLoading: isPrevModelDataLoading } = useQuery(
    [prevModelId],
    context => prevModelApiFn(...context.queryKey),
    { enabled: !!prevModelId }
  );

  const { data: useCase, isLoading: isUseCaseLoading } = useQuery(
    [newModelData.use_case],
    context => api.getUsecaseById(...context.queryKey),
    { enabled: !!newModelData.use_case }
  );

  useEffect(() => {
    if (newModelData.name) {
      setModelDetails(d => ({
        ...d,
        modelName: { value: newModelData.name, error: '' }
      }));
    }
  }, [newModelData.name]);

  useEffect(() => {
    if (prevModelData) {
      setModelDetails(d => ({ ...d, baseModel: [prevModelData] }));
    }
  }, [prevModelData]);

  useEffect(() => {
    if (useCase) {
      setModelDetails(d => ({ ...d, useCase: [useCase] }));
      dispatch(setModelUseCase(useCase));
    }
  }, [useCase]);

  useEffect(() => {
    const { modelName, useCase, baseModel } = modelDetails;

    if (!!(modelName.value.length && useCase.length && baseModel.length)) {
      if (isBtnDisabled) setIsBtnDisabled(false);
    } else {
      if (!isBtnDisabled) setIsBtnDisabled(true);
    }
  }, [modelDetails, isBtnDisabled]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const { modelName } = modelDetails;

      await api.updateTrainingModelName(newModelData.id, modelName.value);

      const newModel = convertTrainingSessionResToNewModel(data);
      dispatch(setNewModel(newModel));

      const params = queryString.stringify({
        [SEARCH_FILTER_PARAMS_KEYS.CONTEXTUAL_FILTERS]: encodeURL({
          date: DATE_RANGE_KEYS.ALL_DATE_RANGE
        })
      });

      navigate(
        `/${subscriptionId}/${packId}/library/model/training-data/${trainingSessionId}?${params}`
      );
    } catch ({ response = {} }) {
      const { data } = response;

      if (response?.status === 400) {
        toast.error(data?.name?.[0] || '');

        setModelDetails(d => ({
          ...d,
          modelName: { value: '', error: true }
        }));
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isPageLoading =
    isTrainingSessionLoading ||
    isUseCaseLoading ||
    isNewModelLoading ||
    isPrevModelDataLoading ||
    isLoading;

  return (
    <ModelTrainingLayout
      title='Model Details'
      isBtnDisabled={isBtnDisabled || modelDetails.modelName.error.length > 0}
      onClick={handleSubmit}
      isLoading={isPageLoading}
      btnText='Select Defect and Training Data'
    >
      <ModelDetails
        modelDetails={modelDetails}
        setModelDetails={setModelDetails}
      />
    </ModelTrainingLayout>
  );
};

export default ResumeModel;
