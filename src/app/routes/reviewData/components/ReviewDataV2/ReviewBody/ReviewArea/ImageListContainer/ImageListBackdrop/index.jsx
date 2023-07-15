import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import {
  selectActiveImg,
  selectSelectAll,
  selectSorting
} from 'store/reviewData/selector';

const mapReviewState = createStructuredSelector({
  activeImg: selectActiveImg,
  selectAll: selectSelectAll,
  sorting: selectSorting
});

const ImageListBackdrop = ({
  containerMeta,
  imageListref,
  gridRef,
  listRef,
  activeGridMode
}) => {
  const { activeImg, selectAll, sorting } = useSelector(mapReviewState);

  const lastUpdatedGridMode = useRef(null);
  const containerMetaRef = useRef(null);
  const lastActiveImage = useRef(null);

  const location = useLocation();

  const isInViewport = index => {
    const parentRect = imageListref.current.getBoundingClientRect();
    const activeEleRect = document
      .getElementById(`thumbnail-card-${index}`)
      ?.getBoundingClientRect();

    return activeEleRect
      ? activeEleRect.top >= parentRect.top &&
          activeEleRect.bottom <= parentRect.bottom
      : false;
  };

  useEffect(() => {
    gridRef.current?.scrollToItem({ rowIndex: 0, align: 'start' });
    listRef.current?.scrollToItem(0, 'start');
  }, [location.search, sorting]);

  useEffect(() => {
    if (
      activeImg.length > 0 &&
      ((lastUpdatedGridMode.current !== activeGridMode &&
        containerMetaRef.current !== containerMeta &&
        imageListref.current &&
        containerMeta &&
        !selectAll) ||
        lastActiveImage.current !== activeImg[0])
    ) {
      lastUpdatedGridMode.current = activeGridMode;
      containerMetaRef.current = containerMeta;
      lastActiveImage.current = activeImg[0];

      let smallestIndex = activeImg[0];

      activeImg.forEach(d => {
        if (d < smallestIndex) smallestIndex = d;
      });

      if (!isInViewport(smallestIndex)) {
        if (activeGridMode === 'Grid View') {
          gridRef.current?.scrollToItem({
            rowIndex: Math.floor(smallestIndex / containerMeta.colCount),
            align: 'start'
          });
        } else {
          listRef.current?.scrollToItem(smallestIndex, 'start');
        }
      }
    }
  }, [activeGridMode, containerMeta, activeImg, selectAll]);

  return null;
};

export default ImageListBackdrop;
