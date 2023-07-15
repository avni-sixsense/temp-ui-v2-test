import { useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  selectActiveGridMode,
  selectGridModes
} from 'store/reviewData/selector';
import { changeGridMode } from 'store/reviewData/actions';

import ModeSelector from 'app/components/ModeSelector';
import { useSelector } from 'react-redux';

const mapReviewState = createStructuredSelector({
  activeGridMode: selectActiveGridMode,
  gridModes: selectGridModes
});

const CanvasGridModeSwitch = () => {
  const dispatch = useDispatch();

  const { activeGridMode, gridModes } = useSelector(mapReviewState);

  const handleModeChange = mode => {
    dispatch(changeGridMode(mode));
  };

  return (
    <ModeSelector
      onChange={handleModeChange}
      active={activeGridMode}
      modes={gridModes}
    />
  );
};

export default CanvasGridModeSwitch;
