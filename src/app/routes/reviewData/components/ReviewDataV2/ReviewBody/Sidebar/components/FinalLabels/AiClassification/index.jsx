import Label from 'app/components/Label';
import RegionLabel from 'app/components/RegionLabel';
import Show from 'app/hoc/Show';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import store from 'store/index';
import { handleUserClassificationChange } from 'store/reviewData/actions';
import {
  selectActiveFileSet,
  selectAiClassification,
  selectModelVisibilityObj,
  selectUseAiAssistance
} from 'store/reviewData/selector';

import classes from './AiClassification.module.scss';

const mapReviewState = createStructuredSelector({
  modelClasification: selectAiClassification,
  modelVisibilityObj: selectModelVisibilityObj,
  fileSet: selectActiveFileSet,
  useAiAssitance: selectUseAiAssistance
});

const getReviewState = state => {
  return state.review;
};

const AiClassificationContainer = ({ useCase }) => {
  const { annotationType } = useParams();
  const { modelClasification, modelVisibilityObj, fileSet, useAiAssitance } =
    useSelector(mapReviewState);

  const handleAiCheckClick = defects => {
    if (defects.length) {
      handleUserClassificationChange(defects, annotationType);
    }
  };

  const handleCheckClick = defect => {
    const { userClassification } = getReviewState(store.getState());
    if (useCase.classification_type === 'MULTI_LABEL') {
      handleAiCheckClick([
        ...(userClassification.data[fileSet.id]?.defects || []),
        ...defect.tags
      ]);
    } else {
      handleAiCheckClick(defect.tags);
    }
  };

  if (!useAiAssitance) return null;

  return Object.keys(modelClasification)
    .filter(x => modelVisibilityObj[x])
    .map(key => {
      const tags = modelClasification[key];

      return (
        <Show when={tags.length > 0} key={key}>
          <div className={classes.aiClassification}>
            <Label label='AI Prediction' fontWeight={600} />

            <div className={classes.aiDefectBox}>
              <RegionLabel
                allowedTags={[]}
                onOpen={() => {}}
                onChange={() => {}}
                onClose={() => {}}
                onDelete={() => {}}
                onCheck={handleCheckClick}
                editing={false}
                region={{
                  tags
                }}
                isAiRegion
              />
            </div>
          </div>
        </Show>
      );
    });
};

export default AiClassificationContainer;
