import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectContainerMeta } from 'store/modelTraining/selector';

import ImageList from './ImageList';
import ImageListBackdrop from './ImageListBackdrop';

const mapModelTrainingState = createStructuredSelector({
  containerMeta: selectContainerMeta
});

const ImageListContainer = () => {
  const { containerMeta } = useSelector(mapModelTrainingState);

  const ref = useRef(null);
  const gridRef = useRef(null);

  return (
    <>
      <ImageListBackdrop
        imageListref={ref}
        gridRef={gridRef}
        containerMeta={containerMeta}
      />

      <ImageList ref={ref} gridRef={gridRef} containerMeta={containerMeta} />
    </>
  );
};

export default ImageListContainer;
