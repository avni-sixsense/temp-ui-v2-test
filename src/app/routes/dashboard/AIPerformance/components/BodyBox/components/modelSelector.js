import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SearchBar from 'app/components/SearchBar/searchBar';
import { getParamsObjFromEncodedString } from 'app/utils/helpers';
import { keyBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  setConfusionModel,
  setConfusionUsecase
} from 'store/aiPerformance/actions';
import { DefectDistribution } from '../../DefectDistribution';
import { UATDefectDistribution } from '../../DefectDistribution/UATDefectDistribution';

const useStyles = makeStyles(theme => ({
  popupText: {
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.colors.grey[22],
    marginRight: theme.spacing(1)
  },
  visibilityHandlePaper: {
    backgroundColor: theme.colors.grey[0]
  }
}));

const ModelSelector = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const [modelsList, setModelsList] = useState([]);
  const { confusionModel } = useSelector(({ aiPerformance }) => aiPerformance);
  const { models, modelsLoading: isLoading } = useSelector(
    ({ common }) => common
  );

  useEffect(() => {
    if (sessionStorage.getItem('confusionModel') && modelsList.length) {
      const tempModelId = sessionStorage.getItem('confusionModel');
      const tempModel = modelsList.filter(
        x => x.id === parseInt(tempModelId, 10)
      );
      if (tempModel.length) {
        dispatch(setConfusionModel(tempModel[0] || {}));
        dispatch(setConfusionUsecase({}));
      }
    } else if (!isLoading) {
      dispatch(setConfusionModel({}));
      dispatch(setConfusionUsecase({}));
    }
  }, [modelsList, isLoading]);

  const getUsecaseModel = () => {
    const params = getParamsObjFromEncodedString(location.search);
    const usecaseIds = params.use_case_id__in;
    return models.filter(
      model =>
        usecaseIds.includes(model.use_case) &&
        model.status === 'ready_for_deployment' &&
        model.classification_type === 'SINGLE_LABEL'
    );
  };

  const getModelById = id => {
    return models.filter(model => model.id === id)?.[0] || {};
  };

  const dispatchConfusionModel = model => {
    dispatch(setConfusionModel(model));
    dispatch(setConfusionUsecase({}));
    if (Object.keys(model).length) {
      sessionStorage.setItem('confusionModel', model.id);
    } else {
      sessionStorage.removeItem('confusionModel');
    }
  };

  useEffect(() => {
    const params = getParamsObjFromEncodedString(location.search);

    if (
      params.use_case_id__in &&
      Array.isArray(params.use_case_id__in) &&
      (models || []).length
    ) {
      const filteredModels = getUsecaseModel();
      const filteredModelsIds = Object.keys(keyBy(filteredModels, 'id'));
      if (filteredModels.length) {
        if (params.ml_model_id__in) {
          if (params.ml_model_id__in.length === 1) {
            const modelData = getModelById(params.ml_model_id__in[0]);
            if (
              modelData?.type === 'CLASSIFICATION' &&
              modelData?.classification_type === 'SINGLE_LABEL'
            ) {
              dispatchConfusionModel(modelData);
            } else {
              dispatchConfusionModel({});
            }
          } else if (
            !params.ml_model_id__in.includes(
              parseInt(sessionStorage.getItem('confusionModel'), 10)
            )
          ) {
            dispatchConfusionModel({});
          }

          setModelsList(
            filteredModels.filter(item =>
              params.ml_model_id__in.includes(item.id)
            )
          );
        } else {
          setModelsList(
            filteredModels.filter(
              item =>
                item.status === 'ready_for_deployment' &&
                item.classification_type === 'SINGLE_LABEL'
            )
          );
          if (
            !filteredModelsIds.includes(
              sessionStorage.getItem('confusionModel')
            )
          )
            dispatchConfusionModel({});
        }
      } else {
        dispatchConfusionModel({});
        setModelsList([]);
      }
    } else if (
      params.ml_model_id__in &&
      Array.isArray(params.ml_model_id__in) &&
      (models || []).length
    ) {
      setModelsList(
        models.filter(
          item =>
            item.status === 'ready_for_deployment' &&
            item.classification_type === 'SINGLE_LABEL' &&
            params.ml_model_id__in.includes(item.id)
        )
      );
      if (params.ml_model_id__in.length === 1) {
        const modelData = getModelById(params.ml_model_id__in[0]);
        if (
          modelData?.type === 'CLASSIFICATION' &&
          modelData?.classification_type === 'SINGLE_LABEL'
        ) {
          dispatchConfusionModel(modelData);
        } else {
          dispatchConfusionModel({});
        }
      } else if (
        !params.ml_model_id__in.includes(
          parseInt(sessionStorage.getItem('confusionModel'), 10)
        )
      ) {
        dispatchConfusionModel({});
      }
    } else if ((models || []).length) {
      const modelIds = Object.keys(keyBy(models, 'id'));
      if (!modelIds.includes(sessionStorage.getItem('confusionModel')))
        dispatchConfusionModel({});
      setModelsList(models);
    }
  }, [location.search, models]);

  const handleModelSelect = value => {
    if (Object.keys(value).length) {
      dispatch(setConfusionModel(value));
      dispatch(setConfusionUsecase({}));
      sessionStorage.setItem('confusionModel', value.id);
    } else {
      dispatch(setConfusionModel({}));
      dispatch(setConfusionUsecase({}));
      sessionStorage.removeItem('confusionModel');
    }
  };

  return (
    <>
      <Paper elevation={1} className={classes.visibilityHandlePaper}>
        <Box
          display='flex'
          alignItems='center'
          pt={2}
          pl={1.45}
          pr={7.875}
          pb={2}
          mb={2}
        >
          {modelsList.length === 0 && !isLoading && (
            <Box pl={1} mr={1.5}>
              <Typography className={classes.popupText}>
                Selected model is not ready for deployment or not the single
                label.
              </Typography>
            </Box>
          )}
          {modelsList.length > 0 && (
            <Box pl={1} mr={1.5}>
              <Typography className={classes.popupText}>
                Select a model to see performance breakdown
              </Typography>
            </Box>
          )}
          {modelsList.length > 0 && (
            <Box pl={1.75}>
              <Box width='300px'>
                <SearchBar
                  fullWidth
                  data={modelsList || []}
                  value={
                    Object.keys(confusionModel).length ? [confusionModel] : []
                  }
                  setValue={handleModelSelect}
                  multiple={false}
                  variant='outlined'
                  placeholder='Search Model'
                />
              </Box>
            </Box>
          )}
          {isLoading && (
            <Box display='flex' alignItems='center'>
              <Typography className={classes.popupText}>
                Loading Models
              </Typography>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Paper>
      {confusionModel?.id && (
        <DefectDistribution mlModelId={confusionModel.id}>
          <UATDefectDistribution mlModelId={confusionModel.id} />
        </DefectDistribution>
      )}
    </>
  );
};

export default ModelSelector;
