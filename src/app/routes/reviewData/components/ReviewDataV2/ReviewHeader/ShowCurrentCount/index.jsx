import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { NumberFormater } from 'app/utils/helpers';
import { selectFileSetCount } from 'store/reviewData/selector';

const mapReviewState = createStructuredSelector({
  fileSetCount: selectFileSetCount
});

const ShowCurrentCount = ({ className }) => {
  const { fileSetCount } = useSelector(mapReviewState);

  return <span className={className}>{NumberFormater(fileSetCount)}</span>;
};

export default ShowCurrentCount;
