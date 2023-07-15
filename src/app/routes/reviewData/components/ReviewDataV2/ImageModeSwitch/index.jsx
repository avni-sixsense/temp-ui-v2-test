import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Show from 'app/hoc/Show';
import ModeSelector from 'app/components/ModeSelector';

import { handleImageModeChange } from 'app/utils/reviewData';

import {
  selectActiveImageMode,
  selectImageModes
} from 'store/reviewData/selector';

const mapReviewState = createStructuredSelector({
  activeImageMode: selectActiveImageMode,
  imageModes: selectImageModes
});

const ImageModeSwitch = () => {
  const { imageModes, activeImageMode } = useSelector(mapReviewState);

  return (
    <Show when={imageModes.length > 0}>
      <div id='imageModes'>
        <ModeSelector
          onChange={handleImageModeChange}
          active={activeImageMode}
          modes={imageModes}
          simpleUnderline
        />
      </div>
    </Show>
  );
};

export default ImageModeSwitch;
