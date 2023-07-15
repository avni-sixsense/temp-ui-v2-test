import { calcContainerLayout } from 'app/utils/reviewData';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setContainerMeta } from 'store/reviewData/actions';
import { selectContainerMeta } from 'store/reviewData/selector';

import CustomSlider from 'app/routes/reviewData/components/Slider';

const ImageResizeContainer = ({ tempContainerMetaRef }) => {
  const dispatch = useDispatch();

  const containerMeta = useSelector(selectContainerMeta) ?? {};

  const disabled = !Object.keys(containerMeta).length;

  useEffect(() => {
    tempContainerMetaRef.current = containerMeta;
  }, [disabled]);

  const handleChange = (_, maxHeight) => {
    const meta = calcContainerLayout({
      totalWidth: containerMeta.totalWidth,
      originalImgHeight: containerMeta.originalImgHeight,
      originalImgWidth: containerMeta.originalImgWidth,
      totalItemCount: containerMeta.totalItemCount,
      maxHeight
    });

    if (meta.colCount !== containerMeta.colCount) {
      dispatch(setContainerMeta({ ...containerMeta, ...meta }));
    }
  };

  return (
    <CustomSlider
      aria-label='slider'
      name='image_dimensions_change'
      disabled={disabled}
      onChange={handleChange}
      min={200}
      defaultValue={containerMeta.cardHeight}
      max={550}
      step={10}
      onKeyDown={e => e.stopPropagation()}
    />
  );
};

export default ImageResizeContainer;
