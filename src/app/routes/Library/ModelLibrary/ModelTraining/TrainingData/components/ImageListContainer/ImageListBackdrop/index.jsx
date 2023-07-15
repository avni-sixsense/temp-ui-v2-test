import CommonBackdrop from 'app/components/CommonBackdrop';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectActiveImg,
  selectFetchingFileSets,
  selectFileSetData,
  selectSelectAll
} from 'store/modelTraining/selector';

const mapModelTrainingState = createStructuredSelector({
  activeImg: selectActiveImg,
  selectAll: selectSelectAll,
  fetchingTrainingData: selectFetchingFileSets,
  fileSetData: selectFileSetData
});

const ImageListBackdrop = ({ containerMeta, imageListref, gridRef }) => {
  const { activeImg, selectAll, fetchingTrainingData, fileSetData } =
    useSelector(mapModelTrainingState);

  const isInViewport = () => {
    const parentRect = imageListref.current.getBoundingClientRect();
    const activeEleRect = document
      .getElementById(`thumbnail-card-${activeImg[0]}`)
      ?.getBoundingClientRect();

    return activeEleRect
      ? activeEleRect.top >= parentRect.top &&
          activeEleRect.bottom <= parentRect.bottom
      : false;
  };

  useEffect(() => {
    if (
      imageListref.current &&
      gridRef.current &&
      containerMeta &&
      activeImg.length === 1 &&
      !selectAll
    ) {
      if (!isInViewport()) {
        gridRef.current.scrollToItem({
          rowIndex: Math.floor(activeImg[0] / containerMeta.colCount),
          align: 'start'
        });
      }
    }
  }, [containerMeta, activeImg, selectAll]);

  const isLoading =
    fetchingTrainingData || (fileSetData.length > 0 && !containerMeta);

  return <CommonBackdrop open={isLoading} />;
};

export default ImageListBackdrop;
