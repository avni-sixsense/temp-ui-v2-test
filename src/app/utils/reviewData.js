import api from 'app/api';
import axios from 'app/api/base';
import { globalQueryClient } from 'app/configs/queryClientConfig';
import { toast } from 'react-toastify';
import store from 'store/index';
import { keyBy } from 'lodash';
import {
  addUserClassification,
  changeGridMode,
  changeImageMode,
  getUserClassification,
  handleUserClassificationChange,
  reArrangeManualAuditFiles,
  setActiveImg,
  setContainerMeta,
  setFetchingReviewData,
  setOtherDefects,
  setReviewData,
  setReviewDataNextApi,
  setSelectAll,
  setSelectedTool,
  updateFilsetById,
  updateUserClassification
} from 'store/reviewData/actions';
import {
  encodeURL,
  formatFileSetData,
  getParamsFromEncodedString,
  getDateFromParams,
  updateNextDataURL
} from './helpers';
import { DEFECT_HOT_KEYS, TOOL_KEYS } from './constants';
import { Review, SORTING_CONSTANTS } from 'store/reviewData/constants';

function calcContainerLayout({
  originalImgHeight,
  originalImgWidth,
  totalItemCount,
  totalWidth,
  maxHeight = 200
}) {
  const imgAspectRatio = originalImgWidth / originalImgHeight;
  let rowAspectRatio = totalWidth / maxHeight;

  const gapBetweenImages = 16;
  const minWidth = 200;

  let maxPossibleImagesWidth;
  let imgWidth = 0;

  let imgCount = 0;

  if (Math.ceil(imgAspectRatio) >= Math.floor(rowAspectRatio)) {
    imgCount = 1;
  } else {
    if (imgAspectRatio < 0.5) {
      maxHeight = 800;
      rowAspectRatio = totalWidth / maxHeight;
    }

    while (imgWidth < minWidth) {
      if (imgWidth) {
        imgCount = 0;
        maxHeight += 20;
        rowAspectRatio = totalWidth / maxHeight;
      }

      let combinedAspectRatioOfImages = 0;

      while (combinedAspectRatioOfImages <= rowAspectRatio) {
        combinedAspectRatioOfImages += imgAspectRatio;
        imgCount += 1;
      }

      maxPossibleImagesWidth = totalWidth - gapBetweenImages * imgCount;
      imgWidth = maxPossibleImagesWidth / imgCount;
    }
  }

  if (!maxPossibleImagesWidth) {
    maxPossibleImagesWidth = totalWidth - gapBetweenImages * imgCount;
  }

  if (!imgWidth) {
    imgWidth = maxPossibleImagesWidth / imgCount;
  }

  const imgHeight = imgWidth / imgAspectRatio;

  const colCount = imgCount > totalItemCount ? totalItemCount : imgCount;
  const rowCount = Math.ceil(totalItemCount / colCount);
  const cardHeight = imgHeight + 35 + 16;

  return {
    rowCount,
    colCount,
    cardHeight,
    totalHeight: cardHeight * rowCount,
    cardWidth: imgWidth + 16
  };
}

function handleCardSelect(index, isSelected) {
  const { getState, dispatch } = store;
  const { activeImg } = getState().review;

  if (isSelected) {
    if (activeImg.length > 1)
      dispatch(setActiveImg(activeImg.filter(x => x !== index)));
  } else {
    dispatch(setActiveImg([...activeImg, index]));
  }
}

function handleCardClick(event, index, isSelected, forceUpdate = false) {
  const { getState, dispatch } = store;
  const { activeImg, selectAll, data: fileSets } = getState().review;

  if (event.ctrlKey || event.metaKey) {
    handleCardSelect(index, isSelected);
  } else if (event.shiftKey) {
    const tempList = [];

    if (activeImg.sort()[activeImg.length - 1] < index) {
      for (
        let i = activeImg.sort()[activeImg.length - 1] + 1;
        i <= index;
        i++
      ) {
        tempList.push(i);
      }
    } else {
      for (let i = index; !activeImg.includes(i); i++) {
        tempList.push(i);
      }
    }

    dispatch(setActiveImg([...new Set([...activeImg, ...tempList])]));
  } else {
    if (
      activeImg.length === 1 &&
      activeImg[0] === index &&
      !forceUpdate &&
      !selectAll
    ) {
      return;
    }

    const tempIndex = activeImg[0];

    dispatch(setActiveImg([index]));

    if (selectAll) dispatch(setSelectAll(false));

    if (fileSets[index].use_case !== fileSets[tempIndex].use_case) {
      dispatch(setOtherDefects([]));
      globalQueryClient.invalidateQueries('useCaseDefects');
    }

    // const { state } = location;
  }
}

function handleCardDoubleClick(index) {
  const { getState, dispatch } = store;
  const { activeGridMode } = getState().review;

  if (activeGridMode === 'Grid View') {
    dispatch(setActiveImg([index]));
    dispatch(changeGridMode('Canvas View'));
  }
}

function handleCardMultiSelect(index, direction) {
  const { getState, dispatch } = store;
  const { activeImg } = getState().review;

  if (activeImg.includes(index)) {
    if (activeImg.length > 1) {
      let updatedIndex = index;

      if (direction === 'down') {
        if (activeImg.includes(index - 1)) {
          updatedIndex = index - 1;
        }
      } else if (direction === 'up' && activeImg.includes(index + 1)) {
        updatedIndex = index + 1;
      }

      dispatch(setActiveImg(activeImg.filter(d => d !== updatedIndex)));
    }
  } else {
    dispatch(setActiveImg([...activeImg, index]));
  }
}

function handleImgClickNavigation(direction, event, forceUpdate = false) {
  const { getState, dispatch } = store;
  const { activeImg, selectAll, data: fileSets } = getState().review;

  let index;

  const currentActiveImage = event.shiftKey
    ? activeImg[activeImg.length - 1]
    : activeImg[0];

  if (direction === 'down') {
    index = currentActiveImage + 1;

    if (index > fileSets.length - 1) return;
  } else if (direction === 'up') {
    index = currentActiveImage - 1;

    if (index < 0) return;
  }

  if (event.shiftKey) {
    return handleCardMultiSelect(index, direction);
  }

  if (
    activeImg.length === 1 &&
    activeImg[0] === index &&
    !forceUpdate &&
    !selectAll
  ) {
    return;
  }

  const tempIndex = activeImg[0];

  dispatch(setActiveImg([index]));
  dispatch(setSelectAll(false));

  if (fileSets[index].use_case !== fileSets[tempIndex].use_case) {
    dispatch(setOtherDefects([]));
    globalQueryClient.invalidateQueries('useCaseDefects');
  }
}

function handleToggleSelectAll() {
  const { getState, dispatch } = store;
  const { selectAll } = getState().review;

  dispatch(setSelectAll(!selectAll));
}

function handleToolSelect(tool) {
  const { dispatch, getState } = store;
  const { selectedTool, activeImg, data } = getState().review;
  const { usecases } = getState().helpers;

  const useCaseId = data[activeImg]?.use_case;
  const useCaseType = usecases[useCaseId]?.type;

  if (useCaseType === 'CLASSIFICATION' && tool === 'create-box') return;

  if (tool === 'zoom' && selectedTool === 'zoom') {
    tool = 'zoom-out';
  }

  if (selectedTool === tool) return;

  dispatch(setSelectedTool(tool));
}

function handleImgKeyNavigation(e, annotationType) {
  // Prevent keydown event from being handled multiple times while held down the key or combo
  if (e.repeat) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  const avoidableKeys = ['Shift', 'Alt', 'Meta', 'Control'];

  // newShortCutKey will always follow the this sequence Ctrl, Shift, Alt, Arrow, Alphabets
  let newShortCutKey = [];

  if (e.ctrlKey || e.metaKey) newShortCutKey.push('ctrl');
  if (e.shiftKey) newShortCutKey.push('shift');
  if (e.altKey) newShortCutKey.push('alt');
  if (e.key.includes('Arrow')) newShortCutKey.push(e.key.split('Arrow')[1]);
  if (e.key && !avoidableKeys.includes(e.key)) newShortCutKey.push(e.key);

  newShortCutKey = newShortCutKey.join('+');

  if (DEFECT_HOT_KEYS[newShortCutKey]) {
    e.preventDefault();
    e.stopPropagation();

    return handleUserClassificationChange(
      DEFECT_HOT_KEYS[newShortCutKey],
      annotationType
    );
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
    e.preventDefault();
    e.stopPropagation();

    return handleToggleSelectAll();
  }

  if (!(e.ctrlKey || e.metaKey) && TOOL_KEYS[e.key.toLowerCase()]) {
    e.preventDefault();
    e.stopPropagation();

    return handleToolSelect(TOOL_KEYS[e.key.toLowerCase()]);
  }

  if (
    document.activeElement.tagName.toLowerCase() !== 'input' &&
    e.key.includes('Arrow') &&
    !(e.ctrlKey || e.shiftKey || e.metaKey)
  ) {
    e.preventDefault();
    e.stopPropagation();

    const key = e.key.split('Arrow')[1];

    switch (key) {
      case 'Down':
      case 'Right':
        handleImgClickNavigation('down', e);
        break;

      case 'Up':
      case 'Left':
        handleImgClickNavigation('up', e);
        break;

      default:
        return;
    }
  }
}

function calcCardIndex(rowIdx, colIdx, colCount) {
  return colCount * rowIdx + colIdx;
}

const getFileSetIds = (isSelectAll, activeImg, fileSets) => {
  if (!isSelectAll) {
    return activeImg.map(x => fileSets[x].fileSetId).join(',');
  }

  return fileSets.map(item => item.fileSetId).join(',');
};

function handleAddFolderTags(tags) {
  const { getState, dispatch } = store;
  const {
    activeImg,
    selectAll,
    data: fileSets,
    searchText
  } = getState().review;

  const parsedParams = getDateFromParams(
    window.location.search,
    undefined,
    true
  );

  let encodedString = {};

  if (!selectAll) {
    encodedString = btoa(
      `id__in=${getFileSetIds(selectAll, activeImg, fileSets)}`
    );
  } else {
    if (searchText) {
      parsedParams['files__name__icontains'] = searchText;
    }

    encodedString = encodeURL(parsedParams);
  }

  api
    .updateTagsOnFilesets({
      tag_ids: tags.map(x => x.id),
      file_set_filters: encodedString
    })
    .then(() => {
      toast('Tags Added to images successfully');
      if (selectAll && fileSets.length >= 50) {
        window.location.reload();
        return;
      }
      if (activeImg.length < 50) {
        api
          .getFilesetTags(getFileSetIds(selectAll, activeImg, fileSets))
          .then(res => {
            const data = formatFileSetData(res?.results || []);
            dispatch(updateFilsetById(keyBy(data, 'id')));
            dispatch(setSelectAll(false));
          })
          .catch(() => {
            toast('Tags are not updated in UI please refresh the page.');
          });
      } else {
        toast('Please refresh to see updated tags.');
      }
    })
    .catch(() => {
      toast('Something went wrong.');
    });
}

function handleRemoveFolderTags(tags, isAllRemove = false) {
  const { getState, dispatch } = store;
  const {
    activeImg,
    selectAll,
    data: fileSets,
    searchText
  } = getState().review;

  const parsedParams = getDateFromParams(
    window.location.search,
    undefined,
    true
  );
  let encodedString = null;

  if (!selectAll) {
    encodedString = btoa(
      `id__in=${getFileSetIds(selectAll, activeImg, fileSets)}`
    );
  } else {
    if (searchText) {
      parsedParams['files__name__icontains'] = searchText;
    }

    encodedString = encodeURL(parsedParams);
  }

  api
    .removeTagsOnFilesets(
      isAllRemove
        ? { remove_all_tags: true, file_set_filters: encodedString }
        : { tag_ids: tags.map(x => x.id), file_set_filters: encodedString }
    )
    .then(() => {
      toast('Tag removed from images successfully');
      if (selectAll && fileSets.length >= 50) {
        window.location.reload();
        return;
      }
      if (activeImg.length < 50) {
        api
          .getFilesetTags(getFileSetIds(selectAll, activeImg, fileSets))
          .then(res => {
            const data = formatFileSetData(res?.results || []);
            dispatch(updateFilsetById(keyBy(data, 'id')));
            dispatch(setSelectAll(false));
          })
          .catch(() => {
            toast('Tags are not updated in UI please refresh the page.');
          });
      } else {
        toast('Please refresh to see updated tags.');
      }
    })
    .catch(() => {
      toast('Something went wrong.');
    });
}

function handleImageModeChange(mode) {
  const { getState, dispatch } = store;
  const { activeImageMode } = getState().review;

  if (activeImageMode === mode) return;

  dispatch(changeImageMode(mode));
}

function loadImageList(ref, lastCursorCallRef, annotationType) {
  const { getState, dispatch } = store;
  const {
    fetchingReviewData,
    next: nextData,
    appliedForAllModelId,
    activeImageMode,
    useAIAssistance,
    data
  } = getState().review;

  const isInViewPort = () => {
    const lastLoadedChild = document.getElementById(
      `thumbnail-card-${data.length - 1}`
    );

    if (!ref.current || !lastLoadedChild) {
      return false;
    }

    const parentRect = ref.current.getBoundingClientRect();
    const childRect = lastLoadedChild.getBoundingClientRect();

    return childRect.top <= parentRect.bottom;
  };

  if (
    isInViewPort() &&
    !fetchingReviewData &&
    !!nextData &&
    lastCursorCallRef.current !== nextData
  ) {
    dispatch(setFetchingReviewData(true));

    return axios
      .get(`${nextData}`)
      .then(({ data: res }) => {
        lastCursorCallRef.current = nextData;

        dispatch(setReviewDataNextApi(updateNextDataURL(res.next)));

        dispatch(
          setReviewData({
            data: res?.results || [],
            isNewData: false,
            annotationType,
            activeImageMode,
            modelId:
              appliedForAllModelId && useAIAssistance
                ? appliedForAllModelId
                : undefined
          })
        );
      })
      .catch(e => {
        dispatch(setFetchingReviewData(false));
      });
  }

  return new Promise(resolve => {
    resolve();
  });
}

function getCurrentModelFromState() {
  const {
    appliedForAllModelId,
    fileSetDefects,
    data,
    activeImg,
    useAIAssistance
  } = store.getState().review;
  const { model_classifications = [], model_detections = [] } =
    fileSetDefects[data[activeImg[0]]?.id] || {};

  let modelId = null;

  if (!useAIAssistance) return null;

  if (appliedForAllModelId) {
    modelId = appliedForAllModelId;
  } else if (model_classifications.length) {
    modelId = model_classifications[0]?.ml_model;
  } else if (model_detections.length) {
    modelId = model_classifications[0]?.ml_model.id;
  }

  return modelId;
}

function getSortingParams() {
  const { sorting } = store.getState().review;

  if (!sorting?.sortBy) return '';

  let params = `&ordering=${sorting.sortDirection === 'ascending' ? '' : '-'}${
    sorting?.sortBy
  }`;

  if (
    sorting.sortBy === SORTING_CONSTANTS.SIMILARITY ||
    sorting.sortBy === SORTING_CONSTANTS.AI_OUTPUT
  ) {
    const modelId = getCurrentModelFromState();
    params = params + `&ordering_ml_model=${modelId}`;
  }

  return params;
}

function isModelExist(id) {
  const { modelsDict } = store.getState().review;

  if (modelsDict[id]) return true;
  return false;
}

function createRegionPayload(region) {
  const { type, x, y, w, h, tags } = region;
  const tempObj = {};

  tempObj.region = {
    type,
    coordinates: {
      x,
      y,
      w,
      h
    }
  };

  tempObj.defects = [...new Set(tags?.map(tag => tag.id) ?? [])];

  return tempObj;
}

function moveFocusToParent() {
  document.elementFromPoint(0, 0).closest('div').focus();
  return;
}

const handleOtherDefectChange = (defect, annotationType) => {
  const { getState, dispatch } = store;
  const { activeImageMode, data, activeImg, fileSetDefects } =
    getState().review;

  const { userInfo } = getState().common;

  const fileSet = data[activeImg[0]] ?? {};
  const modelId = getCurrentModelFromState();

  const defectIds = [];
  if (Array.isArray(defect)) {
    defect.map(item => defectIds.push(item.id));
  } else if (defect.id) {
    defectIds.push(defect.id);
  }

  const shouldUpdate = fileSetDefects[fileSet.id]['gt_classifications'];

  if (shouldUpdate) {
    const gtDefectId = fileSetDefects[fileSet.id]['gt_classifications']['id'];

    dispatch(
      updateUserClassification({
        gtDefectId,
        defectIds,
        fileSet,
        userInfo: userInfo.id,
        modelId
      })
    );
  } else {
    dispatch(
      addUserClassification({
        fileSet,
        defects: defectIds,
        user: userInfo.id,
        modelId: modelId
      })
    );
    if (
      annotationType !== Review &&
      (activeImageMode === 'Unclassified' || activeImageMode === 'Unaudited')
    ) {
      setTimeout(() => {
        reArrangeManualAuditFiles(annotationType);
      }, 1000);
    }
  }

  dispatch(getUserClassification(fileSet.id));
  toast(`1 image is updated successfully.`);
};

const getDictinctModelFromFileDefect = fileSetDefects => {
  return [
    ...new Set(
      Object.values(fileSetDefects)
        .map(item => {
          const { model_classifications, model_detections } = item;
          if (model_classifications) {
            return model_classifications.map(model => model.ml_model);
          } else if (model_detections) {
            return model_detections.map(model => model.ml_model);
          }
          return [];
        })
        .flat()
    )
  ];
};

function setContainerLayout(ref, itemCount) {
  const { getState, dispatch } = store;
  const { data } = getState().review;

  if (!itemCount) {
    dispatch(setContainerMeta(null));
  } else if (itemCount && data.length) {
    const { offsetWidth, offsetTop } = ref.current;

    let idx = 0;

    const img = new Image();
    img.src = data[idx].src;

    img.onerror = () => {
      idx += 1;

      if (idx <= data.length - 1) {
        img.src = data[idx].src;
      }
    };

    img.onload = () => {
      const meta = calcContainerLayout({
        originalImgHeight: img.height,
        originalImgWidth: img.width,
        totalItemCount: itemCount,
        totalWidth: offsetWidth
      });

      dispatch(
        setContainerMeta({
          ...meta,
          containerHeight: window.innerHeight - offsetTop - 30,
          totalWidth: offsetWidth,
          originalImgHeight: img.height,
          originalImgWidth: img.width,
          totalItemCount: itemCount
        })
      );
    };
  }
}

export {
  calcContainerLayout,
  handleCardClick,
  handleCardDoubleClick,
  calcCardIndex,
  handleImgClickNavigation,
  handleImgKeyNavigation,
  handleAddFolderTags,
  handleRemoveFolderTags,
  handleImageModeChange,
  loadImageList,
  getSortingParams,
  handleCardSelect,
  isModelExist,
  getCurrentModelFromState,
  createRegionPayload,
  moveFocusToParent,
  handleOtherDefectChange,
  getDictinctModelFromFileDefect,
  setContainerLayout
};
