import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SearchBar from 'app/components/SearchBar/searchBar';

import api from 'app/api';

import classes from './ModelDetails.module.scss';

const useStyles = makeStyles(theme => ({
  textField: {
    backgroundColor: theme.colors.grey[0],

    '& input': {
      color: theme.colors.grey[18],
      fontWeight: 500,
      fontSize: 14,
      paddingLeft: 6
    }
  },
  textFieldBorder: {
    '& div:hover fieldset, .Mui-focused fieldset': {
      border: `0.2px solid ${theme.colors.grey[5]} !important`,
      boxShadow: '0px 0px 10px rgba(37, 99, 235, 0.1), 0px 0px 1px #BBD2F1'
    }
  },
  textFieldErrorBorder: {
    '& fieldset': {
      border: `0.2px solid ${theme.colors.red[600]}`,
      boxShadow: theme.colors.shadow.sm
    },
    '& div:hover fieldset, .Mui-focused fieldset': {
      border: `0.2px solid ${theme.colors.red[600]} !important`,
      boxShadow: theme.colors.shadow.sm
    }
  }
}));

const ENTER_NEW_MODEL_NAME = 'Enter New Model Name';
const SELECT_USE_CASE = 'Select Use Case';
const SELECT_BASE_MODEL = 'Select Base Model';

const USE_CASE_PARAMS = {
  SINGLE_LABEL_CLASSIFICATION: 'SINGLE_LABEL_CLASSIFICATION',
  MULTI_LABEL_CLASSIFICATION_AND_DETECTION: 'CLASSIFICATION_AND_DETECTION',
  MULTI_LABEL_CLASSIFICATION: 'MULTI_LABEL_CLASSIFICATION',
  MULTI_LABEL_DETECTION: 'CLASSIFICATION_AND_DETECTION'
};

const TOOLTIP_TITLE =
  'Base model is depended on the use case type selected. Select use case to enable the base model field.';

const ModelDetails = ({ modelDetails, setModelDetails }) => {
  const textFileStyles = useStyles();

  const { subscriptionId } = useParams();

  const [useCaseList, setUseCaseList] = useState({
    isLoading: true,
    results: []
  });
  const [baseModelList, setBaseModelList] = useState({
    isLoading: true,
    results: []
  });

  const isDropdownDisabled = !window.location.pathname.includes('create');

  useEffect(() => {
    if (!isDropdownDisabled) {
      api
        .useCase('', undefined, undefined, subscriptionId, '', true)
        .then(res =>
          setUseCaseList(d => ({
            ...d,
            isLoading: false,
            results: res.results
          }))
        );
    }
  }, []);

  useEffect(() => {
    if (!isDropdownDisabled) {
      if (modelDetails.baseModel.length) {
        setModelDetails(d => ({ ...d, baseModel: [] }));
        setBaseModelList(d => ({
          ...d,
          isLoading: modelDetails.useCase.length > 0,
          results: []
        }));
      }

      if (modelDetails.useCase.length > 0) {
        const currentUseCase = modelDetails.useCase[0];
        const useCaseKey =
          USE_CASE_PARAMS[
            `${currentUseCase.classification_type}_${currentUseCase.type}`
          ];

        if (useCaseKey) {
          api.getBaseMlModel('', useCaseKey).then(res =>
            setBaseModelList(d => ({
              ...d,
              isLoading: false,
              results: res.results
            }))
          );
        }
      }
    }
  }, [modelDetails.useCase]);

  const handleDropdownValueChange = name => value => {
    if (Object.keys(value).length) {
      setModelDetails(d => ({ ...d, [name]: [value] }));
    } else {
      setModelDetails(d => ({ ...d, [name]: [] }));
    }
  };

  return (
    <div className={classes.container}>
      <div>
        <div>{ENTER_NEW_MODEL_NAME}</div>
        <div>
          <TextField
            className={clsx(textFileStyles.textField, {
              [textFileStyles.textFieldBorder]: !modelDetails.modelName.error,
              [textFileStyles.textFieldErrorBorder]:
                modelDetails.modelName.error
            })}
            fullWidth
            size='small'
            variant='outlined'
            value={modelDetails.modelName.value}
            onChange={event =>
              setModelDetails(d => ({
                ...d,
                modelName: { value: event.target.value, error: false }
              }))
            }
          />
        </div>
      </div>

      <div>
        <div>{SELECT_USE_CASE}</div>
        <div>
          <SearchBar
            fullWidth
            disabled={isDropdownDisabled}
            data={useCaseList.results}
            value={modelDetails.useCase}
            setValue={handleDropdownValueChange('useCase')}
            multiple={false}
            variant='outlined'
            placeholder={SELECT_USE_CASE}
            isLoading={useCaseList.isLoading}
          />
        </div>
      </div>

      <div className={classes.separation}>
        <div>{SELECT_BASE_MODEL}</div>
        <div>
          <SearchBar
            fullWidth
            disabled={isDropdownDisabled || !baseModelList.results.length}
            data={baseModelList.results}
            value={modelDetails.baseModel}
            setValue={handleDropdownValueChange('baseModel')}
            multiple={false}
            variant='outlined'
            placeholder={SELECT_BASE_MODEL}
            isLoading={baseModelList.isLoading}
            tooltipTitle={isDropdownDisabled ? false : TOOLTIP_TITLE}
          />
        </div>
      </div>
    </div>
  );
};

export default ModelDetails;
