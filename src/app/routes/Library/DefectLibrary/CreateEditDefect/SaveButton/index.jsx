import { useWatch } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import CommonButton from 'app/components/CommonButton';

const SaveButton = ({ activeStep, onClick, text, control, addEntry }) => {
  const [organization_defect_code, name] = useWatch({
    control,
    name: ['organization_defect_code', 'name']
  });

  return (
    <Box mr={5}>
      <CommonButton
        disabled={
          (activeStep === 0 && !(organization_defect_code && name)) ||
          (activeStep === 1 && addEntry)
        }
        onClick={onClick}
        text={text}
      />
    </Box>
  );
};

export default SaveButton;
