import { faAdjust } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClickAwayListener, Fade, Popper } from '@material-ui/core';
import CommonButton from 'app/components/ReviewButton';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectActiveFileSet } from 'store/reviewData/selector';

import classes from './ImageEditDialog.module.scss';
import ImagePropertySlider from './ImagePropertySlider';

const IMAGE_PROPERTIES_ACTIONS = [
  {
    label: 'Brightness',
    valueKey: 'brightness',
    maxValue: 200,
    minValue: 0
  },
  {
    label: 'Contrast',
    valueKey: 'contrast',
    maxValue: 200,
    minValue: 0
  },
  {
    label: 'Saturation',
    valueKey: 'saturate',
    maxValue: 200,
    minValue: 0
  },
  {
    label: 'Gray Scale',
    valueKey: 'grayscale',
    maxValue: 10,
    minValue: 0
  },
  {
    label: 'Hue',
    valueKey: 'hue-rotate',
    maxValue: 360,
    minValue: 0
  }
];

const INTIAL_SLIDER_VALUE = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  'hue-rotate': 0
};

const mapSliderToState = createStructuredSelector({
  activeFileSet: selectActiveFileSet
});

const ImageEditDialogContainer = () => {
  const { activeFileSet } = useSelector(mapSliderToState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAnchor, setDialogAnchor] = useState(null);
  const [sliderValue, setSliderValue] = useState(INTIAL_SLIDER_VALUE);

  const handleClose = event => {
    setDialogAnchor(null);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    setSliderValue(INTIAL_SLIDER_VALUE);

    return () => {
      handleClose();
    };
  }, [activeFileSet]);

  useEffect(() => {
    const ele = document.getElementById('annotation-area-container');
    if (ele) {
      const canvas = ele.getElementsByTagName('canvas')[0];
      canvas.style.filter = `brightness(${sliderValue.brightness}%) contrast(${
        sliderValue.contrast
      }%) saturate(${sliderValue.saturate}%) grayscale(${
        sliderValue.grayscale / 10
      }) hue-rotate(${sliderValue['hue-rotate']}deg)`;
    }
  }, [sliderValue]);

  const handleImageEditClick = event => {
    setDialogAnchor(event.target);
    setIsDialogOpen(true);
  };

  const handleSliderChange = (value, valueKey) => {
    setSliderValue(prev => ({ ...prev, [valueKey]: value }));
  };

  return (
    <>
      <CommonButton
        onClick={handleImageEditClick}
        icon={<FontAwesomeIcon icon={faAdjust} />}
        size='sm'
        variant='secondary'
      />

      <Popper
        open={isDialogOpen}
        anchorEl={dialogAnchor}
        transition
        placement='bottom-start'
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Fade {...TransitionProps} timeout={350}>
              <div className={classes.dialogPaper}>
                {IMAGE_PROPERTIES_ACTIONS.map(
                  ({ label, valueKey, maxValue, minValue }, key) => (
                    <ImagePropertySlider
                      label={label}
                      valueKey={valueKey}
                      maxValue={maxValue}
                      minValue={minValue}
                      key={key}
                      value={sliderValue[valueKey]}
                      onChange={handleSliderChange}
                    />
                  )
                )}
              </div>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default ImageEditDialogContainer;
