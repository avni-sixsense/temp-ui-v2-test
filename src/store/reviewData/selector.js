import {
  getAIConfidence,
  getAIDefects,
  getAIDefectsLabels,
  getAiDetectionRegions,
  getGTDefects,
  getGTDetectionRegions,
  NumberFormater
} from 'app/utils/helpers';
import { keyBy } from 'lodash';
import { createSelector } from 'reselect';

import { setIn } from 'seamless-immutable';

import { STORE_KEYS } from '../storeKeys';

const createAnnotatorInput = (fileSet, regions = []) => {
  const { id, src, name } = fileSet;
  return [
    {
      id,
      src,
      name,
      regions
    }
  ];
};

const isRegionsSame = (region1, region2) => {
  const { x: x1, y: y1, w: w1, h: h1 } = region1;
  const { x: x2, y: y2, w: w2, h: h2 } = region2;

  return x1 === x2 && y1 === y2 && w1 === w2 && h1 === h2;
};

const getConbinedDetectionData = (aiDetections = [], gtDetections = []) => {
  let updatedAiDetections = aiDetections;
  const updatedGTDetections = gtDetections.map(item => {
    let newGTTags = item;
    updatedAiDetections.forEach((aiItem, index) => {
      if (isRegionsSame(aiItem, item) && aiItem.visible) {
        // combine regions here and hide ai detection
        updatedAiDetections = setIn(updatedAiDetections, [index], {
          ...aiItem,
          visible: false
        });

        newGTTags = {
          ...item,
          tags: [
            ...aiItem.tags.map(aiTags => ({ ...aiTags, is_ai_tag: true })),
            ...item.tags
          ]
        };
      }
    });
    return newGTTags;
  });

  return [...updatedAiDetections, ...updatedGTDetections];
};

const selectReview = state => state[STORE_KEYS.REVIEW_DATA];

export const selectReviewData = createSelector(
  [selectReview],
  review => review.data
);

export const selectFetchingReviewData = createSelector(
  [selectReview],
  review => review.fetchingReviewData
);

export const selectFileSetCount = createSelector(
  [selectReview],
  review => review.fileSetCount
);

export const selectReviewDataNext = createSelector(
  [selectReview],
  review => review.next
);

export const selectGridModes = createSelector(
  [selectReview],
  review => review.gridModes
);

export const selectActiveGridMode = createSelector(
  [selectReview],
  review => review.activeGridMode
);

export const selectImageModes = createSelector(
  [selectReview],
  review => review.imageModes
);

export const selectActiveImageMode = createSelector(
  [selectReview],
  review => review.activeImageMode
);

export const selectSearchText = createSelector(
  [selectReview],
  review => review.searchText
);

export const selectActiveImg = createSelector(
  [selectReview],
  review => review.activeImg
);

export const selectFileSetId = createSelector(
  [selectActiveImg, selectReviewData],
  (activeImg, reviewData) => reviewData?.[activeImg[0]]?.fileSetId
);

export const selectFileSetDefects = createSelector(
  [selectReview],
  review => review.fileSetDefects
);

export const selectIsFileSetDefectsLoading = createSelector(
  [selectReview],
  review => review.isFileSetDefectsLoading
);

export const selectSelectedTool = createSelector(
  [selectReview],
  review => review.selectedTool
);

export const selectUseAiAssistance = createSelector(
  [selectReview],
  review => review.useAIAssistance
);

export const selectAppliedForAllModelId = createSelector(
  [selectReview],
  review => review.appliedForAllModelId
);

export const selectIsModelAppliedForAll = createSelector(
  [selectAppliedForAllModelId],
  appliedModelId => !!appliedModelId
);

export const selectModelVisibilityObj = createSelector(
  [selectReview],
  review => review.modelVisibilityObj
);

export const selectSorting = createSelector(
  [selectReview],
  review => review.sorting
);

export const selectSelectAll = createSelector(
  [selectReview],
  review => review.selectAll
);

export const selectModelDetectionList = createSelector(
  [selectReview],
  review => review.modelDetectionList
);

export const selectUserDetectionList = createSelector(
  [selectReview],
  review => review.userDetectionList
);

export const selectOtherDefects = createSelector(
  [selectReview],
  review => review.otherDefects
);

export const selectUserClassification = createSelector(
  [selectReview],
  review => review.userClassification
);

export const selectActiveFileSet = createSelector(
  [selectReviewData, selectActiveImg],
  (data, activeImg) => data[activeImg[0]] ?? {}
);

export const selectContainerMeta = createSelector(
  [selectReview],
  review => review.containerMeta
);

export const selectFirstFileSetDefects = createSelector(
  [selectFileSetDefects, selectReviewData],
  (fileSetDefects, fileSets) => fileSetDefects[fileSets[0]?.id] ?? {}
);

export const selectActiveFileSetDefects = createSelector(
  [selectFileSetDefects, selectActiveFileSet],
  (fileSetDefects, fileSets) => fileSetDefects[fileSets.id] ?? {}
);

export const selectActiveImageModeCount = createSelector(
  [selectReview, selectActiveImageMode],
  (review, activeMode) => {
    const active = keyBy(review.imageModes, 'label')[activeMode];
    return active?.subLabel || 0;
  }
);

export const selectAiClassification = createSelector(
  [selectActiveFileSetDefects],
  fileSetDefect => getAIDefects(fileSetDefect)
);

export const selectGTClassification = createSelector(
  [selectActiveFileSetDefects],
  fileSetDefect => getGTDefects(fileSetDefect)
);

export const selectIsNoDefectClassification = createSelector(
  [selectActiveFileSet, selectReview],
  (fileSet, { fileSetDefects }) => {
    return (
      fileSetDefects[fileSet.id]?.['gt_classifications']?.['is_no_defect'] ||
      false
    );
  }
);

export const selectFileSetByIndex = index =>
  createSelector([selectReviewData], reviewData => reviewData[index]);

export const selectIsSelectedByIndex = index =>
  createSelector(
    [selectActiveImg, selectSelectAll],
    (activeImg, selectAll) => selectAll || activeImg.includes(index)
  );

export const selectFileSetDefectsById = id =>
  createSelector([selectFileSetDefects], fileSetDefects => fileSetDefects[id]);

export const selectGTLabelsByFileSetDefectsId = id =>
  createSelector([selectFileSetDefects], fileSetDefects =>
    getGTDefects(fileSetDefects[id])
      .map(d => d.name)
      .join(', ')
  );

export const selectAILabelsByFileSetDefectsId = id =>
  createSelector([selectFileSetDefects], fileSetDefects =>
    getAIDefectsLabels(fileSetDefects[id]).join(', ')
  );

export const selectAILabelsConfidenceByFileSetDefectsId = id =>
  createSelector([selectFileSetDefects], fileSetDefects =>
    Number(getAIConfidence(fileSetDefects[id])[0] ?? 0).toFixed(2)
  );

export const selectIsMultiSelected = createSelector(
  [selectActiveImg],
  activeImg => activeImg.length > 1
);

export const selectFileSetDefectsLength = createSelector(
  [selectFileSetDefects],
  fileSetDefects => Object.keys(fileSetDefects).length
);

export const selectActiveFileSetUseCaseId = createSelector(
  [selectActiveFileSet],
  activeFileSet => activeFileSet.use_case
);

export const selectIsNoDefect = createSelector(
  [selectActiveFileSet, selectReview],
  (fileSet, { fileSetDefects }) =>
    fileSetDefects[fileSet.id]?.['gt_detections']?.['is_no_defect'] || false
);

export const selectIsNoDefectAI = createSelector(
  [selectActiveFileSet, selectReview],
  (fileSet, { fileSetDefects }) =>
    fileSetDefects[fileSet.id]?.['model_detections']?.[0]?.['is_no_defect'] ||
    false
);

export const selectDetectionRegions = createSelector(
  [selectActiveFileSet, selectReview],
  (fileSet, { fileSetDefects }) =>
    fileSetDefects[fileSet.id]?.['gt_detections']?.['detection_regions']
);

export const selectGTDetection = createSelector(
  [selectActiveFileSet, selectReview],
  (fileSet, { fileSetDefects }) =>
    fileSetDefects[fileSet.id]?.['gt_detections']?.['id']
);

export const selectAiDetections = createSelector(
  [selectActiveFileSetDefects, selectIsNoDefectAI],
  (fileSetDefects, isNoDefect) =>
    getAiDetectionRegions({ fileSetDefects, isNoDefect })
);

export const selectCurrentModelId = createSelector(
  [selectAppliedForAllModelId, selectAiClassification, selectAiDetections],
  (appliedForAllModelId, modelDefects, detectionModelDefects) => {
    const modelId =
      parseInt(Object.keys(modelDefects)[0], 10) ||
      parseInt(Object.keys(detectionModelDefects)[0], 10);
    return appliedForAllModelId || modelId || undefined;
  }
);

export const selectActiveModel = createSelector(
  [selectReview, selectCurrentModelId],
  (review, modelId) => review.modelsDict[modelId]
);

export const selectGTDetections = createSelector(
  [selectActiveFileSetDefects, selectIsNoDefect],
  (fileSetDefects, isNoDefect) =>
    getGTDetectionRegions({ fileSetDefects, isNoDefect })
);

export const selectActiveFileSetDetections = createSelector(
  [
    selectGTDetections,
    selectAiDetections,
    selectCurrentModelId,
    selectModelVisibilityObj,
    selectUseAiAssistance
  ],
  (gtDetections, aiDetections, modelId, modelOutputList, useAIAssistance) => {
    if (modelOutputList[modelId] && useAIAssistance) {
      return getConbinedDetectionData(
        aiDetections?.[modelId]?.detection_regions,
        gtDetections?.detection_regions
      );
    }
    return [...(gtDetections?.detection_regions || [])];
  }
);

export const selectAnnotatorInput = createSelector(
  [selectActiveFileSet, selectActiveFileSetDetections],
  (fileSet, regions) => createAnnotatorInput(fileSet, regions)
);

export const selectIsUserClassificationLoading = createSelector(
  [selectReview],
  review => review.isUserClassificationLoading
);

export const selectIsBulkClassificationUpdating = createSelector(
  [selectReview],
  review => review.isBulkClassificationUpdating
);

export const selectActiveFilesets = createSelector(
  [selectActiveImg, selectReviewData],
  (activeImg, data) => activeImg.map(item => data[item].files).flat()
);

export const selectCommonFileSetDefectId = createSelector(
  [selectActiveFilesets, selectFileSetDefects, selectSelectAll],
  (activeFileSets, fileSetDefects, selectAll) => {
    if (selectAll) return null;

    const activeFileSetDefects = [
      ...new Set(
        activeFileSets.map(item => getGTDefects(fileSetDefects[item.id])).flat()
      )
    ];
    if ([...new Set(activeFileSetDefects.map(item => item.id))].length === 1) {
      return activeFileSetDefects[0].id;
    }
    return null;
  }
);
