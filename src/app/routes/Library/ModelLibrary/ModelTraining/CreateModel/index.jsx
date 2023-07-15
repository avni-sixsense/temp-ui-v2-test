import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import queryString from 'query-string';

import ModelTrainingLayout from '../components/Layout';
import ModelDetails from '../components/ModelDetails';

import api from 'app/api';

import { DATE_RANGE_KEYS } from 'app/constants/filters';
import { SEARCH_FILTER_PARAMS_KEYS } from 'app/constants/searchParams';
import { encodeURL } from 'app/utils/helpers';

import { setModelUseCase, setNewModel } from 'store/modelTraining/actions';
import { convertTrainingSessionResToNewModel } from 'app/utils/modelTraining';

const CreateModel = () => {
  const { subscriptionId, packId } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [modelDetails, setModelDetails] = useState({
    modelName: { value: '', error: false },
    useCase: [],
    baseModel: []
  });
  const [isLoading, setIsLoading] = useState(false);

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
      const { modelName, useCase, baseModel } = modelDetails;

      const currentUseCase = useCase[0];

      const payload = {
        base_ml_model: baseModel[0].id,
        new_ml_model_name: modelName.value,
        use_case: currentUseCase.id,
        subscription: subscriptionId
      };

      const res = await api.createTrainingSession(payload);

      const newModel = convertTrainingSessionResToNewModel(res);
      dispatch(setNewModel(newModel));
      dispatch(setModelUseCase(currentUseCase));

      const params = queryString.stringify({
        [SEARCH_FILTER_PARAMS_KEYS.CONTEXTUAL_FILTERS]: encodeURL({
          date: DATE_RANGE_KEYS.ALL_DATE_RANGE
        })
      });

      navigate(
        `/${subscriptionId}/${packId}/library/model/training-data/${newModel.training_session}?${params}`
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

  return (
    <ModelTrainingLayout
      title='Model Details'
      isBtnDisabled={isBtnDisabled}
      onClick={handleSubmit}
      isLoading={isLoading}
      btnText='Select Defect and Training Data'
    >
      <ModelDetails
        modelDetails={modelDetails}
        setModelDetails={setModelDetails}
      />
    </ModelTrainingLayout>
  );
};

export default CreateModel;
