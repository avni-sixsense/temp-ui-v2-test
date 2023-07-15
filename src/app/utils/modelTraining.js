import axios from 'app/api/base';
import store from 'store/index';
import { updateNextDataURL } from './helpers';
import {
  setActiveImg,
  setFetchingTrainingFilesets,
  setSelectAll,
  setTrainingFileSet,
  setTrainingFileSetNextApi,
  setDefectsInstancesCount,
  setContainerMeta
} from 'store/modelTraining/actions';

import api from 'app/api';

import { encodeString, getParamsFromEncodedString } from 'app/utils/helpers';
import { goToRoute } from './navigation';

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
  const { activeImg } = getState().modelTraining;

  if (isSelected) {
    dispatch(setActiveImg(activeImg.filter(x => x !== index)));
  } else {
    dispatch(setActiveImg([...activeImg, index]));
  }
}

function handleCardClick(event, index, isSelected, forceUpdate = false) {
  const { getState, dispatch } = store;
  const { activeImg, selectAll } = getState().modelTraining;

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

    dispatch(setActiveImg([index]));

    if (selectAll) dispatch(setSelectAll(false));
  }
}

function handleCardMultiSelect(index, direction) {
  const { getState, dispatch } = store;
  const { activeImg } = getState().modelTraining;

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
  const {
    activeImg,
    selectAll,
    fileSetData: fileSets
  } = getState().modelTraining;

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

  dispatch(setActiveImg([index]));
  dispatch(setSelectAll(false));
}

const precedentDefectInstancesCountAddedForTraining = async (
  traningSessionId,
  useCaseId
) => {
  const { dispatch } = store;

  const urlParams = getParamsFromEncodedString(window.location.search, true);

  try {
    const defectInstances = await api.getDefectInstances(
      'notAddedDefectsInstancesCount',
      traningSessionId,
      `file_set_filters=${encodeString(
        urlParams + `&is_gt_classified=true&use_case_id__in=${useCaseId}`
      )}&train_type_filter=TRAIN,TEST,VALIDATION`
    );

    if (defectInstances) {
      dispatch(
        setDefectsInstancesCount({
          key: 'defectsInstancesCountAdded',
          value: defectInstances.total_count
        })
      );
    }
  } catch {
    console.error('something went wrong.');
  }
};

function handleToggleSelectAll() {
  const { getState, dispatch } = store;
  const { selectAll } = getState().modelTraining;

  dispatch(setSelectAll(!selectAll));
}

function handleImgKeyNavigation(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
    e.preventDefault();
    e.stopPropagation();

    return handleToggleSelectAll();
  }

  if (
    document.activeElement.tagName.toLowerCase() !== 'input' &&
    e.key.includes('Arrow')
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

// function handleImageModeChange(mode) {
//   const { getState, dispatch } = store;
//   const { containerMeta } = getState().modelTraining;

//   if (containerMeta && !Object.keys(containerMeta).length) {
//     dispatch(setContainerMeta(null));
//   }

//   dispatch(setFetchingReviewData(true));
//   dispatch(changeImageMode(mode));
// }

function loadImageList(ref, lastCursorCallRef) {
  const { getState, dispatch } = store;
  const {
    fetchingFileSets,
    next: nextData,
    fileSetData
  } = getState().modelTraining;

  const isInViewPort = () => {
    const lastLoadedChild = document.getElementById(
      `thumbnail-card-${fileSetData.length - 1}`
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
    !fetchingFileSets &&
    !!nextData &&
    lastCursorCallRef.current !== nextData
  ) {
    dispatch(setFetchingTrainingFilesets(true));

    return axios
      .get(`${nextData}`)
      .then(({ data: res }) => {
        lastCursorCallRef.current = nextData;

        dispatch(setTrainingFileSetNextApi(updateNextDataURL(res.next)));

        dispatch(
          setTrainingFileSet({
            data: res?.results || [],
            isNewData: false
          })
        );
      })
      .catch(e => {
        dispatch(setFetchingTrainingFilesets(false));
      });
  }

  return new Promise(resolve => {
    resolve();
  });
}

function moveFocusToParent() {
  document.elementFromPoint(0, 0).closest('div').focus();
  return;
}

function convertTrainingSessionResToNewModel(res) {
  const newModel = res;
  newModel.training_session = res.id;
  newModel.id = res.new_ml_model;

  return newModel;
}

function setContainerLayout(ref, itemCount) {
  const { getState, dispatch } = store;
  const { fileSetData: data } = getState().modelTraining;

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
          containerHeight: window.innerHeight - offsetTop - 65,
          totalWidth: offsetWidth,
          originalImgHeight: img.height,
          originalImgWidth: img.width,
          totalItemCount: itemCount
        })
      );
    };
  }
}

function handleCloseModelTraining(navigate, subscriptionId, packId) {
  goToRoute(navigate, `/${subscriptionId}/${packId}/library/model`);
}

function isViewDetailsHash() {
  return window.location.hash === '#viewDetails';
}

const TRAINING_EPOCH_MULTIPLIER = 50;

export {
  handleCardClick,
  calcCardIndex,
  handleImgClickNavigation,
  handleImgKeyNavigation,
  loadImageList,
  handleCardSelect,
  moveFocusToParent,
  precedentDefectInstancesCountAddedForTraining,
  convertTrainingSessionResToNewModel,
  setContainerLayout,
  TRAINING_EPOCH_MULTIPLIER,
  handleCloseModelTraining,
  isViewDetailsHash
};
