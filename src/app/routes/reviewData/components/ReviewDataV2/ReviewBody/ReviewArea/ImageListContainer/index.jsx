import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import ImageList from './ImageList';
import ImageListBackdrop from './ImageListBackdrop';

import {
  selectActiveGridMode,
  selectContainerMeta
} from 'store/reviewData/selector';

const mapReviewState = createStructuredSelector({
  activeGridMode: selectActiveGridMode,
  containerMeta: selectContainerMeta
});

const ImageListContainer = () => {
  const { containerMeta, activeGridMode } = useSelector(mapReviewState);

  const ref = useRef(null);
  const gridRef = useRef(null);
  const listRef = useRef(null);

  return (
    <>
      <ImageListBackdrop
        imageListref={ref}
        gridRef={gridRef}
        listRef={listRef}
        activeGridMode={activeGridMode}
        containerMeta={containerMeta}
      />

      <ImageList
        ref={ref}
        gridRef={gridRef}
        listRef={listRef}
        activeGridMode={activeGridMode}
        containerMeta={containerMeta}
      />
    </>
  );
};

export default ImageListContainer;
