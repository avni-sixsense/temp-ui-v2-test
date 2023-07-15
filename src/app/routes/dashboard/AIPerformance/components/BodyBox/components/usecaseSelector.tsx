import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { getUseCases } from 'app/api/Usecase';
import type {
  Usecase,
  UsecaseFetchAll,
  UsecaseResponse
} from 'app/api/Usecase/types';
import SearchBar from 'app/components/SearchBar/searchBar';
import useApi from 'app/hooks/useApi';
import { getParamsObjFromEncodedString } from 'app/utils/helpers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  setConfusionModel,
  setConfusionUsecase
} from 'store/aiPerformance/actions';

const useStyles = makeStyles((theme: any) => ({
  popupText: {
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.colors.grey[22]
  },
  visibilityHandlePaper: {
    backgroundColor: theme.colors.grey[0]
  }
}));

const UsecaseSelector = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const { subscriptionId } = useParams();
  const [filteredUseCases, setFilteredUsecases] = useState<Array<Usecase>>([]);
  const { confusionUsecase }: { confusionUsecase: Usecase } = useSelector(
    ({ aiPerformance }: { aiPerformance: any }) => aiPerformance
  );

  const { data: useCases, isLoading: isUsecaseLoading } = useApi<
    UsecaseFetchAll,
    UsecaseResponse<Usecase>
  >(getUseCases, {
    subscription_id: subscriptionId!,
    get_all_records: true,
    allowedKeys: []
  });

  useEffect(() => {
    if (sessionStorage.getItem('confusionUsecase') && filteredUseCases.length) {
      const tempUsecaseId = sessionStorage.getItem('confusionUsecase');
      const tempUseCase = filteredUseCases.filter(
        x => x.id === parseInt(tempUsecaseId || '0', 10)
      );
      if (tempUseCase.length) {
        dispatch(setConfusionUsecase(tempUseCase[0] || {}));
        dispatch(setConfusionModel({}));
      }
    } else {
      dispatch(setConfusionModel({}));
      dispatch(setConfusionUsecase({}));
    }
  }, [filteredUseCases]);

  useEffect(() => {
    const params = getParamsObjFromEncodedString(location.search);

    if (
      useCases &&
      params?.use_case_id__in &&
      !Array.isArray(params?.use_case_id__in) &&
      useCases.count
    ) {
      const isSingleLabelClassification = useCases.results.filter(
        usecase =>
          usecase.id === params.use_case_id__in &&
          usecase.classification_type === 'SINGLE_LABEL' &&
          usecase.type === 'CLASSIFICATION'
      );
      if (isSingleLabelClassification.length) {
        setFilteredUsecases(isSingleLabelClassification);
        dispatch(setConfusionUsecase(isSingleLabelClassification[0]));
        dispatch(setConfusionModel({}));
        sessionStorage.setItem(
          'confusionUsecase',
          String(isSingleLabelClassification[0].id)
        );
      } else {
        dispatch(setConfusionUsecase({}));
        dispatch(setConfusionModel({}));
        setFilteredUsecases([]);
        sessionStorage.removeItem('confusionUsecase');
      }
    } else if (
      params?.use_case_id__in &&
      Array.isArray(params?.use_case_id__in) &&
      useCases?.count
    ) {
      setFilteredUsecases(
        useCases.results.filter(
          usecase =>
            params.use_case_id__in.includes(usecase.id) &&
            usecase.classification_type === 'SINGLE_LABEL' &&
            usecase.type === 'CLASSIFICATION'
        )
      );
      if (!params.use_case_id__in.includes(confusionUsecase?.id)) {
        dispatch(setConfusionUsecase({}));
        dispatch(setConfusionModel({}));
        sessionStorage.removeItem('confusionUsecase');
      }
    } else if (!params?.use_case_id__in && useCases?.count) {
      setFilteredUsecases(
        useCases.results.filter(
          usecase =>
            usecase.classification_type === 'SINGLE_LABEL' &&
            usecase.type === 'CLASSIFICATION'
        )
      );
    }
    return () => {
      dispatch(setConfusionUsecase({}));
    };
  }, [location.search, useCases]);

  const handleUseCaseSelect = (value: Usecase) => {
    if (Object.keys(value).length) {
      dispatch(setConfusionUsecase(value));
      dispatch(setConfusionModel({}));
      sessionStorage.setItem('confusionUsecase', String(value.id));
    } else {
      dispatch(setConfusionUsecase({}));
      dispatch(setConfusionModel({}));
      sessionStorage.removeItem('confusionUsecase');
    }
  };

  return (
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
        {filteredUseCases.length > 0 && (
          <Box pl={1} mr={1.5}>
            <Typography className={classes.popupText}>
              Select a use case to see performance breakdown
            </Typography>
          </Box>
        )}
        {filteredUseCases.length ? (
          <Box pl={1.75}>
            <Box width='300px'>
              <SearchBar
                fullWidth
                data={filteredUseCases || []}
                isLoading={isUsecaseLoading}
                value={
                  Object.keys(confusionUsecase).length ? [confusionUsecase] : []
                }
                setValue={handleUseCaseSelect}
                multiple={false}
                variant='outlined'
                placeholder='Search Usecase'
              />
            </Box>
          </Box>
        ) : (
          <Box pl={1.75}>
            <Box mb={0.75}>
              <Typography className={classes.popupText}>
                selected usecases in the filters don’t have any single label
                classification use cases
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default UsecaseSelector;
