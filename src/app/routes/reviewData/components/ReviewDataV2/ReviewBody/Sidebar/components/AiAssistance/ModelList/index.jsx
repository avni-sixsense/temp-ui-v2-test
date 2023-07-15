import api from 'app/api';
import { encodeURL } from 'app/utils/helpers';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import { getDefect, setModelVisibilityObj } from 'store/reviewData/actions';
import {
  selectActiveFileSet,
  selectActiveImg,
  selectActiveModel,
  selectReviewData,
  selectCurrentModelId,
  selectModelVisibilityObj,
  selectSelectAll
} from 'store/reviewData/selector';
import SearchComp from '../../SearchComp';

const mapReviewState = createStructuredSelector({
  modelVisibilityObj: selectModelVisibilityObj,
  activeImg: selectActiveImg,
  fileSet: selectActiveFileSet,
  fileSets: selectReviewData,
  currentModelId: selectCurrentModelId,
  activeModel: selectActiveModel,
  selectAll: selectSelectAll
});

const ModelListContainer = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {
    modelVisibilityObj,
    activeImg,
    fileSet,
    fileSets,
    currentModelId,
    activeModel,
    selectAll
  } = useSelector(mapReviewState);

  const [cacheTimeOut, setCacheTimeOut] = useState(100 * 60 * 3);

  const { data: inferenceStatus, isLoading } = useQuery(
    ['inferenceStatus', currentModelId, fileSet.file_set],
    context => api.getInferenceStatus(...context.queryKey),
    {
      enabled: !!(fileSet.file_set && currentModelId),
      refetchInterval: cacheTimeOut
    }
  );

  useEffect(() => {
    if (inferenceStatus) {
      const { results } = inferenceStatus;
      const status = results[0]?.status ?? '';

      if (status === 'PENDING' || status === 'PROCESSING') {
        setCacheTimeOut(100 * 10 * 2);
      } else if (status === 'FINISHED') {
        setCacheTimeOut(false);
        dispatch(getDefect([fileSet.fileSetId], currentModelId));
      } else if (status === 'FAILED') {
        setCacheTimeOut(false);
      }
    }
  }, [inferenceStatus, fileSet.fileSetId, currentModelId]);

  const { results = [] } = inferenceStatus ?? {};
  const showBtn = inferenceStatus
    ? inferenceStatus.results.length === 0
    : false;

  const handleModelEyeBtnClick = (models = []) => {
    const tempModelObj = { ...modelVisibilityObj };
    models.forEach(model => (tempModelObj[model.id] = model.visible));
    dispatch(setModelVisibilityObj(tempModelObj));

    // if (useCase?.type !== 'CLASSIFICATION') {
    // 	const modelDetectionRegion = []
    // 	modelDetectionList
    // 		.filter((region) => visibleModels.includes(region.ml_model.id))
    // 		.forEach((x) => {
    // 			modelDetectionRegion.push(...x.detection_regions)
    // 		})
    // 	const userRegions = currentRegions.filter((x) => !x.is_ai_region)
    // 	const tempRegions = createDetectionRegions(modelDetectionRegion, true)
    // 	dispatch(
    // 		setAnnotatorInput([
    // 			{
    // 				id: fileSets[activeImg[0]].id,
    // 				src: fileSets[activeImg[0]].src,
    // 				name: fileSets[activeImg[0]]?.name,
    // 				regions: [...tempRegions, ...userRegions],
    // 			},
    // 		])
    // 	)
    // }
  };

  const handleVisibilityList = data => {
    return data.map(model => {
      if (modelVisibilityObj[model.id]) {
        return { ...model, visible: true };
      }
      return { ...model, visible: false };
    });
  };

  const handleStartInferencing = () => {
    if (!Object.keys(fileSet).length) {
      return;
    }

    const mlModelId = [currentModelId];

    if (mlModelId) {
      const postData = {
        file_set_filters: encodeURL({
          id__in: selectAll
            ? fileSets.map(({ fileSetId }) => fileSetId)
            : activeImg
                .map(imageIndex => fileSets[imageIndex].fileSetId)
                .join(',')
        }),
        ml_model_id: mlModelId.join(',')
      };

      toast('Inference started');

      api.bulkCreateFileSetInferenceQueue(postData).then(_ => {
        queryClient.invalidateQueries('inferenceStatus');
      });
    }
  };

  return (
    <SearchComp
      searchable={false}
      data={handleVisibilityList(activeModel ? [activeModel] : [])}
      onVisibilityChange={handleModelEyeBtnClick}
      showInferenceButton={
        (showBtn ||
          (results.length > 0 && results[0].status === 'FAILED') ||
          results.length === 0 ||
          activeImg.length > 1 ||
          selectAll) &&
        !isLoading
      }
      status={results[0]?.status}
      startInferenceClick={handleStartInferencing}
      isLoading={isLoading}
    />
  );
};

export default ModelListContainer;
