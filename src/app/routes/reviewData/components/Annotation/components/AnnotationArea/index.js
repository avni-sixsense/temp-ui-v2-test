import { faBookmark as bookmarkLight } from '@fortawesome/pro-light-svg-icons';
import { faBookmark as bookmarkSolid } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import CommonButton from 'app/components/ReviewButton';
import Annotator from 'app/reactImageAnnotator/Annotator';
import { createRegionPayload } from 'app/utils/reviewData';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import {
  addGTDetections,
  updateFilsetById,
  updateGTDetections
} from 'store/reviewData/actions';
import {
  selectActiveFileSet,
  selectAnnotatorInput,
  selectOtherDefects,
  selectSelectedTool,
  selectGTDetection
} from 'store/reviewData/selector';

import classes from './AnnotationArea.module.scss';

const mapReviewState = createStructuredSelector({
  annotatorInput: selectAnnotatorInput,
  regionTagList: selectOtherDefects,
  fileSet: selectActiveFileSet,
  selectedTool: selectSelectedTool,
  gtDetectionId: selectGTDetection
});

const AnnotatorArea = props => {
  const { subscriptionId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    selectedTool,
    annotatorInput,
    fileSet,
    regionTagList,
    gtDetectionId
  } = useSelector(mapReviewState);

  const [currentRegions, setCurrentRegions] = useState([]);

  const handleCheckClick = (region, file) => {
    const { regions: regionList } = file;

    if (region && Object.keys(region).length) {
      const existingUserRegions = regionList.filter(
        region => !region.is_ai_region
      );

      const detectionRegions = [];

      existingUserRegions.forEach(data =>
        detectionRegions.push(createRegionPayload(data))
      );
      detectionRegions.push(createRegionPayload(region));

      if (gtDetectionId) {
        dispatch(updateGTDetections(detectionRegions));
      } else {
        dispatch(addGTDetections(detectionRegions));
      }
    }
  };

  const debouncedRegionUpdate = () => {
    const existingUserRegions = currentRegions.filter(
      region => !region.is_ai_region
    );

    const isNewOrUpdated = currentRegions.filter(
      item =>
        (item.is_new && (item.tags || []).length) ||
        (!item.is_new && item.is_updated)
    );

    if (!isNewOrUpdated.length) return;

    const newRegions = existingUserRegions.filter(
      item => (item.tags || []).length
    );

    if (gtDetectionId) {
      const detectionRegions = [];

      newRegions.forEach(data =>
        detectionRegions.push(createRegionPayload(data))
      );

      dispatch(updateGTDetections(detectionRegions));
    } else {
      const detectionRegions = [];

      newRegions.forEach(data =>
        detectionRegions.push(createRegionPayload(data))
      );

      dispatch(addGTDetections(detectionRegions));
    }
  };

  const delayedQuery = useCallback(debounce(debouncedRegionUpdate, 500), [
    currentRegions
  ]);

  useEffect(() => {
    delayedQuery();

    return delayedQuery.cancel;
  }, [currentRegions]);

  const [currentMat, setMat] = useState({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  });
  // const [scale, setScale] = useState(100)
  const ih = 0;
  const iw = 0;

  const changeMat = mat => {
    setMat(mat);
    // setScale(((1 / mat.a) * 100).toFixed(0))
  };

  const handleBookMarkClick = () => {
    setIsLoading(true);
    api
      .bookmarkFileSet(fileSet.fileSetId, {
        is_bookmarked: !fileSet.is_bookmarked,
        subscription: subscriptionId
      })
      .then(res => {
        setIsLoading(false);
        dispatch(
          updateFilsetById({
            [fileSet.id]: { ...fileSet, is_bookmarked: res.data.is_bookmarked }
          })
        );
        // queryClient.invalidateQueries('fileSet')
      })
      .catch(() => {
        setIsLoading(false);
        toast('Something went wrong.');
      });
  };

  const handleScaleChange = value => {
    const newMat = {
      a: 100 / value,
      b: currentMat.b,
      c: currentMat.c,
      d: 100 / value,
      e: currentMat.e,
      f: currentMat.f
    };
    const horizontalMoveLimit = (1 / newMat.a - 1) * (iw / (1 / newMat.a));
    const verticalMoveLimit = (1 / newMat.d - 1) * (ih / (1 / newMat.d));

    if (newMat.e < 0) {
      newMat.e = 0;
    } else if (newMat.e > horizontalMoveLimit) {
      newMat.e = horizontalMoveLimit;
    }

    if (newMat.f < 0) {
      newMat.f = 0;
    } else if (newMat.f > verticalMoveLimit) {
      newMat.f = verticalMoveLimit;
    }
    changeMat(newMat);
  };

  if (!annotatorInput[0]?.src) {
    return null;
  }

  return (
    <div id='annotation-area-container' className={classes.annotationContainer}>
      <CommonButton
        icon={
          <FontAwesomeIcon
            icon={fileSet?.is_bookmarked ? bookmarkSolid : bookmarkLight}
          />
        }
        variant='secondary'
        onClick={handleBookMarkClick}
        wrapperClass={classes.bookmarkBtn}
      />
      <Annotator
        {...props}
        selectedTool={selectedTool}
        showTags
        taskDescription='Draw region around the defects'
        images={annotatorInput}
        selectedImage={annotatorInput[0].src}
        currentMat={currentMat}
        changeMat={changeMat}
        handleScaleChange={handleScaleChange}
        setCurrentRegions={setCurrentRegions}
        regionTagList={regionTagList}
        handleCheckClick={handleCheckClick}
        // isAnnotation={isAnnotation}
      />

      <CommonBackdrop open={isLoading} />
    </div>
  );
};

export default AnnotatorArea;
