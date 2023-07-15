import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectActiveGridMode } from 'store/reviewData/selector';

import Show from 'app/hoc/Show';

import ImageListContainer from '../ImageListContainer';
import AnnotatorArea from '../../../../Annotation/components/AnnotationArea';

import classes from './ImageContainer.module.scss';

const mapImageContainerState = createStructuredSelector({
  activeGridMode: selectActiveGridMode
});

const ImageContainer = () => {
  const { activeGridMode } = useSelector(mapImageContainerState);

  const isCanvasView = activeGridMode === 'Canvas View';

  return (
    <div
      className={clsx(classes.imageContainer, {
        [classes.showAnnotator]: isCanvasView
      })}
    >
      <ImageListContainer />

      <Show when={isCanvasView}>
        <AnnotatorArea />
      </Show>
    </div>
  );
};

export default ImageContainer;
