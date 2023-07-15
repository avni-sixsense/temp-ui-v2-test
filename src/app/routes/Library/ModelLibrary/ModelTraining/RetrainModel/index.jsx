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

const RetrainModel = () => {
  const { subscriptionId, packId, oldModelId } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [modelDetails, setModelDetails] = useState({
    modelName: { value: '', error: false },
    useCase: [],
    baseModel: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const { data: oldModelData = {}, isLoading: isNewModelLoading } = useQuery(
    [oldModelId],
    context => api.getMlModelByid(...context.queryKey)
  );

  const { data: useCase, isLoading: isUseCaseLoading } = useQuery(
    [oldModelData.use_case],
    context => api.getUsecaseById(...context.queryKey),
    { enabled: !!oldModelData.use_case }
  );

  useEffect(() => {
    if (oldModelData.id) {
      setModelDetails(d => ({ ...d, baseModel: [oldModelData] }));
    }
  }, [oldModelData.id]);

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

      const payload = {
        old_ml_model: oldModelId,
        new_ml_model_name: modelName.value
      };

      const res = await api.createTrainingSession(payload);

      const newModel = convertTrainingSessionResToNewModel(res);
      dispatch(setNewModel(newModel));

      const params = queryString.stringify({
        [SEARCH_FILTER_PARAMS_KEYS.CONTEXTUAL_FILTERS]: encodeURL({
          date: DATE_RANGE_KEYS.ALL_DATE_RANGE
        })
      });

      navigate(
        `/${subscriptionId}/${packId}/library/model/training-data/${newModel.training_session}?${params}`,
        { replace: true }
      );
    } catch ({ response = {} }) {
      const { data } = response;

      if (response?.status === 400) {
        toast.error(data?.name?.[0] || '');

        setModelDetails(d => ({ ...d, modelName: { value: '', error: true } }));
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isPageLoading = isUseCaseLoading || isNewModelLoading || isLoading;

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

export default RetrainModel;
