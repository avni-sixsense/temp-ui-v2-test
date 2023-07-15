import { Typography } from '@material-ui/core';
import CustomSlider from 'app/routes/reviewData/components/Slider';
import classes from './ImageEditDialog.module.scss';

const ImagePropertySlider = ({
  label,
  valueKey,
  maxValue,
  minValue,
  value,
  onChange
}) => {
  return (
    <div className={classes.sliderContainer}>
      <Typography>{label}</Typography>
      <CustomSlider
        onChange={(_, value) => onChange(value, valueKey)}
        value={value}
        max={maxValue}
        min={minValue}
      />
    </div>
  );
};

export default ImagePropertySlider;
