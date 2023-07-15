import CustomizedCheckbox from 'app/components/ReviewCheckbox';

import { handleCardSelect } from 'app/utils/reviewData';

import classes from './CardCheckbox.module.scss';

const CardCheckbox = ({ index, isSelected }) => {
  const handleChange = e => {
    e.nativeEvent.stopPropagation();
    return handleCardSelect(index, isSelected);
  };

  return (
    <div className={classes.cardCheckbox}>
      <CustomizedCheckbox
        checked={isSelected}
        whiteTheme
        onClickCapture={handleChange}
      />
    </div>
  );
};

export default CardCheckbox;
