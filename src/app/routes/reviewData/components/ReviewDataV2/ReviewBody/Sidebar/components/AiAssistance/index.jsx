import api from 'app/api';
import Label from 'app/components/Label';
import Show from 'app/hoc/Show';
import { isModelExist } from 'app/utils/reviewData';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import {
  getDefect,
  setAppliedForAllModelId,
  setReviewModelsDict,
  setSelectedTool,
  setModelVisibilityObj
} from 'store/reviewData/actions';
import { Review } from 'store/reviewData/constants';
import {
  selectReviewData,
  selectCurrentModelId,
  selectModelVisibilityObj,
  selectUseAiAssistance
} from 'store/reviewData/selector';

import classes from './AiAssistance.module.scss';
import AiModelSelector from './AiModelSelector';
import ModelListContainer from './ModelList';
import UseAiAssistanceContainer from './UseAiAssistance';

const mapReviewState = createStructuredSelector({
  currentModelId: selectCurrentModelId,
  modelVisibilityObj: selectModelVisibilityObj,
  fileSets: selectReviewData,
  useAiAssistance: selectUseAiAssistance
});

const AiAssistanceContainer = () => {
  const dispatch = useDispatch();
  const { annotationType } = useParams();

  const { currentModelId, modelVisibilityObj, fileSets, useAiAssistance } =
    useSelector(mapReviewState);

  useEffect(() => {
    if (currentModelId && !isModelExist(currentModelId)) {
      api.getMlModelByid(currentModelId).then(res => {
        dispatch(setReviewModelsDict(res));
      });
    }
  }, [currentModelId]);

  const onChange = newModel => {
    if (!newModel || !Object.keys(newModel).length) {
      dispatch(setSelectedTool('select'));
    }
    // dispatch(clearAiDefects({}))
    if (Object.keys(newModel).length) {
      dispatch(setReviewModelsDict(newModel));
      if (!modelVisibilityObj[newModel.id]) {
        dispatch(
          setModelVisibilityObj({
            ...modelVisibilityObj,
            [newModel.id]: true
          })
        );
      }
    } else {
      dispatch(setModelVisibilityObj({}));
    }
  };

  const handleApplyModelForAll = model => {
    dispatch(setAppliedForAllModelId(model.id));
  };

  const handleAIAssitanceSubmit = data => {
    const newModel = data[0];
    if (Object.keys(newModel).length) {
      // handleStartInferencing()
      onChange(newModel);
      handleApplyModelForAll(newModel);
      dispatch(
        getDefect(
          fileSets.map(x => x.fileSetId),
          newModel?.id
        )
      );
    }
  };

  return (
    <div className={classes.root}>
      <UseAiAssistanceContainer onChange={onChange} />

      <Show when={useAiAssistance && annotationType === Review}>
        <AiModelSelector onSubmit={handleAIAssitanceSubmit} />
      </Show>

      <Show when={useAiAssistance && currentModelId}>
        <ModelListContainer />
      </Show>

      <Show
        when={useAiAssistance && annotationType !== Review && !currentModelId}
      >
        <Label label='No auto model available.' />
      </Show>
    </div>
  );
};

export default AiAssistanceContainer;
