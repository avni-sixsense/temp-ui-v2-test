import { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { setSelectedTool } from 'store/reviewData/actions';
import {
  selectActiveGridMode,
  selectActiveFileSet
} from 'store/reviewData/selector';
import { selectUseCaseDict } from 'store/helpers/selector';

import { handleImgClickNavigation } from 'app/utils/reviewData';

import {
  faChevronDown,
  faChevronUp,
  faHandPaper,
  faMousePointer,
  faSearchMinus,
  faSearchPlus,
  faVectorSquare
} from '@fortawesome/pro-solid-svg-icons';

import classes from './ImageActionButtons.module.scss';
import ImageActionButtonsContainer from './ImageActionButtonsContainer';
import ImageEditDialogContainer from './ImageEditDialog';

const mapImageActionBtnsState = createStructuredSelector({
  activeGridMode: selectActiveGridMode,
  useCaseDict: selectUseCaseDict,
  fileSet: selectActiveFileSet
});

const ImageActionButtons = () => {
  const dispatch = useDispatch();

  const { activeGridMode, useCaseDict, fileSet } = useSelector(
    mapImageActionBtnsState
  );

  const onClickTool = useCallback(tool => {
    dispatch(setSelectedTool(tool));
  }, []);

  const useCase = useCaseDict[fileSet.use_case];
  const isCanvasView = activeGridMode === 'Canvas View';

  useEffect(() => {
    if (useCase && useCase.type !== 'CLASSIFICATION')
      dispatch(setSelectedTool('create-box'));
  }, [useCase]);

  const imageActionBtns = useMemo(
    () => [
      {
        onClick: () => onClickTool('select'),
        icon: faMousePointer,
        show: isCanvasView
      },
      {
        onClick: () => onClickTool('pan'),
        icon: faHandPaper,
        show: isCanvasView
      },
      {
        onClick: () => onClickTool('create-box'),
        icon: faVectorSquare,
        show:
          (useCase && isCanvasView && useCase.type !== 'CLASSIFICATION') ??
          false
      },
      {
        onClick: () => onClickTool('zoom'),
        icon: faSearchPlus,
        show: isCanvasView
      },
      {
        onClick: () => onClickTool('zoom-out'),
        icon: faSearchMinus,
        show: isCanvasView
      },
      {
        Comp: ImageEditDialogContainer,
        show: isCanvasView
      },
      {
        onClick: e => handleImgClickNavigation('down', e),
        icon: faChevronDown
      },
      {
        onClick: e => handleImgClickNavigation('up', e),
        icon: faChevronUp
      }
    ],
    [isCanvasView, useCase]
  );

  return (
    <div className={classes.imgActionBtnsContainer}>
      <ImageActionButtonsContainer imageActionBtns={imageActionBtns} />
    </div>
  );
};

export default ImageActionButtons;
