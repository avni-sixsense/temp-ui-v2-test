import { useWatch } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import CommonButton from 'app/components/CommonButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isEmptyObject } from 'app/utils/helpers';

const SaveButton = ({ handleNext, loading, control }) => {
  const [type, name] = useWatch({ control, name: ['type', 'name'] });

  return (
    <Box mr={5}>
      <CommonButton
        disabled={!(!isEmptyObject(type) && name)}
        onClick={handleNext}
        text={loading ? <CircularProgress /> : 'Save'}
      />
    </Box>
  );
};

export default SaveButton;
