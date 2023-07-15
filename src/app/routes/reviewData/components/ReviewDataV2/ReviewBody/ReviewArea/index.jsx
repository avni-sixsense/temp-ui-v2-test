import WithErrorBoundary from 'app/hoc/WithErrorBoundary';

import ReviewSettings from '../../ReviewSettings';
import ImageModeSwitch from '../../ImageModeSwitch';
import ImageContainer from './ImageContainer';

const ReviewArea = () => {
  return (
    <>
      <ReviewSettings />

      <ImageModeSwitch />

      <ImageContainer />
    </>
  );
};

export default WithErrorBoundary(ReviewArea);
